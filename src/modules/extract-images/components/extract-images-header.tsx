import { DownloadIcon } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';
import { Spinner } from '@/components/ui/spinner';
import { Typography } from '@/components/ui/typography';

type ExtractImagesHeaderProps = {
  total: number;
  selectedCount: number;
  allSelected: boolean;
  partiallySelected: boolean;
  isDownloading: boolean;
  onSelectAllChange: (checked: boolean) => void;
  onDownloadZip: () => void;
};

const ExtractImagesHeader = ({
  total,
  selectedCount,
  allSelected,
  partiallySelected,
  isDownloading,
  onSelectAllChange,
  onDownloadZip,
}: ExtractImagesHeaderProps) => {
  const selectAllId = 'extract-images-select-all';

  return (
    <div className="flex items-center justify-between gap-3">
      <div className="flex items-center gap-2 ">
        <Checkbox
          id={selectAllId}
          checked={
            allSelected ? true : partiallySelected ? 'indeterminate' : false
          }
          disabled={total === 0}
          onCheckedChange={(value) => onSelectAllChange(value === true)}
        />
        <Typography variant="p" className="text-xs text-muted-foreground">
          {total} {total === 1 ? 'item' : 'items'}
          {selectedCount > 0 ? ` · ${selectedCount} selected` : ''}
        </Typography>
      </div>
      <div className="flex items-center gap-3">
        <Button
          type="button"
          size="xs"
          variant="default"
          tooltip="Download as zip"
          disabled={selectedCount === 0 || isDownloading}
          onClick={onDownloadZip}
        >
          {isDownloading ? <Spinner /> : <DownloadIcon />}
        </Button>
      </div>
    </div>
  );
};

export { ExtractImagesHeader };
