'use client';

import { Checkbox } from '@/components/ui/checkbox';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from '@/components/ui/form-context';
import { useSelector } from '@tanstack/react-form';

interface CheckboxFieldProps {
  label?: string;
  description?: string;
}

export function CheckboxField({ label, description }: CheckboxFieldProps) {
  const field = useFieldContext();
  const isTouched = useSelector(field.store, (s) => s.meta.isTouched);
  const isValid = useSelector(field.store, (s) => s.meta.isValid);
  const value = useSelector(field.store, (s) => s.value) as boolean;

  return (
    <FormFieldSet>
      <FormField orientation="horizontal">
        <Checkbox
          checked={value}
          onCheckedChange={(checked) => {
            field.handleChange(checked as boolean);
            field.handleBlur();
          }}
          aria-invalid={isTouched && !isValid}
        />
        <div className="flex flex-1 flex-col gap-1.5 leading-snug">
          {label && <FieldLabel className="leading-none">{label}</FieldLabel>}
          {description && <FieldDescription>{description}</FieldDescription>}
          <FormFieldError />
        </div>
      </FormField>
    </FormFieldSet>
  );
}

export const FormCheckboxField = createFormField(CheckboxField);
