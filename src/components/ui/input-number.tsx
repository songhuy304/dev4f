import { forwardRef, useCallback, useEffect, useState } from 'react';
import { Input } from './input';
import { cn } from '@/shared/lib/utils';
import {
  clamp,
  formatNumber,
  parseNumber,
  type FormatNumberOptions,
} from '@/shared/utils/number.util';

export interface NumberInputProps extends Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  'value' | 'onChange' | 'defaultValue' | 'prefix'
> {
  stepper?: number;
  thousandSeparator?: string;
  decimalSeparator?: string;
  placeholder?: string;
  defaultValue?: number;
  min?: number;
  max?: number;
  value?: number;
  suffix?: string;
  prefix?: string;
  onValueChange?: (value: number | undefined) => void;
  fixedDecimalScale?: boolean;
  decimalScale?: number;
  showControls?: boolean;
}

export const NumberInput = forwardRef<HTMLInputElement, NumberInputProps>(
  (
    {
      stepper,
      thousandSeparator = '',
      decimalSeparator = '.',
      placeholder,
      defaultValue,
      min = -Infinity,
      max = Infinity,
      onValueChange,
      fixedDecimalScale = false,
      decimalScale = 0,
      suffix = '',
      prefix = '',
      value: controlledValue,
      showControls = true,
      className,
      onBlur,
      onKeyDown,
      ...props
    },
    ref,
  ) => {
    const fmtOptions: FormatNumberOptions = {
      thousandSeparator,
      decimalSeparator,
      decimalScale,
      fixedDecimalScale,
      prefix,
      suffix,
    };

    const [value, setValue] = useState<number | undefined>(
      controlledValue ?? defaultValue,
    );
    const [displayValue, setDisplayValue] = useState<string>(() =>
      formatNumber(controlledValue ?? defaultValue, fmtOptions),
    );

    // đồng bộ khi controlled value đổi từ bên ngoài
    useEffect(() => {
      if (controlledValue !== undefined) {
        setValue(controlledValue);
        setDisplayValue(formatNumber(controlledValue, fmtOptions));
      }
    }, [controlledValue]);

    const commitValue = useCallback(
      (next: number | undefined) => {
        setValue(next);
        onValueChange?.(next);
      },
      [onValueChange],
    );

    const handleIncrement = useCallback(() => {
      const next =
        value === undefined
          ? (stepper ?? 1)
          : clamp(value + (stepper ?? 1), min, max);
      commitValue(next);
      setDisplayValue(formatNumber(next, fmtOptions));
    }, [value, stepper, min, max, commitValue, fmtOptions]);

    const handleDecrement = useCallback(() => {
      const next =
        value === undefined
          ? -(stepper ?? 1)
          : clamp(value - (stepper ?? 1), min, max);
      commitValue(next);
      setDisplayValue(formatNumber(next, fmtOptions));
    }, [value, stepper, min, max, commitValue, fmtOptions]);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      const raw = e.target.value;
      setDisplayValue(raw); // hiển thị đúng những gì user gõ, format lúc blur
      const parsed = parseNumber(raw, fmtOptions);
      commitValue(parsed);
    };

    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      let next = value;
      if (next !== undefined) {
        next = clamp(next, min, max);
      }
      commitValue(next);
      setDisplayValue(formatNumber(next, fmtOptions));
      onBlur?.(e);
    };

    const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
      if (e.key === 'ArrowUp') {
        e.preventDefault();
        handleIncrement();
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        handleDecrement();
      }
      onKeyDown?.(e);
    };

    return (
      <Input
        {...props}
        ref={ref}
        type="text"
        inputMode="decimal"
        placeholder={placeholder}
        value={displayValue}
        onChange={handleChange}
        onBlur={handleBlur}
        onKeyDown={handleKeyDown}
        className={cn(
          '[appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none rounded-r-none relative',
          className,
          !showControls && 'rounded-r-md',
        )}
      />
    );
  },
);

NumberInput.displayName = 'NumberInput';
