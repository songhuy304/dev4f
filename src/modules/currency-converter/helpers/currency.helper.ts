import type { Rate, CurrencyOption } from '../types';

type EditedField = 'from' | 'to';

function pickCurrency(
  options: CurrencyOption[],
  preferred: string,
  fallbackIndex: number,
): CurrencyOption | undefined {
  return (
    options.find((option) => option.value === preferred) ??
    options[fallbackIndex]
  );
}

function resolveExchangeRate(
  sameCurrency: boolean,
  rateData: Rate | null | undefined,
  base?: string,
  quote?: string,
): number | undefined {
  if (sameCurrency) return 1;

  if (
    rateData != null &&
    rateData.base === base &&
    rateData.quote === quote
  ) {
    return rateData.rate;
  }

  return undefined;
}

function convertAmounts(
  editedField: EditedField,
  editedAmount: number | undefined,
  rate: number | undefined,
): { fromAmount: number | undefined; toAmount: number | undefined } {
  if (editedField === 'from') {
    return {
      fromAmount: editedAmount,
      toAmount:
        rate !== undefined && editedAmount !== undefined
          ? editedAmount * rate
          : undefined,
    };
  }

  return {
    fromAmount:
      rate !== undefined && editedAmount !== undefined
        ? editedAmount / rate
        : undefined,
    toAmount: editedAmount,
  };
}

export { pickCurrency, resolveExchangeRate, convertAmounts };
export type { EditedField };
