import { useMemo, useState } from 'react';
import {
  convertAmounts,
  pickCurrency,
  resolveExchangeRate,
  type EditedField,
} from '../helpers';
import { useCurrencies } from './use-currencies';
import { useExchangeRate } from './use-exchange-rate';

const DEFAULT_FROM = 'USD';
const DEFAULT_TO = 'VND';

function useCurrencyConverter() {
  const { options, isLoading } = useCurrencies();

  const [fromValue, setFromValue] = useState<string>();
  const [toValue, setToValue] = useState<string>();

  const fromCurrency = useMemo(
    () =>
      options.find((o) => o.value === fromValue) ??
      pickCurrency(options, DEFAULT_FROM, 0),
    [options, fromValue],
  );
  const toCurrency = useMemo(
    () =>
      options.find((o) => o.value === toValue) ??
      pickCurrency(options, DEFAULT_TO, 1),
    [options, toValue],
  );

  const [editedField, setEditedField] = useState<EditedField>('from');
  const [editedAmount, setEditedAmount] = useState<number | undefined>(1);

  const sameCurrency =
    fromCurrency?.value != null && fromCurrency.value === toCurrency?.value;

  const {
    data: rateData,
    fetchedAt,
    isLoading: isRateLoading,
    refetch,
  } = useExchangeRate(fromCurrency?.value, toCurrency?.value);

  const rate = resolveExchangeRate(
    sameCurrency,
    rateData,
    fromCurrency?.value,
    toCurrency?.value,
  );

  const { fromAmount, toAmount } = convertAmounts(
    editedField,
    editedAmount,
    rate,
  );

  const handleFromAmountChange = (value: number | undefined) => {
    setEditedField('from');
    setEditedAmount(value);
  };

  const handleToAmountChange = (value: number | undefined) => {
    setEditedField('to');
    setEditedAmount(value);
  };

  const handleSwap = () => {
    setFromValue(toCurrency?.value);
    setToValue(fromCurrency?.value);
    setEditedField((prev) => (prev === 'from' ? 'to' : 'from'));
  };

  return {
    options,
    isLoading,
    fromCurrency,
    toCurrency,
    setFromValue,
    setToValue,
    fromAmount,
    toAmount,
    handleFromAmountChange,
    handleToAmountChange,
    handleSwap,
    rate,
    fetchedAt,
    isRateLoading,
    refetch,
    sameCurrency,
  };
}

export { useCurrencyConverter };
