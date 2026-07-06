---
name: platepilot-frontend
description: >
  PlatePilot frontend conventions (Ionic React SPA + Vite + bun, multi-tenant
  restaurant BI SaaS). Use for ANY work under frontend/ — dashboard UI, KPI
  cards, the branch/location switcher, Recharts charts, Ionic pages or
  components, frontend auth flows, Pilot AI insight cards, theming or dark
  mode, and any call to the FastAPI backend — even when this skill is not
  named. Read BEFORE writing, editing, or reviewing frontend code.
---

# PlatePilot Frontend

Multi-tenant restaurant BI SaaS. Five restaurant branches, data synced **once
daily** by a backend cron — the UI must always be honest about data freshness.

## Stack (verified against package.json)

| Concern | Choice |
|---|---|
| Framework | Ionic React 8 (`@ionic/react`, `@ionic/react-router`) SPA on Vite 7 — no SSR |
| Routing | react-router **v5** (`<Link to>`, `useHistory()`, `useLocation()`, `<Redirect>`) |
| Language | TypeScript (strict) |
| Data fetching | TanStack Query 5 (`@tanstack/react-query`) |
| Charts | **Recharts 2** — the only chart library; do not add another |
| Styling | Tailwind CSS v4 (CSS `@theme` in `src/styles.css`, no config file) + shadcn/ui in `src/components/ui/` |
| Icons | lucide-react |
| Toasts | sonner (`toast.success(...)` / `toast.error(...)`) |
| Forms | react-hook-form + zod |
| Package manager | **bun** — never npm/npx/yarn |

## Commands (run from `frontend/`)

```bash
bun run dev      # Vite dev server on http://localhost:3000 (next free port if taken)
bun run build    # production build → dist/
bun run lint     # ESLint (typescript-eslint + prettier config) — must pass
bun run format   # Prettier write — run on files you touched before finishing
```

Backend: FastAPI at `http://localhost:8000`. All base URLs derive from
`src/lib/apiBase.ts` (`API_ORIGIN`, `API_URL`), which reads `VITE_API_URL`
and defaults to `http://localhost:8000/api`. That file is the **single
source of truth** — historical copies of the URL existed in `lib/auth.ts` /
`lib/api.ts` / `services/api.ts`; all three now import from `apiBase.ts`.
Keep it that way.

## Architecture map

```
src/
├── App.tsx                    # IonApp + IonReactRouter + route table
├── pages/                     # one file per top-level route, wrapped in AppPage
│   ├── Dashboard.tsx          # /dashboard/* shell: auth guard + inner <Switch>
│   └── dashboard/*.tsx        # leaf pages (plain components, NO IonPage)
├── components/
│   ├── ionic/AppPage.tsx      # IonPage wrapper + scroll container + document.title
│   ├── dashboard/             # DashboardLayout, LocationSwitcher, DateRangePicker, shared.tsx
│   └── ui/                    # shadcn/ui primitives — reuse, don't reinvent
├── contexts/                  # BranchFilterContext, DateRangeContext (global dashboard filters)
├── lib/                       # apiBase, auth, api, locations, utils(cn)
├── services/                  # dashboardService, teamService, ApiClient
├── hooks/                     # useApi (query hooks + KEYS), use-mobile, useCounterAnimation
└── types/domain.ts            # Tenant/TeamMember/ApiResponse types
```

## Non-negotiable conventions

### 1. Data access goes through the existing API layer

Three sanctioned layers — pick by endpoint, never inline `fetch` in a
component:

- `src/lib/auth.ts` — everything under `/api/auth/*`
- `src/lib/api.ts` — `posSalesApi`, `tallyApi`, `healthApi` (POS sales, Tally vouchers, health)
- `src/services/dashboardService.ts` — every `/api/dashboard/*` endpoint, fully typed
- `src/services/teamService.ts` (via `services/api.ts` `ApiClient`) — `/api/tenants/*/team*`

New endpoint? Add a typed method to the matching service and a `useQuery`
call with the established key shape. See `references/data-fetching.md` for
exact response shapes, query-key conventions, and the 401-refresh flow.

### 2. Auth state only via `src/lib/auth.ts` helpers

