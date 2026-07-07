import { lazy, Suspense, useMemo } from "react";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Crown,
  DollarSign,
  MapPin,
  RefreshCw,
  Scale,
  ShoppingCart,
  TrendingUp,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip as ReTooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { dashboardService, type BranchSummaryItem } from "@/services/dashboardService";
import {
  DASHBOARD_LIVE_QUERY,
  ChartGradientDefs,
  deepFillY,
  fmtCurrency,
} from "@/components/dashboard/shared";

const BRANCH_COORDS: Record<string, [number, number]> = {
  "Airport Branch": [25.2532, 55.3657],
  "Downtown Branch": [25.1972, 55.2744],
  "Jumeirah Branch": [25.2048, 55.2708],
  "Mall Branch": [25.1985, 55.2796],
  "Marina Branch": [25.0805, 55.1403],
};

const LazyBranchMap = lazy(() => import("@/components/dashboard/BranchMap"));

/* ── Data shaping ────────────────────────────────────────────────────────── */

interface BranchRow {
  name: string;
  color: string;
  /** position in the branch list — keys the identity color/gradient */
  index: number;
  revenue: number;
  orders: number;
  avg_order: number;
  delta_pct: number | null;
  vs_seven_day_pct: number;
  sparkline: number[];
  margin_pct: number | null;
  food_cost_pct: number | null;
  issues: number;
}

/** The demo dataset produces impossible ratios (purchases ≫ sales). Treat
    percentages outside a believable band as "no reliable data" → render "—". */
function plausible(value: number | undefined, min: number, max: number): number | null {
  if (value == null || !Number.isFinite(value)) return null;
  return value >= min && value <= max ? value : null;
}

function fmtPctOrDash(value: number | null): string {
  return value == null ? "—" : `${value.toFixed(1)}%`;
}

/* ── Small pieces ────────────────────────────────────────────────────────── */

