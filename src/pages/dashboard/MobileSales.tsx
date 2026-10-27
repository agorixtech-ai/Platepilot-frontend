import { useQuery } from "@tanstack/react-query";
import { Bar, BarChart, CartesianGrid, ResponsiveContainer, XAxis, YAxis } from "recharts";

import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod, type DateRange } from "@/contexts/DateRangeContext";
import {
  ChartGradientDefs,
  DASHBOARD_LIVE_QUERY,
  deepFillY,
  fmtCurrency,
} from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import {
  CARD,
  Delta,
  EmptyNote,
  ErrorStrip,
  ListGroup,
  Segments,
  SectionTitle,
  SyncNote,
} from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

type Seg = "today" | "7d" | "30d" | "1y";

const RANGE_OF: Record<Seg, () => DateRange> = {
  today: () => ({ kind: "today" }),
  "7d": () => ({ kind: "7d" }),
  "30d": () => ({ kind: "30d" }),
  // >31 days maps to the backend's "year" bucket (see rangeToPeriod)
  "1y": () => ({ kind: "custom", from: new Date(Date.now() - 364 * 86_400_000), to: new Date() }),
};

/** "2026-09-17" → Thu (week) / 17 (month); "2026-09" → Sep (year). */
function tickLabel(label: string, trend: "week" | "month" | "year"): string {
  const d = new Date(label.length === 7 ? `${label}-01` : label);
  if (Number.isNaN(d.getTime())) return label;
  if (trend === "week") return d.toLocaleDateString([], { weekday: "short" });
  if (trend === "month") return String(d.getDate());
  return d.toLocaleDateString([], { month: "short" });
}

