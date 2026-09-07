interface Currency {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
}

type CurrenciesResponse = Currency[];

interface Rate {
  date: string;
  base: string;
  quote: string;
  rate: number;
}

interface CurrencyOption {
  label: string;
  value: string;
  flag?: string;
}

export type { Currency, CurrenciesResponse, Rate, CurrencyOption };
