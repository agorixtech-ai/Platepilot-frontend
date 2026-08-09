import { API_URL } from "./apiBase";

const API_BASE = `${API_URL}/auth`;

export interface User {
  id: string;
  full_name: string;
  email: string;
  provider: string;
  is_verified: boolean;
  is_admin: boolean;
  role_id: string | null;
  role_name: string | null;
  /** page keys this user may open — every page for admins */
  pages: string[];
  created_at: string;
}

/** Does the stored user have access to a dashboard page key? */
export function canOpenPage(page: string, user = getStoredUser()): boolean {
  if (!user) return false;
  if (user.is_admin) return true;
  return (user.pages ?? []).includes(page);
}

export interface AuthTokens {
  access_token: string;
  refresh_token: string;
  token_type: string;
  user: User;
}

// ── Token Storage ────────────────────────────────────────
export function saveTokens(tokens: AuthTokens) {
  localStorage.setItem("access_token", tokens.access_token);
  localStorage.setItem("refresh_token", tokens.refresh_token);
  localStorage.setItem("user", JSON.stringify(tokens.user));
}

export function updateStoredUser(user: User) {
  if (!isBrowser) return;
  localStorage.setItem("user", JSON.stringify(user));
}

const isBrowser = typeof window !== "undefined";

export function getAccessToken(): string | null {
  return isBrowser ? localStorage.getItem("access_token") : null;
}

export function getRefreshToken(): string | null {
  return isBrowser ? localStorage.getItem("refresh_token") : null;
}

export function getStoredUser(): User | null {
  if (!isBrowser) return null;
  const raw = localStorage.getItem("user");
  return raw ? JSON.parse(raw) : null;
}

export function clearTokens() {
  if (!isBrowser) return;
  localStorage.removeItem("access_token");
  localStorage.removeItem("refresh_token");
  localStorage.removeItem("user");
}

export function isAuthenticated(): boolean {
  return !!getAccessToken();
}

// ── Core fetch ────────────────────────────────────────────
async function apiFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = getAccessToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers as Record<string, string>),
  };
  if (token) headers["Authorization"] = `Bearer ${token}`;
  return fetch(`${API_BASE}${path}`, { ...options, headers });
}

async function handleResponse<T>(res: Response): Promise<T> {
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: res.statusText }));
    const detail = err.detail;
    const message = Array.isArray(detail)
      ? detail.map((e: any) => e.msg || String(e)).join(", ")
      : detail || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return res.json();
}

// ── Auth API ─────────────────────────────────────────────
export async function register(
  full_name: string,
  email: string,
  password: string,
): Promise<AuthTokens> {
  const res = await apiFetch("/register", {
    method: "POST",
    body: JSON.stringify({ full_name, email, password }),
  });
  const data = await handleResponse<AuthTokens>(res);
  saveTokens(data);
  return data;
}

// TEMPORARY: demo login for the fixed test account (test@gmail.com / test@123).
// Skips the OTP email step; remove together with the backend /test-login route.
export async function testLogin(): Promise<AuthTokens> {
  const res = await apiFetch("/test-login", { method: "POST" });
  const data = await handleResponse<AuthTokens>(res);
  saveTokens(data);
  return data;
}

export async function login(email: string, password: string): Promise<AuthTokens> {
  const res = await apiFetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
  });
  const data = await handleResponse<AuthTokens>(res);
  saveTokens(data);
  return data;
}

/* ══ OTP FLOW DISABLED — matches the commented-out backend routes ══
export async function verifyEmail(email: string, otp: string): Promise<AuthTokens> {
  const res = await apiFetch("/verify-email", {
    method: "POST",
    body: JSON.stringify({ email, otp }),
  });
  const data = await handleResponse<AuthTokens>(res);
  saveTokens(data);
  return data;
}

export async function sendOtp(email: string, purpose: "login" | "verify" = "login") {
  const res = await apiFetch("/send-otp", {
    method: "POST",
    body: JSON.stringify({ email, purpose }),
  });
  return handleResponse<{ message: string; detail: string }>(res);
}

export async function verifyOtp(
  email: string,
  otp: string,
  purpose: "login" | "verify" = "login",
): Promise<AuthTokens> {
  const res = await apiFetch("/verify-otp", {
    method: "POST",
    body: JSON.stringify({ email, otp, purpose }),
  });
  const data = await handleResponse<AuthTokens>(res);
  saveTokens(data);
  return data;
}
*/

