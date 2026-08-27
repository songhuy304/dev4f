import { AppSidebar } from './app-sidebar';
import { ToolPanel } from './tool-panel';
import { SidebarProvider } from './ui/sidebar';

const AppLayout = () => {
  return (
    <SidebarProvider defaultOpen className="relative min-h-svh bg-transparent">
      <ToolPanel />
      <AppSidebar />
    </SidebarProvider>
  );
};

export { AppLayout };
