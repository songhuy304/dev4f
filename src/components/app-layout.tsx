import { useLastUsedPath, useOverlayFrameSize } from '@/shared/hooks';

import { AppSidebar } from './app-sidebar';
import { ToolPanel } from './tool-panel';
import { SidebarProvider } from './ui/sidebar';

function OverlayFrameSync() {
  useOverlayFrameSize();
  return null;
}

function LastUsedPathSync() {
  useLastUsedPath();
  return null;
}

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen>
      <OverlayFrameSync />
      <LastUsedPathSync />
      <ToolPanel />
      <AppSidebar />
    </SidebarProvider>
  );
};

export { AppLayout };
