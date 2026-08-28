import { Pin, X } from 'lucide-react';
import { AnimatePresence, motion } from 'motion/react';
import { useNavigate, useMatch, useOutlet } from 'react-router-dom';

import { Button } from '@/components/ui/button';
import { useSidebar } from '@/components/ui/sidebar';
import {
  findNavItemByToolId,
  TOOLS_ROUTE,
  type ToolPanelSize,
} from '@/shared/constant';
import { cn } from '@/shared/lib/utils';
import { useKeyboard, usePinnedTools } from '@/shared/hooks';

import { Kbd } from './ui/kbd';

const PANEL_SIZE_CLASS: Record<ToolPanelSize, string> = {
  sm: 'w-[min(18rem,calc(100vw-4rem))]',
  md: 'w-[min(22rem,calc(100vw-4rem))]',
  lg: 'w-[min(36rem,calc(100vw-4rem))]',
  '2lg': 'w-[min(48rem,calc(100vw-4rem))]',
  full: 'left-2 w-auto',
};

export function ToolPanel() {
  const navigate = useNavigate();
  const match = useMatch('/tools/:toolId');
  const toolId = match?.params.toolId;

  const { hasPinnedTool, togglePinnedTool } = usePinnedTools();
  const { state } = useSidebar();

  const isCollapsed = state === 'collapsed';

  const navItem = findNavItemByToolId(toolId);
  const title = navItem?.title ?? toolId ?? 'Tool';
  const size: ToolPanelSize = navItem?.size ?? 'md';
  const Icon = navItem?.icon;
  const key = navItem?.key ?? '';
  const isFull = size === 'full';

  const outlet = useOutlet({
    toolId,
    title,
    size,
    icon: Icon,
  });

  const closePanel = () => navigate('/');

  useKeyboard({
    Escape: closePanel,
  });

  return (
    <AnimatePresence mode="wait">
      {toolId && (
        <motion.aside
          key={toolId}
          data-slot="tool-panel"
          data-size={size}
          data-state="open"
          initial={{
            opacity: 0,
            x: 24,
          }}
          animate={{
            opacity: 1,
            x: 0,
          }}
          exit={{
            opacity: 0,
            x: 24,
          }}
          transition={{
            duration: 0.3,
          }}
          className={cn(
            'fixed top-2 bottom-2 z-20 flex flex-col overflow-hidden rounded-2xl border border-sidebar-border bg-sidebar text-sidebar-foreground shadow-lg',
            PANEL_SIZE_CLASS[size],
            isCollapsed
              ? 'right-14'
              : 'right-[calc(var(--sidebar-width)+0.5rem)]',
            isFull && 'left-2',
          )}
        >
          <header
            className={cn(
              'relative isolate flex shrink-0 items-center justify-between gap-2',
              'border-b border-sidebar-border px-4 py-3',
              'before:absolute before:inset-x-0 before:top-0 before:bottom-px before:-z-10',
              'before:bg-linear-to-b before:from-[#424247] before:to-transparent before:to-60%',
            )}
          >
            <div className="flex min-w-0 items-center gap-2">
              {Icon ? (
                <Icon className="size-4 shrink-0 text-muted-foreground" />
              ) : null}

              <span className="truncate text-sm font-medium">{title}</span>

              <span
                aria-hidden
                className="size-1.5 shrink-0 rounded-full bg-emerald-500"
              />
            </div>

            <div className="flex shrink-0 items-center gap-0.5">
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                tooltip={hasPinnedTool(key) ? 'Unpin panel' : 'Pin panel'}
                className="text-muted-foreground"
                aria-label={hasPinnedTool(key) ? 'Unpin panel' : 'Pin panel'}
                onClick={() => togglePinnedTool(key)}
              >
                <Pin
                  className={cn(
                    'size-4',
                    hasPinnedTool(key) && 'text-foreground',
                  )}
                />
              </Button>

              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                tooltip="Close panel"
                className="text-muted-foreground"
                aria-label="Close panel"
                onClick={closePanel}
              >
                <X className="size-4" />
              </Button>
            </div>
          </header>

          <div className="min-h-0 flex-1 overflow-y-auto px-4 py-2">
            {outlet}
          </div>

          <footer className="flex shrink-0 items-center justify-between gap-3 border-t border-sidebar-border px-4 py-3 text-[11px] text-muted-foreground">
            <span>
              <Kbd className="mr-2">Esc</Kbd>
              close
            </span>

            <span className="truncate text-sidebar-foreground/40">
              {TOOLS_ROUTE.DETAIL(toolId)}
            </span>
          </footer>
        </motion.aside>
      )}
    </AnimatePresence>
  );
}
