import * as React from 'react';

import { ChevronRight } from 'lucide-react';

import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarNavGroup,
  useSidebar,
} from '@/components/ui/sidebar';

import { NAV_CONFIG } from '@/shared/constant';

import { usePinnedTools } from '@/shared/hooks';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Separator } from './ui/separator';
import { ScrollFadeEffect } from './ui/scroll-fade';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const { hasPinnedTool, navPin } = usePinnedTools();
  const pinnedGroup = navPin();

  const isCollapsed = state === 'collapsed';

  const location = useLocation();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {
        [pinnedGroup.title]: true,
      };

      NAV_CONFIG.navMain.forEach((group) => {
        initialState[group.title] = true;
      });

      return initialState;
    },
  );

  const toggleGroup = (title: string) => {
    setOpenGroups((prev) => ({
      ...prev,
      [title]: !prev[title],
    }));
  };

  const handleToolClick = (
    event: React.MouseEvent<HTMLAnchorElement>,
    url: string,
  ) => {
    if (location.pathname === url) {
      event.preventDefault();
      navigate('/');
    }
  };

  const navMainGroups = NAV_CONFIG.navMain.map((group) => ({
    ...group,
    items: group.items?.filter((item) => !hasPinnedTool(item.key)),
  }));

  return (
    <Sidebar variant="floating" side="right" {...props}>
      {/* ==================== HEADER ==================== */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between py-2 pl-2">
            <Logo withText={!isCollapsed} />

            <Button variant="ghost" className="size-8" onClick={toggleSidebar}>
              <ChevronRight className="size-4 text-sidebar-foreground/50" />
            </Button>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      {/* ==================== CONTENT ==================== */}
      <SidebarContent className="overflow-hidden">
        <ScrollFadeEffect className="flex-1">
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              <SidebarNavGroup
                group={pinnedGroup}
                isOpen={openGroups[pinnedGroup.title]}
                onToggle={() => toggleGroup(pinnedGroup.title)}
              />

              {navMainGroups.map((group) => (
                <SidebarNavGroup
                  key={group.title}
                  group={group}
                  isOpen={openGroups[group.title]}
                  onToggle={() => toggleGroup(group.title)}
                />
              ))}
            </SidebarMenu>
          </SidebarGroup>
        </ScrollFadeEffect>
      </SidebarContent>

      <SidebarFooter>
        <Separator />
        <SidebarMenu>
          {NAV_CONFIG.navFooter.map((item) => {
            const Icon = item.icon;

            const isActive = location.pathname === item.url;

            return (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  isActive={isActive}
                  tooltip={item.title}
                >
                  <NavLink
                    to={item.url}
                    onClick={(event) => handleToolClick(event, item.url)}
                    className="gap-2 text-xs text-sidebar-foreground/80"
                  >
                    <Icon className="size-4 shrink-0" />

                    <span className="truncate">{item.title}</span>
                  </NavLink>
                </SidebarMenuButton>
              </SidebarMenuItem>
            );
          })}
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
}
