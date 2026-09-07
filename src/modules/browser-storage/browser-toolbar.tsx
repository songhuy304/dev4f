import { InputSearch } from '@/components/input-search';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Typography } from '@/components/ui/typography';
import {
  FileJsonIcon,
  FileTextIcon,
  PlusIcon,
  RefreshCcwIcon,
  TrashIcon,
} from 'lucide-react';

interface BrowserToolbarProps {
  onAddNew: () => void;
  onDownloadJSON: () => void;
  onDownloadTXT: () => void;
  keyword: string;
  setKeyword: (keyword: string) => void;
  total: () => React.ReactNode;
  onRefresh: () => void;
  onClearAll?: () => void;
}

const BrowserToolbar = ({
  onAddNew,
  onDownloadJSON,
  onDownloadTXT,
  keyword,
  setKeyword,
  total,
  onRefresh,
  onClearAll,
}: BrowserToolbarProps) => {
  return (
    <div className="flex flex-col gap-2">
      <InputSearch
        placeholder="Enter by name, value or domain..."
        value={keyword}
        onChange={(e) => setKeyword(e.target.value)}
      />

      <div className="flex items-center justify-between">
        <div>
          <Typography variant="small" className="text-10">
            {total()}
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <ButtonGroup>
            <Button
              tooltip="Download JSON"
              size="icon-xs"
              onClick={onDownloadJSON}
              variant="secondary"
              title="Download JSON"
            >
              <FileJsonIcon />
            </Button>

            <Button
              tooltip="Download TXT"
              size="icon-xs"
              variant="secondary"
              title="Download TXT"
              onClick={onDownloadTXT}
            >
              <FileTextIcon />
            </Button>
            <Button
              tooltip="Add new"
              size="icon-xs"
              variant="secondary"
              onClick={onAddNew}
            >
              <PlusIcon />
            </Button>
            <Button
              tooltip="Refresh"
              size="icon-xs"
              variant="secondary"
              onClick={onRefresh}
            >
              <RefreshCcwIcon />
            </Button>
            <Button
              tooltip="Clear all"
              size="icon-xs"
              variant="secondary"
              onClick={onClearAll}
            >
              <TrashIcon />
            </Button>
          </ButtonGroup>
        </div>
      </div>
    </div>
  );
};

export { BrowserToolbar };
