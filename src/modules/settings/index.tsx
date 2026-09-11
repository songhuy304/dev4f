import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty';
import { Separator } from '@/components/ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  SETTINGS_TABS,
  SETTINGS_TABS_MAP,
  type SettingsTab,
} from './constants';

function SettingsSection({ tab }: { tab: SettingsTab }) {
  const { label, description, icon: Icon } = SETTINGS_TABS_MAP[tab];

  return (
    <div className="flex h-full flex-col gap-5">
      <header className="space-y-1">
        <h2 className="text-sm font-medium tracking-tight">{label}</h2>
        <p className="text-xs text-muted-foreground">{description}</p>
      </header>

      <Separator />

      <Empty className="min-h-0 flex-1 border border-dashed border-border/60 bg-muted/20">
        <EmptyHeader>
          <EmptyMedia variant="icon">
            <Icon />
          </EmptyMedia>
          <EmptyTitle>Coming soon</EmptyTitle>
          <EmptyDescription>
            {label} settings will show up here.
          </EmptyDescription>
        </EmptyHeader>
      </Empty>
    </div>
  );
}

const SettingsPage = () => {
  return (
    <div className="h-full bg-card/40">
      <Tabs
        orientation="vertical"
        className="h-full gap-0"
        defaultValue={SETTINGS_TABS.APPEARANCE}
      >
        <TabsList className="h-auto shrink-0 items-stretch justify-start gap-0.5 self-stretch px-6 py-3">
          {Object.entries(SETTINGS_TABS_MAP).map(
            ([value, { label, icon: Icon }]) => (
              <TabsTrigger key={value} value={value}>
                <Icon className="size-3.5 opacity-70" />
                {label}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pl-5 bg-background py-3 px-2">
          {(Object.keys(SETTINGS_TABS_MAP) as SettingsTab[]).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 h-full">
              <SettingsSection tab={tab} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export { SettingsPage };
