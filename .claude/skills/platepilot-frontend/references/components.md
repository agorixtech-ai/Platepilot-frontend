# Component patterns (as used in this repo)

Everything here is lifted from real code — copy the shapes, keep the names.

## Ionic shell: how pages are structured

Ionic provides the app frame only; visuals are Tailwind + shadcn. Ionic page
transitions are disabled globally (`setupIonicReact({ mode: "md", animated:
false })` in `src/App.tsx`) — do not re-enable per page.

### Top-level page (marketing, auth, 404)

```tsx
// src/pages/Example.tsx
import { AppPage } from "@/components/ionic/AppPage";

function ExamplePage() {
  return <div className="min-h-screen bg-background">…</div>;
}

export default function ExamplePageRoute() {
  return (
    <AppPage title="Example — PlatePilot">
      <ExamplePage />
    </AppPage>
  );
}
```

`AppPage` (`src/components/ionic/AppPage.tsx`) = `IonPage` + a
`.app-page-scroll` document-style scroll container + `usePageTitle` (sets
`document.title` on mount **and** on `useIonViewWillEnter`, because Ionic
keeps stacked pages mounted). Pass `scroll={false}` only when the page owns
its scrolling (the dashboard shell does).

Register the route in `src/App.tsx` inside `IonRouterOutlet`:

```tsx
<Route exact path="/example" component={ExamplePageRoute} />
```

### Dashboard leaf page

Leaf pages are plain components — **no IonPage, no AppPage** — rendered by
the inner `<Switch>` in `src/pages/Dashboard.tsx` so the sidebar shell
persists across navigation:

```tsx
// src/pages/dashboard/Example.tsx
function ExamplePage() {
  return <div className="space-y-6">…</div>;
}
export default ExamplePage;
```

Then in `Dashboard.tsx`'s `<Switch>`:
`<Route exact path="/dashboard/example" component={Example} />`
and a nav item in the `*_ITEMS` arrays of
`components/dashboard/DashboardLayout.tsx`.

### Navigation (react-router v5)

```tsx
import { Link, useHistory, useLocation } from "react-router-dom";

const history = useHistory();
history.push("/dashboard/pos");     // user-initiated navigation
history.replace("/login");          // replace, e.g. after logout
const { pathname } = useLocation(); // active-state checks
```

Auth guard is render-time (`Dashboard.tsx`):

```tsx
if (!getStoredUser()) return <Redirect to="/login" />;
```

## KPI cards

`KpiCardWithSparkline` (defined in `src/pages/dashboard/Overview.tsx`) is
the KPI card. Props observed in use:

```tsx
<KpiCardWithSparkline
  index={0}                          // stagger animation order
  label="Total Sales"
  value={fmtCurrency(m.total_sales, m.currency)}
  icon={DollarSign}                  // lucide icon component
  tone="primary"                     // Tone: primary|success|warning|destructive|info|neutral
  delta={deltaPct(m.total_sales_delta_pct)}        // previous-period chip
  sub={{ text: "vs last period", tone: "success", dot: true }}  // or footnote="…"
  sparklineData={sparkFromYear(yearTrend?.sales)}
  to="/dashboard/pos"                // optional: whole card becomes a Link
/>
```

Delta helpers (same file):

- `deltaPct(value, goodDir)` → `{ value: "12.3%", direction, tone }`
- `deltaPp(value, goodDir)` → percentage-*point* variant (`"1.4pp"`) for
  food-cost/margin
- `goodDir: "down"` when a decrease is good (food cost); default `"up"`.

Loading state for a KPI row: render skeleton cards while
`metricsQuery.isLoading || !m`.

## Period toggles

`PeriodChip` from `components/dashboard/shared.tsx`:

```tsx
{(["today", "7d", "30d"] as const).map((k) => (
  <PeriodChip key={k} label={k} active={range.kind === k}
    onClick={() => setRange({ kind: k })} />
))}
```

The date-range control users see is
`components/dashboard/DateRangePicker.tsx` (Today / 7d / 30d / Custom) and
the branch control is `components/dashboard/LocationSwitcher.tsx` — reuse
them; do not build parallel pickers.

## Charts (Recharts + shared helpers)

All chart colors are CSS variables; all shared chart machinery lives in
`components/dashboard/shared.tsx`:

- `CHART_PALETTE` / `paletteColor(i)` — the 5 branch identity colors
  (`var(--color-chart-1..5)`); index = branch's position in the branch list.
  Keep in sync with `LOCATION_COLORS` in `lib/locations.ts`.
- `ChartGradientDefs` + `deepFillY(i)` / `deepFillX(i)` — depth gradients
  for bars: drop `<ChartGradientDefs />` inside the chart, use
  `fill={deepFillY(i)}` on vertical bars.
