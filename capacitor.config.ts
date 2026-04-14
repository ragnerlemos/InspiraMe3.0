import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inspireme2.app',
  appName: 'InspireMe',
  webDir: 'out',
  cordova: {
    preferences: {
      'android-targetSdkVersion': '33',
      'android-minSdkVersion': '22',
      'android-compileSdkVersion': '33'
    }
  },
  plugins: {
    Clipboard: {
      webAuth: {
        blockRobots: true,
        blockPartialBotDetection: true
      }
    },
    Permissions: {
      android: {
        alias: 'clipboard-write',
        name: 'clipboard-write',
        permission: 'android.permission.CLIPBOARD_WRITE'
      }
    }
  }
};

export default config;
