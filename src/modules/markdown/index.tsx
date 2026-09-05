import { useState } from 'react';
import { useAppForm } from '@/components/ui/tanstack-form';
import { useSelector } from '@tanstack/react-form';
import { DEFAULT_MARKDOWN } from './constants';
import { MarkdownContent } from './content';
import { MarkdownHeader } from './header';
import { ViewMode, type MarkdownFormValues } from './types';

const MarkdownPage = () => {
  const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.SPLIT);

  const form = useAppForm({
    defaultValues: {
      value: DEFAULT_MARKDOWN,
    } as MarkdownFormValues,
  });

  const value = useSelector(form.store, (state) => state.values.value);

  return (
    <form.AppForm>
      <form.Form className="flex h-full flex-col gap-0 p-0 md:p-0">
        <MarkdownHeader
          value={value}
          characterCount={value?.length ?? 0}
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
        <MarkdownContent viewMode={viewMode} value={value} />
      </form.Form>
    </form.AppForm>
  );
};

export { MarkdownPage };
