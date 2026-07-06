# Data fetching & auth (exact contracts from the code)

## Base URL — one source of truth

`src/lib/apiBase.ts`:

```ts
export const API_ORIGIN; // backend origin, no /api (root routes like /health)
export const API_URL;    // always ends with /api
```

Derived from `VITE_API_URL` (accepts with/without `/api` suffix), default
`http://localhost:8000/api`. **Never** define another base-URL constant;
import from here. If the backend moves, change `VITE_API_URL` — no code edit.

## The three API layers

### 1. `src/lib/auth.ts` — `/api/auth/*`

Storage helpers (the ONLY code allowed to touch these localStorage keys —
`access_token`, `refresh_token`, `user`):

```ts
saveTokens(tokens: AuthTokens)      // persists all three keys
updateStoredUser(user: User)
getAccessToken(): string | null
getRefreshToken(): string | null
getStoredUser(): User | null
clearTokens()
isAuthenticated(): boolean          // = !!getAccessToken()
```

Endpoint functions (all return parsed JSON or throw `Error` with the
FastAPI `detail` message, including array-of-validation-errors flattening):

```ts
register(full_name, email, password)         // → { message, detail }
login(email, password)                       // → { message, detail }  (OTP sent, NOT tokens)
sendOtp(email, purpose: "login" | "verify")
verifyOtp(email, otp, purpose)               // → AuthTokens (auto-saves)
verifyEmail(email, otp)                      // → AuthTokens (auto-saves)
testLogin()                                  // TEMPORARY demo login — remove with backend route
logout()                                     // POST /logout then clearTokens()
refreshAccessToken()                         // → AuthTokens | null (clears tokens on failure)
getMe()                                      // → User | null; retries once after refresh on 401
updateProfile(full_name)                     // PATCH /me, updates stored user
changePassword(current_password, new_password)
getGoogleOAuthUrl()                          // href for "Continue with Google"
```

Auth flow shape: `login()` only triggers the OTP email; tokens arrive from
`verifyOtp()`. Google OAuth lands back on `/login` with `access_token` +
`refresh_token` query params (handled in `pages/Login.tsx`).

```ts
export interface User {
  id: string; full_name: string; email: string;
  provider: string; is_verified: boolean; created_at: string;
}
export interface AuthTokens {
  access_token: string; refresh_token: string; token_type: string; user: User;
}
```

### 2. `src/lib/api.ts` — POS sales, Tally vouchers, health

`request<T>()` attaches `Authorization: Bearer <token>`, and on **401
refreshes once and retries**; a second 401 clears tokens and throws
"Session expired. Please log in again." — this is the canonical 401
pattern for new code.

```ts
posSalesApi.list({ skip?, limit?, branch?, status? })
  // → PaginatedResponse<PosSale>       GET /api/pos-sales
tallyApi.list({ skip?, limit?, branch?, voucher_type? })
  // → PaginatedResponse<TallyVoucher>  GET /api/tally-vouchers
healthApi.check()                       // GET /health (origin-level)

interface PaginatedResponse<T> { total: number; skip: number; limit: number; items: T[]; }
interface PosSale      { _id: string; branch_name?: string; order_status?: string; [k: string]: unknown; }
interface TallyVoucher { _id: string; branch?: string; vouchertype?: string;  [k: string]: unknown; }
```

Note the loose index signatures: POS/Tally docs are heterogeneous Mongo
documents — narrow fields at the usage site, don't invent a fake full type.

### 3. `src/services/dashboardService.ts` — `/api/dashboard/*`

Every method takes `(period, branch?)` where `Period = "today" | "week" |
"month" | "year"` and `branch` is a name string or `null`/`"all"`-omitted:

```ts
getMetrics(period, branch?)          // DashboardMetrics
getMetricsTrend(period, branch?)     // MetricsTrend ("week" | "month" | "year" only)
getStockSummary(branch?)             // StockSummary
getChannelBreakdown(period, branch?) // ChannelBreakdownData
getReconciliation(period, branch?)   // ReconciliationData
getStockItems(branch?, limit)        // { items: StockItem[] }
getTopItems(period, branch?, limit)  // { items: TopItem[]; currency }
getBranchSummary(period)             // { period; currency; items: BranchSummaryItem[] }
getLocationSnapshots(period)         // { period; currency; items: LocationSnapshot[] }
getComparisonSeries(period)          // ComparisonSeries (branch-vs-branch chart)
getHourlySales(branch)               // HourlySales
getRecentTransactions(branch?, limit)// { items: RecentTransaction[] }
```

