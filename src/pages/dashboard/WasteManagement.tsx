import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ArrowDown,
  ArrowUp,
  CheckCircle2,
  Download,
  HelpCircle,
  RefreshCw,
  Search,
  Trash2,
  TrendingDown,
  Wallet,
} from "lucide-react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { DASHBOARD_LIVE_QUERY, PeriodChip, fmtCurrency } from "@/components/dashboard/shared";
import { dashboardService, type WasteManagementItem } from "@/services/dashboardService";

type Period = "week" | "month" | "year" | "all";
type Filter = "all" | WasteManagementItem["status"];
type SortKey =
  | "name"
  | "bought"
  | "remaining"
  | "used"
  | "should_use"
  | "waste"
  | "waste_pct"
  | "waste_cost";

const PERIODS: { label: string; value: Period }[] = [
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
  { label: "Year", value: "year" },
  { label: "All time", value: "all" },
];

const PERIOD_NOTE: Record<Period, string> = {
  week: "last 7 days",
  month: "last 30 days",
  year: "this year",
  all: "all recorded history",
};

const STATUS = {
  over: {
    label: "Over tolerance",
    badge: "bg-destructive/15 text-destructive border-destructive/30",
    fill: "var(--color-destructive)",
  },
  ok: {
    label: "Within tolerance",
    badge: "bg-success/15 text-success border-success/30",
    fill: "var(--color-success)",
  },
  unreconciled: {
    label: "Check stock records",
    badge: "bg-warning/15 text-warning border-warning/30",
    fill: "var(--color-warning)",
  },
  no_recipe: {
    label: "No recipe match",
    badge: "bg-muted text-muted-foreground border-border",
    fill: "var(--color-muted-foreground)",
  },
} as const;

const num = (n: number, digits = 1) =>
  n.toLocaleString("en-US", { minimumFractionDigits: digits, maximumFractionDigits: digits });
const isTracked = (i: WasteManagementItem) => i.status === "over" || i.status === "ok";

/** bought = should use + waste + remaining, drawn as one bar. */
function FlowBar({ i }: { i: WasteManagementItem }) {
  if (!isTracked(i) || i.bought <= 0) return <span className="text-muted-foreground/50">—</span>;
  const pct = (v: number) => `${Math.max(0, Math.min(100, (v / i.bought) * 100))}%`;
  const needed = Math.min(i.should_use, i.used);
  return (
    <div
      className="flex h-2 w-32 overflow-hidden rounded-full bg-muted/50"
      title={`Needed ${num(needed)} · Waste ${num(i.waste)} · Remaining ${num(i.remaining)} ${i.unit}`}
    >
      <div className="bg-success/80" style={{ width: pct(needed) }} />
      <div className="bg-destructive/80" style={{ width: pct(i.waste) }} />
      <div className="bg-muted-foreground/25" style={{ width: pct(i.remaining) }} />
    </div>
  );
}

function SortHead({
  label,
  k,
  sort,
  onSort,
  align = "right",
}: {
  label: string;
  k: SortKey;
  sort: { key: SortKey; dir: "asc" | "desc" };
  onSort: (k: SortKey) => void;
  align?: "left" | "right";
}) {
  const active = sort.key === k;
  const Arrow = sort.dir === "asc" ? ArrowUp : ArrowDown;
  // reserved width, so toggling the sort never shifts the header text
  const arrow = <Arrow className={cn("h-3 w-3 shrink-0", !active && "opacity-0")} />;
  return (
    <th className={cn("px-3 py-2.5 font-bold", align === "right" ? "text-right" : "text-left")}>
      <button
        onClick={() => onSort(k)}
        className={cn(
          "inline-flex items-center gap-1 uppercase tracking-wider transition-colors hover:text-foreground",
          active && "text-foreground",
        )}
      >
        {align === "right" && arrow}
        {label}
        {align === "left" && arrow}
      </button>
    </th>
  );
}

