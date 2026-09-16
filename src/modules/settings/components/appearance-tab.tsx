import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useSidebar } from '@/components/ui/sidebar';
import { useAccentColor } from '@/components/themes/use-accent-color';
import { ACCENT_COLORS, AccentColor } from '@/components/themes/theme-config';
import { cn } from '@/shared/lib/utils';
import { SETTINGS_TABS } from '../constants';
import { CardRow } from './card-row';
import SettingsSection from './setting-section';
import { ThemeSelector } from '@/components/themes/theme-selector';

const SwitchAccentColor = () => {
  const { accentColor, setAccentColor } = useAccentColor();

  return (
    <div className="flex items-center gap-2.5">
      {Object.entries(ACCENT_COLORS).map(([key, value]) => {
        const isActive = accentColor === key;

        return (
          <button
            key={key}
            type="button"
            aria-label={`Accent ${key}`}
            aria-pressed={isActive}
            className={cn(
              'size-4 shrink-0 cursor-pointer rounded-full transition-all duration-200',
              'hover:scale-110 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background',
              isActive &&
                'scale-110 ring-2 ring-foreground ring-offset-2 ring-offset-background',
            )}
            style={{ backgroundColor: value.primary }}
            onClick={() => setAccentColor(key as AccentColor)}
          />
        );
      })}
    </div>
  );
};

const TogglePosition = () => {
  const { setSidebarPosition } = useSidebar();
  return (
    <div className="flex flex-col items-center justify-center gap-4">
      <ToggleGroup
        variant="outline"
        defaultValue="left"
        type="single"
        size="xs"
        spacing={0}
      >
        <ToggleGroupItem
          value="left"
          aria-label="Toggle left"
          onClick={() => setSidebarPosition('left')}
        >
          Left
        </ToggleGroupItem>
        <ToggleGroupItem
          value="right"
          aria-label="Toggle right"
          onClick={() => setSidebarPosition('right')}
        >
          Right
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

const AppearanceTab = () => {
  return (
    <div className="space-y-6">
      <SettingsSection tab={SETTINGS_TABS.APPEARANCE} />

      <Card className="py-0">
        <CardContent className="divide-y p-0">
          <CardRow
            title="Color mode"
            description="Switch between light, dark themes."
          >
            <ThemeModeToggle />
          </CardRow>
          <CardRow
            title="Theme"
            description="Controls the overall visual language, including surfaces, text, borders, and color tokens"
          >
            <ThemeSelector />
          </CardRow>
          <CardRow
            title="Accent color"
            description="Sets the highlight color used for active states"
          >
            <SwitchAccentColor />
          </CardRow>
          {/* <CardRow
            title="Sidebar position"
            description="Determines where the navigation sidebar is anchored within the layout"
          >
            <TogglePosition />
          </CardRow> */}
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceTab;
