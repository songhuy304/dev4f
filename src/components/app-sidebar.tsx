import { ChevronLeft, ChevronRight } from 'lucide-react';
import * as React from 'react';
import { NavLink, useLocation, useNavigate } from 'react-router-dom';

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { NAV_CONFIG } from '@/shared/constant';
import { Logo } from './logo';
import { Button } from './ui/button';

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { state, toggleSidebar } = useSidebar();
  const isCollapsed = state === 'collapsed';
  const location = useLocation();
  const navigate = useNavigate();

  const [openGroups, setOpenGroups] = React.useState<Record<string, boolean>>(
    () => {
      const initialState: Record<string, boolean> = {};

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

  return (
    <Sidebar variant="floating" side="right" {...props}>
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

      <SidebarContent>
        <SidebarGroup>
          <SidebarMenu className="gap-2">
            {NAV_CONFIG.navMain.map((group) => {
              const isOpen = openGroups[group.title];

              return (
                <SidebarMenuItem key={group.title}>
                  <SidebarMenuButton
                    onClick={() => toggleGroup(group.title)}
                    className="flex items-center justify-between font-medium"
                  >
                    <span className="truncate text-[10px] text-sidebar-foreground/50 uppercase">
                      {group.title}
                    </span>

                    <ChevronLeft
                      className={`size-4 text-sidebar-foreground/50 transition-transform duration-300 ${
                        isOpen ? '-rotate-90' : ''
                      }`}
                    />
                  </SidebarMenuButton>

                  <div
                    className={`grid transition-[grid-template-rows] duration-300 ease-in-out ${
                      isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'
                    }`}
                  >
                    <div className="overflow-hidden">
                      {group.items?.length ? (
                        <SidebarMenuSub className="ml-0 border-l-0 px-1.5">
                          {group.items.map((item) => {
                            const isActive = location.pathname === item.url;
                            const Icon = item.icon;

                            return (
                              <SidebarMenuSubItem key={item.title}>
                                <SidebarMenuSubButton
                                  asChild
                                  isActive={isActive}
                                >
                                  <NavLink
                                    to={item.url}
                                    onClick={(event) =>
                                      handleToolClick(event, item.url)
                                    }
                                    className="gap-2 text-xs text-sidebar-foreground/80"
                                  >
                                    <Icon className="size-3.5 shrink-0" />
                                    <span className="truncate">{item.title}</span>
                                  </NavLink>
                                </SidebarMenuSubButton>
                              </SidebarMenuSubItem>
                            );
                          })}
                        </SidebarMenuSub>
                      ) : null}
                    </div>
                  </div>
                </SidebarMenuItem>
              );
            })}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
