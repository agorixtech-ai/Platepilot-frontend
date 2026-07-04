// Canonical API base URLs derived from VITE_API_URL.
// Accepts the value with or without a trailing /api suffix, so both
// "https://backend.example.com" and "https://backend.example.com/api" work.
const raw = (import.meta.env.VITE_API_URL || "http://localhost:8000/api").replace(/\/+$/, "");

/** Backend origin, no /api suffix (for root-level routes like /health). */
export const API_ORIGIN = raw.replace(/\/api$/, "");

/** Backend API base, always ends with /api. */
export const API_URL = `${API_ORIGIN}/api`;
