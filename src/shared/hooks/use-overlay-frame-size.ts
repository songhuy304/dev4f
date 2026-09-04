import { useEffect } from 'react';
import { useMatch } from 'react-router-dom';

import { useSidebar } from '@/components/ui/sidebar';
import {
  EXT_MESSAGE,
  findNavItemByToolId,
  type ToolPanelSize,
} from '@/shared/constant';

const REM = 16;
const SIDEBAR_EXPANDED = 13 * REM + 16;
const SIDEBAR_COLLAPSED = 56;
const PANEL_WIDTH: Record<Exclude<ToolPanelSize, 'full'>, number> = {
  sm: 18 * REM,
  md: 22 * REM,
  lg: 36 * REM,
  '2lg': 48 * REM,
};

export function useOverlayFrameSize() {
  const { state } = useSidebar();
  const match = useMatch('/tools/:toolId');
  const toolId = match?.params.toolId;
  const size: ToolPanelSize = findNavItemByToolId(toolId)?.size ?? 'md';

  useEffect(() => {
    if (window.parent === window) {
      return;
    }

    const isFull = Boolean(toolId) && size === 'full';
    const sidebarSpace =
      state === 'collapsed' ? SIDEBAR_COLLAPSED : SIDEBAR_EXPANDED;
    const panelSpace =
      toolId && !isFull
        ? PANEL_WIDTH[size as Exclude<ToolPanelSize, 'full'>] + 8
        : 0;

    window.parent.postMessage(
      {
        type: EXT_MESSAGE.FRAME_SIZE,
        width: sidebarSpace + panelSpace,
        full: isFull,
      },
      '*',
    );
  }, [size, state, toolId]);
}
