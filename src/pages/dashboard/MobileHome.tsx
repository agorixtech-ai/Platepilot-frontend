import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Area, AreaChart, Bar, ComposedChart, Line, ResponsiveContainer } from "recharts";
import {
  AlertTriangle,
  Bell,
  ChartColumn,
  ChevronDown,
  ChevronRight,
  Coins,
  FileText,
  Package,
  Receipt,
  ShoppingCart,
  Sparkles,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useAlerts } from "@/components/dashboard/useAlerts";
import {
  AlertRow,
  CARD,
  Delta,
  EmptyNote,
  ErrorStrip,
  SectionTitle,
  SyncNote,
} from "@/components/dashboard/MobileUI";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import { Skeleton } from "@/components/ui/skeleton";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { dashboardService } from "@/services/dashboardService";
import { canOpenPage, getStoredUser } from "@/lib/auth";
import { cn } from "@/lib/utils";

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

const AI_PROMPTS = ["Why did sales change?", "What should I reorder?", "Best sellers this week"];

/** Staggered entrance for each Home section. */
const ENTER = "animate-in fade-in slide-in-from-bottom-3 fill-mode-both duration-500";
const delay = (i: number) => ({ animationDelay: `${i * 70}ms` });

/** Daily Command Center — phone Home tab (desktop keeps Overview). */
export default function MobileHome() {
  const { alerts, metrics: m, isLoading, isError, refetch } = useAlerts();
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const user = getStoredUser();
  const period = rangeToPeriod(range);
  const trendPeriod = period === "today" ? "week" : period === "year" ? "year" : period;
  const canSales = canOpenPage("overview") || canOpenPage("pos");

  // Same query keys as MobileSales/Overview so the cache is shared.
  const trend = useQuery({
    queryKey: ["dashboard", "metrics-trend", trendPeriod, branch],
    queryFn: () => dashboardService.getMetricsTrend(trendPeriod, branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });
  const top = useQuery({
    queryKey: ["dashboard", "top-items", period, branch],
    queryFn: () => dashboardService.getTopItems(period, branch, 5),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });

  const cur = m?.currency ?? "AED";
  const aov = m && m.orders > 0 ? m.total_sales / m.orders : 0;
  const spark = (trend.data?.sales ?? []).map((v) => ({ v }));
  const critical = alerts.filter((a) => a.severity === "critical").length;
  const topItems = (top.data?.items ?? []).slice(0, 3);
  const topMax = Math.max(1, ...topItems.map((t) => t.revenue));

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
                Here's how your restaurant is doing today.
              </p>
            </div>
            <button
              className={cn(
                "shrink-0 px-3 py-1.5 rounded-2xl text-sm font-semibold border border-white/25 text-white",
              )}
            >
              Today <ChevronDown className="inline-block w-4 h-4 ml-1" />
            </button>
          </div>

          {/* Horizontal split: sales figures on the left, trend chart + callout on the right. */}
          <div className="flex items-start gap-3">
            <div className="min-w-0 flex-1">
              <p className="text-[13px] text-white/70 mb-1.5">Today's Sales</p>
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

      {/* Metric cards — 2x2 grid */}
      <div style={delay(1)} className={cn(ENTER, "mt-4 grid grid-cols-2 gap-3 px-4")}>
        {/* Orders Card */}
        <Link to="/dashboard/pos" className={cn(CARD, "p-4 flex flex-col")}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-green-100 text-green-700">
              <ShoppingCart className="h-5 w-5" />
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Orders</p>
          <p className="text-2xl font-bold mt-1">{m?.orders ?? "—"}</p>
          <Delta value={m?.orders_delta_pct} className="mt-2 text-xs" />
          <div className="mt-3 h-10">
            {spark.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="ordersChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#22c55e" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#22c55e" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#22c55e"
                    strokeWidth={1.5}
                    fill="url(#ordersChart)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Link>

        {/* Avg Order Value Card */}
        <Link to="/dashboard/pos" className={cn(CARD, "p-4 flex flex-col")}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-amber-100 text-amber-700">
              <Receipt className="h-5 w-5" />
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Avg. Order Value</p>
          <p className="text-2xl font-bold mt-1">{m ? fmtCurrency(aov, cur) : "—"}</p>
          <p className="text-xs text-muted-foreground mt-2">per order</p>
          <div className="mt-2 h-10">
            {spark.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="aovChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#f59e0b" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#f59e0b" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#f59e0b"
                    strokeWidth={1.5}
                    fill="url(#aovChart)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Link>

        {/* Food Cost Card */}
        <Link to="/dashboard/food-cost" className={cn(CARD, "p-4 flex flex-col")}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100 text-red-700">
              <Coins className="h-5 w-5" />
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Food Cost</p>
          <p className="text-2xl font-bold mt-1">{m ? `${m.food_cost_pct.toFixed(1)}%` : "—"}</p>
          <Delta value={m?.food_cost_pp_delta} suffix=" pts" good="down" className="mt-2 text-xs" />
          <div className="mt-2 h-10">
            {spark.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="costChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#ef4444" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#ef4444" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#ef4444"
                    strokeWidth={1.5}
                    fill="url(#costChart)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Link>

        {/* Active Alerts Card */}
        <Link to="/dashboard/alerts" className={cn(CARD, "p-4 flex flex-col")}>
          <div className="flex items-center justify-between mb-2">
            <span className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-100 text-blue-700">
              <Bell className="h-5 w-5" />
            </span>
            <ChevronRight className="h-4 w-4 text-muted-foreground" />
          </div>
          <p className="text-sm text-muted-foreground">Active Alerts</p>
          <p
            className={cn(
              "text-2xl font-bold mt-1",
              critical > 0 ? "text-red-600" : "text-green-600",
            )}
          >
            {critical}
          </p>
          <Link to="/dashboard/alerts" className="text-xs text-primary font-semibold mt-2">
            View all →
          </Link>
          <div className="mt-2 h-10">
            {spark.length > 1 && (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={spark} margin={{ top: 2, right: 0, bottom: 0, left: 0 }}>
                  <defs>
                    <linearGradient id="alertChart" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.3} />
                      <stop offset="100%" stopColor="#3b82f6" stopOpacity={0} />
                    </linearGradient>
                  </defs>
                  <Area
                    type="monotone"
                    dataKey="v"
                    stroke="#3b82f6"
                    strokeWidth={1.5}
                    fill="url(#alertChart)"
                    isAnimationActive
                  />
                </AreaChart>
              </ResponsiveContainer>
            )}
          </div>
        </Link>
      </div>

      {/* What needs your attention — inventory section */}
      <div style={delay(2)} className={cn(ENTER, "mt-5 px-4")}>
        <SectionTitle
          right={
            <Link to="/dashboard/inventory" className="text-[12px] font-semibold text-primary">
              View all →
            </Link>
          }
        >
          What needs your attention?
        </SectionTitle>
        <div className="overflow-x-auto -mx-4 px-4 pb-2 flex gap-2">
          {[
            { name: "Mozzarella Cheese", emoji: "🧀", status: "Out of stock" },
            { name: "Lettuce", emoji: "🥬", status: "Out of stock" },
            { name: "Pizza Dough", emoji: "🍞", status: "Out of stock" },
            { name: "Pizza Sauce", emoji: "🍅", status: "Out of stock" },
          ].map((item, idx) => (
            <div
              key={idx}
              className={cn(CARD, "flex flex-col flex-shrink-0 rounded-xl overflow-hidden w-24")}
            >
              <div className="relative bg-gray-100 h-24 flex items-center justify-center text-4xl">
                {item.emoji}
                <div className="absolute -left-1 -top-1 bg-red-600 rounded-full p-1 ring-2 ring-white">
                  <AlertTriangle className="h-3 w-3 text-white" />
                </div>
              </div>
              <div className="p-2">
                <p className="text-xs font-semibold line-clamp-2 leading-tight">{item.name}</p>
                <p className="text-[10px] text-red-600 font-semibold mt-1">{item.status}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div style={delay(3)} className={cn(ENTER, "mt-5 px-4")}>
        <SectionTitle
          right={
            <Link to="/dashboard" className="text-primary text-[12px] font-semibold">
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

/** Donut showing a 0–100% value (food cost). */
function Ring({ pct, bad }: { pct: number; bad: boolean }) {
  const r = 22;
  const c = 2 * Math.PI * r;
  const p = Math.min(100, Math.max(0, pct));
  return (
    <div className="relative h-14 w-14 shrink-0">
      <svg viewBox="0 0 56 56" className="h-full w-full -rotate-90">
        <circle cx="28" cy="28" r={r} fill="none" strokeWidth="6" className="stroke-muted" />
        <circle
          cx="28"
          cy="28"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeLinecap="round"
          strokeDasharray={c}
          strokeDashoffset={c * (1 - p / 100)}
          className={cn(
            "transition-[stroke-dashoffset] duration-700",
            bad ? "stroke-destructive" : "stroke-primary",
          )}
        />
      </svg>
      <span className="absolute inset-0 flex items-center justify-center text-[12px] font-bold tabular-nums">
        {p.toFixed(0)}%
      </span>
    </div>
  );
}
