import { useEffect, useMemo, useState } from 'react';
import { ArrowUpDownIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/input-number';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { formatDate, formatNumberView } from '@/shared/utils';
import { useCurrencies, useExchangeRate, type CurrencyOption } from './hooks';

const DEFAULT_FROM = 'USD';
const DEFAULT_TO = 'VND';

const selectTriggerClass =
  'h-5 shrink-0 border-0 bg-transparent! ring-0! focus-visible:ring-0! focus-visible:ring-ring/50! focus-visible:ring-offset-0!';

const amountInputClass =
  'border-0 bg-transparent! ring-0! text-right! text-lg!';

type EditedField = 'from' | 'to';

function CurrencyFlagOption({ option }: { option: CurrencyOption }) {
  return (
    <span className="flex items-center gap-2">
      {option.flag ? (
        <img
          src={option.flag}
          alt={option.label}
          className="size-4 rounded-sm object-cover"
        />
      ) : null}
      <span>{option.label}</span>
    </span>
  );
}

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

const CurrencyConverterPage = () => {
  const { options, isLoading } = useCurrencies();

  // Chỉ lưu "mã tiền tệ do user chọn"; nếu chưa chọn thì fallback về default.
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

  // Nguồn sự thật duy nhất cho amount: field nào vừa sửa + giá trị đã nhập.
  const [editedField, setEditedField] = useState<EditedField>('from');
  const [editedAmount, setEditedAmount] = useState<number | undefined>(1);

  const sameCurrency =
    fromCurrency?.value != null && fromCurrency.value === toCurrency?.value;

  const { data: rateData } = useExchangeRate(
    fromCurrency?.value,
    toCurrency?.value,
  );

  const rate = sameCurrency
    ? 1
    : rateData != null &&
        rateData.base === fromCurrency?.value &&
        rateData.quote === toCurrency?.value
      ? rateData.rate
      : undefined;

  // fromAmount / toAmount luôn được suy ra, không cần effect để "đồng bộ" nữa.
  const fromAmount =
    editedField === 'from'
      ? editedAmount
      : rate !== undefined && editedAmount !== undefined
        ? editedAmount / rate
        : undefined;

  const toAmount =
    editedField === 'to'
      ? editedAmount
      : rate !== undefined && editedAmount !== undefined
        ? editedAmount * rate
        : undefined;

  // Chỉ dùng effect cho đúng việc của nó: ghi nhận thời điểm rate mới về.
  const [fetchedAt, setFetchedAt] = useState<Date>();
  useEffect(() => {
    if (rate !== undefined) setFetchedAt(new Date());
  }, [rate]);

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
    // editedAmount đi theo currency của nó, chỉ cần đổi nhãn field.
    setEditedField((prev) => (prev === 'from' ? 'to' : 'from'));
  };

  return (
    <div className="py-2 px-3 flex flex-col gap-2">
      <Typography className="text-center" variant="h3">
        Swap
      </Typography>
      <div className="flex flex-col gap-2 relative">
        <Card className="border-0 rounded-md">
          <CardContent className="p-0 flex items-center gap-2">
            <Select
              className={selectTriggerClass}
              options={options}
              value={fromCurrency?.value}
              onValueChange={setFromValue}
              disabled={isLoading}
              renderOption={(option) => <CurrencyFlagOption option={option} />}
            />
            <NumberInput
              className={amountInputClass}
              thousandSeparator=","
              placeholder="0.00"
              decimalSeparator="."
              decimalScale={6}
              showControls={false}
              min={0}
              value={fromAmount}
              onValueChange={handleFromAmountChange}
            />
          </CardContent>
        </Card>

        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-10">
          <Button
            type="button"
            className="rounded-full size-10 bg-sidebar"
            variant="link"
            onClick={handleSwap}
            disabled={!fromCurrency || !toCurrency}
            aria-label="Swap currencies"
          >
            <ArrowUpDownIcon className="size-4 text-sidebar-foreground" />
          </Button>
        </div>

        <Card className="border-0 rounded-md">
          <CardContent className="p-0 flex items-center gap-2">
            <Select
              className={selectTriggerClass}
              options={options}
              value={toCurrency?.value}
              onValueChange={setToValue}
              disabled={isLoading}
              renderOption={(option) => <CurrencyFlagOption option={option} />}
            />
            <NumberInput
              className={amountInputClass}
              thousandSeparator=","
              placeholder="0.00"
              decimalSeparator="."
              decimalScale={6}
              showControls={false}
              min={0}
              value={toAmount}
              onValueChange={handleToAmountChange}
            />
          </CardContent>
        </Card>
      </div>

      {rate !== undefined && fromCurrency && toCurrency ? (
        <Typography
          variant="muted"
          className="text-center text-xs text-muted-foreground"
        >
          1 {fromCurrency.label} ={' '}
          <span className="text-foreground">
            {formatNumberView(rate, { decimalScale: 6 })}
          </span>{' '}
          {toCurrency.label}
          {fetchedAt ? (
            <>
              {' · '}
              <span className="text-muted-foreground">
                updated {formatDate(fetchedAt, 'HH:mm:ss')}
              </span>
            </>
          ) : null}
        </Typography>
      ) : null}
    </div>
  );
};

export { CurrencyConverterPage };
