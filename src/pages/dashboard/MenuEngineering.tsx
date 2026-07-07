import { useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import {
  ChevronRight,
  RefreshCw,
  Search,
  UtensilsCrossed,
  Scale,
  TrendingUp,
  Crown,
  TriangleAlert,
  Trash2,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { EmptyState } from "@/components/ui/empty-state";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { fmtCurrency } from "@/components/dashboard/shared";
import { dashboardService, type MenuEngineeringItem } from "@/services/dashboardService";

const QUADRANT_CONFIG = {
  star: {
    label: "Star",
    className: "bg-success/15 text-success border-success/30",
    hint: "High margin · high sales",
  },
  plow_horse: {
    label: "Plow Horse",
    className: "bg-info/15 text-info border-info/30",
    hint: "Popular but low margin",
  },
  puzzle: {
    label: "Puzzle",
    className: "bg-warning/15 text-warning border-warning/30",
    hint: "Profitable but slow-selling",
  },
  dog: {
    label: "Dog",
    className: "bg-destructive/15 text-destructive border-destructive/30",
    hint: "Low margin · low sales",
  },
} as const;

type Quadrant = keyof typeof QUADRANT_CONFIG;

function QuadrantBadge({ quadrant }: { quadrant: Quadrant }) {
  const cfg = QUADRANT_CONFIG[quadrant];
  return (
    <Badge
      variant="outline"
      className={cn("border px-1.5 py-0 text-[9px] font-bold uppercase", cfg.className)}
    >
      {cfg.label}
    </Badge>
  );
}

/** Recipe detail: per-portion ingredient quantities for the selected dish. */
function RecipeDialog({
  dish,
  onClose,
}: {
  dish: MenuEngineeringItem | null;
  onClose: () => void;
}) {
  return (
    <Dialog open={!!dish} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="max-w-md">
        {dish && (
          <>
            <DialogHeader>
              <div className="flex items-center gap-3">
                <ItemAvatar name={dish.dish} size="sm" variant="photo" />
                <div className="min-w-0">
                  <DialogTitle className="text-[15px] font-bold text-foreground">
                    {dish.dish}
                  </DialogTitle>
                  <p className="mt-0.5 text-[11px] text-muted-foreground">
                    {dish.category} · {QUADRANT_CONFIG[dish.quadrant].hint}
                  </p>
                </div>
                <div className="ml-auto shrink-0">
                  <QuadrantBadge quadrant={dish.quadrant} />
                </div>
              </div>
            </DialogHeader>

            <div className="grid grid-cols-3 gap-2">
              {[
                { label: "Menu price", value: fmtCurrency(dish.price) },
                { label: "Portion cost", value: fmtCurrency(dish.cost) },
                { label: "Margin", value: `${dish.margin_pct.toFixed(1)}%` },
                { label: "Sold (30d)", value: dish.sold_30d.toLocaleString() },
                {
                  label: "Wasted (30d)",
                  value: `${dish.waste_qty_30d.toLocaleString()} u`,
                  tone: "text-destructive",
                },
                {
                  label: "Waste cost",
                  value: fmtCurrency(dish.waste_cost_30d),
                  tone: "text-destructive",
                },
              ].map((kpi) => (
                <div
                  key={kpi.label}
                  className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2"
                >
                  <p className="text-[9px] font-semibold uppercase text-muted-foreground">
                    {kpi.label}
                  </p>
                  <p
                    className={cn(
                      "text-[13px] font-bold tabular-nums",
                      kpi.tone ?? "text-foreground",
                    )}
                  >
                    {kpi.value}
                  </p>
                </div>
              ))}
            </div>

            <div>
              <p className="mb-1.5 text-[10px] font-bold uppercase tracking-wider text-muted-foreground">
                Quantities required per portion
              </p>
              <div className="divide-y divide-border/30 rounded-lg border border-border/40">
                {dish.ingredients.map((ing) => (
                  <div key={ing.name} className="flex items-center gap-2 px-3 py-2">
                    <span className="min-w-0 flex-1 truncate text-[11.5px] font-medium text-foreground">
                      {ing.name}
                    </span>
                    <span className="shrink-0 text-[11.5px] font-bold tabular-nums text-foreground">
                      {ing.qty.toLocaleString()} {ing.unit}
                    </span>
                    <span className="w-16 shrink-0 text-right text-[10.5px] tabular-nums text-muted-foreground">
                      {fmtCurrency(ing.cost_aed)}
                    </span>
                  </div>
                ))}
                <div className="flex items-center justify-between bg-muted/30 px-3 py-2">
                  <span className="text-[11px] font-bold text-foreground">
                    Total ingredient cost
                  </span>
                  <span className="text-[11.5px] font-black tabular-nums text-foreground">
                    {fmtCurrency(dish.cost)}
                  </span>
                </div>
              </div>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}

function MenuEngineeringPage() {
  const [search, setSearch] = useState("");
  const [quadrantFilter, setQuadrantFilter] = useState<Quadrant | null>(null);
  const [selected, setSelected] = useState<MenuEngineeringItem | null>(null);

  const { data, isLoading, isError, refetch, isFetching } = useQuery({
    queryKey: ["dashboard", "menu-engineering"],
    queryFn: () => dashboardService.getMenuEngineering(),
  });

  const items = useMemo(() => {
    const all = data?.items ?? [];
    return all
      .filter((i) => {
        if (quadrantFilter && i.quadrant !== quadrantFilter) return false;
        if (search) {
          const q = search.toLowerCase();
          if (!i.dish.toLowerCase().includes(q) && !i.category.toLowerCase().includes(q))
            return false;
        }
        return true;
      })
      .sort((a, b) => b.sold_30d - a.sold_30d);
  }, [data, search, quadrantFilter]);

  const all = data?.items ?? [];
  const avgMargin = all.length
    ? all.reduce((sum, i) => sum + i.margin_pct, 0) / all.length
    : 0;
  const starCount = all.filter((i) => i.quadrant === "star").length;
  const dogCount = all.filter((i) => i.quadrant === "dog").length;

  return (
    <div className="space-y-5">
      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-[20px] font-bold tracking-tight text-foreground flex items-center gap-2">
            <UtensilsCrossed className="h-5 w-5 text-primary" />
            Menu Engineering
          </h1>
          <p className="mt-0.5 text-[12px] text-muted-foreground">
            Dish profitability vs popularity — click a dish for the quantities its recipe requires
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => refetch()}
          disabled={isFetching}
          className="text-[11px]"
        >
          <RefreshCw className={cn("h-3.5 w-3.5", isFetching && "animate-spin")} />
        </Button>
      </div>

      {/* ── KPI Row ──────────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 gap-3 lg:grid-cols-4">
        {[
          {
            label: "DISHES ON MENU",
            value: all.length ? String(all.length) : "…",
            icon: UtensilsCrossed,
            tone: "bg-primary/15 text-primary",
          },
          {
            label: "AVG MARGIN",
            value: all.length ? `${avgMargin.toFixed(1)}%` : "…",
            icon: Scale,
            tone: "bg-info/15 text-info",
          },
          {
            label: "STARS",
            value: all.length ? String(starCount) : "…",
            icon: Crown,
            tone: "bg-success/15 text-success",
          },
          {
            label: "DOGS",
            value: all.length ? String(dogCount) : "…",
            icon: TriangleAlert,
            tone: "bg-destructive/15 text-destructive",
          },
        ].map((kpi) => (
          <Card key={kpi.label} className="border border-border/60 bg-card shadow-sm">
            <CardContent className="flex items-center gap-3 p-4">
              <div
                className={cn(
                  "flex h-9 w-9 shrink-0 items-center justify-center rounded-xl",
                  kpi.tone,
                )}
              >
                <kpi.icon className="h-4 w-4" />
              </div>
              <div className="min-w-0">
                <p className="text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
                  {kpi.label}
                </p>
                <p className="text-[17px] font-black tabular-nums text-foreground">{kpi.value}</p>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* ── Dish list ────────────────────────────────────────────────── */}
      <Card className="border border-border/60 bg-card shadow-sm">
        <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <CardTitle className="text-[13px] font-bold text-foreground">Menu items</CardTitle>
              <p className="mt-0.5 text-[10px] text-muted-foreground">
                Sorted by 30-day sales · classification vs menu medians
              </p>
            </div>
            <div className="flex flex-wrap items-center gap-1.5">
              {(Object.keys(QUADRANT_CONFIG) as Quadrant[]).map((q) => (
                <button
                  key={q}
                  onClick={() => setQuadrantFilter(quadrantFilter === q ? null : q)}
                  aria-pressed={quadrantFilter === q}
                  className={cn(
                    "rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase transition-colors",
                    quadrantFilter === q
                      ? QUADRANT_CONFIG[q].className
                      : "border-border/60 text-muted-foreground hover:text-foreground",
                  )}
                >
                  {QUADRANT_CONFIG[q].label}
                </button>
              ))}
              <div className="relative">
                <Search className="pointer-events-none absolute left-2.5 top-1/2 h-3.5 w-3.5 -translate-y-1/2 text-muted-foreground" />
                <Input
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search dishes…"
                  className="h-8 w-44 pl-8 text-[11.5px]"
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="px-0 pb-2 pt-0">
          {isLoading ? (
            <div className="space-y-2 px-5 py-4">
              {Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="h-11 animate-pulse rounded bg-secondary" />
              ))}
            </div>
          ) : isError ? (
            <EmptyState
              icon={TriangleAlert}
              title="Couldn't load the menu"
              description="Check that the backend is running, then retry"
              action={{ label: "Retry", onClick: () => refetch() }}
            />
          ) : !items.length ? (
            <EmptyState
              icon={UtensilsCrossed}
              title={all.length ? "No dishes match the current filters" : "No menu data yet"}
              description={
                all.length
                  ? "Clear the search or quadrant filter to see the full menu"
                  : "Dishes will appear here once recipes are synced"
              }
            />
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full min-w-[720px] text-left">
                <thead>
                  <tr className="border-b border-border/40 text-[9.5px] font-bold uppercase tracking-wider text-muted-foreground">
                    <th className="px-5 py-2.5">Dish</th>
                    <th className="px-3 py-2.5">Category</th>
                    <th className="px-3 py-2.5 text-right">Price</th>
                    <th className="px-3 py-2.5 text-right">Cost</th>
                    <th className="px-3 py-2.5 text-right">Margin</th>
                    <th className="px-3 py-2.5 text-right">Sold (30d)</th>
                    <th className="px-3 py-2.5 text-right">Wasted (30d)</th>
                    <th className="px-3 py-2.5">Class</th>
                    <th className="px-3 py-2.5" />
                  </tr>
                </thead>
                <tbody>
                  {items.map((item) => (
                    <tr
                      key={item.id}
                      onClick={() => setSelected(item)}
                      className="cursor-pointer border-b border-border/20 transition-colors last:border-0 hover:bg-muted/40"
                    >
                      <td className="px-5 py-2.5">
                        <div className="flex items-center gap-2.5">
                          <ItemAvatar name={item.dish} size="sm" variant="photo" />
                          <span className="text-[12px] font-semibold text-foreground">
                            {item.dish}
                          </span>
                        </div>
                      </td>
                      <td className="px-3 py-2.5 text-[11px] text-muted-foreground">
                        {item.category}
                      </td>
                      <td className="px-3 py-2.5 text-right text-[11.5px] font-semibold tabular-nums text-foreground">
                        {fmtCurrency(item.price)}
                      </td>
                      <td className="px-3 py-2.5 text-right text-[11.5px] tabular-nums text-muted-foreground">
                        {fmtCurrency(item.cost)}
                      </td>
                      <td
                        className={cn(
                          "px-3 py-2.5 text-right text-[11.5px] font-bold tabular-nums",
                          item.margin_pct >= 60 ? "text-success" : "text-foreground",
                        )}
                      >
                        {item.margin_pct.toFixed(1)}%
                      </td>
                      <td className="px-3 py-2.5 text-right text-[11.5px] tabular-nums text-foreground">
                        <span className="inline-flex items-center gap-1">
                          <TrendingUp className="h-3 w-3 text-muted-foreground" />
                          {item.sold_30d.toLocaleString()}
                        </span>
                      </td>
                      <td className="px-3 py-2.5 text-right text-[11.5px] tabular-nums">
                        <span className="inline-flex items-center gap-1 text-destructive">
                          <Trash2 className="h-3 w-3" />
                          {item.waste_qty_30d.toLocaleString()} u
                        </span>
                        <span className="ml-1.5 text-[10px] text-muted-foreground">
                          ({fmtCurrency(item.waste_cost_30d)})
                        </span>
                      </td>
                      <td className="px-3 py-2.5">
                        <QuadrantBadge quadrant={item.quadrant} />
                      </td>
                      <td className="px-3 py-2.5 text-right">
                        <ChevronRight className="ml-auto h-3.5 w-3.5 text-muted-foreground" />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </CardContent>
      </Card>

      <RecipeDialog dish={selected} onClose={() => setSelected(null)} />
    </div>
  );
}

export default MenuEngineeringPage;
