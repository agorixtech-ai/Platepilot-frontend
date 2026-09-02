import { rewriteApiHostForNative } from "@/lib/native";

// Canonical API base URLs derived from VITE_API_URL.
// Accepts the value with or without a trailing /api suffix, so both
// "https://backend.example.com" and "https://backend.example.com/api" work.
const rawEnv = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");

/** Resolve on each call so Android native rewrite sees Capacitor as ready. */
export function getApiOrigin(): string {
  return rewriteApiHostForNative(rawEnv).replace(/\/api$/, "");
}

export function getApiUrl(): string {
  return `${getApiOrigin()}/api`;
}

/** Backend origin, no /api suffix (for root-level routes like /health). */
export const API_ORIGIN = getApiOrigin();

/** Backend API base, always ends with /api. */
export const API_URL = getApiUrl();
