import { CheckIcon, CopyIcon, DownloadIcon, ExternalLinkIcon } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Typography } from '@/components/ui/typography';
import { useCopyToClipboard } from '@/shared/hooks/use-copy-clipboard';
import { useDownload } from '@/shared/hooks/use-download';
import { cn } from '@/shared/lib/utils';

import {
  IMAGE_KIND_BADGE_VARIANT,
  IMAGE_KIND_LABEL,
  type ImageItem,
} from '../utils';
import { fetchImageBlob } from '../utils/download-images-zip';

type ImageCardProps = {
  item: ImageItem;
  selected: boolean;
  onSelectedChange: (selected: boolean) => void;
};

const checkerboardClass =
  '[background-color:#1c1c1c] [background-image:linear-gradient(45deg,#2a2a2a_25%,transparent_25%),linear-gradient(-45deg,#2a2a2a_25%,transparent_25%),linear-gradient(45deg,transparent_75%,#2a2a2a_75%),linear-gradient(-45deg,transparent_75%,#2a2a2a_75%)] [background-size:12px_12px] [background-position:0_0,0_6px,6px_-6px,-6px_0] flex items-center justify-center';

const ImageCard = ({ item, selected, onSelectedChange }: ImageCardProps) => {
  const [copied, , copyImage] = useCopyToClipboard();
  const { downloadAsync } = useDownload();

  const handleCopyImage = () => {
    void copyImage(item.url);
  };

  const handleDownload = () => {
    void downloadAsync(async () => ({
      blob: await fetchImageBlob(item.url),
      fileName: item.name,
    }));
  };

  return (
    <div
      className={cn(
        'overflow-hidden rounded-xl border bg-card text-card-foreground shadow-sm transition-colors',
        selected && 'border-primary ring-1 ring-primary/40',
      )}
    >
      <div
        className={cn(
          'relative aspect-square overflow-hidden',
          checkerboardClass,
        )}
      >
        <img
          src={item.url}
          alt={item.name}
          loading="lazy"
          className="object-contain"
          draggable={false}
        />

        <Badge
          variant={IMAGE_KIND_BADGE_VARIANT[item.kind]}
          className="absolute top-2 left-2 rounded-md px-1.5 py-0 text-[10px] font-semibold tracking-wide uppercase"
        >
          {IMAGE_KIND_LABEL[item.kind]}
        </Badge>

        <div className="absolute top-2 right-2">
          <Checkbox
            checked={selected}
            onCheckedChange={(value) => onSelectedChange(value === true)}
            aria-label={`Select ${item.name}`}
            className="size-5 border-white/40 bg-black/50 data-[state=checked]:border-primary"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-t px-2.5 py-2">
        <Typography
          variant="small"
          ellipsis
          className="min-w-0 text-xs text-muted-foreground"
          tooltip={item.name}
        >
          {item.name}
        </Typography>

        <div className="flex shrink-0 items-center gap-0.5">
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            tooltip={copied === item.url ? 'Copied' : 'Copy image'}
            aria-label="Copy image"
            onClick={handleCopyImage}
          >
            {copied === item.url ? <CheckIcon /> : <CopyIcon />}
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            tooltip="Open"
            aria-label="Open image"
            onClick={() =>
              window.open(item.url, '_blank', 'noopener,noreferrer')
            }
          >
            <ExternalLinkIcon />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="ghost"
            tooltip="Download"
            aria-label="Download image"
            onClick={handleDownload}
          >
            <DownloadIcon />
          </Button>
        </div>
      </div>
    </div>
  );
};

export { ImageCard };
