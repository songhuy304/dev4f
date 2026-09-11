import { EXT_MESSAGE } from '@/shared/constant/extension';

const REQUEST_TIMEOUT_MS = 120_000;

type RegionCaptureSuccess = {
  type: typeof EXT_MESSAGE.REGION_CAPTURE_RESULT;
  requestId: string;
  dataUrl: string;
};

type RegionCaptureCancelled = {
  type: typeof EXT_MESSAGE.REGION_CAPTURE_CANCELLED;
  requestId: string;
  error?: string;
};

type RegionCaptureResponse = RegionCaptureSuccess | RegionCaptureCancelled;

/**
 * Asks the content script to hide the overlay, capture the visible tab,
 * and let the user drag-select a region. Resolves with a PNG data URL,
 * `null` if the user cancels, or rejects on failure / timeout.
 */
const requestRegionCapture = (): Promise<string | null> => {
  if (window.parent === window) {
    return Promise.reject(
      new Error('Region capture only works inside the extension overlay'),
    );
  }

  return new Promise((resolve, reject) => {
    const requestId = crypto.randomUUID();

    const onMessage = (event: MessageEvent<RegionCaptureResponse>) => {
      if (event.data?.requestId !== requestId) {
        return;
      }

      if (event.data.type === EXT_MESSAGE.REGION_CAPTURE_RESULT) {
        window.clearTimeout(timeoutId);
        window.removeEventListener('message', onMessage);
        resolve(event.data.dataUrl);
        return;
      }

      if (event.data.type === EXT_MESSAGE.REGION_CAPTURE_CANCELLED) {
        window.clearTimeout(timeoutId);
        window.removeEventListener('message', onMessage);

        if (event.data.error) {
          reject(new Error(event.data.error));
          return;
        }

        resolve(null);
      }
    };

    const timeoutId = window.setTimeout(() => {
      window.removeEventListener('message', onMessage);
      reject(new Error('Capture timed out'));
    }, REQUEST_TIMEOUT_MS);

    window.addEventListener('message', onMessage);
    window.parent.postMessage(
      { type: EXT_MESSAGE.START_REGION_CAPTURE, requestId },
      '*',
    );
  });
};

export { requestRegionCapture };