function Spark({ values, color }: { values: number[]; color: string }) {
  if (values.length < 2) return null;
  const w = 88;
  const h = 24;
  const min = Math.min(...values);
  const max = Math.max(...values);
  const span = max - min || 1;
  const pts = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden className="shrink-0">
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

function DeltaChip({ value }: { value: number | null }) {
  if (value == null)
    return <span className="text-[11px] tabular-nums text-muted-foreground/60">—</span>;
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-bold tabular-nums",
        up ? "text-success" : "text-destructive",
      )}
    >
      {up ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

function KpiCard({
  label,
  value,
  sub,
  icon: Icon,
  tone,
}: {
  label: string;
  value: string;
  sub?: string;
  icon: React.ElementType;
  tone: string;
}) {
  return (
    <Card className="border border-border/60 bg-card shadow-sm">
      <CardContent className="flex items-center gap-3 p-4">
        <div className={cn("flex h-9 w-9 shrink-0 items-center justify-center rounded-xl", tone)}>
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          <p className="truncate text-[16px] font-black tabular-nums text-foreground">{value}</p>
          {sub && <p className="truncate text-[10px] text-muted-foreground">{sub}</p>}
        </div>
      </CardContent>
    </Card>
  );
}

/* ── Page ────────────────────────────────────────────────────────────────── */

function BranchesPage() {
  const queryClient = useQueryClient();
  const { locations, setBranch, isLoadingBranches } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);

  const summaryQuery = useQuery({
    queryKey: ["dashboard", "branch-summary", period],
    queryFn: () => dashboardService.getBranchSummary(period),
    ...DASHBOARD_LIVE_QUERY,
  });
  const snapshotsQuery = useQuery({
    queryKey: ["dashboard", "location-snapshots", period],
    queryFn: () => dashboardService.getLocationSnapshots(period),
    ...DASHBOARD_LIVE_QUERY,
  });

  const isLoading = isLoadingBranches || summaryQuery.isLoading || snapshotsQuery.isLoading;
  const isError = summaryQuery.isError || snapshotsQuery.isError;
  const currency = summaryQuery.data?.currency ?? "AED";

  const rows: BranchRow[] = useMemo(() => {
    const snaps = snapshotsQuery.data?.items ?? [];
    const sums = summaryQuery.data?.items ?? [];
    return locations
      .map((loc) => {
        const snap = snaps.find((s) => s.branch === loc.name);
        const sum = sums.find((s) => s.branch === loc.name);
        // 100% margin + 0% food cost = no purchases recorded, not a real ratio
        const noPurchases = sum?.food_cost_pct === 0;
        return {
          name: loc.name,
          color: loc.color,
          index: loc.index,
          revenue: snap?.revenue ?? 0,
          orders: snap?.orders ?? 0,
          avg_order: snap?.avg_order ?? 0,
          delta_pct: snap?.delta_pct ?? null,
          vs_seven_day_pct: snap?.vs_seven_day_pct ?? 0,
          sparkline: snap?.sparkline ?? [],
          margin_pct: noPurchases ? null : plausible(sum?.gross_margin_pct, -50, 100),
          food_cost_pct: noPurchases ? null : plausible(sum?.food_cost_pct, 0, 150),
          issues: snap?.pending_issues ?? 0,
        };
      })
      .sort((a, b) => b.revenue - a.revenue);
  }, [locations, snapshotsQuery.data, summaryQuery.data]);

  const totalRevenue = rows.reduce((sum, r) => sum + r.revenue, 0);
  const totalOrders = rows.reduce((sum, r) => sum + r.orders, 0);
  const totalIssues = rows.reduce((sum, r) => sum + r.issues, 0);
  const top = rows[0];
  const maxRevenue = Math.max(...rows.map((r) => r.revenue), 1);

  // Auto-generated insight callouts, worst news first
  const insights = useMemo(() => {
    const list: { tone: "success" | "warning" | "destructive"; title: string; text: string }[] =
      [];
    const laggards = rows.filter((r) => r.vs_seven_day_pct <= -12);
    const risers = rows.filter((r) => (r.delta_pct ?? 0) > 0 || r.vs_seven_day_pct >= 12);
    if (top && top.revenue > 0) {
      list.push({
        tone: "success",
        title: `${top.name} leads the network`,
        text: `${fmtCurrency(top.revenue, currency)} — ${((top.revenue / (totalRevenue || 1)) * 100).toFixed(0)}% of network revenue this ${period}`,
      });
    }
    if (risers.length && risers[0].name !== top?.name) {
      const r = risers[0];
      list.push({
        tone: "success",
        title: `${r.name} is trending up`,
        text:
          r.delta_pct != null
            ? `Revenue up ${r.delta_pct.toFixed(1)}% vs the previous ${period}`
            : `Running ${r.vs_seven_day_pct.toFixed(0)}% above its 7-day average`,
      });
    }
    for (const l of laggards) {
      list.push({
        tone: l.vs_seven_day_pct <= -25 ? "destructive" : "warning",
        title: `${l.name} needs attention`,
        text: `Trailing its 7-day average by ${Math.abs(l.vs_seven_day_pct).toFixed(0)}%${l.issues ? ` · ${l.issues} open issue${l.issues > 1 ? "s" : ""}` : ""}`,
      });
    }
    const zero = rows.filter((r) => r.revenue === 0 && r.orders === 0);
    for (const z of zero) {
      list.push({
        tone: "warning",
        title: `${z.name} has no POS data`,
        text: "Sales will appear here once the POS sync starts reporting for this location",
      });
    }
    return list.slice(0, 3);
  }, [rows, top, totalRevenue, currency, period]);

  const INSIGHT_STYLES = {
    success: "border-success/25 bg-success-soft/30",
    warning: "border-warning/30 bg-warning-soft/30",
    destructive: "border-destructive/35 bg-destructive-soft/40",
  } as const;
  const INSIGHT_ICON = {
    success: <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />,
    warning: <AlertTriangle className="h-4 w-4 shrink-0 text-warning" />,
    destructive: <AlertTriangle className="h-4 w-4 shrink-0 text-destructive" />,
  } as const;

  const mapBranches: BranchSummaryItem[] = rows.map((r) => ({
    branch: r.name,
    sales: r.revenue,
    orders: r.orders,
    food_cost_pct: r.food_cost_pct ?? 0,
    gross_margin_pct: r.margin_pct ?? 0,
    active_alerts: r.issues,
  }));

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-foreground flex items-center gap-2">
            <Building2 className="h-5 w-5 text-primary" />
            Branch Insights
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            How the network performed this {period} — ranked, compared, and mapped
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() =>
            queryClient.invalidateQueries({ queryKey: ["dashboard"] })
          }
          disabled={summaryQuery.isFetching || snapshotsQuery.isFetching}
          className="text-[11px]"
        >
          <RefreshCw
            className={cn(
              "h-3.5 w-3.5",
              (summaryQuery.isFetching || snapshotsQuery.isFetching) && "animate-spin",
            )}
          />
        </Button>
      </div>

      {isError ? (
        <EmptyState
          icon={AlertTriangle}
          title="Couldn't load branch data"
          description="Check that the backend is running, then retry"
          action={{
            label: "Retry",
            onClick: () => queryClient.invalidateQueries({ queryKey: ["dashboard"] }),
          }}
        />
      ) : isLoading ? (
        <div className="space-y-5">
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="h-[74px] rounded-xl skeleton-shimmer" />
            ))}
          </div>
          <div className="h-[320px] rounded-xl skeleton-shimmer" />
          <div className="grid gap-4 lg:grid-cols-2">
            <div className="h-[300px] rounded-xl skeleton-shimmer" />
            <div className="h-[300px] rounded-xl skeleton-shimmer" />
          </div>
        </div>
      ) : !rows.length ? (
        <EmptyState
          icon={Building2}
          title="No locations yet"
          description="Branches will appear here once POS or Tally data is synced"
        />
      ) : (
        <>
          {/* ── KPI Row ──────────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
            <KpiCard
              label="Network revenue"
              value={fmtCurrency(totalRevenue, currency)}
              sub={`across ${rows.length} locations`}
              icon={DollarSign}
              tone="bg-primary/15 text-primary"
            />
            <KpiCard
              label="Orders"
              value={totalOrders.toLocaleString()}
              sub={`AED ${totalOrders ? (totalRevenue / totalOrders).toFixed(0) : 0} avg order`}
              icon={ShoppingCart}
              tone="bg-info/15 text-info"
            />
            <KpiCard
              label="Top branch"
              value={top?.name ?? "—"}
              sub={top ? fmtCurrency(top.revenue, currency) : undefined}
              icon={Crown}
              tone="bg-warning/15 text-warning"
            />
            <KpiCard
              label="Open issues"
              value={String(totalIssues)}
              sub="incomplete orders to review"
              icon={AlertTriangle}
              tone={totalIssues ? "bg-destructive/15 text-destructive" : "bg-success/15 text-success"}
            />
          </div>

          {/* ── Insight callouts ─────────────────────────────────────── */}
          {insights.length > 0 && (
            <div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
              {insights.map((ins) => (
                <div
                  key={ins.title}
                  className={cn(
                    "flex items-start gap-2.5 rounded-xl border px-4 py-3",
                    INSIGHT_STYLES[ins.tone],
                  )}
                >
                  {INSIGHT_ICON[ins.tone]}
                  <div className="min-w-0">
                    <p className="text-[12px] font-bold text-foreground">{ins.title}</p>
                    <p className="mt-0.5 text-[11px] text-muted-foreground">{ins.text}</p>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* ── Leaderboard ──────────────────────────────────────────── */}
          <Card className="border border-border/60 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
              <CardTitle className="text-[13px] font-bold text-foreground">
                Branch leaderboard
              </CardTitle>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Ranked by revenue this {period} — click a branch to focus the whole dashboard on
                it
              </p>
            </CardHeader>
            <CardContent className="px-0 pb-2 pt-0">
              <div className="overflow-x-auto">
                <table className="w-full min-w-[860px] text-left">
                  <thead>
                    <tr className="border-b border-border/40 text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5 w-10">#</th>
                      <th className="px-3 py-2.5">Branch</th>
                      <th className="px-3 py-2.5">14-day trend</th>
                      <th className="px-3 py-2.5 text-right">Revenue</th>
                      <th className="px-3 py-2.5 w-[16%]">Share</th>
                      <th className="px-3 py-2.5 text-right">Orders</th>
                      <th className="px-3 py-2.5 text-right">Avg order</th>
                      <th className="px-3 py-2.5 text-right">Margin</th>
                      <th className="px-3 py-2.5 text-right">vs prev</th>
                      <th className="px-3 py-2.5 text-right">Issues</th>
                    </tr>
                  </thead>
                  <tbody>
                    {rows.map((row, rank) => (
                      <tr
                        key={row.name}
                        onClick={() => setBranch(row.name)}
                        className="cursor-pointer border-b border-border/20 transition-colors last:border-0 hover:bg-muted/40"
                      >
                        <td className="px-5 py-3">
                          {rank === 0 ? (
                            <Crown className="h-3.5 w-3.5 text-warning" />
                          ) : (
                            <span className="text-[11px] font-bold tabular-nums text-muted-foreground/70">
                              {rank + 1}
                            </span>
                          )}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <span
                              className="h-2.5 w-2.5 shrink-0 rounded-full"
                              style={{ backgroundColor: row.color }}
                            />
                            <span className="text-[12px] font-semibold text-foreground">
                              {row.name}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3">
                          <Spark values={row.sparkline} color={row.color} />
                        </td>
                        <td className="px-3 py-3 text-right text-[12px] font-bold tabular-nums text-foreground">
                          {fmtCurrency(row.revenue, currency)}
                        </td>
                        <td className="px-3 py-3">
                          <div className="flex items-center gap-2">
                            <div className="h-1.5 flex-1 overflow-hidden rounded-full bg-muted">
                              <div
                                className="h-full rounded-full"
                                style={{
                                  width: `${(row.revenue / maxRevenue) * 100}%`,
                                  backgroundColor: row.color,
                                }}
                              />
                            </div>
                            <span className="w-9 shrink-0 text-right text-[10px] tabular-nums text-muted-foreground">
                              {totalRevenue ? ((row.revenue / totalRevenue) * 100).toFixed(0) : 0}
                              %
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-right text-[11.5px] tabular-nums text-foreground">
                          {row.orders.toLocaleString()}
                        </td>
                        <td className="px-3 py-3 text-right text-[11.5px] tabular-nums text-muted-foreground">
                          {row.orders ? `AED ${row.avg_order.toFixed(0)}` : "—"}
                        </td>
                        <td
                          className={cn(
                            "px-3 py-3 text-right text-[11.5px] font-semibold tabular-nums",
                            row.margin_pct == null
                              ? "text-muted-foreground/60"
                              : row.margin_pct >= 50
                                ? "text-success"
                                : row.margin_pct >= 25
                                  ? "text-warning"
                                  : "text-destructive",
                          )}
                        >
                          {fmtPctOrDash(row.margin_pct)}
                        </td>
                        <td className="px-3 py-3 text-right">
                          <DeltaChip value={row.delta_pct} />
                        </td>
                        <td className="px-3 py-3 text-right">
                          {row.issues > 0 ? (
                            <Badge
                              variant="outline"
                              className="border-destructive/30 bg-destructive-soft/40 px-1.5 py-0 text-[10px] font-bold tabular-nums text-destructive"
                            >
                              {row.issues}
                            </Badge>
                          ) : (
                            <span className="text-[11px] text-muted-foreground/50">0</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>

          {/* ── Charts row ───────────────────────────────────────────── */}
          <div className="grid gap-4 lg:grid-cols-[1fr_1.4fr]">
            {/* Revenue share donut */}
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
                <CardTitle className="text-[13px] font-bold text-foreground">
                  Revenue share
                </CardTitle>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Each location's slice of network revenue
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <div className="relative h-[240px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={rows.filter((r) => r.revenue > 0)}
                        dataKey="revenue"
                        nameKey="name"
                        innerRadius="62%"
                        outerRadius="88%"
                        paddingAngle={3}
                        strokeWidth={0}
                      >
                        {rows
                          .filter((r) => r.revenue > 0)
                          .map((r) => (
                            <Cell key={r.name} fill={r.color} />
                          ))}
                      </Pie>
                      <ReTooltip
                        content={({ active, payload }) => {
                          if (!active || !payload?.length) return null;
                          const p = payload[0];
                          return (
                            <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-[11px] shadow-lg">
                              <p className="font-bold text-foreground">{p.name}</p>
                              <p className="tabular-nums text-muted-foreground">
                                {fmtCurrency(p.value as number, currency)}
                              </p>
                            </div>
                          );
                        }}
                      />
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
                    <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      Total
                    </p>
                    <p className="text-[17px] font-black tabular-nums text-foreground">
                      {fmtCurrency(totalRevenue, currency)}
                    </p>
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1.5">
                  {rows.map((r) => (
                    <span
                      key={r.name}
                      className="flex items-center gap-1.5 text-[10.5px] text-muted-foreground"
                    >
                      <span
                        className="h-2 w-2 rounded-full"
                        style={{ backgroundColor: r.color }}
                      />
                      {r.name.replace(" Branch", "")}
                    </span>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Revenue by branch bars */}
            <Card className="border border-border/60 bg-card shadow-sm">
              <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
                <CardTitle className="text-[13px] font-bold text-foreground">
                  Revenue by branch
                </CardTitle>
                <p className="mt-0.5 text-[10px] text-muted-foreground">
                  Side-by-side revenue this {period}
                </p>
              </CardHeader>
              <CardContent className="px-5 pb-5 pt-3">
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={rows} margin={{ top: 8, right: 8, left: -14, bottom: 0 }}>
                      <ChartGradientDefs />
                      <CartesianGrid
                        strokeDasharray="3 3"
                        stroke="var(--color-border)"
                        opacity={0.35}
                        vertical={false}
                      />
                      <XAxis
                        dataKey="name"
                        stroke="var(--color-muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(name: string) => name.replace(" Branch", "")}
                      />
                      <YAxis
                        stroke="var(--color-muted-foreground)"
                        fontSize={10}
                        tickLine={false}
                        axisLine={false}
                        tickFormatter={(v: number) =>
                          v >= 1000 ? `${(v / 1000).toFixed(0)}k` : String(v)
                        }
                      />
                      <ReTooltip
                        cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                        content={({ active, payload, label }) => {
                          if (!active || !payload?.length) return null;
                          return (
                            <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-[11px] shadow-lg">
                              <p className="font-bold text-foreground">{label}</p>
                              <p className="tabular-nums text-muted-foreground">
                                {fmtCurrency(payload[0].value as number, currency)}
                              </p>
                            </div>
                          );
                        }}
                      />
                      <Bar dataKey="revenue" radius={[6, 6, 0, 0]} maxBarSize={52}>
                        {rows.map((r) => (
                          <Cell key={r.name} fill={deepFillY(r.index)} />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* ── Map ──────────────────────────────────────────────────── */}
          <Card className="border border-border/60 bg-card shadow-sm">
            <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
              <div className="flex items-center gap-1.5">
                <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
                <CardTitle className="text-[13px] font-bold text-foreground">
                  Branch locations
                </CardTitle>
              </div>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                All {rows.length} outlets across Dubai — click a marker for its numbers
              </p>
            </CardHeader>
            <CardContent className="p-0">
              <div className="h-[340px] overflow-hidden rounded-b-xl">
                <Suspense
                  fallback={
                    <div className="flex h-full items-center justify-center">
                      <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
                    </div>
                  }
                >
                  <LazyBranchMap
                    branches={mapBranches}
                    coords={BRANCH_COORDS}
                    currency={currency}
                  />
                </Suspense>
              </div>
            </CardContent>
          </Card>

          <p className="flex items-center gap-1.5 text-[10px] text-muted-foreground/70">
            <TrendingUp className="h-3 w-3" />
            Revenue and orders from POS sales · margin from Tally purchases — "—" means the
            period has too little data for a reliable ratio
            <Scale className="ml-auto h-3 w-3" />
          </p>
        </>
      )}
    </div>
  );
}

export default BranchesPage;
