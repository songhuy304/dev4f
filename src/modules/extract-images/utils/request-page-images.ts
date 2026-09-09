import { EXT_MESSAGE } from '@/shared/constant/extension';

import {
  detectImageKind,
  getAllPageImages,
  type ImageSource,
} from './index';

const REQUEST_TIMEOUT_MS = 5_000;

type PageImagesResponse = {
  type: typeof EXT_MESSAGE.PAGE_IMAGES;
  requestId: string;
  images?: ImageSource[];
  /** Legacy payload — still accepted for older content scripts. */
  urls?: string[];
};

const normalizeSources = (data: PageImagesResponse): ImageSource[] => {
  if (Array.isArray(data.images)) {
    return data.images.filter(
      (item): item is ImageSource =>
        !!item && typeof item.url === 'string' && !!item.kind,
    );
  }

  if (Array.isArray(data.urls)) {
    return data.urls
      .filter((url): url is string => typeof url === 'string')
      .map((url) => ({ url, kind: detectImageKind(url) }));
  }

  return [];
};

const requestPageImages = (): Promise<ImageSource[]> => {
  // Standalone / vite preview — scan the local document.
  if (window.parent === window) {
    return Promise.resolve(getAllPageImages());
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
      resolve(normalizeSources(event.data));
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

export { requestPageImages };
