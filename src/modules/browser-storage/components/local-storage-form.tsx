import { Button } from '@/components/ui/button';
import { CardFooter } from '@/components/ui/card';
import { useAppForm, useFormFields } from '@/components/ui/tanstack-form';
import { TrashIcon } from 'lucide-react';
import type { LocalStorageFormValues } from '../types';

interface LocalStorageFormProps {
  onSubmit: (data: LocalStorageFormValues) => void;
  initialValues?: LocalStorageFormValues;
  onCancel?: () => void;
  onDelete?: () => void;
  submitLabel?: string;
}

const EMPTY_VALUES: LocalStorageFormValues = {
  name: '',
  value: '',
};

const LocalStorageForm = ({
  onSubmit,
  initialValues = EMPTY_VALUES,
  onCancel,
  onDelete,
  submitLabel = 'Save',
}: LocalStorageFormProps) => {
  const form = useAppForm({
    defaultValues: initialValues,
    onSubmit: ({ value }) => onSubmit(value),
  });

  const { FormTextField, FormTextareaField } = useFormFields();

  return (
    <form.AppForm>
      <form.Form className="p-0">
        <div className="flex flex-col gap-2 mb-3">
          <FormTextField name="name" label="Name" />
          <FormTextareaField name="value" label="Value" />
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
          <div className="flex items-center gap-2 ml-auto">
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

export { LocalStorageForm };
