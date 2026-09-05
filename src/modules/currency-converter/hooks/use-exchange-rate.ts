import { useFetchApi } from '@/shared/hooks';
import type { Rate } from '../types';

const API_BASE = 'https://api.frankfurter.dev/v2';

function useExchangeRate(base?: string, quote?: string) {
  const url =
    base && quote && base !== quote
      ? `${API_BASE}/rate/${base}/${quote}`
      : undefined;

  return useFetchApi<Rate>(url);
}

export { useExchangeRate };
