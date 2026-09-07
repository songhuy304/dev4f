import { Card, CardContent } from '@/components/ui/card';
import { BrowserToolbar } from './browser-toolbar';
import { CollapseItem } from './components/collapse-item';
import { useCallback, useState } from 'react';
import { LocalStorageItem } from './types';
import { LocalStorageForm } from './components/local-storage-form';
import { getAllLocalStorage, localStorage } from '@/shared/utils';
import { useFilter } from '@/shared/hooks';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { useDownload } from '@/shared/hooks/use-download';

const LocalStorageEditor = () => {
  const { downloadJson, downloadTxt } = useDownload();
  const [isCreating, setIsCreating] = useState(false);
  const [items, setItems] = useState<LocalStorageItem[]>(localStorage.getAll);

  const { data, keyword, setKeyword } = useFilter({
    items,
    filterFn: (item, query) => {
      const q = query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q)
      );
    },
  });

  const handleRefetch = useCallback(() => {
    setItems(getAllLocalStorage());
  }, []);

  const handleClearAll = useCallback(() => {
    localStorage.clear();
    handleRefetch();
  }, [handleRefetch]);

  const handleDelete = useCallback(
    (name: string) => {
      localStorage.remove(name);
      handleRefetch();
    },
    [handleRefetch],
  );

  const handleCreate = useCallback(
    (item: LocalStorageItem) => {
      localStorage.setRaw(item.name, item.value);
      setIsCreating(false);
      handleRefetch();
    },
    [handleRefetch],
  );

  const handleUpdate = useCallback(
    (originalName: string, item: LocalStorageItem) => {
      if (item.name !== originalName) {
        localStorage.remove(originalName);
      }
      localStorage.setRaw(item.name, item.value);
      handleRefetch();
    },
    [handleRefetch],
  );

  return (
    <div className="flex flex-col gap-2">
      <BrowserToolbar
        onAddNew={() => setIsCreating(true)}
        onDownloadJSON={() =>
          downloadJson(
            Object.fromEntries(items.map((item) => [item.name, item.value])),
            'local-storage',
          )
        }
        onDownloadTXT={() =>
          downloadTxt(
            items.map((item) => `${item.name}=${item.value}`).join('\n'),
            'local-storage',
          )
        }
        keyword={keyword}
        setKeyword={setKeyword}
        total={() => `${items.length} items`}
        onRefresh={handleRefetch}
        onClearAll={handleClearAll}
      />

      {isCreating ? (
        <Card className="gap-0 overflow-hidden">
          <CardContent>
            <LocalStorageForm
              onSubmit={handleCreate}
              onCancel={() => setIsCreating(false)}
              submitLabel="Create"
            />
          </CardContent>
        </Card>
      ) : null}

      {data.length === 0 ? (
        <Empty>
          <EmptyContent>
            <EmptyTitle>No items found</EmptyTitle>
            <EmptyDescription>
              No items found in the local storage.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <CardContent className="divide-y p-0">
            {data.map((item) => (
              <CollapseItem
                key={item.name}
                header={item.name}
                content={
                  <LocalStorageForm
                    initialValues={item}
                    onSubmit={(values) => handleUpdate(item.name, values)}
                    onDelete={() => handleDelete(item.name)}
                  />
                }
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { LocalStorageEditor };
