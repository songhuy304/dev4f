import type { LucideIcon } from 'lucide-react';
import { QrCode } from 'lucide-react';

import { PATHS } from './path';

export type ToolPanelSize = 'sm' | 'md' | 'lg' | 'full';

export type NavItem = {
  title: string;
  url: string;
  icon: LucideIcon;
  size?: ToolPanelSize;
  isActive?: boolean;
};

type NavGroup = {
  title: string;
  url?: string;
  items?: NavItem[];
};

export const NAV_CONFIG: { navMain: NavGroup[] } = {
  navMain: [
    {
      title: 'Tools',
      items: [
        {
          title: 'QR Code',
          url: `/${PATHS.QR_CODE}`,
          icon: QrCode,
          size: 'md',
        },
      ],
    },
  ],
};

export function findNavItemByToolId(toolId?: string) {
  if (!toolId) return undefined;

  for (const group of NAV_CONFIG.navMain) {
    const item = group.items?.find((navItem) => {
      const segments = navItem.url.split('/').filter(Boolean);
      return segments.at(-1) === toolId;
    });
    if (item) return item;
  }

  return undefined;
}