`getStoredUser()`, `getAccessToken()`, `getRefreshToken()`, `saveTokens()`,
`clearTokens()`, `isAuthenticated()`, `refreshAccessToken()`, `getMe()`.
Tokens live in `localStorage` (`access_token`, `refresh_token`, `user`) but
**only these helpers may touch those keys**. Route guarding is render-time:
`if (!getStoredUser()) return <Redirect to="/login" />;` (imperative
`history.replace` in a mount effect gets swallowed by Ionic's initial
transition — documented failure mode, don't reintroduce it).

### 3. Global dashboard filters are React Contexts

- **Branch switcher**: `useBranchFilter()` from
  `src/contexts/BranchFilterContext.tsx` → `{ branch, setBranch, branches,
  locations, isLoadingBranches }`. `branch` is `"all"` or a branch-name
  string fetched from `GET /api/dashboard/branches`. Selection persists to
  localStorage key `platepilot_branch`. **This is the standard** — do not
  create new branch state, props-drill branch names, or use the legacy
  Zustand stores (`store/authStore.ts`, `store/tenantStore.ts` are only used
  by the deprecated `components/shared/` Sidebar/Header).
- **Period**: `useDateRange()` from `src/contexts/DateRangeContext.tsx` →
  `DateRange` (`today | 7d | 30d | custom`), mapped to backend buckets with
  `rangeToPeriod(range)` and cache keys with `rangeKey(range)`.

Every dashboard query takes `(period, branch)` and includes both in its
`queryKey` so switching branch/period refetches automatically.

### 4. Branch identity

Branch names come from the API — **never hardcode branch IDs or names**.
Each branch has a fixed identity color assigned by list index:
`locationColor(index)` / `toLocations()` in `src/lib/locations.ts`, backed
by `--chart-1..5` tokens. A branch keeps its hue across every chart, dot,
and card. Use `useBranchFilter().locations` when you need name + color.

### 5. Loading / error / empty / stale — every data view handles all four

```tsx
{query.isLoading ? (
  <Skeleton … />                        // or the spinner pattern in shared.tsx
) : query.isError ? (
  /* error strip + retry via queryClient.invalidateQueries */
) : !query.data?.items.length ? (
  <EmptyState icon={Package} title="No data yet"
    description="… will appear here once synced" />
) : (
  /* content */
)}
```

- `EmptyState` (`src/components/ui/empty-state.tsx`) takes
  `{ icon?, title, description?, action? }` — use it, don't hand-roll.
- **Stale/sync surface**: data syncs once daily. `DashboardMetrics` returns
  `sync_status`, `sync_pct`, `last_sync` (ISO string | null) — any new data
  view must show "last synced at" (or a Synced badge) derived from these
  fields and must render sensibly when `last_sync` is null (never synced).
- Empty-state copy references syncing, e.g. "Locations will appear here once
  POS sales are synced".

### 6. KPI cards & period comparison

`KpiCardWithSparkline` (in `pages/dashboard/Overview.tsx`) is the KPI
pattern: `{ label, value, icon, tone, delta, sub | footnote, sparklineData,
index }`. Previous-period comparison comes from the backend
(`*_delta_pct` / `*_pp_delta` fields, `prev_*` arrays in `MetricsTrend`) —
never compute period deltas client-side. Convert to a `Delta` chip with
`deltaPct(value, goodDir)` / `deltaPp(value, goodDir)`; `goodDir: "down"`
for cost-like metrics (food cost), `"up"` for revenue-like. Period toggles
use `PeriodChip` from `components/dashboard/shared.tsx`.

### 7. Charts

Recharts only, themed via CSS variables (`var(--color-chart-1)` …), with
the shared helpers in `components/dashboard/shared.tsx`: `CHART_PALETTE`,
`paletteColor(i)`, `ChartGradientDefs` + `deepFillY/X`, `AreaTrend` (has
loading + empty built in), `fmtCurrency` (AED default), `fmtPct`. Details
and copy-paste patterns in `references/components.md`.

### 8. Pilot AI insights (page exists as a stub — this is the build spec)

`/dashboard/ai` (`src/pages/dashboard/Ai.tsx`) renders backend-generated
business insights as cards. Contract per card:

- `title` — short insight headline
- `recommendation` — the suggested action, 1–3 sentences
- `metrics` — supporting numbers, formatted with `fmtCurrency`/`fmtPct`
- `priority` — tag rendered with the tone system: `high` → `destructive`,
  `medium` → `warning`, `low` → `info` (Badge + `TONE_ICON_BG` styles)

Fetch through `dashboardService` (add a typed `getAiInsights(period,
branch?)` method), key `["dashboard", "ai-insights", period, branch]`, and
surface `last_sync` like every other data view.

### 9. Responsive layout

Mobile-first Tailwind breakpoints (`sm:` 640, `md:` 768, `lg:` 1024, `xl:`
1280). Standard grid: `grid grid-cols-2 gap-3 lg:grid-cols-4` for KPI rows;
content column capped at `max-w-[1600px] mx-auto`. Sidebar collapses via
shadcn `useSidebar()` (`isMobile` built in); for bespoke JS breakpoint logic
use `useIsMobile()` (`src/hooks/use-mobile.tsx`, 768px). Pages scroll inside
`AppPage`'s `.app-page-scroll` container — never rely on body scroll.

### 10. TypeScript interface conventions for API responses

Interfaces mirror the FastAPI JSON exactly: **snake_case fields, no
client-side renaming** (`total_sales`, `food_cost_pct`, `last_sync`).
Nullable-when-no-prior-data is `| null`, optional-in-payload is `?`.
List endpoints wrap as `{ items: T[] }` (+ `period`, `currency` where the
backend sends them); paginated endpoints as `{ total, skip, limit, items }`.
Mongo ids are `_id: string`. Define response interfaces next to the service
method that returns them (see `dashboardService.ts`), not in components.

## Never do

- **Never hardcode branch IDs or branch names** — branches come from
  `useBranchFilter()` / `GET /api/dashboard/branches`.
- **Never bypass the API layer** with inline `fetch` in components/pages —
  extend `lib/api.ts`, `lib/auth.ts`, or the services instead.
- **Never read or write `access_token` / `refresh_token` / `user`
  localStorage keys outside `src/lib/auth.ts`** — use its exported helpers.
- **Never add a new API base URL constant** — import `API_URL` /
  `API_ORIGIN` from `src/lib/apiBase.ts`.
- **Never mix inline styles with the theme system** — style with Tailwind
  utilities and the `--color-*` tokens; hex/rgb literals and `style={{...}}`
  color values are forbidden in dashboard code (the only sanctioned
  exceptions: Recharts props that require a color string — pass
  `var(--color-…)` — and the legacy fixed-pixel `AgorixHero` stage).
- Never use npm/npx/yarn; never import TanStack Router APIs (removed);
  never add `IonPage` inside a dashboard leaf page; never compute
  period-over-period deltas client-side.

## References

- `references/components.md` — Ionic page/shell patterns, KPI cards, charts,
  EmptyState, insight-card spec, responsive recipes
- `references/data-fetching.md` — all three API layers, exact auth helpers,
  response interfaces, query keys, 401 flow, sync/stale handling
- `references/theming.md` — dark-default theme, oklch tokens, chart palette,
  Ionic CSS boundaries
