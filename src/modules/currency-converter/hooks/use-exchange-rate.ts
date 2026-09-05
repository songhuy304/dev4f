import { useEffect, useMemo, useState } from 'react';
import { useFetchApi } from '@/shared/hooks';
import type { Rate } from '../types';

const API_BASE = 'https://api.frankfurter.dev/v2';

function useExchangeRate(base?: string, quote?: string) {
  const { canonicalBase, canonicalQuote, inverted } = useMemo(() => {
    if (!base || !quote || base === quote) {
      return {
        canonicalBase: undefined,
        canonicalQuote: undefined,
        inverted: false,
      };
    }

    if (base < quote) {
      return { canonicalBase: base, canonicalQuote: quote, inverted: false };
    }

    return { canonicalBase: quote, canonicalQuote: base, inverted: true };
  }, [base, quote]);

  const url =
    canonicalBase && canonicalQuote
      ? `${API_BASE}/rate/${canonicalBase}/${canonicalQuote}`
      : undefined;

  const result = useFetchApi<Rate>(url);

  const [fetchedAt, setFetchedAt] = useState<Date>();
  useEffect(() => {
    if (result.data) setFetchedAt(new Date());
  }, [result.data]);

  const data = useMemo(() => {
    if (!result.data || !base || !quote || base === quote) return null;

    if (!inverted) {
      return result.data.base === base && result.data.quote === quote
        ? result.data
        : null;
    }

    if (result.data.base !== quote || result.data.quote !== base) return null;

    return {
      ...result.data,
      base,
      quote,
      rate: 1 / result.data.rate,
    } satisfies Rate;
  }, [result.data, base, quote, inverted]);

  return { ...result, data, fetchedAt };
}

export { useExchangeRate };
