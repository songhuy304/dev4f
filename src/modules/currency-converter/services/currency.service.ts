import { api } from '@/shared/lib/axios';
import type { CurrenciesResponse, Rate } from '../types';

const API_BASE = 'https://api.frankfurter.dev/v2';

const currencyService = {
  getCurrencies: async () => {
    const { data } = await api.get<CurrenciesResponse>(`${API_BASE}/currencies`);
    return data;
  },
  getRate: async (base: string, quote: string) => {
    const { data } = await api.get<Rate>(`${API_BASE}/rate/${base}/${quote}`);
    return data;
  },
};

export { currencyService };
