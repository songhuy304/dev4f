import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { LocalStorageEditor } from './local-storage-editor';
import { SessionStorageEditor } from './sesstion-editor';
import { CookieEditor } from './cookie-editor';

const ETab = {
  LOCAL_STORAGE: 'local-storage',
  SESSION_STORAGE: 'session-storage',
  COOKIES: 'cookies',
};

const BrowserStoragePage = () => {
  return (
    <div className="px-3 py-2">
      <Tabs defaultValue={ETab.COOKIES} className="w-full flex-1">
        <TabsList className="w-full">
          <TabsTrigger value={ETab.LOCAL_STORAGE}>Local Storage</TabsTrigger>
          <TabsTrigger value={ETab.SESSION_STORAGE}>
            Session Storage
          </TabsTrigger>
          <TabsTrigger value={ETab.COOKIES}>Cookies</TabsTrigger>
        </TabsList>

        <TabsContent value={ETab.LOCAL_STORAGE}>
          <LocalStorageEditor />
        </TabsContent>
        <TabsContent value={ETab.SESSION_STORAGE}>
          <SessionStorageEditor />
        </TabsContent>
        <TabsContent value={ETab.COOKIES}>
          <CookieEditor />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export { BrowserStoragePage };