/** Sales Insights — phone view: period, trend bars, by branch, top sellers. */
export default function MobileSales() {
  const { branch, locations } = useBranchFilter();
  const { range, setRange } = useDateRange();
  const period = rangeToPeriod(range);
  const seg: Seg = range.kind === "custom" ? "1y" : range.kind;
  const trendPeriod = period === "today" ? "week" : period === "year" ? "year" : period;

  const metrics = useQuery({
    queryKey: ["dashboard", "metrics", period, branch],
    queryFn: () => dashboardService.getMetrics(period, branch),
    ...DASHBOARD_LIVE_QUERY,
  });
  const trend = useQuery({
    queryKey: ["dashboard", "metrics-trend", trendPeriod, branch],
    queryFn: () => dashboardService.getMetricsTrend(trendPeriod, branch),
    ...DASHBOARD_LIVE_QUERY,
  });
  const branches = useQuery({
    queryKey: ["dashboard", "location-snapshots", period],
    queryFn: () => dashboardService.getLocationSnapshots(period),
    ...DASHBOARD_LIVE_QUERY,
  });
  const top = useQuery({
    queryKey: ["dashboard", "top-items", period, branch],
    queryFn: () => dashboardService.getTopItems(period, branch, 5),
    ...DASHBOARD_LIVE_QUERY,
  });

  const m = metrics.data;
  const cur = m?.currency ?? "AED";
  const chartData = (trend.data?.labels ?? []).map((l, i) => ({
    label: tickLabel(l, trendPeriod),
    value: trend.data?.sales[i] ?? 0,
  }));
  const colorOf = (name: string) => locations.find((l) => l.name === name)?.color;
  const retry = () => {
    void metrics.refetch();
    void trend.refetch();
    void branches.refetch();
    void top.refetch();
  };

  return (
    <div className="mx-auto max-w-xl">
      <Segments<Seg>
        value={seg}
        onChange={(v) => setRange(RANGE_OF[v]())}
        options={[
          { value: "today", label: "Today" },
          { value: "7d", label: "7D" },
          { value: "30d", label: "30D" },
          { value: "1y", label: "1Y" },
        ]}
      />

      {metrics.isError && (
        <div className="mt-3">
          <ErrorStrip onRetry={retry} />
        </div>
      )}

      <div className={`${CARD} mt-3 p-4`}>
        <p className="text-[12px] text-muted-foreground">Total Sales</p>
        <div className="mt-1 flex items-center justify-between gap-3">
          {metrics.isLoading ? (
            <Skeleton className="h-8 w-36" />
          ) : (
            <p className="text-[26px] font-bold tracking-tight text-foreground">
              {fmtCurrency(m?.total_sales ?? 0, cur)}
            </p>
          )}
          {m?.total_sales_delta_pct != null && (
            <span className="rounded-full bg-success-soft px-2.5 py-1">
              <Delta value={m.total_sales_delta_pct} />
            </span>
          )}
        </div>
        <p className="text-[11px] text-muted-foreground">{m?.compare_label}</p>

        <div className="mt-3 h-44">
          {trend.isLoading ? (
            <Skeleton className="h-full w-full" />
          ) : chartData.length === 0 ? (
            <EmptyNote>No sales yet for this period.</EmptyNote>
          ) : (
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData} margin={{ top: 4, right: 0, left: -18, bottom: 0 }}>
                <ChartGradientDefs />
                <CartesianGrid
                  vertical={false}
                  stroke="var(--color-border)"
                  strokeDasharray="3 3"
                />
                <XAxis
                  dataKey="label"
                  tickLine={false}
                  axisLine={false}
                  interval="preserveStartEnd"
                  minTickGap={6}
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <YAxis
                  tickLine={false}
                  axisLine={false}
                  width={44}
                  tickFormatter={(v: number) =>
                    v >= 1000 ? `${Math.round(v / 1000)}K` : String(v)
                  }
                  tick={{ fontSize: 10, fill: "var(--color-muted-foreground)" }}
                />
                <Bar dataKey="value" fill={deepFillY(0)} radius={[4, 4, 0, 0]} maxBarSize={22} />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <SectionTitle>Sales by Branch</SectionTitle>
      <ListGroup>
        {(branches.data?.items ?? []).map((b) => (
          <div key={b.branch} className="flex items-center gap-3 px-3.5 py-3 text-[13px]">
            <span
              className="h-3 w-3 shrink-0 rounded-full bg-chart-1"
              // per-branch identity colour comes from the API-ordered palette (lib/locations.ts)
              style={{ backgroundColor: colorOf(b.branch) }}
            />
            <span className="min-w-0 flex-1 truncate font-medium text-foreground">{b.branch}</span>
            <span className="font-semibold text-foreground">
              {fmtCurrency(b.revenue, branches.data?.currency)}
            </span>
            <span className="w-14 text-right">
              <Delta value={b.delta_pct} />
            </span>
          </div>
        ))}
        {!branches.isLoading && !branches.data?.items.length && (
          <p className="p-4 text-center text-[12px] text-muted-foreground">
            Locations will appear here once POS sales are synced
          </p>
        )}
      </ListGroup>

      <SectionTitle>Top Selling Items</SectionTitle>
      <ListGroup>
        {(top.data?.items ?? []).map((i) => (
          <div key={i.item} className="flex items-center gap-3 px-3.5 py-3">
            <ItemAvatar name={i.item} size="lg" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[13px] font-semibold text-foreground">{i.item}</p>
              <p className="text-[11px] text-muted-foreground">{i.qty.toLocaleString()} sold</p>
            </div>
            <div className="text-right">
              <p className="text-[13px] font-semibold text-foreground">
                {fmtCurrency(i.revenue, top.data?.currency)}
              </p>
              <p className="text-[11px] text-muted-foreground">{i.pct.toFixed(0)}% of sales</p>
            </div>
          </div>
        ))}
        {!top.isLoading && !top.data?.items.length && (
          <p className="p-4 text-center text-[12px] text-muted-foreground">
            Top sellers will appear here once POS sales are synced
          </p>
        )}
      </ListGroup>

      <SyncNote lastSync={m?.last_sync} />
    </div>
  );
}
