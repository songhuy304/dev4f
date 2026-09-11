'use client';

import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';
import { Kbd } from '@/components/ui/kbd';
import React from 'react';
import { useTheme } from './theme-provider';
import { SunIcon } from 'lucide-react';

export function ThemeModeToggle() {
  const { setTheme, theme } = useTheme();

  const handleThemeToggle = React.useCallback(
    (e?: React.MouseEvent) => {
      const newMode = theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;

      if (!document.startViewTransition) {
        setTheme(newMode);
        return;
      }

      // Set coordinates from the click event
      if (e) {
        root.style.setProperty('--x', `${e.clientX}px`);
        root.style.setProperty('--y', `${e.clientY}px`);
      }

      document.startViewTransition(() => {
        setTheme(newMode);
      });
    },
    [theme, setTheme],
  );

  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Button
          variant="secondary"
          size="icon"
          className="group/toggle size-8"
          onClick={handleThemeToggle}
        >
          <SunIcon className="size-4" />
          <span className="sr-only">Toggle theme</span>
        </Button>
      </TooltipTrigger>
      <TooltipContent>
        Toggle theme <Kbd>D D</Kbd>
      </TooltipContent>
    </Tooltip>
  );
}
