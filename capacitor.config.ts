import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.platepielet.app",
  appName: "PlatePielet",
  webDir: "dist",
  server: {
    // Allow cleartext to a local FastAPI backend during development.
    // Production builds should point VITE_API_URL at HTTPS.
    androidScheme: "https",
    cleartext: true,
  },
  plugins: {
    SplashScreen: {
      launchAutoHide: true,
      launchShowDuration: 0,
      backgroundColor: "#071A14",
      showSpinner: false,
    },
    StatusBar: {
      style: "LIGHT",
      backgroundColor: "#FFFFFF",
    },
  },
  android: {
    allowMixedContent: true,
    backgroundColor: "#FFFFFF",
  },
};

export default config;
