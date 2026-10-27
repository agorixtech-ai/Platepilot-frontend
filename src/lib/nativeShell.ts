import { Capacitor } from "@capacitor/core";
import { App as CapApp } from "@capacitor/app";
import { Keyboard, KeyboardResize } from "@capacitor/keyboard";
import { StatusBar, Style } from "@capacitor/status-bar";
import { SplashScreen } from "@capacitor/splash-screen";

/** Match the OS status bar to the header under it: forest (light icons) or white (dark icons). */
export async function setStatusBarTone(tone: "forest" | "white"): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;
  try {
    // Capacitor naming: Style.Dark = light icons for dark backgrounds.
    await StatusBar.setStyle({ style: tone === "forest" ? Style.Dark : Style.Light });
    await StatusBar.setBackgroundColor({ color: tone === "forest" ? "#071A14" : "#FFFFFF" });
  } catch {
    /* plugin unavailable in some preview builds */
  }
}

/**
 * Wire Capacitor plugins for the Android (and iOS) shell.
 * Safe on web — every call is gated by Capacitor.isNativePlatform().
 */
export async function initNativeShell(): Promise<void> {
  if (!Capacitor.isNativePlatform()) return;

  document.documentElement.classList.add("is-native-app");
  if (Capacitor.getPlatform() === "android") {
    document.documentElement.classList.add("is-android-app");
  }

  try {
    await StatusBar.setStyle({ style: Style.Light });
    await StatusBar.setBackgroundColor({ color: "#FFFFFF" });
  } catch {
    /* plugin unavailable in some preview builds */
  }

  try {
    await Keyboard.setResizeMode({ mode: KeyboardResize.Body });
  } catch {
    /* iOS-only on some versions; ignore on Android */
  }

  try {
    await SplashScreen.hide();
  } catch {
    /* already hidden */
  }

  // Android hardware back → history.back(); exit only on root auth screens.
  CapApp.addListener("backButton", ({ canGoBack }) => {
    if (canGoBack) {
      window.history.back();
      return;
    }
    const path = window.location.pathname;
    if (path === "/login" || path === "/signup" || path === "/" || path === "/dashboard") {
      void CapApp.exitApp();
    } else {
      window.history.back();
    }
  });
}
