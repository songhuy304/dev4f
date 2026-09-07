import { EXT_MESSAGE } from '@/shared/constant';
import { useCallback, useEffect, useState } from 'react';

const useCookieEditor = () => {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getCookies = useCallback(() => {
    if (!chrome?.runtime?.sendMessage) {
      setError('Extension runtime is not available in this context');
      return;
    }

    chrome.runtime.sendMessage(
      { type: EXT_MESSAGE.GET_COOKIES },
      (response) => {
        if (chrome.runtime.lastError) {
          setError(chrome.runtime.lastError.message ?? '');
          return;
        }

        if (response?.cookies) {
          setCookies(response.cookies);
          setError(null);
        } else {
          setError(response?.error ?? 'Get cookies failed');
        }
      },
    );
  }, []);

  useEffect(() => {
    void getCookies();
  }, [getCookies]);

  const refresh = useCallback(() => {
    void getCookies();
  }, [getCookies]);

  return { cookies, error, refresh };
};

export { useCookieEditor };
