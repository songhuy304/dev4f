import { useState } from 'react';

import { requestRegionCapture } from '@/shared/utils/region-capture.util';

export const useRegionCapture = () => {
  const [dataUrl, setDataUrl] = useState<string | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);

  const capture = async () => {
    setIsCapturing(true);
    setError(null);

    try {
      const result = await requestRegionCapture();
      setDataUrl(result);
      return result;
    } catch (err) {
      const nextError =
        err instanceof Error ? err : new Error('Capture failed');
      setError(nextError);
      throw nextError;
    } finally {
      setIsCapturing(false);
    }
  };

  const clear = () => {
    setDataUrl(null);
    setError(null);
  };

  return {
    dataUrl,
    error,
    isCapturing,
    capture,
    clear,
  };
};
