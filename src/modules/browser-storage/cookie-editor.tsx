import {
  Alert,
  AlertDescription,
  AlertTitle,
} from '@/components/ui/alert';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyTitle,
} from '@/components/ui/empty';
import { Typography } from '@/components/ui/typography';
import { useFilter } from '@/shared/hooks';
import { useDownload } from '@/shared/hooks/use-download';
import { formatExpiration } from '@/shared/utils';
import { AlertCircleIcon } from 'lucide-react';
import { useCallback, useState } from 'react';
import { BrowserToolbar } from './browser-toolbar';
import { CollapseItem } from './components/collapse-item';
import { CookieForm } from './components/cookie-form';
import { useCookieEditor } from './hooks/use-cookie-editor';
import type { CookieFormValues } from './types';
import {
  cookieToFormValues,
  getCookieKey,
  getSameSite,
} from './utils';

const renderHeader = (item: chrome.cookies.Cookie) => {
  const expiration = formatExpiration(item.expirationDate);
  const sameSite = getSameSite(item.sameSite);
  const SameSiteIcon = sameSite.icon;

  return (
    <div className="flex w-full items-center justify-between gap-2">
      <Typography variant="p" className="text-xs">
        {item.name}
      </Typography>

      <div className="flex items-center gap-2">
        <Badge variant={sameSite.variant} className="text-10">
          <SameSiteIcon />
        </Badge>

        <Badge variant="outline" className="rounded-full text-10!">
          {expiration ?? (item.session ? 'Session' : '—')}
        </Badge>
      </div>
    </div>
  );
};

const CookieEditor = () => {
  const { downloadJson, downloadTxt } = useDownload();
  const [isCreating, setIsCreating] = useState(false);
  const {
    cookies,
    error,
    refresh,
    createCookie,
    updateCookie,
    deleteCookie,
    clearAll,
  } = useCookieEditor();

  const { data, keyword, setKeyword } = useFilter<chrome.cookies.Cookie>({
    items: cookies,
    filterFn: (item, query) => {
      const q = query.toLowerCase();
      return (
        item.name.toLowerCase().includes(q) ||
        item.value.toLowerCase().includes(q) ||
        item.domain.toLowerCase().includes(q) ||
        item.path.toLowerCase().includes(q)
      );
    },
  });

  const handleCreate = useCallback(
    async (values: CookieFormValues) => {
      try {
        await createCookie(values);
        setIsCreating(false);
      } catch {
        // error is surfaced via Alert from hook state
      }
    },
    [createCookie],
  );

  const handleUpdate = useCallback(
    async (item: chrome.cookies.Cookie, values: CookieFormValues) => {
      try {
        await updateCookie(item, values);
      } catch {
        // error is surfaced via Alert from hook state
      }
    },
    [updateCookie],
  );

  return (
    <div className="flex flex-col gap-2">
      <BrowserToolbar
        onAddNew={() => setIsCreating(true)}
        onDownloadJSON={() => downloadJson(cookies, 'cookies')}
        onDownloadTXT={() =>
          downloadTxt(
            cookies
              .map(
                (item) =>
                  `${item.name}=${item.value}; Domain=${item.domain}; Path=${item.path}`,
              )
              .join('\n'),
            'cookies',
          )
        }
        keyword={keyword}
        setKeyword={setKeyword}
        total={() => `${data.length} items`}
        onRefresh={refresh}
        onClearAll={() => {
          void clearAll();
        }}
      />

      {error ? (
        <Alert variant="destructive">
          <AlertCircleIcon />
          <AlertTitle>Cookie error</AlertTitle>
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : null}

      {isCreating ? (
        <Card className="gap-0 overflow-hidden">
          <CardContent>
            <CookieForm
              onSubmit={(values) => {
                void handleCreate(values);
              }}
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
              No cookies found for this site.
            </EmptyDescription>
          </EmptyContent>
        </Empty>
      ) : (
        <Card className="gap-0 overflow-hidden py-0">
          <CardContent className="divide-y p-0">
            {data.map((item) => (
              <CollapseItem
                key={getCookieKey(item)}
                header={renderHeader(item)}
                content={
                  <CookieForm
                    initialValues={cookieToFormValues(item)}
                    onSubmit={(values) => {
                      void handleUpdate(item, values);
                    }}
                    onDelete={() => {
                      void deleteCookie(item);
                    }}
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

export { CookieEditor };
