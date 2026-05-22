import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'ch.nolimitevents.app',
  appName: 'No Limit Events',
  webDir: 'build',
  server: {
    url: 'https://app.nolimitevents.ch',
    cleartext: false
  }
};

export default config;
