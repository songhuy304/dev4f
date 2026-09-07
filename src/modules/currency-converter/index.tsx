import { ArrowUpDownIcon, RefreshCwIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { NumberInput } from '@/components/ui/input-number';
import { Select } from '@/components/ui/select';
import { Typography } from '@/components/ui/typography';
import { formatDate, formatNumberView } from '@/shared/utils';
import { CurrencyFlagOption } from './components';
import { useCurrencyConverter } from './hooks';

const selectTriggerClass =
  'h-5 shrink-0 border-0 bg-transparent! ring-0! focus-visible:ring-0! focus-visible:ring-ring/50! focus-visible:ring-offset-0!';

const amountInputClass =
  'border-0 bg-transparent! ring-0! text-right! text-lg!';

const CurrencyConverterPage = () => {
  const {
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
  } = useCurrencyConverter();

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
        <div className="flex items-center justify-center gap-1.5">
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
                {formatDate(fetchedAt, 'DD/MM/YYYY HH:mm:ss')}
              </>
            ) : null}
          </Typography>
          {!sameCurrency ? (
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="size-6 text-muted-foreground"
              onClick={() => void refetch()}
              disabled={isRateLoading}
              aria-label="Reload exchange rate"
            >
              <RefreshCwIcon
                className={`size-3.5 ${isRateLoading ? 'animate-spin' : ''}`}
              />
            </Button>
          ) : null}
        </div>
      ) : null}
    </div>
  );
};

export { CurrencyConverterPage };
