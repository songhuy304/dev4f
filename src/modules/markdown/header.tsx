import {
  Check,
  Columns2,
  Copy,
  Download,
  PanelLeft,
  PanelRight,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ButtonGroup } from '@/components/ui/button-group';
import { Typography } from '@/components/ui/typography';
import { useCopyToClipboard } from '@/shared/hooks/use-copy-clipboard';
import { useDownload } from '@/shared/hooks/use-download';
import { ViewMode } from './types';

interface MarkdownHeaderProps {
  value: string;
  characterCount: number;
  viewMode: ViewMode;
  onViewModeChange: (mode: ViewMode) => void;
}

const MarkdownHeader = ({
  value,
  characterCount,
  viewMode,
  onViewModeChange,
}: MarkdownHeaderProps) => {
  const [copiedText, copy] = useCopyToClipboard();
  const { downloadFile, isDownloading } = useDownload();

  const handleCopy = () => {
    void copy(value);
  };

  const handleDownload = async () => {
    const blob = new Blob([value], { type: 'text/markdown;charset=utf-8' });
    const url = URL.createObjectURL(blob);

    try {
      await downloadFile('markdown.md', url);
    } finally {
      URL.revokeObjectURL(url);
    }
  };

  return (
    <div className="shrink-0 border-b px-4 py-3 flex items-center justify-between">
      <div className="inline-flex items-center gap-1 text-muted-foreground">
        <span>·</span>
        <Typography variant="p" className="text-10">
          {characterCount} characters
        </Typography>
      </div>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          size="icon-xs"
          variant="default"
          tooltip="Download .md"
          className="text-foreground"
          disabled={isDownloading}
          onClick={handleDownload}
        >
          <Download />
        </Button>
        <Button
          type="button"
          size="icon-xs"
          variant="outline"
          tooltip={copiedText ? 'Copied' : 'Copy'}
          onClick={handleCopy}
        >
          {copiedText ? <Check /> : <Copy />}
        </Button>

        <ButtonGroup>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            tooltip="Markdown view"
            aria-pressed={viewMode === ViewMode.LEFT}
            onClick={() => onViewModeChange(ViewMode.LEFT)}
          >
            <PanelLeft />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            tooltip="Split"
            aria-pressed={viewMode === ViewMode.SPLIT}
            onClick={() => onViewModeChange(ViewMode.SPLIT)}
          >
            <Columns2 />
          </Button>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            tooltip="Preview view"
            aria-pressed={viewMode === ViewMode.RIGHT}
            onClick={() => onViewModeChange(ViewMode.RIGHT)}
          >
            <PanelRight />
          </Button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export { MarkdownHeader };
