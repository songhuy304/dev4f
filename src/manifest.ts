import { defineManifest } from '@crxjs/vite-plugin';

export default defineManifest({
  manifest_version: 3,

  name: 'DevKit',
  version: '1.0.0',

  permissions: ['activeTab', 'scripting'],

  host_permissions: ['<all_urls>'],

  background: {
    service_worker: 'src/background/index.ts',
    type: 'module',
  },

  content_scripts: [
    {
      matches: ['<all_urls>'],
      js: ['src/content/index.ts'],
      run_at: 'document_idle',
    },
  ],

  web_accessible_resources: [
    {
      resources: ['src/overlay/index.html', 'assets/*'],
      matches: ['<all_urls>'],
    },
  ],

  icons: {
    16: 'icon.svg',
    48: 'icon.svg',
    128: 'icon.svg',
  },

  action: {
    default_title: 'Open Extension',
    default_icon: 'icon.svg',
  },
});
