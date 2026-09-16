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

import { useFilter, usePinnedTools } from '@/shared/hooks';
import { InputSearch } from './input-search';
import { Logo } from './logo';
import { Button } from './ui/button';
import { Empty, EmptyContent, EmptyDescription, EmptyTitle } from './ui/empty';
import { ScrollFadeEffect } from './ui/scroll-fade';
import { Separator } from './ui/separator';

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

  const matchesSearch = (title: string, q: string) =>
    !q || title.toLocaleLowerCase().includes(q.toLocaleLowerCase());

  const {
    data: filteredNav,
    keyword,
    setKeyword,
  } = useFilter({
    items: NAV_CONFIG.navMain,
    filterFn: (group, q) => {
      const items = group.items?.filter(
        (item) => !hasPinnedTool(item.key) && matchesSearch(item.title, q),
      );

      if (!items?.length) return false;

      return { ...group, items };
    },
  });

  const filteredPinnedGroup = {
    ...pinnedGroup,
    items: (pinnedGroup.items ?? []).filter((item) =>
      matchesSearch(item.title, keyword),
    ),
  };

  return (
    <Sidebar variant="floating" side={"right"} {...props}>
      {/* ==================== HEADER ==================== */}
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem className="flex items-center justify-between py-2 pl-2">
            <Logo withText={!isCollapsed} />

            <Button variant="ghost" className="size-8" onClick={toggleSidebar}>
              <ChevronRight className="size-4 text-sidebar-foreground/50" />
            </Button>
          </SidebarMenuItem>

          <InputSearch
            placeholder="Search by name..."
            className="w-full h-7!"
            value={keyword}
            onChange={(e) => setKeyword(e.target.value)}
          />
        </SidebarMenu>
      </SidebarHeader>

      {/* ==================== CONTENT ==================== */}
      <SidebarContent className="overflow-hidden">
        <ScrollFadeEffect className="flex-1">
          <SidebarGroup>
            <SidebarMenu className="gap-2">
              {!!filteredPinnedGroup.items?.length && (
                <SidebarNavGroup
                  group={filteredPinnedGroup}
                  isOpen={openGroups[pinnedGroup.title]}
                  onToggle={() => toggleGroup(pinnedGroup.title)}
                />
              )}

              {filteredNav.length > 0 ? (
                filteredNav.map((group) => (
                  <SidebarNavGroup
                    key={group.title}
                    group={group}
                    isOpen={openGroups[group.title]}
                    onToggle={() => toggleGroup(group.title)}
                  />
                ))
              ) : !filteredPinnedGroup.items?.length ? (
                <Empty className="gap-3 border-0 p-4 md:p-4">
                  <EmptyContent className="gap-1.5">
                    <EmptyTitle>No tools found</EmptyTitle>
                    <EmptyDescription>
                      Try a different search keyword.
                    </EmptyDescription>
                  </EmptyContent>
                </Empty>
              ) : null}
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
