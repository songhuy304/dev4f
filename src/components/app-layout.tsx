import { useOverlayFrameSize } from '@/shared/hooks';

import { AppSidebar } from './app-sidebar';
import { ToolPanel } from './tool-panel';
import { SidebarProvider } from './ui/sidebar';

function OverlayFrameSync() {
  useOverlayFrameSize();
  return null;
}

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen>
      <OverlayFrameSync />
      <ToolPanel />
      <AppSidebar />
    </SidebarProvider>
  );
};

export { AppLayout };
