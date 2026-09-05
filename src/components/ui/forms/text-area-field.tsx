import { useSelector } from '@tanstack/react-form';
import { Textarea } from '@/components/ui/textarea';
import { FieldDescription, FieldLabel } from '@/components/ui/field';
import {
  useFieldContext,
  FormFieldSet,
  FormField,
  FormFieldError,
  createFormField,
} from '@/components/ui/form-context';
import { cn } from '@/shared/lib/utils';

interface TextareaFieldProps extends Omit<
  React.ComponentProps<'textarea'>,
  'value' | 'onChange' | 'onBlur'
> {
  label?: React.ReactNode;
  description?: string;
  required?: boolean;
  maxLength?: number;
  showCount?: boolean;
}

export function TextareaField({
  label,
  description,
  required,
  maxLength,
  showCount = !!maxLength,
  className,
  ...textareaProps
}: TextareaFieldProps) {
  const field = useFieldContext();
  const isTouched = useSelector(field.store, (s) => s.meta.isTouched);
  const isValid = useSelector(field.store, (s) => s.meta.isValid);
  const value = (useSelector(field.store, (s) => s.value) as string) ?? '';
  const isFullHeight =
    typeof className === 'string' && className.includes('h-full');

  return (
    <FormFieldSet
      className={cn(isFullHeight && 'h-full min-h-0 gap-0 border-0 p-0')}
    >
      <FormField className={cn(isFullHeight && 'h-full min-h-0 gap-0')}>
        {label && (
          <FieldLabel htmlFor={field.name}>
            {label}
            {required && <span className="text-red-500"> *</span>}
          </FieldLabel>
        )}
        <Textarea
          id={field.name}
          value={value}
          onBlur={field.handleBlur}
          onChange={(e) => field.handleChange(e.target.value)}
          maxLength={maxLength}
          aria-invalid={isTouched && !isValid}
          className={className}
          {...textareaProps}
        />
        {showCount && (
          <div className="text-muted-foreground text-right text-xs tabular-nums">
            {value.length}
            {maxLength ? ` / ${maxLength}` : ''}
          </div>
        )}
        {description && <FieldDescription>{description}</FieldDescription>}
      </FormField>
      <FormFieldError />
    </FormFieldSet>
  );
}

export const FormTextareaField = createFormField(TextareaField);
