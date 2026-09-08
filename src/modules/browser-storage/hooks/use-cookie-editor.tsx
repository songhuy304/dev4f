import { EXT_MESSAGE } from '@/shared/constant';
import { useCallback, useEffect, useState } from 'react';
import type { CookieFormValues } from '../types';
import {
  cookieToRemoveDetails,
  formValuesToSetDetails,
  getCookieKey,
} from '../utils';

const sendRuntimeMessage = <TResponse,>(
  payload: Record<string, unknown>,
): Promise<TResponse> => {
  return new Promise((resolve, reject) => {
    if (!chrome?.runtime?.sendMessage) {
      reject(new Error('Extension runtime is not available in this context'));
      return;
    }

    chrome.runtime.sendMessage(payload, (response) => {
      if (chrome.runtime.lastError) {
        reject(
          new Error(
            chrome.runtime.lastError.message ?? 'Runtime message failed',
          ),
        );
        return;
      }

      if (response?.error) {
        reject(new Error(response.error));
        return;
      }

      resolve(response as TResponse);
    });
  });
};

const useCookieEditor = () => {
  const [cookies, setCookies] = useState<chrome.cookies.Cookie[]>([]);
  const [error, setError] = useState<string | null>(null);

  const getCookies = useCallback(async () => {
    try {
      const response = await sendRuntimeMessage<{
        cookies: chrome.cookies.Cookie[];
      }>({ type: EXT_MESSAGE.GET_COOKIES });

      setCookies(response.cookies ?? []);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Get cookies failed');
    }
  }, []);

  useEffect(() => {
    void getCookies();
  }, [getCookies]);

  const refresh = useCallback(() => {
    void getCookies();
  }, [getCookies]);

  const createCookie = useCallback(
    async (values: CookieFormValues) => {
      try {
        await sendRuntimeMessage({
          type: EXT_MESSAGE.SET_COOKIE,
          details: formValuesToSetDetails(values),
        });
        setError(null);
        await getCookies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Create cookie failed');
        throw err;
      }
    },
    [getCookies],
  );

  const updateCookie = useCallback(
    async (original: chrome.cookies.Cookie, values: CookieFormValues) => {
      try {
        const details = formValuesToSetDetails(values);
        const originalKey = getCookieKey(original);
        const nextKey = getCookieKey({
          name: values.name,
          domain: values.domain || original.domain,
          path: values.path || original.path,
        });

        await sendRuntimeMessage({
          type: EXT_MESSAGE.SET_COOKIE,
          details,
          ...(originalKey !== nextKey
            ? { remove: cookieToRemoveDetails(original) }
            : {}),
        });
        setError(null);
        await getCookies();
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Update cookie failed');
        throw err;
      }
    },
    [getCookies],
  );

  const deleteCookie = useCallback(
    async (cookie: chrome.cookies.Cookie) => {
      await sendRuntimeMessage({
        type: EXT_MESSAGE.REMOVE_COOKIE,
        details: cookieToRemoveDetails(cookie),
      });
      await getCookies();
    },
    [getCookies],
  );

  const clearAll = useCallback(async () => {
    await Promise.all(
      cookies.map((cookie) =>
        sendRuntimeMessage({
          type: EXT_MESSAGE.REMOVE_COOKIE,
          details: cookieToRemoveDetails(cookie),
        }),
      ),
    );
    await getCookies();
  }, [cookies, getCookies]);

  return {
    cookies,
    error,
    refresh,
    createCookie,
    updateCookie,
    deleteCookie,
    clearAll,
  };
};

export { useCookieEditor };
