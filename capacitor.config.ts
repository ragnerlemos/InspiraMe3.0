
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inspireme.app',
  appName: 'InspireMe',
  webDir: 'out',
  server: {
    // A URL será a do seu deploy no Vercel/Firebase
    // Ex: 'https://inspireme-app.vercel.app'
    url: 'http://localhost:3000', 
    cleartext: true,
  },
};

export default config;
