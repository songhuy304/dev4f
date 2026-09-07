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
import { formatExpiration } from '@/shared/utils';
import { useState } from 'react';
import { BrowserToolbar } from './browser-toolbar';
import { CollapseItem } from './components/collapse-item';
import { useCookieEditor } from './hooks/use-cookie-editor';
import { getSameSite } from './utils';

const renderHeader = (item: chrome.cookies.Cookie) => {
  const expiration = formatExpiration(item.expirationDate);
  const sameSite = getSameSite(item.sameSite);
  const SameSiteIcon = sameSite.icon;

  return (
    <div className="flex w-full items-center gap-2 justify-between">
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
  const [isCreating, setIsCreating] = useState(false);
  const { cookies, refresh } = useCookieEditor();

  const { data, keyword, setKeyword } = useFilter({
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

  return (
    <div className="flex flex-col gap-2">
      <BrowserToolbar
        onAddNew={() => setIsCreating(true)}
        onDownloadJSON={() => {}}
        onDownloadTXT={() => {}}
        keyword={keyword}
        setKeyword={setKeyword}
        total={() => `${data.length} items`}
        onRefresh={refresh}
      />

      {isCreating ? (
        <Card className="gap-0 overflow-hidden">
          <CardContent></CardContent>
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
                header={renderHeader(item)}
                content={<div>ád sadsd</div>}
              />
            ))}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export { CookieEditor };
