interface Currency {
  iso_code: string;
  iso_numeric: string;
  name: string;
  symbol: string;
  start_date: string;
  end_date: string;
}

type CurrenciesResponse = Currency[];

export type { Currency, CurrenciesResponse };
