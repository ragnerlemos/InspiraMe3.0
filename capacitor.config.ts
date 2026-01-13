
import type { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.inspireme2.app',
  appName: 'InspireMe',
  webDir: 'out',
  server: {
    androidScheme: 'https',
  },
  plugins: {
    Firebase: {
      config: {
        projectId: "quotevid2-57726828-e0133",
        appId: "1:523999002605:web:ccb32fab01f90f09ebb1e4",
        apiKey: "AIzaSyCJ22veYzQeQ5wGCumfVX5Kh_B3IDD-WxY",
        authDomain: "quotevid2-57726828-e0133.firebaseapp.com",
        measurementId: "G-XWNJDR3QHX",
        messagingSenderId: "523999002605",
      },
    },
    CapacitorAndroid: {
      fullscreen: true,
      overlay: false,
      permissions: [
        {
          alias: 'publicStorage',
          name: 'READ_EXTERNAL_STORAGE',
        },
        {
          alias: 'publicStorage',
          name: 'WRITE_EXTERNAL_STORAGE',
        },
        {
          alias: 'camera',
          name: 'CAMERA',
        },
      ]
    }
  },
  android: {
    buildOptions: {
      compileSdkVersion: 34,
      targetSdkVersion: 34
    }
  }
};

export default config;
