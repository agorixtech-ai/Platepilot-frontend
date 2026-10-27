import { dehydrate, hydrate, QueryClient, type DehydratedState } from "@tanstack/react-query";

export const queryClient = new QueryClient();

export const QUERY_CACHE_KEY = "platepilot_query_cache";
const MAX_AGE_MS = 24 * 60 * 60 * 1000;

type Saved = { userId: string; savedAt: number; state: DehydratedState };

/**
 * Stale-while-revalidate across app launches: the dashboard opens showing the last data
 * it had (instantly), then refreshes in the background. The API is slow (see
 * DASHBOARD_LIVE_QUERY), so an empty skeleton on every launch is the main thing users feel.
 * Only successful `dashboard` queries are saved, and only for the same signed-in user.
 */
export function restoreQueryCache(userId: string | undefined) {
  try {
    const raw = localStorage.getItem(QUERY_CACHE_KEY);
    if (!raw) return;
    const saved = JSON.parse(raw) as Saved;
    if (!userId || saved.userId !== userId || Date.now() - saved.savedAt > MAX_AGE_MS) {
      localStorage.removeItem(QUERY_CACHE_KEY);
      return;
    }
    hydrate(queryClient, saved.state);
  } catch {
    /* corrupt or blocked storage — just start cold */
  }
}

export function persistQueryCache(getUserId: () => string | undefined) {
  let timer: ReturnType<typeof setTimeout> | undefined;
  const save = () => {
    const userId = getUserId();
    if (!userId) return;
    try {
      const state = dehydrate(queryClient, {
        shouldDehydrateQuery: (q) => q.state.status === "success" && q.queryKey[0] === "dashboard",
      });
      localStorage.setItem(
        QUERY_CACHE_KEY,
        JSON.stringify({ userId, savedAt: Date.now(), state } satisfies Saved),
      );
    } catch {
      /* quota exceeded or blocked — persistence is best-effort */
    }
  };
  // Debounced: the cache emits an event per query update, and a screen updates dozens.
  return queryClient.getQueryCache().subscribe(() => {
    clearTimeout(timer);
    timer = setTimeout(save, 2000);
  });
}
