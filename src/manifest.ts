import { defineManifest } from '@crxjs/vite-plugin';
import packageJson from '../package.json';

export default defineManifest({
  manifest_version: 3,

  name: 'DevKit',
  version: packageJson.version,

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
    16: 'icons/icon-16.png',
    48: 'icons/icon-48.png',
    128: 'icons/icon-128.png',
  },

  action: {
    default_title: 'Open Extension',
    default_icon: 'icons/icon-16.png',
  },
});
