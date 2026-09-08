import { EXT_MESSAGE } from '@/shared/constant/extension';

import { getAllImageUrls } from './index';

const REQUEST_TIMEOUT_MS = 5_000;

type PageImagesResponse = {
  type: typeof EXT_MESSAGE.PAGE_IMAGES;
  requestId: string;
  urls: string[];
};

const requestPageImageUrls = (): Promise<string[]> => {
  // Standalone / vite preview — scan the local document.
  if (window.parent === window) {
    return Promise.resolve(getAllImageUrls());
  }

  return new Promise((resolve) => {
    const requestId = crypto.randomUUID();

    const onMessage = (event: MessageEvent<PageImagesResponse>) => {
      if (
        event.data?.type !== EXT_MESSAGE.PAGE_IMAGES ||
        event.data.requestId !== requestId
      ) {
        return;
      }

      window.clearTimeout(timeoutId);
      window.removeEventListener('message', onMessage);
      resolve(Array.isArray(event.data.urls) ? event.data.urls : []);
    };

    const timeoutId = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      resolve([]);
    }, REQUEST_TIMEOUT_MS);

    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      { type: EXT_MESSAGE.GET_PAGE_IMAGES, requestId },
      '*',
    );
  });
};

export { requestPageImageUrls };
