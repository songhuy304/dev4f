import { useFetchApi } from '@/shared/hooks';
import { currencyService } from '../services';
import type { Currency } from '../types';

function useCurrencies(immediate = true) {
  return useFetchApi<Currency[]>({
    immediate,
    fetcher: currencyService.getCurrencies,
  });
}

export { useCurrencies };
