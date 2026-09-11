// shared/hooks/use-accent-color.ts

import { useCallback, useEffect, useState } from 'react';

import {
  ACCENT_COLORS,
  ACCENT_COLORS_KEY,
  DEFAULT_ACCENT_COLOR,
  type AccentColor,
} from './theme-config';
import { localStorage } from '@/shared/utils';

function getStoredAccentColor(): AccentColor {
  const stored = localStorage.get<AccentColor>(ACCENT_COLORS_KEY);
  return stored ?? DEFAULT_ACCENT_COLOR;
}

function applyAccentColor(color: AccentColor) {
  const root = document.documentElement;
  const theme = ACCENT_COLORS[color];

  root.style.setProperty('--primary', theme.primary);
  root.style.setProperty('--primary-foreground', theme.primaryForeground);
}

export function useAccentColor() {
  const [accentColor, setAccentColor] =
    useState<AccentColor>(getStoredAccentColor);

  useEffect(() => {
    applyAccentColor(accentColor);
  }, [accentColor]);

  const handleSetAccentColor = useCallback((color: AccentColor) => {
    setAccentColor(color);

    localStorage.set<AccentColor>(ACCENT_COLORS_KEY, color);

    applyAccentColor(color);
  }, []);

  return {
    accentColor,
    setAccentColor: handleSetAccentColor,
    accentColors: ACCENT_COLORS,
  };
}
