import {
  EXT_COLLAPSED_FRAME,
  EXT_DEFAULT_FRAME_WIDTH,
  EXT_IFRAME_ID,
  EXT_MESSAGE,
} from '@/shared/constant/extension';
import { getAllPageImages } from '@/modules/extract-images/utils';

import { startRegionCapture } from './region-capture';

function getIframe() {
  return document.getElementById(EXT_IFRAME_ID) as HTMLIFrameElement | null;
}

function applyFrameSize(
  iframe: HTMLIFrameElement,
  width: number,
  options?: { full?: boolean; compact?: boolean },
) {
  const { full, compact } = options ?? {};

  if (compact) {
    const nextWidth = `${EXT_COLLAPSED_FRAME.width}px`;
    iframe.dataset.width = nextWidth;
    iframe.dataset.compact = '1';
    Object.assign(iframe.style, {
      width: nextWidth,
      height: `${EXT_COLLAPSED_FRAME.height}px`,
      top: '50%',
      transform: 'translateY(-50%)',
    });
    return;
  }

  const nextWidth = full
    ? '100vw'
    : `${Math.min(Math.max(width, 24), window.innerWidth)}px`;

  iframe.dataset.width = nextWidth;
  iframe.dataset.compact = '0';
  Object.assign(iframe.style, {
    width: nextWidth,
    height: '100vh',
    top: '0',
    transform: 'none',
  });
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.id = EXT_IFRAME_ID;
  iframe.src = chrome.runtime.getURL('src/overlay/index.html');
  iframe.setAttribute('allow', 'clipboard-write; clipboard-read');
  iframe.setAttribute('allowtransparency', 'true');
  iframe.setAttribute('title', 'Admin dashboard');

  Object.assign(iframe.style, {
    position: 'fixed',
    top: '0',
    right: '0',
    height: '100vh',
    width: `${EXT_DEFAULT_FRAME_WIDTH}px`,
    border: 'none',
    zIndex: '2147483646',
    background: 'transparent',
    colorScheme: 'none',
    display: 'block',
    transform: 'none',
  });

  iframe.dataset.open = '1';
  iframe.dataset.compact = '0';
  iframe.dataset.width = `${EXT_DEFAULT_FRAME_WIDTH}px`;

  document.documentElement.appendChild(iframe);
  return iframe;
}

function setOverlayOpen(open: boolean) {
  const existing = getIframe();

  if (!open) {
    if (existing) {
      existing.style.display = 'none';
      existing.dataset.open = '0';
    }
    return;
  }

  const iframe = existing ?? createIframe();
  iframe.style.display = 'block';
  iframe.dataset.open = '1';

  if (iframe.dataset.compact === '1') {
    applyFrameSize(iframe, EXT_COLLAPSED_FRAME.width, { compact: true });
  } else {
    iframe.style.width = iframe.dataset.width || `${EXT_DEFAULT_FRAME_WIDTH}px`;
    iframe.style.height = '100vh';
    iframe.style.top = '0';
    iframe.style.transform = 'none';
  }

  const notifyOpened = () => {
    iframe.contentWindow?.postMessage(
      { type: EXT_MESSAGE.OVERLAY_OPENED },
      '*',
    );
  };

  // Fresh iframe needs load before the overlay app can receive the message.
  if (!existing) {
    iframe.addEventListener('load', notifyOpened, { once: true });
  } else {
    notifyOpened();
  }
}

function toggleOverlay() {
  const iframe = getIframe();
  const isOpen =
    iframe?.dataset.open === '1' && iframe.style.display !== 'none';
  setOverlayOpen(!isOpen);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === EXT_MESSAGE.TOGGLE_OVERLAY) {
    toggleOverlay();
  }
});

function waitForPaint() {
  return new Promise<void>((resolve) => {
    window.requestAnimationFrame(() => {
      window.requestAnimationFrame(() => {
        window.setTimeout(resolve, 50);
      });
    });
  });
}

function captureVisibleTab(): Promise<string> {
  return new Promise((resolve, reject) => {
    chrome.runtime.sendMessage(
      { type: EXT_MESSAGE.CAPTURE_VISIBLE_TAB },
      (response: { dataUrl?: string; error?: string } | undefined) => {
        if (chrome.runtime.lastError) {
          reject(new Error(chrome.runtime.lastError.message));
          return;
        }

        if (!response?.dataUrl) {
          reject(new Error(response?.error ?? 'Capture failed'));
          return;
        }

        resolve(response.dataUrl);
      },
    );
  });
}

async function handleRegionCapture(
  iframe: HTMLIFrameElement,
  requestId: string,
) {
  const previousDisplay = iframe.style.display;
  iframe.style.display = 'none';

  try {
    await waitForPaint();
    const screenshotDataUrl = await captureVisibleTab();

    startRegionCapture({
      screenshotDataUrl,
      onComplete: (croppedDataUrl) => {
        iframe.style.display = previousDisplay || 'block';
        iframe.contentWindow?.postMessage(
          {
            type: EXT_MESSAGE.REGION_CAPTURE_RESULT,
            requestId,
            dataUrl: croppedDataUrl,
          },
          '*',
        );
      },
      onCancel: () => {
        iframe.style.display = previousDisplay || 'block';
        iframe.contentWindow?.postMessage(
          {
            type: EXT_MESSAGE.REGION_CAPTURE_CANCELLED,
            requestId,
          },
          '*',
        );
      },
    });
  } catch (error) {
    iframe.style.display = previousDisplay || 'block';
    iframe.contentWindow?.postMessage(
      {
        type: EXT_MESSAGE.REGION_CAPTURE_CANCELLED,
        requestId,
        error: error instanceof Error ? error.message : 'Capture failed',
      },
      '*',
    );
  }
}

window.addEventListener('message', (event) => {
  const iframe = getIframe();
  if (!iframe || event.source !== iframe.contentWindow) {
    return;
  }

  if (event.data?.type === EXT_MESSAGE.GET_PAGE_IMAGES) {
    const images = getAllPageImages();
    iframe.contentWindow?.postMessage(
      {
        type: EXT_MESSAGE.PAGE_IMAGES,
        requestId: event.data.requestId,
        images,
        urls: images.map((item) => item.url),
      },
      '*',
    );
    return;
  }

  if (event.data?.type === EXT_MESSAGE.START_REGION_CAPTURE) {
    void handleRegionCapture(iframe, String(event.data.requestId ?? ''));
    return;
  }

  if (event.data?.type !== EXT_MESSAGE.FRAME_SIZE) {
    return;
  }

  if (iframe.dataset.open !== '1') {
    return;
  }

  applyFrameSize(iframe, Number(event.data.width) || EXT_DEFAULT_FRAME_WIDTH, {
    full: event.data.full,
    compact: event.data.compact,
  });
});
