import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inspireme2.app',
  appName: 'InspireMe',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
};

export default config;
