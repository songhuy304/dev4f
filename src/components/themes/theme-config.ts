export const ACCENT_COLORS = {
  purple: {
    primary: 'oklch(0.58 0.18 290)',
    primaryForeground: 'oklch(0.98 0 0)',
  },

  blue: {
    primary: 'oklch(0.65 0.18 265)',
    primaryForeground: 'oklch(0.985 0 0)',
  },

  cyan: {
    primary: 'oklch(0.68 0.15 220)',
    primaryForeground: 'oklch(0.98 0 0)',
  },

  green: {
    primary: 'oklch(0.62 0.15 150)',
    primaryForeground: 'oklch(0.98 0 0)',
  },

  amber: {
    primary: 'oklch(0.72 0.16 85)',
    primaryForeground: 'oklch(0.25 0.03 85)',
  },

  pink: {
    primary: 'oklch(0.65 0.16 350)',
    primaryForeground: 'oklch(0.98 0 0)',
  },
} as const;

export const DEFAULT_THEME = 'vercel';

export const THEMES = [
  // {
  //   name: 'Neutral',
  //   value: 'neutral',
  // },
  // {
  //   name: 'Claude',
  //   value: 'claude',
  // },
  // {
  //   name: 'Neobrutualism',
  //   value: 'neobrutualism',
  // },
  // {
  //   name: 'Supabase',
  //   value: 'supabase',
  // },
  {
    name: 'Vercel',
    value: 'vercel',
  },
  {
    name: 'Mono',
    value: 'mono',
  },
  // {
  //   name: 'Notebook',
  //   value: 'notebook',
  // },
  // {
  //   name: 'Light Green',
  //   value: 'light-green',
  // },
  // {
  //   name: 'Zen',
  //   value: 'zen',
  // },
  // {
  //   name: 'Astro Vista',
  //   value: 'astro-vista',
  // },
  // {
  //   name: 'WhatsApp',
  //   value: 'whatsapp',
  // },
];

export type AccentColor = keyof typeof ACCENT_COLORS;
export const DEFAULT_ACCENT_COLOR: AccentColor = 'purple';
export const ACCENT_COLORS_KEY = 'accent_color';
