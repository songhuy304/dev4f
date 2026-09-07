import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from '@/components/ui/collapsible';
import { ChevronRightIcon } from 'lucide-react';

interface CollapseItemProps {
  header: React.ReactNode;
  content: React.ReactNode;
  defaultOpen?: boolean;
  open?: boolean;
  onOpenChange?: (open: boolean) => void;
}

const CollapseItem = ({
  header,
  content,
  defaultOpen,
  open,
  onOpenChange,
}: CollapseItemProps) => {
  return (
    <Collapsible
      defaultOpen={defaultOpen}
      open={open}
      onOpenChange={onOpenChange}
    >
      <CollapsibleTrigger className="group flex w-full cursor-pointer items-center gap-2 px-2 py-2 text-left text-xs transition-colors">
        <ChevronRightIcon
          aria-hidden="true"
          className="text-muted-foreground size-3.5 shrink-0 transition-transform group-data-[state=open]:rotate-90"
        />
        {header}
      </CollapsibleTrigger>

      <CollapsibleContent>
        <div className="bg-sidebar border-t px-2 py-3 text-xs">{content}</div>
      </CollapsibleContent>
    </Collapsible>
  );
};

export { CollapseItem };
