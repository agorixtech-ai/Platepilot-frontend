/**
 * Capacitor / native platform helpers.
 */

import { Capacitor } from "@capacitor/core";

export function isNativeApp(): boolean {
  try {
    return Capacitor.isNativePlatform();
  } catch {
    return typeof document !== "undefined" && document.location.protocol === "capacitor:";
  }
}

export function getNativePlatform(): "ios" | "android" | "web" {
  try {
    const p = Capacitor.getPlatform();
    if (p === "ios" || p === "android" || p === "web") return p;
  } catch {
    /* not available */
  }
  return "web";
}

export function isAndroidApp(): boolean {
  return isNativeApp() && getNativePlatform() === "android";
}

/** Rewrite localhost API hosts for the Android emulator loopback. */
export function rewriteApiHostForNative(url: string): string {
  if (!isAndroidApp()) return url;
  return url
    .replace("://localhost", "://10.0.2.2")
    .replace("://127.0.0.1", "://10.0.2.2");
}
