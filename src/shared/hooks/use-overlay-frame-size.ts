import { useEffect, useRef } from 'react';
import { useMatch } from 'react-router-dom';

import { useSidebar } from '@/components/ui/sidebar';
import {
  EXT_COLLAPSED_FRAME,
  EXT_MESSAGE,
  findNavItemByToolId,
  type ToolPanelSize,
} from '@/shared/constant';

const REM = 16;
const SIDEBAR_EXPANDED = 13 * REM;
/** Space for tool panel when sidebar is collapsed (`right-14`). */
const SIDEBAR_COLLAPSED_WITH_PANEL = 56;
/** Match sidebar `duration-300` so iframe doesn't clip mid-animation. */
const SIDEBAR_TRANSITION_MS = 300;
const PANEL_WIDTH: Record<Exclude<ToolPanelSize, 'full'>, number> = {
  sm: 18 * REM,
  md: 22 * REM,
  lg: 36 * REM,
  '2lg': 48 * REM,
};

type FrameSizePayload = {
  width: number;
  full: boolean;
  compact: boolean;
};

function postFrameSize(payload: FrameSizePayload) {
  window.parent.postMessage(
    {
      type: EXT_MESSAGE.FRAME_SIZE,
      ...payload,
    },
    '*',
  );
}

export function useOverlayFrameSize() {
  const { state } = useSidebar();
  const match = useMatch('/tools/:toolId');
  const toolId = match?.params.toolId;
  const size: ToolPanelSize = findNavItemByToolId(toolId)?.size ?? 'md';
  const prevWidthRef = useRef<number | null>(null);

  useEffect(() => {
    if (window.parent === window) {
      return;
    }

    const isFull = Boolean(toolId) && size === 'full';
    const isCollapsed = state === 'collapsed';
    const hasPanel = Boolean(toolId) && !isFull;
    const compact = isCollapsed && !hasPanel && !isFull;

    const sidebarSpace = isCollapsed
      ? compact
        ? EXT_COLLAPSED_FRAME.width
        : SIDEBAR_COLLAPSED_WITH_PANEL
      : SIDEBAR_EXPANDED;
    const panelSpace = hasPanel
      ? PANEL_WIDTH[size as Exclude<ToolPanelSize, 'full'>] + 8
      : 0;
    const nextWidth = sidebarSpace + panelSpace;
    const prevWidth = prevWidthRef.current;
    const payload: FrameSizePayload = {
      width: nextWidth,
      full: isFull,
      compact,
    };

    // Grow immediately so expand animation has room; shrink after close animation.
    const shouldDelayShrink =
      prevWidth != null && nextWidth < prevWidth && !isFull;

    if (!shouldDelayShrink) {
      prevWidthRef.current = nextWidth;
      postFrameSize(payload);
      return;
    }

    const timer = window.setTimeout(() => {
      prevWidthRef.current = nextWidth;
      postFrameSize(payload);
    }, SIDEBAR_TRANSITION_MS);

    return () => window.clearTimeout(timer);
  }, [size, state, toolId]);
}
