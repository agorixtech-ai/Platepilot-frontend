import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import {
  BookOpen,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  Percent,
  ShoppingCart,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useAlerts } from "@/components/dashboard/useAlerts";
import { BranchPill } from "@/components/dashboard/MobileHeader";
import { Delta, PhotoCredit } from "@/components/dashboard/MobileUI";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { dashboardService } from "@/services/dashboardService";
import { canOpenPage } from "@/lib/auth";
import { cn } from "@/lib/utils";

/* Every stat and mini-visual on this screen comes from the same live queries as the
   screen it links to (identical query keys → shared cache, no duplicate requests).
   Rates use stable windows: sales = last 7 days, food cost / waste / menu = 30 days. */

const Pending = () => <span className="inline-block h-3 w-24 animate-pulse rounded bg-muted" />;

/** Last 7 days of sales as bars. */
function SalesSpark({ values }: { values: number[] }) {
  const max = Math.max(...values, 0);
  if (max <= 0) return null;
  return (
    <div className="flex h-12 w-20 items-end justify-end gap-1">
      {values.slice(-7).map((v, i) => (
        <div
          key={i}
          className="w-2.5 rounded-t-sm bg-success/70"
          style={{ height: `${Math.max(8, (v / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/** Food cost vs gross margin — the two always add to 100% of sales. */
function FoodCostRing({ foodPct, marginPct }: { foodPct: number; marginPct: number }) {
  const r = 16;
  const c = 2 * Math.PI * r;
  const food = Math.min(100, Math.max(0, foodPct));
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-11 w-11 shrink-0 -rotate-90">
        <circle cx="20" cy="20" r={r} fill="none" strokeWidth="6" className="stroke-emerald-400" />
        <circle
          cx="20"
          cy="20"
          r={r}
          fill="none"
          strokeWidth="6"
          strokeDasharray={`${(food / 100) * c} ${c}`}
          className="stroke-orange-400"
        />
      </svg>
      <div className="flex shrink-0 flex-col gap-0.5 text-[9px] leading-tight text-muted-foreground">
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-orange-400" />
          Food cost {foodPct.toFixed(0)}%
        </span>
        <span className="flex items-center gap-1">
          <span className="h-1.5 w-1.5 rounded-full bg-emerald-400" />
          Margin {marginPct.toFixed(0)}%
        </span>
      </div>
    </div>
  );
}

/** The costliest over-purchased ingredients, as bars. */
function WasteBars({ costs }: { costs: number[] }) {
  const max = Math.max(...costs, 0);
  if (max <= 0) return null;
  return (
    <div className="flex h-11 w-20 items-end justify-end gap-1.5">
      {costs.slice(0, 5).map((c, i) => (
        <div
          key={i}
          className="w-3 rounded-t-sm bg-destructive/70"
          style={{ height: `${Math.max(10, (c / max) * 100)}%` }}
        />
      ))}
    </div>
  );
}

/** Real item names, overlapped like avatars. */
function ItemStack({ names }: { names: string[] }) {
  if (names.length === 0) return <CheckCircle2 className="h-8 w-8 text-success" />;
  return (
    <div className="flex -space-x-3">
      {names.slice(0, 3).map((n) => (
        <ItemAvatar
          key={n}
          name={n}
          size="lg"
          variant="photo"
          className="rounded-full border-2 border-white shadow-sm"
        />
      ))}
    </div>
  );
}

/** Top dishes by revenue, bar = share of the best seller. */
function DishBars({ dishes }: { dishes: { name: string; revenue: number }[] }) {
  const max = Math.max(...dishes.map((d) => d.revenue), 1);
  return (
    <div className="flex w-28 flex-col gap-1.5">
      {dishes.slice(0, 3).map((d) => (
        <div key={d.name} className="flex flex-col gap-0.5">
          <span className="truncate text-[9px] font-medium leading-none text-foreground">
            {d.name}
          </span>
          <span className="h-1 rounded-full bg-muted">
            <span
              className="block h-1 rounded-full bg-success"
              style={{ width: `${Math.max(6, (d.revenue / max) * 100)}%` }}
            />
          </span>
        </div>
      ))}
    </div>
  );
}

/** Branch names with their fixed identity colour. */
function BranchDots({ branches }: { branches: { name: string; color: string }[] }) {
  return (
    <div className="flex w-24 flex-col gap-1">
      {branches.slice(0, 4).map((b) => (
        <span key={b.name} className="flex items-center gap-1.5 text-[9px] text-foreground">
          <span className="h-2 w-2 shrink-0 rounded-full" style={{ backgroundColor: b.color }} />
          <span className="truncate">{b.name}</span>
        </span>
      ))}
    </div>
  );
}

/** Items that need buying now. */
function BuyList({ names }: { names: string[] }) {
  if (names.length === 0) {
    return <span className="text-[10px] font-medium text-success">Nothing to reorder</span>;
  }
  return (
    <div className="flex w-24 flex-col gap-1">
      {names.slice(0, 4).map((n) => (
        <span key={n} className="flex items-center gap-1.5 text-[9px] text-foreground">
          <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-destructive" />
          <span className="truncate">{n}</span>
        </span>
      ))}
    </div>
  );
}

type Row = {
  icon: LucideIcon;
  title: string;
  sub: string;
  to: string;
  page: string;
  tone: string;
  iconTone: string;
  stat: ReactNode;
  visual: ReactNode;
};

export default function Insights() {
  const { branch, branches, locations } = useBranchFilter();
  const { alerts, isLoading: stockLoading } = useAlerts();
  const canSales = canOpenPage("overview") || canOpenPage("pos");
  const canWaste = canOpenPage("overview") || canOpenPage("inventory") || canOpenPage("menu");

  const week = useQuery({
    queryKey: ["dashboard", "metrics", "week", branch],
    queryFn: () => dashboardService.getMetrics("week", branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });
  const month = useQuery({
    queryKey: ["dashboard", "metrics", "month", branch],
    queryFn: () => dashboardService.getMetrics("month", branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });
  const trend = useQuery({
    queryKey: ["dashboard", "metrics-trend", "week", branch],
    queryFn: () => dashboardService.getMetricsTrend("week", branch),
    enabled: canSales,
    ...DASHBOARD_LIVE_QUERY,
  });
  const waste = useQuery({
    queryKey: ["dashboard", "waste-composition", "month", branch],
    queryFn: () => dashboardService.getWasteComposition("month", branch, 10),
    enabled: canWaste,
    ...DASHBOARD_LIVE_QUERY,
  });
  const menu = useQuery({
    queryKey: ["dashboard", "menu-engineering", "month", branch],
    queryFn: () => dashboardService.getMenuEngineering("month", branch),
    enabled: canOpenPage("menu-engineering"),
    ...DASHBOARD_LIVE_QUERY,
  });

  const stockAlerts = alerts.filter((a) => a.kind === "Critical Stock" || a.kind === "Low Stock");
  const buyNow = stockAlerts.filter((a) => a.severity === "critical");
  const w = week.data;
  const mo = month.data;
  const wc = waste.data;
  const dishes = [...(menu.data?.items ?? [])].sort((a, b) => b.revenue - a.revenue);
  const stars = dishes.filter((d) => d.quadrant === "star").length;

  const rows: Row[] = [
    {
      icon: TrendingUp,
      title: "Sales",
      sub: "Trends, branches, products, channels",
      to: "/dashboard/pos",
      page: "pos",
      tone: "bg-success/10",
      iconTone: "bg-success/15 text-success",
      stat: week.isLoading ? (
        <Pending />
      ) : w ? (
        <span className="flex flex-wrap items-center gap-x-1.5">
          <span className="font-bold text-foreground">
            {fmtCurrency(w.total_sales, w.currency)}
          </span>
          {w.total_sales_delta_pct != null ? (
            <>
              <Delta value={w.total_sales_delta_pct} />
              <span>{w.compare_label}</span>
            </>
          ) : (
            <span>last 7 days</span>
          )}
        </span>
      ) : (
        "No sales data yet"
      ),
      visual: <SalesSpark values={trend.data?.sales ?? []} />,
    },
    {
      icon: Percent,
      title: "Food Cost",
      sub: "Food cost and variance",
      to: "/dashboard/food-cost",
      page: "overview",
      tone: "bg-warning/10",
      iconTone: "bg-warning/20 text-warning-dark",
      stat: month.isLoading ? (
        <Pending />
      ) : mo ? (
        <span className="flex flex-wrap items-center gap-x-1.5">
          <span className="font-bold text-foreground">{mo.food_cost_pct.toFixed(1)}%</span>
          {mo.food_cost_pp_delta != null ? (
            <>
              <Delta value={mo.food_cost_pp_delta} suffix=" pts" good="down" />
              <span>vs last month</span>
            </>
          ) : (
            <span>last 30 days</span>
          )}
        </span>
      ) : (
        "No data yet"
      ),
      visual: mo ? (
        <FoodCostRing foodPct={mo.food_cost_pct} marginPct={mo.gross_margin_pct} />
      ) : null,
    },
    {
      icon: Package,
      title: "Inventory",
      sub: "Stock status and movement",
      to: "/dashboard/inventory",
      page: "inventory",
      tone: "bg-info/10",
      iconTone: "bg-info/15 text-info",
      stat: stockLoading ? (
        <Pending />
      ) : stockAlerts.length ? (
        <span>
          <span className="font-bold text-destructive">{stockAlerts.length}</span> items low or out
          of stock
        </span>
      ) : (
        <span className="font-semibold text-success">All items in stock</span>
      ),
      visual: stockLoading ? null : <ItemStack names={stockAlerts.map((a) => a.title)} />,
    },
    {
      icon: BookOpen,
      title: "Menu",
      sub: "Profitability and popularity",
      to: "/dashboard/menu-engineering",
      page: "menu-engineering",
      tone: "bg-success/10",
      iconTone: "bg-success/15 text-success",
      stat: menu.isLoading ? (
        <Pending />
      ) : dishes.length ? (
        <span>
          <span className="font-bold text-success">{stars}</span> star dishes of {dishes.length}
        </span>
      ) : (
        "No dishes yet"
      ),
      visual: dishes.length ? (
        <DishBars dishes={dishes.map((d) => ({ name: d.dish, revenue: d.revenue }))} />
      ) : null,
    },
    {
      icon: Trash2,
      title: "Waste",
      sub: "Waste trends and financial impact",
      to: "/dashboard/waste",
      page: "inventory",
      tone: "bg-destructive/10",
      iconTone: "bg-destructive/15 text-destructive",
      stat: waste.isLoading ? (
        <Pending />
      ) : wc ? (
        <span>
          <span className="font-bold text-destructive">
            {fmtCurrency(wc.total_cost, wc.currency)}
          </span>{" "}
          over recipe · {wc.over_count} ingredients
        </span>
      ) : (
        "No data yet"
      ),
      visual: wc ? <WasteBars costs={wc.items.map((i) => i.cost)} /> : null,
    },
    {
      icon: MapPin,
      title: "Branches",
      sub: "Compare your locations",
      to: "/dashboard/branches",
      page: "branches",
      tone: "bg-indigo-500/10",
      iconTone: "bg-indigo-500/15 text-indigo-600",
      stat: (
        <span className="font-bold text-indigo-600">
          {branches.length} branch{branches.length === 1 ? "" : "es"}
        </span>
      ),
      visual: locations.length ? <BranchDots branches={locations} /> : null,
    },
    {
      icon: ShoppingCart,
      title: "Purchasing",
      sub: "What to order and why",
      to: "/dashboard/purchasing",
      page: "inventory",
      tone: "bg-success/10",
      iconTone: "bg-success/15 text-success",
      stat: stockLoading ? (
        <Pending />
      ) : buyNow.length ? (
        <span>
          <span className="font-bold text-destructive">{buyNow.length}</span> items to buy now
        </span>
      ) : (
        <span className="font-semibold text-success">Nothing to reorder</span>
      ),
      visual: stockLoading ? null : <BuyList names={buyNow.map((a) => a.title)} />,
    },
  ];

  return (
    <div className="mx-auto max-w-xl px-4 pb-4">
      {/* Header — title + subtitle with a faint decorative skyline. */}
      <div className="relative overflow-hidden pt-5 pb-4">
        <div className="pointer-events-none absolute -right-2 top-2 flex items-end gap-1.5 opacity-15">
          {[16, 28, 40, 52, 64].map((h, i) => (
            <div key={i} className="w-3 rounded-t-sm bg-success" style={{ height: h }} />
          ))}
        </div>
        <div className="relative flex items-start justify-between gap-3">
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Insights</h1>
          <BranchPill className="mt-1" />
        </div>
        <p className="mt-1 max-w-[75%] text-[13px] text-muted-foreground">
          Get deeper insights to run your restaurant better.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {rows
          .filter((r) => canOpenPage(r.page))
          .map((r) => (
            <Link
              key={r.to}
              to={r.to}
              className={cn("flex items-center gap-3 rounded-2xl p-4", r.tone)}
            >
              <span
                className={cn(
                  "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                  r.iconTone,
                )}
              >
                <r.icon className="h-5 w-5" />
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-[16px] font-bold leading-tight text-foreground">{r.title}</p>
                <p className="text-[12px] leading-snug text-muted-foreground">{r.sub}</p>
                <div className="mt-1 text-[12px] text-muted-foreground">{r.stat}</div>
              </div>
              <div className="flex shrink-0 items-center gap-1">
                {r.visual}
                <ChevronRight className="h-4 w-4 text-muted-foreground" />
              </div>
            </Link>
          ))}
      </div>
      <PhotoCredit />
    </div>
  );
}