- `AreaTrend` — the standard trend chart (drag-to-zoom, previous-period
  dashed compare line, loading spinner and empty state **built in**):

```tsx
<AreaTrend
  data={activeSeries.values}
  compareData={activeSeries.compareValues}   // prev_* arrays from MetricsTrend
  labels={trendData?.labels ?? []}
  loading={trendQuery.isLoading}
  metricName={METRIC_CONFIG[activeMetric].label}
  metricKey={activeMetric}                    // "sales" | "orders" | "food_cost" | "margin"
  period={trendPeriod}
  currentLabel={trendData?.current_label}
  previousLabel={trendData?.previous_label}
/>
```

- `METRIC_CONFIG` — per-metric label/color/tab styling; extend it rather
  than inventing new metric styling.
- Formatters: `fmtCurrency(value, currency = "AED")` (k/M abbreviation),
  `fmtPct(value)`.

Recharts axis/grid styling convention (from `AreaTrend` and Overview):
`stroke="var(--color-border)"` for grids (opacity ~0.3, `vertical={false}`),
`stroke="var(--color-muted-foreground)"` fontSize 9–10 for axes,
`tickLine={false} axisLine={false}`. Tooltips are custom `content`
renderers on `bg-card/95` with `border-border/60 rounded-xl` — copy the
tooltip block from `AreaTrend`.

Branch-colored multi-series (branch comparison): map series index →
`paletteColor(index)` so each branch keeps its identity color.

## Loading / error / empty / stale

```tsx
{q.isLoading ? (
  <div className="flex items-center justify-center" style={{ height }}>
    <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
  </div>
) : q.isError ? (
  // page-level: hasCriticalError = metricsQuery.isError || trendQuery.isError → error strip + Retry
) : !q.data?.items.length ? (
  <EmptyState icon={Scale} title="No data for this period"
    description="Reconciliation data will appear here once synced" />
) : (
  …content…
)}
```

`EmptyState` API (`components/ui/empty-state.tsx`):
`{ icon?: LucideIcon; title: string; description?: string; action?: { label; onClick }; className? }`.

Stale/sync surface: `DashboardMetrics.last_sync` (ISO | null),
`sync_status`, `sync_pct`. Data is synced once daily — show "last synced"
text or a `Synced` badge (`Badge` with `bg-success-soft text-success`) and
treat `last_sync === null` as "never synced" (empty state, not zeros).

## Pilot AI insight cards (build spec — page is currently a stub)

`src/pages/dashboard/Ai.tsx` renders backend-generated insights. Card
anatomy, using existing primitives only:

```tsx
const PRIORITY_TONE = { high: "destructive", medium: "warning", low: "info" } as const;

<Card className="border-border/40 bg-card">
  <CardContent className="p-4 space-y-3">
    <div className="flex items-start justify-between gap-2">
      <div className={cn("flex h-9 w-9 items-center justify-center rounded-xl",
        TONE_ICON_BG[PRIORITY_TONE[insight.priority]])}>
        <Sparkles className="h-4 w-4" />
      </div>
      <Badge variant="outline"
        className={cn("border-0 text-[10px] font-extrabold uppercase",
          TONE_ICON_BG[PRIORITY_TONE[insight.priority]])}>
        {insight.priority}
      </Badge>
    </div>
    <p className="text-sm font-bold text-foreground">{insight.title}</p>
    <p className="text-xs text-muted-foreground">{insight.recommendation}</p>
    {/* supporting metrics: fmtCurrency / fmtPct, tabular-nums */}
  </CardContent>
</Card>
```

Grid: `grid gap-3 sm:grid-cols-2 xl:grid-cols-3`. Fetch via a new typed
`dashboardService.getAiInsights(period, branch?)`; handle all four data
states; surface `last_sync`.

## Responsive rules

- Mobile-first Tailwind: base = phone, add `sm: md: lg: xl:` upward.
- KPI rows: `grid grid-cols-2 gap-3 lg:grid-cols-4`.
- Two-column content: `grid gap-4 lg:grid-cols-[2fr_1fr]` (chart + side list).
- Page container: `max-w-[1600px] mx-auto`, padding `px-4 sm:px-6 md:px-8`.
- Hide-on-mobile helpers: `hidden sm:block` / `hidden xl:flex` (see header).
- JS breakpoint: `useIsMobile()` (768px) or shadcn `useSidebar().isMobile`.
- Tables must live in an `overflow-x-auto` wrapper; never let the page body
  scroll horizontally.

## shadcn/ui usage

Primitives live in `src/components/ui/` (Card, Badge, Button, Dialog,
Tabs, Skeleton, Sidebar, …). Compose them with `cn()` from `lib/utils`.
Don't add new primitive libraries and don't fork a primitive when a
className will do. Micro-interaction classes already defined in
`styles.css`: `card-interactive`, `animate-fade-in-up`, `stagger-N`.
