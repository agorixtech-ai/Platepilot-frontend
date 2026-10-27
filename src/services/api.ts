import { ApiResponse } from "@/types/domain";
import { getApiUrl } from "@/lib/apiBase";
import { authFetch, clearTokens } from "@/lib/auth";

export class ApiClient {
  // Resolved per request (not at import) so the native-app host rewrite always applies.
  constructor(private baseUrl?: string) {}

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const response = await authFetch(`${this.baseUrl ?? getApiUrl()}${endpoint}`, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(options.headers as Record<string, string>),
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // Refresh already failed inside authFetch — the session is really over. Clear the
        // stored user too, otherwise the dashboard guard still thinks we're signed in.
        clearTokens();
        window.location.href = "/login";
      }
      const error = await response.json().catch(() => ({}));
      const detail = error.detail;
      const message = Array.isArray(detail)
        ? detail.map((e: any) => e.msg || String(e)).join(", ")
        : detail || error.message || "API request failed";
      throw new Error(message);
    }

    return response.json();
  }

  async get<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "GET" });
  }

  async post<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async put<T>(endpoint: string, data?: Record<string, any>): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
    });
  }

  async delete<T>(endpoint: string): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE" });
  }
}

export const apiClient = new ApiClient();
