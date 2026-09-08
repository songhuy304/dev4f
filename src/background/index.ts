// background/index.ts
import contentScript from '@/content/index.ts?script';
import { EXT_MESSAGE } from '@/shared/constant/extension';

async function toggleOverlay(tabId: number) {
  try {
    await chrome.tabs.sendMessage(tabId, { type: EXT_MESSAGE.TOGGLE_OVERLAY });
  } catch {
    await chrome.scripting.executeScript({
      target: { tabId },
      files: [contentScript],
    });
    await chrome.tabs.sendMessage(tabId, { type: EXT_MESSAGE.TOGGLE_OVERLAY });
  }
}

chrome.action.onClicked.addListener((tab) => {
  if (!tab.id) return;
  void toggleOverlay(tab.id);
});

async function getSenderTabUrl(
  sender: chrome.runtime.MessageSender,
): Promise<string | undefined> {
  if (sender.tab?.url) return sender.tab.url;

  // Overlay runs as an extension page, so sender.tab is missing — use the active tab.
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  return tab?.url;
}

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.type === EXT_MESSAGE.GET_COOKIES) {
    void getSenderTabUrl(sender).then((tabUrl) => {
      if (!tabUrl) {
        sendResponse({ error: 'No tab URL' });
        return;
      }

      chrome.cookies.getAll({ url: tabUrl }, (cookies) => {
        sendResponse({ cookies, tabUrl });
      });
    });

    return true;
  }

  if (message.type === EXT_MESSAGE.SET_COOKIE) {
    void getSenderTabUrl(sender).then((tabUrl) => {
      const details = {
        ...(message.details as chrome.cookies.SetDetails),
      };

      if (!details.url && tabUrl) {
        details.url = tabUrl;
      }

      if (!details.url) {
        sendResponse({ error: 'No cookie URL' });
        return;
      }

      const removeDetails = message.remove as
        | chrome.cookies.CookieDetails
        | undefined;

      const setCookie = () => {
        chrome.cookies.set(details, (cookie) => {
          if (chrome.runtime.lastError) {
            sendResponse({
              error: chrome.runtime.lastError.message ?? 'Set cookie failed',
            });
            return;
          }

          sendResponse({ cookie });
        });
      };

      if (removeDetails?.url && removeDetails.name) {
        chrome.cookies.remove(removeDetails, () => {
          // Ignore remove errors (cookie may already be gone) and proceed to set.
          setCookie();
        });
        return;
      }

      setCookie();
    });

    return true;
  }

  if (message.type === EXT_MESSAGE.REMOVE_COOKIE) {
    const details = message.details as chrome.cookies.CookieDetails | undefined;

    if (!details?.url || !details.name) {
      sendResponse({ error: 'Missing cookie remove details' });
      return false;
    }

    chrome.cookies.remove(details, (result) => {
      if (chrome.runtime.lastError) {
        sendResponse({
          error: chrome.runtime.lastError.message ?? 'Remove cookie failed',
        });
        return;
      }

      sendResponse({ result });
    });

    return true;
  }
});