Key response shapes (fields are snake_case — mirror the backend exactly):

```ts
interface DashboardMetrics {
  period: string; compare_label: string; currency: string;
  total_sales: number;      total_sales_delta_pct: number | null;
  orders: number;           orders_delta_pct: number | null;
  food_cost_pct: number;    food_cost_pp_delta: number | null;
  gross_margin_pct: number; gross_margin_pp_delta: number | null;
  active_alerts: number; critical_alerts: number;
  sync_status: string; sync_pct: number; last_sync: string | null;  // ← stale-data surface
  range_start?: string; range_end?: string;
}

interface MetricsTrend {
  period: string; labels: string[];
  sales: number[]; orders: number[]; food_cost_pct: number[]; margin_pct: number[];
  prev_sales: number[]; prev_orders: number[];        // previous-period compare series
  prev_food_cost_pct: number[]; prev_margin_pct: number[];
  current_label: string; previous_label: string; anchor_date: string | null;
}

interface LocationSnapshot {
  branch: string; revenue: number; orders: number; avg_order: number;
  delta_pct: number | null;        // null = no prior data, render "—" not 0
  vs_seven_day_pct: number;
  sparkline: number[];             // last 14 days of revenue
  pending_issues: number;
}

interface ComparisonSeries { labels: string[]; series: { branch: string; values: number[] }[]; }
```

Conventions these encode:
- List payloads: `{ items: [...] }` plus `period`/`currency` when relevant.
- "No previous data" is `null`, never `0` — render a neutral dash.
- Deltas are computed by the backend (`*_delta_pct` = percent,
  `*_pp_delta` = percentage points). Do not recompute client-side.

### `src/services/api.ts` (`ApiClient`) + `teamService.ts`

Generic `apiClient.get/post/put/delete<T>()` used by `teamService`
(`/tenants/:id/team*`, wrapped in `ApiResponse<T> = { success, data?,
error?, message? }` from `types/domain.ts`). Caveat: its 401 handling
hard-redirects to `/login` instead of refreshing — prefer the
`lib/api.ts` refresh pattern for new services.

## TanStack Query conventions

Dashboard queries (see `pages/dashboard/Overview.tsx`):

```ts
const { branch } = useBranchFilter();
const { range } = useDateRange();
const period = rangeToPeriod(range);

const metricsQuery = useQuery({
  queryKey: ["dashboard", "metrics", period, branch],   // filters IN the key
  queryFn: () => dashboardService.getMetrics(period, branch),
  ...DASHBOARD_LIVE_QUERY,   // { refetchInterval: 60_000, staleTime: 30_000, refetchOnWindowFocus: true }
});
```

- Key shape: `["dashboard", <endpoint>, period, branch]` — branch/period
  changes refetch automatically; custom ranges use `rangeKey(range)`.
- Refresh-all: `queryClient.invalidateQueries({ queryKey: ["dashboard"] })`
  + `toast.success("Dashboard refreshed")`.
- Reusable hooks/keys for POS/Tally/auth live in `src/hooks/useApi.ts`
  (`KEYS`, `useHealth`, `useMe`, `useLogin`, …) — extend that file for new
  reusable hooks.
- Profile query: `queryKey: ["auth", "me"]` in `DashboardLayout`.

## Error & toast conventions

Service layers throw `Error` with a human-readable message (FastAPI
`detail`). Mutations surface it via sonner:
`.catch((err) => toast.error(err.message || "Fallback message."))`.
Query errors render inline (error strip / `EmptyState`), not as toasts.

## Daily-sync awareness checklist for any new data view

1. Include `last_sync` (from `getMetrics`) or the endpoint's own sync field.
2. Render "Last synced <relative time>" or a `Synced` badge.
3. `last_sync === null` → empty state ("… will appear here once synced"),
   never a grid of zeros.
4. `DASHBOARD_LIVE_QUERY` keeps views fresh intra-day, but data only
   changes daily — don't add aggressive polling below 60s.
