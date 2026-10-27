import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, ComposedChart, Line, ResponsiveContainer } from "recharts";
import { Bell, ChartColumn, Check, ChevronDown, ChevronRight, Coins, FileText, Package, Receipt, ShoppingCart, Sparkles, TrendingUp, type LucideIcon } from "lucide-react";
import TriangleAlertIcon from "@/components/ui/icons/triangle-alert-icon";

import { useAlerts } from "@/components/dashboard/useAlerts";
import {
  CARD,
  Delta,
  EmptyNote,
  ErrorStrip,
  PhotoCredit,
  SectionTitle,
  SyncNote,
} from "@/components/dashboard/MobileUI";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { BranchPicker } from "@/components/dashboard/MobileHeader";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { dashboardService } from "@/services/dashboardService";
import { canOpenPage, getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

const PERIOD_CHOICES = [
  { kind: "today", label: "Today" },
  { kind: "7d", label: "Last 7 days" },
  { kind: "30d", label: "Last 30 days" },
] as const;
const PERIOD_LABEL: Record<string, string> = {
  today: "Today",
  "7d": "7 days",
  "30d": "30 days",
  custom: "Custom",
};
const PERIOD_PHRASE: Record<string, string> = {
  today: " today",
  "7d": " this week",
  "30d": " this month",
  custom: "",
};

const SALES_LABEL: Record<string, string> = {
  today: "Today's Sales",
  week: "7-Day Sales",
  month: "30-Day Sales",
  year: "Year's Sales",
};

const QUICK: { label: string; to: string; icon: LucideIcon; page: string; tone: string }[] = [
  {
    label: "Add Order",
    to: "/dashboard/pos",
    icon: ShoppingCart,
    page: "pos",
    tone: "bg-green-100 text-green-700",
  },
  {
    label: "Manage Inventory",
    to: "/dashboard/inventory",
    icon: Package,
    page: "inventory",
    tone: "bg-orange-100 text-orange-700",
  },
  {
    label: "Market Prices",
    to: "/dashboard/market-prices",
    icon: ChartColumn,
    page: "market-prices",
    tone: "bg-blue-100 text-blue-700",
  },
  {
    label: "AI Insights",
    to: "/dashboard/ai",
    icon: Sparkles,
    page: "ai",
    tone: "bg-purple-100 text-purple-700",
  },
  {
    label: "Reports",
    to: "/dashboard/reports",
    icon: FileText,
    page: "reports",
    tone: "bg-emerald-100 text-emerald-700",
  },
];

/** Staggered entrance for each Home section. */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500";
const delay = (i: number) => ({ animationDelay: `${i * 70}ms` });

/** Tiny area chart of one real daily series (Recharts needs colour strings, not classes). */
function Spark({ values, stroke, id }: { values: number[]; stroke: string; id: string }) {
  if (values.length < 2) return null;
  return (
    <ResponsiveContainer width="100%" height="100%">
      <AreaChart
        data={values.map((v) => ({ v }))}
        margin={{ top: 2, right: 0, bottom: 0, left: 0 }}
      >
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={stroke} stopOpacity={0.3} />
            <stop offset="100%" stopColor={stroke} stopOpacity={0} />
          </linearGradient>
        </defs>
        <Area
          type="monotone"
          dataKey="v"
          stroke={stroke}
          strokeWidth={1.5}
          fill={`url(#${id})`}
          isAnimationActive
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

function KpiCard({
  to,
  icon: Icon,
  iconTone,
  label,
  value,
  valueClass,
  note,
  chart,
}: {
  to: string;
  icon: LucideIcon;
  iconTone: string;
  label: string;
  value: ReactNode;
  valueClass?: string;
  note?: ReactNode;
  chart?: ReactNode;
}) {
  return (
    <Link to={to} className={cn(CARD, "flex flex-col p-4")}>
      <div className="mb-2 flex items-center justify-between">
        <span className={cn("flex h-10 w-10 items-center justify-center rounded-full", iconTone)}>
          <Icon className="h-5 w-5" />
        </span>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-2xl font-bold", valueClass)}>{value}</p>
      <div className="mt-2 min-h-4 text-xs text-muted-foreground">{note}</div>
      <div className="mt-2 h-10">{chart}</div>
    </Link>
  );
}

/** Daily Command Center — phone Home tab (desktop keeps Overview). */
export default function MobileHome() {
  const { openAlerts, metrics: m, isLoading, isError, refetch } = useAlerts();
  const { branch } = useBranchFilter();
  const { range, setRange } = useDateRange();
  const user = getStoredUser();
  const period = rangeToPeriod(range);
  const trendPeriod = period === "today" ? "week" : period === "year" ? "year" : period;
  const canSales = canOpenPage("overview") || canOpenPage("pos");
  const canStock = canOpenPage("overview") || canOpenPage("inventory") || canOpenPage("tally");

  // Same query keys as MobileSales/Overview/useAlerts so the cache is shared.
  const trend = useQuery({
    queryKey: ["dashboard", "metrics-trend", trendPeriod, branch],
    queryFn: () => dashboardService.getMetricsTrend(trendPeriod, branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });
  // Food cost = purchases ÷ sales. Purchases arrive in batches, so a single day swings
  // between 0% and 100%+ — the headline number uses the trailing 30 days instead.
  const month = useQuery({
    queryKey: ["dashboard", "metrics", "month", branch],
    queryFn: () => dashboardService.getMetrics("month", branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });

  const cur = m?.currency ?? "AED";
  const aov = m && m.orders > 0 ? m.total_sales / m.orders : 0;
  const t = trend.data;
  const sales = t?.sales ?? [];
  const orderSeries = t?.orders ?? [];
  const aovSeries = sales.map((s, i) => (orderSeries[i] ? s / orderSeries[i] : 0));
  const spark = sales.map((v) => ({ v }));
  const fc = month.data;

  const critical = openAlerts.filter((a) => a.severity === "critical").length;
  const warning = openAlerts.filter((a) => a.severity === "warning").length;
  const other = openAlerts.length - critical - warning;
  const attention = openAlerts.filter((a) => a.kind === "Critical Stock" || a.kind === "Low Stock");

  const asOf = m?.last_sync ? new Date(m.last_sync) : null;
  const stale = m?.sync_status === "Stale" && asOf;
  const salesLabel =
    period === "today" && stale
      ? `Sales on ${asOf.toLocaleDateString([], { day: "numeric", month: "short" })}`
      : (SALES_LABEL[period] ?? "Sales");

  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";
  const firstName = user?.full_name?.split(" ")[0] ?? "there";

  return (
    <div className="mx-auto max-w-xl pb-4">
      {isError && !m && <ErrorStrip onRetry={refetch} />}

      {/* Hero — sales + trend sparkline on deep forest. */}
      <section
        style={delay(0)}
        className={cn(
          ENTER,
          "relative overflow-hidden rounded-3xl bg-brand-forest p-5 text-white shadow-card mx-4 mb-4",
        )}
      >
        <div className="pointer-events-none absolute -right-16 -top-20 h-56 w-56 rounded-full bg-[#22c55e]/35 blur-3xl" />
        <div className="pointer-events-none absolute -bottom-24 -left-10 h-48 w-48 rounded-full bg-[#0f7a4c]/60 blur-3xl" />

        <div className="relative">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="flex-1 min-w-0">
              <h1 className="text-xl font-bold leading-tight">
                {greeting}, {firstName}!{" "}
                <span aria-hidden className="inline ml-1">
                  👋
                </span>
              </h1>
              <p className="text-[13px] text-white/70 mt-1">
                Here's how your restaurant is doing{PERIOD_PHRASE[range.kind]}.
              </p>
              <BranchPicker className="mt-1.5 text-white/80" />
            </div>
            <DropdownMenu>
              <DropdownMenuTrigger className="shrink-0 rounded-2xl border border-white/25 px-3 py-1.5 text-sm font-semibold text-white outline-none">
                {PERIOD_LABEL[range.kind]} <ChevronDown className="ml-1 inline-block h-4 w-4" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="min-w-40">
                {PERIOD_CHOICES.map((c) => (
                  <DropdownMenuItem
                    key={c.kind}
                    onSelect={() => setRange({ kind: c.kind })}
                    className="justify-between"
                  >
                    {c.label}
                    {range.kind === c.kind && <Check className="h-4 w-4 text-primary" />}
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Horizontal split: sales figures on the left, trend chart + callout on the right. */}
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white/70 mb-1.5">{salesLabel}</p>
              {isLoading ? (
                <Skeleton className="h-9 w-28 bg-white/15" />
              ) : (
                <p className="text-3xl font-extrabold leading-tight tracking-tight tabular-nums">
                  {fmtCurrency(m?.total_sales ?? 0, cur)}
                </p>
              )}
              <div className="mt-2 flex items-center gap-2">
                {m?.total_sales_delta_pct != null && (
                  <span
                    className={cn(
                      "inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[13px] font-bold",
                      m.total_sales_delta_pct >= 0
                        ? "bg-[#22c55e] text-white"
                        : "bg-red-500 text-white",
                    )}
                  >
                    {m.total_sales_delta_pct >= 0 ? "↑" : "↓"}{" "}
                    {Math.abs(m.total_sales_delta_pct).toFixed(0)}%
                  </span>
                )}
                <p className="text-[13px] text-white/70">{m?.compare_label ?? ""}</p>
              </div>
            </div>

            <div className="w-[42%] shrink-0">
              {m?.total_sales_delta_pct != null && (
                <div className="mb-1.5 flex items-center gap-1.5 rounded-xl bg-white px-2 py-1.5 text-left shadow-lg">
                  <span
                    className={cn(
                      "flex h-6 w-6 shrink-0 items-center justify-center rounded-full",
                      m.total_sales_delta_pct >= 0
                        ? "bg-green-100 text-green-600"
                        : "bg-red-100 text-red-600",
                    )}
                  >
                    <TrendingUp className="h-3.5 w-3.5" />
                  </span>
                  <div className="min-w-0 leading-tight text-foreground">
                    <p className="text-[10px] font-bold">
                      {m.total_sales_delta_pct >= 0 ? "Great!" : "Careful!"}
                    </p>
                    <p className="truncate text-[9px] text-muted-foreground">
                      Sales{" "}
                      <span
                        className={cn(
                          "font-semibold",
                          m.total_sales_delta_pct >= 0 ? "text-success" : "text-destructive",
                        )}
                      >
                        {m.total_sales_delta_pct >= 0 ? "up" : "down"}{" "}
                        {Math.abs(m.total_sales_delta_pct).toFixed(0)}%
                      </span>
                    </p>
                  </div>
                </div>
              )}
              <div className="h-14">
                {spark.length > 1 && (
                  <ResponsiveContainer width="100%" height="100%">
                    <ComposedChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                      <Bar
                        dataKey="v"
                        fill="rgba(255,255,255,0.16)"
                        radius={[2, 2, 0, 0]}
                        barSize={5}
                      />
                      <Line
                        type="monotone"
                        dataKey="v"
                        stroke="#86efac"
                        strokeWidth={2}
                        dot={false}
                        isAnimationActive
                      />
                    </ComposedChart>
                  </ResponsiveContainer>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Metric cards — 2x2 grid; every chart is that metric's own daily series. */}
      <div style={delay(1)} className={cn(ENTER, "mt-4 grid grid-cols-2 gap-3 px-4")}>
        <KpiCard
          to="/dashboard/pos"
          icon={ShoppingCart}
          iconTone="bg-green-100 text-green-700"
          label="Orders"
          value={m?.orders ?? "—"}
          valueClass="text-foreground"
          note={<Delta value={m?.orders_delta_pct} />}
          chart={<Spark values={orderSeries} stroke="#22c55e" id="kpiOrders" />}
        />
        <KpiCard
          to="/dashboard/pos"
          icon={Receipt}
          iconTone="bg-amber-100 text-amber-700"
          label="Avg. Order Value"
          value={m ? fmtCurrency(aov, cur) : "—"}
          note="per order"
          chart={<Spark values={aovSeries} stroke="#f59e0b" id="kpiAov" />}
        />
        <KpiCard
          to="/dashboard/food-cost"
          icon={Coins}
          iconTone="bg-red-100 text-red-700"
          label="Food Cost · 30 days"
          value={fc ? `${fc.food_cost_pct.toFixed(1)}%` : "—"}
          note={<Delta value={fc?.food_cost_pp_delta} suffix=" pts" good="down" />}
          chart={<Spark values={t?.food_cost_pct ?? []} stroke="#ef4444" id="kpiCost" />}
        />
        <KpiCard
          to="/dashboard/alerts"
          icon={Bell}
          iconTone="bg-blue-100 text-blue-700"
          label="Active Alerts"
          value={openAlerts.length}
          valueClass={
            critical > 0 ? "text-red-600" : warning > 0 ? "text-amber-600" : "text-green-600"
          }
          note={
            openAlerts.length === 0
              ? "All clear"
              : `${critical} critical · ${warning} warning${other ? ` · ${other} tip` : ""}`
          }
          chart={
            openAlerts.length > 0 && (
              <div className="flex h-full items-end">
                <div className="flex h-2 w-full overflow-hidden rounded-full bg-muted">
                  <span className="bg-red-500" style={{ flex: critical }} />
                  <span className="bg-amber-500" style={{ flex: warning }} />
                  <span className="bg-green-500" style={{ flex: other }} />
                </div>
              </div>
            )
          }
        />
      </div>

      {/* What needs your attention — live stock alerts (critical first). */}
      {canStock && (
        <div style={delay(2)} className={cn(ENTER, "mt-5 px-4")}>
          <SectionTitle
            right={
              <Link to="/dashboard/alerts" className="text-[12px] font-semibold text-primary">
                View all →
              </Link>
            }
          >
            What needs your attention?
          </SectionTitle>
          {isLoading ? (
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <Skeleton key={i} className="h-40 w-24 shrink-0 rounded-xl" />
              ))}
            </div>
          ) : attention.length === 0 ? (
            <EmptyNote>Nothing needs your attention — stock levels look healthy.</EmptyNote>
          ) : (
            <div className="scrollbar-none -mx-4 flex gap-2 overflow-x-auto px-4 pb-2">
              {attention.slice(0, 8).map((a) => (
                <Link
                  key={a.id}
                  to={a.to}
                  className={cn(CARD, "flex w-24 shrink-0 flex-col overflow-hidden rounded-xl")}
                >
                  <div className="relative h-24">
                    <ItemAvatar
                      name={a.title}
                      size="lg"
                      variant="photo"
                      className="h-24 w-full rounded-none text-[22px]"
                    />
                    <div
                      className={cn(
                        "absolute -left-1 -top-1 rounded-full p-1 ring-2 ring-white",
                        a.severity === "critical" ? "bg-red-600" : "bg-amber-500",
                      )}
                    >
                      <TriangleAlertIcon className="h-3 w-3 text-white" />
                    </div>
                  </div>
                  <div className="p-2">
                    <p className="line-clamp-2 text-xs font-semibold leading-tight">{a.title}</p>
                    <p
                      className={cn(
                        "mt-1 text-[10px] font-semibold",
                        a.severity === "critical" ? "text-red-600" : "text-amber-600",
                      )}
                    >
                      {a.detail}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          )}
          <PhotoCredit />
        </div>
      )}

      {/* Quick actions */}
      <div style={delay(3)} className={cn(ENTER, "mt-5 px-4")}>
        <SectionTitle
          right={
            <Link to="/dashboard/insights" className="text-primary text-[12px] font-semibold">
              See all
            </Link>
          }
        >
          Quick Actions
        </SectionTitle>
        <div className="grid grid-cols-5 gap-2">
          {QUICK.filter((q) => canOpenPage(q.page)).map(({ label, to, icon: Icon, tone }) => (
            <Link key={to} to={to} className="flex flex-col items-center gap-2">
              <span
                className={cn(
                  "flex h-14 w-14 items-center justify-center rounded-2xl transition-transform active:scale-90",
                  tone,
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={2} />
              </span>
              <span className="text-[10px] font-medium text-center text-muted-foreground line-clamp-2">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </div>

      {/* Get AI Insights */}
      <div
        style={delay(4)}
        className={cn(
          ENTER,
          "mt-6 mx-4 rounded-2xl bg-gradient-to-br from-brand-forest to-brand-forest/80 p-5 text-white",
        )}
      >
        <div className="flex gap-4">
          <div className="text-5xl">🤖</div>
          <div className="flex-1">
            <h3 className="text-lg font-bold">Get AI Insights</h3>
            <p className="text-sm text-white/80 mt-1">
              Discover wastage, slow moving items and ways to improve your profit.
            </p>
            <Link
              to="/dashboard/ai"
              className="inline-flex items-center gap-2 mt-3 px-4 py-2 rounded-full bg-white text-brand-forest text-sm font-semibold hover:bg-white/90 transition"
            >
              ✨ Ask Plate AI →
            </Link>
          </div>
        </div>
      </div>

      <SyncNote lastSync={m?.last_sync} />
    </div>
  );
}
