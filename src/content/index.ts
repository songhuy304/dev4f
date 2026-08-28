import {
  EXT_DEFAULT_FRAME_WIDTH,
  EXT_IFRAME_ID,
  EXT_MESSAGE,
} from '@/shared/constant/extension';

function getIframe() {
  return document.getElementById(EXT_IFRAME_ID) as HTMLIFrameElement | null;
}

function applyFrameSize(iframe: HTMLIFrameElement, width: number, full?: boolean) {
  const nextWidth = full
    ? '100vw'
    : `${Math.min(Math.max(width, 24), window.innerWidth)}px`;

  iframe.dataset.width = nextWidth;
  iframe.style.width = nextWidth;
}

function createIframe() {
  const iframe = document.createElement('iframe');
  iframe.id = EXT_IFRAME_ID;
  iframe.src = chrome.runtime.getURL('src/overlay/index.html');
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
  });

  iframe.dataset.open = '1';
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
  iframe.style.width = iframe.dataset.width || `${EXT_DEFAULT_FRAME_WIDTH}px`;
}

function toggleOverlay() {
  const iframe = getIframe();
  const isOpen = iframe?.dataset.open === '1' && iframe.style.display !== 'none';
  setOverlayOpen(!isOpen);
}

chrome.runtime.onMessage.addListener((message) => {
  if (message?.type === EXT_MESSAGE.TOGGLE_OVERLAY) {
    toggleOverlay();
  }
});

window.addEventListener('message', (event) => {
  const iframe = getIframe();
  if (!iframe || event.source !== iframe.contentWindow) {
    return;
  }

  if (event.data?.type !== EXT_MESSAGE.FRAME_SIZE) {
    return;
  }

  if (iframe.dataset.open !== '1') {
    return;
  }

  applyFrameSize(
    iframe,
    Number(event.data.width) || EXT_DEFAULT_FRAME_WIDTH,
    event.data.full,
  );
});
