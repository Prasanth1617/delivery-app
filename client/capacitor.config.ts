import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
  appId: 'com.theniretail.app',
  appName: 'Theni Retail',
  webDir: 'build',
  server: {
    androidScheme: 'https'
  },
  plugins: {
    SplashScreen: {
      launchShowDuration: 2000,
      backgroundColor: '#1e0a3c',
      showSpinner: false
    }
  }
};

export default config;