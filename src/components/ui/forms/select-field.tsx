'use client';

import { useSelector } from '@tanstack/react-form';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  Select,
  type SelectOption,
} from '@/components/ui/select';
import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from '@/components/ui/form-context';
import { cn } from '@/shared/lib/utils';

interface SelectFieldProps<T extends SelectOption = SelectOption> {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  options: T[];
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  getOptionValue?: (option: T) => string;
  renderOption?: (option: T) => React.ReactNode;
}

export function SelectField<T extends SelectOption = SelectOption>({
  label,
  description,
  required,
  options,
  placeholder,
  disabled,
  className,
  getOptionValue,
  renderOption,
}: SelectFieldProps<T>) {
  const field = useFieldContext();
  const isTouched = useSelector(field.store, (s) => s.meta.isTouched);
  const isValid = useSelector(field.store, (s) => s.meta.isValid);
  const value = useSelector(field.store, (s) => s.value) as string;

  return (
    <FormFieldSet>
      <FormField>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}
        <Select
          id={field.name}
          options={options}
          value={value}
          placeholder={placeholder}
          disabled={disabled}
          getOptionValue={getOptionValue}
          renderOption={renderOption}
          aria-invalid={isTouched && !isValid}
          className={cn('w-full', className)}
          onValueChange={(next) => {
            field.handleChange(next);
            field.handleBlur();
          }}
        />
        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>
      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormSelectField = createFormField(SelectField);
