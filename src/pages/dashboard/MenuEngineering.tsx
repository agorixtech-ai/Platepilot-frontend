import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  AlertTriangle,
  ChevronRight,
  Eye,
  Lightbulb,
  RefreshCw,
  Search,
  Star,
  TriangleAlert,
  UtensilsCrossed,
  Wallet,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { fmtCurrency } from "@/components/dashboard/shared";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { dashboardService, type MenuEngineeringItem } from "@/services/dashboardService";

const TIER = {
  star: {
    label: "Keep & Promote",
    short: "Stars",
    icon: Star,
    hint: "Sells well and makes strong profit.",
    action: "Feature it and train staff to recommend it.",
    className: "border-success/30 bg-success/10 text-success",
    chip: "bg-success/10 text-success border-success/20",
  },
  plow_horse: {
    label: "Optimize Price",
    short: "Optimize",
    icon: Wallet,
    hint: "Popular, but profit per plate can improve.",
    action: "Review price, portion size, or supplier cost.",
    className: "border-info/30 bg-info/10 text-info",
    chip: "bg-info/10 text-info border-info/20",
  },
  puzzle: {
    label: "Boost Visibility",
    short: "Boost",
    icon: Eye,
    hint: "Profitable, but rarely ordered.",
    action: "Promote it, add a photo, or pair in a combo.",
    className: "border-warning/30 bg-warning/10 text-warning",
    chip: "bg-warning/10 text-warning border-warning/20",
  },
  dog: {
    label: "Reconsider",
    short: "Reconsider",
    icon: AlertTriangle,
    hint: "Low sales and low profit.",
    action: "Rework the recipe, change sourcing, or remove it.",
    className: "border-destructive/30 bg-destructive/10 text-destructive",
    chip: "bg-destructive/10 text-destructive border-destructive/20",
  },
} as const;

type Tier = keyof typeof TIER;

function TierBadge({ tier }: { tier: Tier }) {
  const config = TIER[tier];
  const Icon = config.icon;
  return (
    <Badge
      variant="outline"
      className={cn("gap-1 border px-2 py-0.5 text-[10px] font-semibold", config.className)}
    >
      <Icon className="h-3 w-3" />
      {config.label}
    </Badge>
  );
}

function recommendationCopy(item: MenuEngineeringItem) {
  const raise = Math.max(1, Math.round(item.price * 0.08));
  const monthlyGain = raise * item.sold_30d;
  if (item.quadrant === "star") {
    return "Keep the price steady. Feature this dish and upsell it.";
  }
  if (item.quadrant === "plow_horse") {
    return `A ${fmtCurrency(raise)} price increase could add about ${fmtCurrency(monthlyGain)} over 30 days at current sales.`;
  }
  if (item.quadrant === "puzzle") {
    return "Don't discount first. Make it easier to notice and pair it with a popular item.";
  }
  return "Review the recipe and supplier cost first; if neither improves, consider removing it.";
}

