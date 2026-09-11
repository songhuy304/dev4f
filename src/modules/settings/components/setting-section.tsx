import { Typography } from '@/components/ui/typography';
import { type SettingsTab, SETTINGS_TABS_MAP } from '../constants';

function SettingsSection({ tab }: { tab: SettingsTab }) {
  const { label, description } = SETTINGS_TABS_MAP[tab];

  return (
    <div className="flex h-full flex-col gap-5">
      <header className="space-y-1">
        <Typography variant="h4">{label}</Typography>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>
    </div>
  );
}

export default SettingsSection;
