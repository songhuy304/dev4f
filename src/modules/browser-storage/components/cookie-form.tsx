import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { TrashIcon } from 'lucide-react';
import type { CookieFormValues } from '../types';

interface CookieFormProps {
  onSubmit: (data: CookieFormValues) => void;
  initialValues?: CookieFormValues;
  onCancel?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
}

const EMPTY_VALUES: CookieFormValues = {
  name: '',
  value: '',
  domain: '',
  path: '/',
  expires: undefined,
  secure: false,
  httpOnly: false,
  sameSite: 'lax',
};

const SAME_SITE_OPTIONS: {
  label: string;
  value: CookieFormValues['sameSite'];
}[] = [
  { label: 'Strict', value: 'strict' },
  { label: 'Lax', value: 'lax' },
  { label: 'None', value: 'no_restriction' },
  { label: 'Unspecified', value: 'unspecified' },
];

const CookieForm = ({
  onSubmit,
  initialValues = EMPTY_VALUES,
  onCancel,
  onDelete,
  submitLabel = 'Save',
}: CookieFormProps) => {
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => onSubmit(value),
  });

  const {
    FormTextField,
    FormTextareaField,
    FormCheckboxField,
    FormDatePickerField,
    FormSelectField,
  } = useFormFields();

  return (
    <form.AppForm>
      <form.Form className="p-0">
        <div className="mb-3 flex flex-col gap-2">
          <div className="grid grid-cols-2 gap-2">
            <FormTextField name="name" label="Name" />
            <FormTextField name="domain" label="Domain" />
          </div>
          <div className="grid grid-cols-2 gap-2">
            <FormTextField name="path" label="Path" />
            <FormDatePickerField name="expires" label="Expires" showTime />
          </div>
          <FormTextareaField name="value" label="Value" />
          <FormSelectField
            name="sameSite"
            label="SameSite"
            options={SAME_SITE_OPTIONS}
          />
          <div className="flex items-center gap-2">
            <FormCheckboxField name="secure" label="Secure" />
            <FormCheckboxField name="httpOnly" label="HttpOnly" />
          </div>
        </div>
        <CardFooter className="flex items-center justify-between gap-2 px-0">
          {onDelete ? (
            <Button
              type="button"
              variant="destructive"
              size="sm"
              onClick={onDelete}
            >
              <TrashIcon />
              Delete
            </Button>
          ) : null}
          <div className="ml-auto flex items-center gap-2">
            {onCancel ? (
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={onCancel}
              >
                Cancel
              </Button>
            ) : null}
            <form.SubmitButton size="sm">{submitLabel}</form.SubmitButton>
          </div>
        </CardFooter>
      </form.Form>
    </form.AppForm>
  );
};

export { CookieForm };
