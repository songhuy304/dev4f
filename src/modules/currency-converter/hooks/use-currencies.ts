import { useMemo } from 'react';
import { hasFlag } from 'country-flag-icons';
import * as flagSvgs from 'country-flag-icons/string/3x2';
import { useFetchApi } from '@/shared/hooks';
import { currencyService } from '../services';
import type { Currency } from '../types';

interface CurrencyOption {
  label: string;
  value: string;
  flag?: string;
}

function getFlagSrc(isoCode: string): string | undefined {
  const countryCode = isoCode.slice(0, 2).toUpperCase();
  if (!hasFlag(countryCode)) return undefined;

  const svg = (flagSvgs as Record<string, string>)[countryCode];
  if (!svg) return undefined;

  return `data:image/svg+xml;charset=utf-8,${encodeURIComponent(svg)}`;
}

function useCurrencies(immediate = true) {
  const result = useFetchApi<Currency[]>({
    immediate,
    fetcher: currencyService.getCurrencies,
  });

  const options = useMemo<CurrencyOption[]>(() => {
    if (!result.data) return [];

    return result.data.map((currency) => ({
      label: currency.iso_code,
      value: currency.iso_code,
      flag: getFlagSrc(currency.iso_code),
    }));
  }, [result.data]);

  return {
    ...result,
    options,
  };
}

export { useCurrencies };
export type { CurrencyOption };
