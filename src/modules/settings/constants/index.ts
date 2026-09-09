import type { LucideIcon } from 'lucide-react';
import { BookOpen, Palette } from 'lucide-react';

export const SETTINGS_TABS = {
  APPEARANCE: 'appearance',
  READER: 'reader',
} as const;

export type SettingsTab = (typeof SETTINGS_TABS)[keyof typeof SETTINGS_TABS];

export const SETTINGS_TABS_MAP: Record<
  SettingsTab,
  { label: string; description: string; icon: LucideIcon }
> = {
  [SETTINGS_TABS.APPEARANCE]: {
    label: 'Appearance',
    description: 'Theme, colors, and visual preferences.',
    icon: Palette,
  },
  [SETTINGS_TABS.READER]: {
    label: 'Reader',
    description: 'Reading experience and display options.',
    icon: BookOpen,
  },
};