export default function WasteManagement() {
  const { branch } = useBranchFilter();
  const [period, setPeriod] = useState<Period>("month");
  const [filter, setFilter] = useState<Filter>("all");
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState<{ key: SortKey; dir: "asc" | "desc" }>({
    key: "waste_cost",
    dir: "desc",
  });

  const { data, isLoading, isError, isFetching, refetch } = useQuery({
    queryKey: ["dashboard", "waste-management", branch, period],
    queryFn: () => dashboardService.getWasteManagement(branch, period),
    ...DASHBOARD_LIVE_QUERY,
  });

  const items = useMemo(() => data?.items ?? [], [data]);
  const tracked = useMemo(() => items.filter(isTracked), [items]);
  const worst = useMemo(() => [...tracked].sort((a, b) => b.waste_pct - a.waste_pct)[0], [tracked]);
  const unclearCount = items.length - tracked.length;

  const chartData = useMemo(
    () =>
      tracked
        .filter((i) => i.waste_cost > 0)
        .sort((a, b) => b.waste_cost - a.waste_cost)
        .slice(0, 10)
        .map((i) => ({ ...i, label: i.name.length > 20 ? `${i.name.slice(0, 19)}…` : i.name })),
    [tracked],
  );

  const counts = useMemo(() => {
    const c: Record<Filter, number> = {
      all: items.length,
      over: 0,
      ok: 0,
      unreconciled: 0,
      no_recipe: 0,
    };
    for (const i of items) c[i.status] += 1;
    return c;
  }, [items]);

  const rows = useMemo(() => {
    const q = search.trim().toLowerCase();
    const list = items.filter(
      (i) => (filter === "all" || i.status === filter) && (!q || i.name.toLowerCase().includes(q)),
    );
    const dir = sort.dir === "asc" ? 1 : -1;
    return [...list].sort((a, b) =>
      sort.key === "name" ? a.name.localeCompare(b.name) * dir : (a[sort.key] - b[sort.key]) * dir,
    );
  }, [items, filter, search, sort]);

  const onSort = (key: SortKey) =>
    setSort((s) =>
      s.key === key ? { key, dir: s.dir === "asc" ? "desc" : "asc" } : { key, dir: "desc" },
    );

  const exportCsv = () => {
    const head = [
      "Ingredient",
      "Unit",
      "Bought",
      "Remaining",
      "Used",
      "Should use",
      "Waste",
      "Waste %",
      "Waste cost",
      "Status",
    ];
    const body = rows.map((i) => [
      i.name,
      i.unit,
      i.bought,
      i.remaining,
      i.used,
      i.should_use,
      i.waste,
      i.waste_pct,
      i.waste_cost,
      i.status,
    ]);
    const csv = [head, ...body]
      .map((r) => r.map((c) => `"${String(c).replace(/"/g, '""')}"`).join(","))
      .join("\n");
    const a = document.createElement("a");
    a.href = URL.createObjectURL(new Blob([csv], { type: "text/csv" }));
    a.download = `waste-${period}.csv`;
    a.click();
    URL.revokeObjectURL(a.href);
  };

  const currency = data?.currency ?? "AED";
  const kpis = [
    {
      label: "WASTE COST",
      value: data ? fmtCurrency(data.total_waste_cost, currency) : "…",
      sub: `Used beyond recipes · ${PERIOD_NOTE[period]}`,
      icon: Wallet,
      tone: "bg-destructive/15 text-destructive",
    },
    {
      label: "FLAGGED INGREDIENTS",
      value: data ? String(data.flagged_count) : "…",
      sub: data ? `Waste at or above ${data.tolerance_pct}% of use` : "",
      icon: AlertTriangle,
      tone:
        data && data.flagged_count > 0
          ? "bg-warning/15 text-warning"
          : "bg-success/15 text-success",
    },
    {
      label: "WORST OFFENDER",
      value: worst ? worst.name : "—",
      sub: !data
        ? ""
        : worst
          ? `${num(worst.waste_pct, 0)}% of what was used is waste`
          : "Nothing reconciled yet",
      icon: TrendingDown,
      tone: "bg-primary/15 text-primary",
    },
    {
      label: "TRACKED INGREDIENTS",
      value: data ? `${tracked.length} / ${items.length}` : "…",
      sub:
        unclearCount > 0
          ? `${unclearCount} need a stock-record check`
          : "All reconciled against recipes",
      icon: CheckCircle2,
      tone: unclearCount > 0 ? "bg-info/15 text-info" : "bg-success/15 text-success",
    },
  ];

  return (
    <div className="space-y-5 pb-20">
      {/* ── Header ─────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-[20px] font-bold tracking-tight text-foreground">
            <Trash2 className="h-5 w-5 text-primary" />
            Waste Management
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            What we bought, what was actually used, and what the recipes say should have been used
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-0.5 rounded-full border border-border/50 bg-muted/30 p-0.5">
            {PERIODS.map((p) => (
              <PeriodChip
                key={p.value}
                label={p.label}
                active={period === p.value}
                onClick={() => setPeriod(p.value)}
              />
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            className="gap-1.5 text-[11px]"
            onClick={exportCsv}
            disabled={!rows.length}
          >
            <Download className="h-3.5 w-3.5" />
            Export
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => void refetch()}
            disabled={isFetching}
            className="text-[11px]"
          >
            <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
          </Button>
        </div>
      </div>

      {isError && (
        <Card className="border border-destructive/30 bg-destructive/[0.04] shadow-sm">
          <CardContent className="flex items-center justify-between gap-3 px-5 py-4">
            <p className="text-[13px] font-semibold text-destructive">
              Couldn&apos;t load waste data.
            </p>
            <Button variant="outline" size="sm" onClick={() => void refetch()}>
              Retry
            </Button>
          </CardContent>
        </Card>
      )}

      {/* ── KPI row ────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 xl:grid-cols-4">
        {kpis.map((c) => (
          <Card key={c.label} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="px-5 py-4">
              <div className="mb-3 flex items-center justify-between">
                <p className="text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                  {c.label}
                </p>
                <div
                  className={cn(
                    "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                    c.tone,
                  )}
                >
                  <c.icon className="h-4 w-4" />
                </div>
              </div>
              {isLoading ? (
                <Skeleton className="h-7 w-28" />
              ) : (
                <p className="truncate text-[22px] font-bold leading-tight tabular-nums text-foreground">
                  {c.value}
                </p>
              )}
              <p className="mt-1 text-[11px] text-muted-foreground/70">{c.sub}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Chart + how it works ───────────────────────────────────── */}
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-5">
        <Card className="border border-border/60 bg-card shadow-sm lg:col-span-3">
          <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
            <CardTitle className="text-[13px] font-bold text-foreground">
              Waste cost by ingredient
            </CardTitle>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Top ingredients by cost of stock used beyond recipe needs · {PERIOD_NOTE[period]}
            </p>
          </CardHeader>
          <CardContent className="px-5 pb-5 pt-3">
            {isLoading ? (
              <Skeleton className="h-[300px] w-full" />
            ) : chartData.length === 0 ? (
              <div className="flex h-[300px] flex-col items-center justify-center text-center">
                <CheckCircle2 className="mb-2 h-9 w-9 text-success/60" />
                <p className="text-[13px] font-semibold text-muted-foreground">
                  No waste detected in this period
                </p>
              </div>
            ) : (
              <div className="h-[300px] w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={chartData}
                    layout="vertical"
                    margin={{ top: 4, right: 24, left: 8, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      opacity={0.3}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      fontSize={10}
                      stroke="var(--color-muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) =>
                        v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(Math.round(v))
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="label"
                      width={136}
                      fontSize={11}
                      stroke="var(--color-muted-foreground)"
                      tickLine={false}
                      axisLine={false}
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)", opacity: 0.15 }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const d = payload[0].payload as WasteManagementItem;
                        return (
                          <div className="rounded-xl border border-border bg-popover px-3.5 py-2.5 text-[11px] shadow-xl">
                            <p className="mb-1 font-bold text-foreground">{d.name}</p>
                            <p className="text-muted-foreground">
                              Used <b className="text-foreground">{num(d.used)}</b> · should use{" "}
                              <b className="text-foreground">{num(d.should_use)}</b> {d.unit}
                            </p>
                            <p className="mt-0.5 font-bold text-destructive">
                              {num(d.waste)} {d.unit} wasted · {fmtCurrency(d.waste_cost, currency)}
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar dataKey="waste_cost" radius={[0, 8, 8, 0]} maxBarSize={22}>
                      {chartData.map((d) => (
                        <Cell key={d.name} fill={STATUS[d.status].fill} fillOpacity={0.8} />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>
            )}
          </CardContent>
        </Card>

        <Card className="flex flex-col border border-border/60 bg-card shadow-sm lg:col-span-2">
          <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
            <CardTitle className="flex items-center gap-1.5 text-[13px] font-bold text-foreground">
              <HelpCircle className="h-3.5 w-3.5 text-muted-foreground" />
              How waste is worked out
            </CardTitle>
          </CardHeader>
          <CardContent className="flex flex-1 flex-col justify-between gap-5 px-5 py-5">
            <div className="space-y-5">
              {[
                ["1", "Bought", "Tally purchases minus purchase returns."],
                ["2", "Used", "Bought minus what remains (Material In − Material Out)."],
                ["3", "Should use", "Dishes sold on POS × the recipe quantity per portion."],
                ["4", "Waste", "Used − Should use, costed at the average purchase price."],
              ].map(([n, title, body]) => (
                <div key={n} className="flex gap-3">
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/15 text-[11px] font-bold text-primary">
                    {n}
                  </span>
                  <p className="text-[12px] leading-snug text-muted-foreground">
                    <b className="text-foreground">{title}.</b> {body}
                  </p>
                </div>
              ))}
            </div>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-border/40 pt-3 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-success/80" />
                Needed by recipes
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-destructive/80" />
                Waste
              </span>
              <span className="flex items-center gap-1.5">
                <i className="h-2 w-2 rounded-full bg-muted-foreground/30" />
                Still in stock
              </span>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* ── Table ──────────────────────────────────────────────────── */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
          <div className="flex flex-col gap-3 lg:flex-row lg:items-center lg:justify-between">
            <div>
              <CardTitle className="text-[13px] font-bold text-foreground">
                Ingredient reconciliation
              </CardTitle>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Bought vs used vs recipe, per ingredient
                {data?.as_of
                  ? ` · data to ${new Date(data.as_of).toLocaleDateString("en-GB", { day: "numeric", month: "short", year: "numeric" })}`
                  : ""}
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search ingredient"
                  className="h-8 w-48 pl-8 text-[12px]"
                />
              </div>
              <div className="flex items-center gap-0.5 rounded-full border border-border/40 bg-muted/30 p-0.5">
                {(["all", "over", "ok", "unreconciled", "no_recipe"] as const).map((f) => (
                  <button
                    key={f}
                    onClick={() => setFilter(f)}
                    className={cn(
                      "rounded-full px-2.5 py-1 text-[10px] font-semibold transition-all",
                      filter === f
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground",
                    )}
                  >
                    {f === "all"
                      ? "All"
                      : f === "over"
                        ? "Flagged"
                        : f === "ok"
                          ? "OK"
                          : f === "unreconciled"
                            ? "Check"
                            : "No recipe"}
                    <span className="ml-1 opacity-70">{counts[f]}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full min-w-[1000px] whitespace-nowrap text-[12px] [&_td:first-child]:pl-5 [&_td:last-child]:pr-5 [&_th:first-child]:pl-5 [&_th:last-child]:pr-5">
              <thead>
                <tr className="border-b border-border/40 bg-muted/20 text-[10px] text-muted-foreground">
                  <SortHead label="Ingredient" k="name" sort={sort} onSort={onSort} align="left" />
                  <SortHead label="Bought" k="bought" sort={sort} onSort={onSort} />
                  <SortHead label="Remaining" k="remaining" sort={sort} onSort={onSort} />
                  <SortHead label="Used" k="used" sort={sort} onSort={onSort} />
                  <SortHead label="Should use" k="should_use" sort={sort} onSort={onSort} />
                  <SortHead label="Waste" k="waste" sort={sort} onSort={onSort} />
                  <SortHead label="Waste %" k="waste_pct" sort={sort} onSort={onSort} />
                  <SortHead label="Cost" k="waste_cost" sort={sort} onSort={onSort} />
                  <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wider">
                    Breakdown
                  </th>
                  <th className="px-3 py-2.5 text-left font-bold uppercase tracking-wider">
                    Status
                  </th>
                </tr>
              </thead>
              <tbody>
                {isLoading &&
                  Array.from({ length: 6 }).map((_, n) => (
                    <tr key={n} className="border-b border-border/30">
                      <td colSpan={10} className="px-3 py-3">
                        <Skeleton className="h-5 w-full" />
                      </td>
                    </tr>
                  ))}
                {!isLoading && rows.length === 0 && (
                  <tr>
                    <td colSpan={10} className="py-14 text-center">
                      <Trash2 className="mx-auto mb-2 h-9 w-9 text-muted-foreground/40" />
                      <p className="text-[13px] font-semibold text-muted-foreground">
                        No ingredients match
                      </p>
                    </td>
                  </tr>
                )}
                {rows.map((i) => {
                  const t = isTracked(i);
                  const st = STATUS[i.status];
                  const dash = <span className="text-muted-foreground/50">—</span>;
                  return (
                    <tr
                      key={i.name}
                      className="border-b border-border/30 transition-colors last:border-0 hover:bg-muted/20"
                    >
                      <td className="px-3 py-3 font-semibold text-foreground">
                        {i.name}
                        <span className="ml-1.5 rounded bg-muted px-1 py-0.5 text-[9px] font-semibold uppercase text-muted-foreground">
                          {i.unit}
                        </span>
                      </td>
                      <td className="px-3 py-3 text-right tabular-nums">{num(i.bought)}</td>
                      <td
                        className={cn(
                          "px-3 py-3 text-right tabular-nums",
                          i.remaining < 0 && "font-semibold text-warning",
                        )}
                      >
                        {num(i.remaining)}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-right tabular-nums",
                          i.used < 0 && "font-semibold text-warning",
                        )}
                      >
                        {num(i.used)}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                        {i.should_use > 0 ? num(i.should_use) : dash}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-right tabular-nums",
                          i.status === "over" && "font-semibold text-destructive",
                        )}
                      >
                        {t ? num(i.waste) : dash}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-3 text-right tabular-nums",
                          i.status === "over" ? "font-bold text-destructive" : "text-foreground",
                        )}
                      >
                        {t ? `${num(i.waste_pct, 0)}%` : dash}
                      </td>
                      <td className="px-3 py-3 text-right font-semibold tabular-nums text-foreground">
                        {t ? fmtCurrency(i.waste_cost, currency) : dash}
                      </td>
                      <td className="px-3 py-3">
                        <FlowBar i={i} />
                      </td>
                      <td className="px-3 py-3">
                        <Badge
                          variant="outline"
                          className={cn("whitespace-nowrap text-[9px] font-bold", st.badge)}
                        >
                          {st.label}
                        </Badge>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
          {!isLoading && counts.unreconciled > 0 && (
            <p className="border-t border-border/40 px-5 py-3 text-[11px] text-muted-foreground">
              <b className="text-warning">Check stock records:</b> for these ingredients more stock
              was taken out than received (or the reverse), so &ldquo;used&rdquo; can&apos;t be
              trusted and no waste is calculated.
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
