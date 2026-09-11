import { Button } from '@/components/ui/button';
import { ButtonCopy } from '@/components/ui/button-copy';
import { ButtonGroup } from '@/components/ui/button-group';
import { Typography } from '@/components/ui/typography';
import { useDownload } from '@/shared/hooks/use-download';
import { Columns2, Download, PanelLeft, PanelRight } from 'lucide-react';
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
  const { downloadMarkdown, isDownloading } = useDownload();

  const handleDownload = () => {
    downloadMarkdown(value, 'markdown');
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
        <ButtonCopy size="icon-xs" content={value} justIcon variant="outline" />

        <ButtonGroup>
          <Button
            type="button"
            size="icon-xs"
            variant="outline"
            tooltip="Markdown view"
            className="text-muted-foreground text"
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
            className="text-muted-foreground"
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
            className="text-muted-foreground"
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
