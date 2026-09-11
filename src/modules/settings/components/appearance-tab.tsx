import { ThemeModeToggle } from '@/components/themes/theme-mode-toggle';
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { SETTINGS_TABS } from '../constants';
import { CardRow } from './card-row';
import SettingsSection from './setting-section';
import { useSidebar } from '@/components/ui/sidebar';
import { useAccentColor } from '@/components/themes/use-accent-color';
import { ACCENT_COLORS, AccentColor } from '@/components/themes/theme-config';

const SwitchAccentColor = () => {
  const { accentColor, setAccentColor } = useAccentColor();

  return (
    <div className="flex gap-2 items-center">
      {Object.entries(ACCENT_COLORS).map(([key, value]) => (
        <div
          key={key}
          className="size-4 rounded-full cursor-pointer border border-transparent transition-all duration-300"
          style={{
            backgroundColor: value.primary,
            border:
              accentColor === key
                ? '1px solid var(--primary)'
                : 'none',
          }}
          onClick={() => setAccentColor(key as AccentColor)}
        />
      ))}
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
          />
          <CardRow
            title="Accent color"
            description="Sets the highlight color used for active states"
          >
            <SwitchAccentColor />
          </CardRow>
          <CardRow
            title="Sidebar position"
            description="Determines where the navigation sidebar is anchored within the layout"
          >
            <TogglePosition />
          </CardRow>
        </CardContent>
      </Card>
    </div>
  );
};

export default AppearanceTab;
