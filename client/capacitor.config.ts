import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.v2mart.app',
  appName: 'V2 Mart',
  webDir: 'build',
  server: {
    androidScheme: 'https',
    cleartext: false,
  },
  android: {
    allowMixedContent: false,
    captureInput: true,           // KEY: routes native input events into WebView
    webContentsDebuggingEnabled: true,  // remove before Play Store upload
    appendUserAgent: 'V2Mart/1.0',
    backgroundColor: '#1e0a3c',
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 1500,
      backgroundColor: '#1e0a3c',
      androidSplashResourceName: 'splash',
      showSpinner: false,
    },
    Keyboard: {
      resize: 'body',             // KEY: body resizes with keyboard, not native scroll
      style: 'dark',
      resizeOnFullScreen: true,
    },
  },
};

export default config;