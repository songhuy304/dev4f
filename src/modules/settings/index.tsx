import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

import {
  SETTINGS_TABS,
  SETTINGS_TABS_MAP,
  type SettingsTab,
} from './constants';
import { useState } from 'react';

const SettingsPage = () => {
  const [activeTab, setActiveTab] = useState<SettingsTab>(
    SETTINGS_TABS.APPEARANCE,
  );
  const Component = SETTINGS_TABS_MAP[activeTab].component;

  return (
    <div className="h-full bg-muted">
      <Tabs
        orientation="vertical"
        value={activeTab}
        onValueChange={(value) => setActiveTab(value as SettingsTab)}
        className="h-full gap-0"
      >
        <TabsList className="h-auto shrink-0 w-52 items-stretch justify-start gap-0.5 self-stretch px-2 pb-3">
          {Object.entries(SETTINGS_TABS_MAP).map(
            ([value, { label, icon: Icon }]) => (
              <TabsTrigger
                className="py-1.5 group data-[state=active]:bg-primary/30!"
                key={value}
                value={value}
              >
                <Icon className="size-3.5 group-data-[state=active]:text-primary!" />
                {label}
              </TabsTrigger>
            ),
          )}
        </TabsList>

        <div className="min-h-0 min-w-0 flex-1 overflow-y-auto pl-5 bg-background py-3 px-2">
          {(Object.keys(SETTINGS_TABS_MAP) as SettingsTab[]).map((tab) => (
            <TabsContent key={tab} value={tab} className="mt-0 h-full">
              <Component tab={tab} />
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
};

export { SettingsPage };
