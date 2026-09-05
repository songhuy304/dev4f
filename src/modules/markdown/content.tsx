import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from '@/components/ui/resizable';
import { useFormFields } from '@/components/ui/tanstack-form';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { ViewMode } from './types';

interface MarkdownContentProps {
  viewMode: ViewMode;
  value: string;
}

const MarkdownContent = ({ viewMode, value }: MarkdownContentProps) => {
  const { FormTextareaField } = useFormFields();

  const showLeft = viewMode === ViewMode.LEFT || viewMode === ViewMode.SPLIT;
  const showRight = viewMode === ViewMode.RIGHT || viewMode === ViewMode.SPLIT;

  return (
    <ResizablePanelGroup key={viewMode}>
      {showLeft && (
        <ResizablePanel defaultSize={showRight ? 50 : 100}>
          <FormTextareaField
            name="value"
            showCount={false}
            className="h-full min-h-0 field-sizing-fixed resize-none rounded-none border-0 bg-transparent ring-0 focus-visible:ring-0"
          />
        </ResizablePanel>
      )}
      {showLeft && showRight && <ResizableHandle />}
      {showRight && (
        <ResizablePanel
          defaultSize={showLeft ? 50 : 100}
          className="py-2 px-3"
        >
          <div className="markdown-preview text-sm leading-relaxed">
            <ReactMarkdown remarkPlugins={[remarkGfm]}>{value}</ReactMarkdown>
          </div>
        </ResizablePanel>
      )}
    </ResizablePanelGroup>
  );
};

export { MarkdownContent };