export async function logout(): Promise<void> {
  await apiFetch("/logout", { method: "POST" });
  clearTokens();
}

export async function refreshAccessToken(): Promise<AuthTokens | null> {
  const refreshToken = getRefreshToken();
  if (!refreshToken) return null;
  const res = await fetch(`${API_BASE}/refresh`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ refresh_token: refreshToken }),
  });
  if (!res.ok) {
    clearTokens();
    return null;
  }
  const data: AuthTokens = await res.json();
  saveTokens(data);
  return data;
}

export async function getMe(): Promise<User | null> {
  const res = await apiFetch("/me");
  if (res.status === 401) {
    const refreshed = await refreshAccessToken();
    if (refreshed) {
      const retry = await apiFetch("/me");
      if (retry.ok) return retry.json();
    }
    clearTokens();
    return null;
  }
  if (!res.ok) return null;
  return res.json();
}

export async function updateProfile(full_name: string): Promise<User> {
  const res = await apiFetch("/me", {
    method: "PATCH",
    body: JSON.stringify({ full_name }),
  });
  const user = await handleResponse<User>(res);
  updateStoredUser(user);
  return user;
}

export async function changePassword(
  current_password: string,
  new_password: string,
): Promise<void> {
  const res = await apiFetch("/change-password", {
    method: "POST",
    body: JSON.stringify({ current_password, new_password }),
  });
  await handleResponse<{ message: string; detail: string }>(res);
}

/* ══ GOOGLE OAUTH DISABLED — backend /api/auth/google is commented out ══
export function getGoogleOAuthUrl(): string {
  return `${API_BASE}/google`;
}
*/

// ── Admin API (403 unless the user is an admin) ──────────
export interface AdminUser {
  id: string;
  full_name: string;
  email: string;
  provider: string;
  is_verified: boolean;
  is_admin: boolean;
  role_id: string | null;
  role_name: string | null;
  created_at: string;
}

export interface Role {
  id: string;
  name: string;
  pages: string[];
  user_count: number;
  created_at: string;
}

export interface PageInfo {
  key: string;
  label: string;
  group: string;
}

async function adminFetch<T>(path: string, options: RequestInit = {}): Promise<T> {
  const res = await fetch(`${API_URL}/admin${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${getAccessToken()}`,
      ...(options.headers as Record<string, string>),
    },
  });
  return handleResponse<T>(res);
}

export async function listUsers(): Promise<AdminUser[]> {
  return (await adminFetch<{ items: AdminUser[] }>("/users")).items;
}

/** Partial update — send only the fields that change. */
export async function updateUser(
  userId: string,
  patch: { is_admin?: boolean; role_id?: string | null },
): Promise<void> {
  await adminFetch(`/users/${userId}`, { method: "PATCH", body: JSON.stringify(patch) });
}

export async function listPages(): Promise<PageInfo[]> {
  return (await adminFetch<{ items: PageInfo[] }>("/pages")).items;
}

export async function listRoles(): Promise<Role[]> {
  return (await adminFetch<{ items: Role[] }>("/roles")).items;
}

export async function createRole(name: string, pages: string[]): Promise<void> {
  await adminFetch("/roles", { method: "POST", body: JSON.stringify({ name, pages }) });
}

export async function updateRole(id: string, name: string, pages: string[]): Promise<void> {
  await adminFetch(`/roles/${id}`, { method: "PATCH", body: JSON.stringify({ name, pages }) });
}

export async function deleteRole(id: string): Promise<void> {
  await adminFetch(`/roles/${id}`, { method: "DELETE" });
}
