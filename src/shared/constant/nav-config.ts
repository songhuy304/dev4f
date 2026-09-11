import type { LucideIcon } from 'lucide-react';
import {
  Book,
  Braces,
  CalendarClock,
  Camera,
  Coins,
  Database,
  GitCompare,
  Image,
  KeyRound,
  Link,
  Palette,
  QrCode,
  Ruler,
  Settings,
  StickyNote,
  Text,
  Zap,
} from 'lucide-react';

import { PATHS } from './path';

export type ToolPanelSize = 'sm' | 'md' | 'lg' | '2lg' | '3lg' | 'full';

export type NavItem = {
  key: string;
  title: string;
  url: string;
  icon: LucideIcon;
  size?: ToolPanelSize;
  isActive?: boolean;
  isNew?: boolean;
};

export type NavGroup = {
  title: string;
  url?: string;
  items?: NavItem[];
};

export const NAV_CONFIG: {
  navMain: NavGroup[];
  navFooter: NavItem[];
} = {
  navMain: [
    {
      title: 'Developer',
      items: [
        {
          key: 'jwt-decoder',
          title: 'JWT Decoder',
          url: `/${PATHS.JWT_DECODER}`,
          icon: KeyRound,
          size: 'md',
        },
        {
          key: 'timestamp',
          title: 'Timestamp Converter',
          url: `/${PATHS.TIMESTAMP}`,
          icon: CalendarClock,
          size: '2lg',
        },

        {
          key: 'page-speed',
          title: 'Page Speed',
          url: `/${PATHS.PAGE_SPEED}`,
          icon: Zap,
          size: 'md',
        },
      ],
    },

    {
      title: 'Web Tools',
      items: [
        {
          key: 'responsive-viewer',
          title: 'Responsive Viewer',
          url: `/${PATHS.RESPONSIVE_VIEWER}`,
          icon: Ruler,
          size: 'md',
        },
        {
          key: 'storage-manager',
          title: 'Storage Manager',
          url: `/${PATHS.STORAGE_MANAGER}`,
          icon: Database,
          size: 'lg',
          isNew: true,
        },
        {
          key: 'extract-images',
          title: 'Extract Images',
          url: `/${PATHS.EXTRACT_IMAGES}`,
          icon: Image,
          size: 'md',
        },

        {
          key: 'image-to-text',
          title: 'Image to Text',
          url: `/${PATHS.IMAGE_TO_TEXT}`,
          icon: Text,
          size: 'lg',
          isNew: true,
        },

        {
          key: 'format-json',
          title: 'Format JSON',
          url: `/${PATHS.FORMAT_JSON}`,
          icon: Braces,
          size: 'md',
        },
        {
          key: 'text-compare',
          title: 'Text compare',
          url: `/${PATHS.TEXT_COMPARE}`,
          icon: GitCompare,
          size: 'md',
        },
        {
          key: 'color-picker',
          title: 'Color Picker',
          url: `/${PATHS.COLOR_PICKER}`,
          icon: Palette,
          size: 'md',
        },
        {
          key: 'screenshot',
          title: 'Screenshot',
          url: `/${PATHS.SCREENSHOT}`,
          icon: Camera,
          size: 'md',
        },
        {
          key: 'link-shortener',
          title: 'Link Shortener',
          url: `/${PATHS.LINK_SHORTENER}`,
          icon: Link,
          size: 'md',
        },

        {
          key: 'markdown-preview',
          title: 'Markdown Preview',
          url: `/${PATHS.MARKDOWN_PREVIEW}`,
          icon: Book,
          size: 'full',
        },
      ],
    },

    {
      title: 'Utilities',
      items: [
        {
          key: 'currency-converter',
          title: 'Currency Converter',
          url: `/${PATHS.CURRENCY_CONVERTER}`,
          icon: Coins,
          size: 'md',
        },
        {
          key: 'qr-code',
          title: 'QR Code',
          url: `/${PATHS.QR_CODE}`,
          icon: QrCode,
          size: 'md',
        },
      ],
    },

    {
      title: 'Productivity',
      items: [
        {
          key: 'sticky-notes',
          title: 'Sticky Notes',
          url: `/${PATHS.STICKY_NOTES}`,
          icon: StickyNote,
          size: 'md',
        },
      ],
    },
  ],
  navFooter: [
    {
      key: 'settings',
      title: 'Settings',
      url: `/${PATHS.SETTINGS}`,
      icon: Settings,
      size: '3lg',
    },
  ],
};

function getAllNavItems() {
  return [
    ...NAV_CONFIG.navMain.flatMap((group) => group.items ?? []),
    ...NAV_CONFIG.navFooter,
  ];
}

export function findNavItemByToolId(toolId?: string) {
  if (!toolId) return undefined;

  return getAllNavItems().find((navItem) => {
    const segments = navItem.url.split('/').filter(Boolean);
    return segments.at(-1) === toolId;
  });
}

export function findNavItemByUrl(url?: string) {
  if (!url) return undefined;
  return getAllNavItems().find((navItem) => navItem.url === url);
}
