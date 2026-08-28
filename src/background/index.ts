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
  if (!tab.id) {
    return;
  }

  void toggleOverlay(tab.id);
});
