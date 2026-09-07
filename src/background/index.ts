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
        sendResponse({ cookies });
      });
    });

    return true;
  }
});