function DishDialog({ dish, onClose }: { dish: MenuEngineeringItem | null; onClose: () => void }) {
  if (!dish) return null;
  const config = TIER[dish.quadrant];

  return (
    <Dialog open={!!dish} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md gap-4">
        <DialogHeader>
          <div className="flex items-start gap-3">
            <ItemAvatar name={dish.dish} size="sm" variant="photo" />
            <div className="min-w-0 flex-1">
              <DialogTitle className="text-base font-bold text-foreground">{dish.dish}</DialogTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">{dish.category}</p>
            </div>
            <TierBadge tier={dish.quadrant} />
          </div>
        </DialogHeader>

        <div className="grid grid-cols-2 gap-2">
          {[
            ["Price", fmtCurrency(dish.price)],
            ["Cost", fmtCurrency(dish.cost)],
            ["Profit / plate", fmtCurrency(dish.gross_profit)],
            ["Sold (30d)", dish.sold_30d.toLocaleString()],
          ].map(([label, value]) => (
            <div key={label} className="rounded-lg border border-border/50 bg-muted/30 px-3 py-2.5">
              <p className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
                {label}
              </p>
              <p className="mt-0.5 text-sm font-bold tabular-nums text-foreground">{value}</p>
            </div>
          ))}
        </div>

        <div className="rounded-xl border border-primary/20 bg-primary/5 p-3.5">
          <div className="flex items-start gap-2">
            <Lightbulb className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
            <div>
              <p className="text-xs font-bold text-foreground">{config.label}</p>
              <p className="mt-1 text-xs leading-relaxed text-muted-foreground">
                {recommendationCopy(dish)}
              </p>
              <p className="mt-2 text-[11px] font-semibold text-primary">Next: {config.action}</p>
            </div>
          </div>
        </div>

        {dish.ingredients.length > 0 && (
          <div>
            <p className="mb-2 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
              Recipe ({dish.ingredients.length})
            </p>
            <div className="max-h-48 divide-y divide-border/40 overflow-y-auto rounded-lg border border-border/50">
              {dish.ingredients.map((ing) => (
                <div key={ing.name} className="flex items-center gap-2 px-3 py-2">
                  <span className="min-w-0 flex-1 truncate text-xs font-medium text-foreground">
                    {ing.name}
                  </span>
                  <span className="shrink-0 text-xs tabular-nums text-muted-foreground">
                    {ing.qty.toLocaleString()} {ing.unit}
                  </span>
                  <span className="w-14 shrink-0 text-right text-xs font-semibold tabular-nums text-foreground">
                    {fmtCurrency(ing.cost_aed)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
}

export default function MenuEngineeringPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<Tier | null>(null);
  const [selected, setSelected] = useState<MenuEngineeringItem | null>(null);
  const { branch } = useBranchFilter();

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard", "menu-engineering", branch],
    queryFn: () => dashboardService.getMenuEngineering(branch),
  });

  const all = useMemo(() => data?.items ?? [], [data?.items]);

  const counts = useMemo(() => {
    const next = { star: 0, plow_horse: 0, puzzle: 0, dog: 0 };
    for (const item of all) next[item.quadrant] += 1;
    return next;
  }, [all]);

  const items = useMemo(() => {
    const q = search.trim().toLowerCase();
    return all
      .filter((item) => {
        const matchesFilter = !filter || item.quadrant === filter;
        const matchesSearch =
          !q || item.dish.toLowerCase().includes(q) || item.category.toLowerCase().includes(q);
        return matchesFilter && matchesSearch;
      })
      .sort((a, b) => b.sold_30d - a.sold_30d);
  }, [all, filter, search]);

  const filters: { label: string; tier: Tier | null }[] = [
    { label: "All", tier: null },
    { label: "Keep & Promote", tier: "star" },
    { label: "Optimize", tier: "plow_horse" },
    { label: "Boost", tier: "puzzle" },
    { label: "Reconsider", tier: "dog" },
  ];

  return (
    <div className="mx-auto max-w-[1600px] space-y-5">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="flex items-center gap-2 text-xl font-bold tracking-tight text-foreground">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Menu Engineering
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            What to keep, fix, promote, or drop — based on the last 30 days
            {branch !== "all" ? ` · ${branch}` : ""}.
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="gap-1.5 self-start"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
          Refresh
        </Button>
      </div>

      <section className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {(Object.keys(TIER) as Tier[]).map((tier) => {
          const config = TIER[tier];
          const Icon = config.icon;
          const active = filter === tier;
          return (
            <button
              key={tier}
              type="button"
              onClick={() => setFilter(active ? null : tier)}
              className={cn(
                "rounded-xl border px-4 py-3 text-left transition-colors",
                active ? config.chip : "border-border/60 bg-card hover:bg-muted/40",
              )}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-semibold text-muted-foreground">{config.short}</span>
                <Icon className={cn("h-3.5 w-3.5", active ? undefined : "text-muted-foreground")} />
              </div>
              <p className="mt-1.5 text-2xl font-bold tabular-nums text-foreground">
                {counts[tier]}
              </p>
              <p className="mt-1 text-[11px] leading-snug text-muted-foreground">{config.hint}</p>
            </button>
          );
        })}
      </section>

      <Card className="border-border/60 bg-card shadow-sm">
        <CardHeader className="gap-3 border-b border-border/40 px-5 pb-3 pt-4">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-sm font-bold text-foreground">Dishes</CardTitle>
              <p className="mt-0.5 text-xs text-muted-foreground">
                {items.length} of {all.length} shown · tap a row for the recommendation
              </p>
            </div>
            <div className="relative">
              <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search dishes…"
                className="h-8 w-full pl-8 text-xs sm:w-52"
              />
            </div>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {filters.map(({ label, tier }) => (
              <button
                key={label}
                type="button"
                onClick={() => setFilter(tier)}
                className={cn(
                  "rounded-full border px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  filter === tier
                    ? "border-primary bg-primary text-primary-foreground"
                    : "border-border/60 text-muted-foreground hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-2 pt-0">
          {isLoading ? (
            <div className="space-y-2 px-5 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={TriangleAlert}
              title="Couldn't load your menu"
              description="Check that the backend is running, then retry."
              action={{ label: "Retry", onClick: () => refetch() }}
            />
          ) : !items.length ? (
            <EmptyState
              icon={UtensilsCrossed}
              title={all.length ? "No dishes match this view" : "No menu data yet"}
              description={
                all.length
                  ? "Try another filter or search term."
                  : "Dishes will appear here once POS sales are synced."
              }
            />
          ) : (
            <>
              <div className="hidden overflow-x-auto md:block">
                <table className="w-full min-w-[720px] text-left">
                  <thead>
                    <tr className="border-b border-border/40 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                      <th className="px-5 py-2.5">Dish</th>
                      <th className="px-3 py-2.5">Category</th>
                      <th className="px-3 py-2.5 text-right">Price</th>
                      <th className="px-3 py-2.5 text-right">Sold (30d)</th>
                      <th className="px-3 py-2.5">Action</th>
                      <th className="px-3 py-2.5" />
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((item) => (
                      <tr
                        key={item.id}
                        onClick={() => setSelected(item)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter" || e.key === " ") {
                            e.preventDefault();
                            setSelected(item);
                          }
                        }}
                        role="button"
                        tabIndex={0}
                        className="cursor-pointer border-b border-border/20 transition-colors last:border-0 hover:bg-muted/40 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-inset focus-visible:ring-ring"
                      >
                        <td className="px-5 py-3">
                          <div className="flex items-center gap-2.5">
                            <ItemAvatar name={item.dish} size="sm" variant="photo" />
                            <span className="text-sm font-semibold text-foreground">
                              {item.dish}
                            </span>
                          </div>
                        </td>
                        <td className="px-3 py-3 text-xs text-muted-foreground">{item.category}</td>
                        <td className="px-3 py-3 text-right text-sm font-semibold tabular-nums">
                          {fmtCurrency(item.price)}
                        </td>
                        <td className="px-3 py-3 text-right text-sm tabular-nums">
                          {item.sold_30d.toLocaleString()}
                        </td>
                        <td className="px-3 py-3">
                          <TierBadge tier={item.quadrant} />
                        </td>
                        <td className="px-3 py-3">
                          <ChevronRight className="ml-auto h-4 w-4 text-muted-foreground" />
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              <div className="space-y-2 p-3 md:hidden">
                {items.map((item) => (
                  <button
                    key={item.id}
                    type="button"
                    onClick={() => setSelected(item)}
                    className="w-full rounded-xl border border-border/60 p-3 text-left transition-colors hover:bg-muted/40"
                  >
                    <div className="flex items-start gap-2.5">
                      <ItemAvatar name={item.dish} size="sm" variant="photo" />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0">
                            <p className="truncate text-sm font-bold text-foreground">
                              {item.dish}
                            </p>
                            <p className="mt-0.5 text-xs text-muted-foreground">{item.category}</p>
                          </div>
                          <TierBadge tier={item.quadrant} />
                        </div>
                        <div className="mt-3 grid grid-cols-2 gap-2 text-xs">
                          <span>
                            <b className="block text-sm text-foreground">
                              {fmtCurrency(item.price)}
                            </b>
                            Price
                          </span>
                          <span>
                            <b className="block text-sm text-foreground">{item.sold_30d}</b>
                            Sold
                          </span>
                        </div>
                      </div>
                    </div>
                  </button>
                ))}
              </div>
            </>
          )}
        </CardContent>
      </Card>

      <DishDialog dish={selected} onClose={() => setSelected(null)} />
    </div>
  );
}
