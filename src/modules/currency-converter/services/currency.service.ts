import { api } from '@/shared/lib/axios';
import type { CurrenciesResponse } from '../types';

const CURRENCIES_URL = 'https://api.frankfurter.dev/v2/currencies';

const currencyService = {
  getCurrencies: async () => {
    const { data } = await api.get<CurrenciesResponse>(CURRENCIES_URL);
    return data;
  },
};

export { currencyService };
