'use client';

import { createContext, useContext, useEffect, useState } from 'react';

import { localStorage } from '@/shared/utils';
import { DEFAULT_THEME } from '../themes/theme-config';

type ThemeMode = 'dark' | 'light';

type ThemeProviderProps = {
  children: React.ReactNode;
  defaultTheme?: ThemeMode;
  initialActiveTheme?: string;
  storageKey?: string;
};

type ThemeProviderState = {
  theme: ThemeMode;
  setTheme: (theme: ThemeMode) => void;

  activeTheme: string;
  setActiveTheme: (theme: string) => void;
};

const initialState: ThemeProviderState = {
  theme: 'dark',
  setTheme: () => null,

  activeTheme: DEFAULT_THEME,
  setActiveTheme: () => null,
};

const ThemeProviderContext = createContext<ThemeProviderState>(initialState);

const ACTIVE_THEME_COOKIE = 'active_theme';

function setThemeCookie(theme: string) {
  document.cookie = [
    `${ACTIVE_THEME_COOKIE}=${theme}`,
    'path=/',
    'max-age=31536000',
    'SameSite=Lax',
  ].join('; ');
}

export function ThemeProvider({
  children,
  defaultTheme = 'dark',
  initialActiveTheme = DEFAULT_THEME,
  storageKey = 'vite-ui-theme',
}: ThemeProviderProps) {
  const [theme, setThemeState] = useState<ThemeMode>(
    () => localStorage.get<ThemeMode>(storageKey) ?? defaultTheme,
  );

  const [activeTheme, setActiveThemeState] = useState(initialActiveTheme);

  /**
   * Dark / Light
   */
  useEffect(() => {
    const root = document.documentElement;

    root.classList.remove('light', 'dark');
    root.classList.add(theme);

    localStorage.set(storageKey, theme);
  }, [theme, storageKey]);

  /**
   * Color / UI theme
   */
  useEffect(() => {
    const root = document.documentElement;

    root.setAttribute('data-theme', activeTheme);

    setThemeCookie(activeTheme);
  }, [activeTheme]);

  const value: ThemeProviderState = {
    theme,

    setTheme: (nextTheme) => {
      setThemeState(nextTheme);
    },

    activeTheme,

    setActiveTheme: (nextTheme) => {
      setActiveThemeState(nextTheme);
    },
  };

  return (
    <ThemeProviderContext.Provider value={value}>
      {children}
    </ThemeProviderContext.Provider>
  );
}

export function useTheme() {
  return useContext(ThemeProviderContext);
}
