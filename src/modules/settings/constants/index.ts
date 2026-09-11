import type { LucideIcon } from 'lucide-react';
import { Palette } from 'lucide-react';
import AppearanceTab from '../components/appearance-tab';

export const SETTINGS_TABS = {
  APPEARANCE: 'appearance',
} as const;

export type SettingsTab = (typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS];

export const SETTINGS_TABS_MAP: Record<
  SettingsTab,
  {
    label: string;
    description: string;
    icon: LucideIcon;
    component: React.ComponentType<{ tab: SettingsTab }>;
  }
> = {
  [SETTINGS_TABS.APPEARANCE]: {
    label: 'Appearance',
    description: 'Theme, colors, and visual preferences.',
    icon: Palette,
    component: AppearanceTab,
  },
};
