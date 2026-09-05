import { useCallback, useEffect, useRef, useState } from 'react';
import type { AxiosRequestConfig } from 'axios';
import { api } from '@/shared/lib/axios';

interface UseFetchApiOptions<T> extends Omit<AxiosRequestConfig, 'url'> {
  url?: string;
  immediate?: boolean;
  fetcher?: () => Promise<T>;
  onSuccess?: (data: T) => void;
  onError?: (error: unknown) => void;
}

interface UseFetchApiResult<T> {
  data: T | null;
  error: unknown;
  isLoading: boolean;
  execute: (config?: AxiosRequestConfig) => Promise<T | null>;
  refetch: () => Promise<T | null>;
  reset: () => void;
}

function useFetchApi<T = unknown>(
  options: UseFetchApiOptions<T>,
): UseFetchApiResult<T>;
function useFetchApi<T = unknown>(
  url?: string,
  options?: UseFetchApiOptions<T>,
): UseFetchApiResult<T>;
function useFetchApi<T = unknown>(
  urlOrOptions?: string | UseFetchApiOptions<T>,
  maybeOptions: UseFetchApiOptions<T> = {},
): UseFetchApiResult<T> {
  const isOptionsFirst =
    typeof urlOrOptions === 'object' && urlOrOptions !== null;
  const options = isOptionsFirst ? urlOrOptions : maybeOptions;
  const url = isOptionsFirst ? options.url : urlOrOptions;

  const {
    immediate = Boolean(url || options.fetcher),
    fetcher,
    onSuccess,
    onError,
    ...axiosConfig
  } = options;

  const [data, setData] = useState<T | null>(null);
  const [error, setError] = useState<unknown>(null);
  const [isLoading, setIsLoading] = useState(false);

  const configRef = useRef({
    url,
    fetcher,
    axiosConfig,
    onSuccess,
    onError,
  });
  configRef.current = { url, fetcher, axiosConfig, onSuccess, onError };

  const execute = useCallback(
    async (overrideConfig?: AxiosRequestConfig): Promise<T | null> => {
      const {
        url: baseUrl,
        fetcher: baseFetcher,
        axiosConfig: baseConfig,
        onSuccess: successCb,
        onError: errorCb,
      } = configRef.current;

      const requestUrl = overrideConfig?.url ?? baseUrl;

      if (!baseFetcher && !requestUrl) {
        return null;
      }

      setIsLoading(true);
      setError(null);

      try {
        const result = baseFetcher
          ? await baseFetcher()
          : (
              await api.request<T>({
                ...baseConfig,
                ...overrideConfig,
                url: requestUrl,
              })
            ).data;

        setData(result);
        successCb?.(result);

        return result;
      } catch (err) {
        setError(err);
        errorCb?.(err);
        return null;
      } finally {
        setIsLoading(false);
      }
    },
    [],
  );

  const refetch = useCallback(() => execute(), [execute]);

  const reset = useCallback(() => {
    setData(null);
    setError(null);
    setIsLoading(false);
  }, []);

  useEffect(() => {
    if (!immediate) return;
    if (!url && !fetcher) return;

    void execute();
  }, [immediate, url, fetcher, execute]);

  return {
    data,
    error,
    isLoading,
    execute,
    refetch,
    reset,
  };
}

export { useFetchApi };
export type { UseFetchApiOptions, UseFetchApiResult };
