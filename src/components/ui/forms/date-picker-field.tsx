'use client';

import { useSelector } from '@tanstack/react-form';
import { CalendarIcon, ClockIcon } from 'lucide-react';
import { format } from 'date-fns';

import { cn } from '@/shared/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  FormField,
  FormFieldError,
  FormFieldSet,
  useFieldContext,
  createFormField,
} from '@/components/ui/form-context';

interface DatePickerFieldProps {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  placeholder?: string;
  /** date-fns format string. Defaults depend on `showTime`. */
  format?: string;
  /** When true, shows a time input and includes time in the value/display. */
  showTime?: boolean;
}

function toDate(value: unknown): Date | undefined {
  if (value == null || value === '') return undefined;
  if (value instanceof Date) {
    return Number.isNaN(value.getTime()) ? undefined : value;
  }
  if (typeof value === 'number') {
    // Support unix seconds (cookie expiration) and milliseconds.
    const ms = value < 1e12 ? value * 1000 : value;
    const date = new Date(ms);
    return Number.isNaN(date.getTime()) ? undefined : date;
  }
  const date = new Date(value as string);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

function mergeDateTime(date: Date, time: string): Date {
  const [hours = '0', minutes = '0', seconds = '0'] = time.split(':');
  const next = new Date(date);
  next.setHours(
    Number(hours) || 0,
    Number(minutes) || 0,
    Number(seconds) || 0,
    0,
  );
  return next;
}

function timeValueFromDate(date: Date | undefined): string {
  if (!date) return '00:00';
  return format(date, 'HH:mm');
}

export function DatePickerField({
  label,
  description,
  required,
  placeholder = 'Pick a date',
  format: dateFormat,
  showTime = false,
}: DatePickerFieldProps) {
  const field = useFieldContext();
  const rawValue = useSelector(field.store, (s) => s.value);
  const isTouched = useSelector(field.store, (s) => s.meta.isTouched);
  const isValid = useSelector(field.store, (s) => s.meta.isValid);

  const value = toDate(rawValue);
  const displayFormat =
    dateFormat ?? (showTime ? 'dd/MM/yyyy HH:mm' : 'dd/MM/yyyy');

  const handleSelectDate = (day: Date | undefined) => {
    if (!day) {
      field.handleChange(undefined);
      return;
    }

    if (showTime && value) {
      field.handleChange(mergeDateTime(day, timeValueFromDate(value)));
      return;
    }

    if (showTime) {
      field.handleChange(mergeDateTime(day, timeValueFromDate(undefined)));
      return;
    }

    // Date-only: normalize to local midnight.
    const next = new Date(day);
    next.setHours(0, 0, 0, 0);
    field.handleChange(next);
  };

  const handleTimeChange = (time: string) => {
    const base = value ?? new Date();
    field.handleChange(mergeDateTime(base, time));
  };

  return (
    <FormFieldSet className="min-w-48">
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}

        <Popover modal={false}>
          <PopoverTrigger asChild>
            <Button
              id={field.name}
              type="button"
              variant="outline"
              aria-invalid={isTouched && !isValid}
              onBlur={field.handleBlur}
              className={cn(
                'w-full justify-start text-left font-normal',
                !value && 'text-muted-foreground',
              )}
            >
              <CalendarIcon />
              {value ? format(value, displayFormat) : placeholder}
            </Button>
          </PopoverTrigger>

          <PopoverContent className="w-auto p-0" align="start" sideOffset={4}>
            <Calendar
              mode="single"
              selected={value}
              onSelect={handleSelectDate}
              captionLayout="dropdown"
              autoFocus
            />

            {showTime ? (
              <div className="flex items-center gap-2 border-t p-3">
                <ClockIcon className="text-muted-foreground size-4 shrink-0" />
                <Input
                  type="time"
                  value={timeValueFromDate(value)}
                  onChange={(e) => handleTimeChange(e.target.value)}
                  onBlur={field.handleBlur}
                  className="h-8"
                />
              </div>
            ) : null}
          </PopoverContent>
        </Popover>

        {description && <FieldDescription>{description}</FieldDescription>}

        <FormFieldError />
      </FormField>
    </FormFieldSet>
  );
}

export const FormDatePickerField = createFormField(DatePickerField);
