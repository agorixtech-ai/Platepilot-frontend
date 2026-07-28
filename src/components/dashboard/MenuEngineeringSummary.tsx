import { useMemo } from "react";
import { useQuery } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import {
  CartesianGrid,
  ReferenceLine,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { AlertTriangle, ChevronRight, Eye, Star, UtensilsCrossed, Wallet } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtCurrency, DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { dashboardService, type MenuEngineeringItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";

const QUADRANT: Record<
  MenuEngineeringItem["quadrant"],
  { label: string; color: string; icon: React.ElementType }
> = {
  star: { label: "Stars", color: "var(--color-success)", icon: Star },
  plow_horse: { label: "Optimize", color: "var(--color-info)", icon: Wallet },
  puzzle: { label: "Boost", color: "var(--color-warning)", icon: Eye },
  dog: { label: "Reconsider", color: "var(--color-destructive)", icon: AlertTriangle },
};
const QUADRANT_KEYS = Object.keys(QUADRANT) as (keyof typeof QUADRANT)[];

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

/** Classic menu-engineering quadrant: sold (popularity) vs. gross_profit
    (profitability), split at the menu's own medians. */
export function MenuEngineeringSummary() {
  const { branch } = useBranchFilter();

  const query = useQuery({
    queryKey: ["dashboard", "menu-engineering", branch],
    queryFn: () => dashboardService.getMenuEngineering("month", branch),
    ...DASHBOARD_LIVE_QUERY,
  });

  const items = useMemo(() => query.data?.items ?? [], [query.data]);
  const currency = query.data?.currency ?? "AED";

  const counts = useMemo(() => {
    const next = { star: 0, plow_horse: 0, puzzle: 0, dog: 0 };
    for (const item of items) next[item.quadrant] += 1;
    return next;
  }, [items]);

  const medianSold = useMemo(() => median(items.map((i) => i.sold)), [items]);
  const medianProfit = useMemo(() => median(items.map((i) => i.gross_profit)), [items]);

  return (
    <Card className="flex h-full flex-col border border-border/60 bg-card shadow-sm animate-fade-in-up">
      <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-[13px] font-bold text-foreground">
              Menu Engineering
            </CardTitle>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Popularity vs. profitability across your menu — last 30 days
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-primary/30 bg-primary/10 text-[9px] font-bold text-primary"
          >
            Live · POS
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5 pt-3">
        {query.isLoading ? (
          <div className="flex h-[300px] flex-col gap-2">
            <div className="grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-4">
              {Array.from({ length: 4 }).map((_, i) => (
                <div key={i} className="h-12 animate-pulse rounded-lg bg-secondary" />
              ))}
            </div>
            <div className="flex-1 animate-pulse rounded-lg bg-secondary" />
          </div>
        ) : query.isError ? (
          <div className="flex h-[300px] items-center justify-center">
            <EmptyState
              icon={AlertTriangle}
              title="Couldn't load menu data"
              description="Check that the backend is running, then retry."
              action={{ label: "Retry", onClick: () => query.refetch() }}
            />
          </div>
        ) : !items.length ? (
          <div className="flex h-[300px] items-center justify-center">
            <EmptyState
              icon={UtensilsCrossed}
              title="No menu data yet"
              description="Dishes will appear here once POS sales are synced."
            />
          </div>
        ) : (
          <div className="flex flex-col">
            <div className="mb-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
              {QUADRANT_KEYS.map((q) => {
                const cfg = QUADRANT[q];
                const Icon = cfg.icon;
                return (
                  <div key={q} className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                    <div className="flex items-center justify-between">
                      <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                        {cfg.label}
                      </p>
                      <Icon className="h-3 w-3" style={{ color: cfg.color }} />
                    </div>
                    <p className="text-[15px] font-bold tabular-nums text-foreground">
                      {counts[q]}
                    </p>
                  </div>
                );
              })}
            </div>

            {/* Color key — the dots below use these same colors */}
            <div className="mb-2 flex flex-wrap items-center gap-x-4 gap-y-1">
              {QUADRANT_KEYS.map((q) => (
                <div key={q} className="flex items-center gap-1.5">
                  <span
                    className="h-2 w-2 rounded-full"
                    style={{ backgroundColor: QUADRANT[q].color }}
                  />
                  <span className="text-[10px] text-muted-foreground">{QUADRANT[q].label}</span>
                </div>
              ))}
              <div className="flex items-center gap-1.5">
                <span className="h-0 w-3 border-t-2 border-dashed border-destructive/50" />
                <span className="text-[10px] text-muted-foreground">Break-even</span>
              </div>
            </div>

            {/* Y-axis title lives outside the chart's SVG, as plain CSS vertical
                text — Recharts' rotated inside-label collides with wide
                currency tick text ("AED 32.00") when placed in-chart. */}
            <div className="flex items-stretch gap-1">
              <div className="flex shrink-0 items-center justify-center">
                <span
                  className="whitespace-nowrap text-[10px] text-muted-foreground"
                  style={{ writingMode: "vertical-rl", transform: "rotate(180deg)" }}
                >
                  Profit per plate ↑
                </span>
              </div>
              <div className="min-w-0 flex-1">
                <ResponsiveContainer width="100%" height={260}>
                  <ScatterChart margin={{ top: 8, right: 12, left: 0, bottom: 18 }}>
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      opacity={0.35}
                    />
                    <XAxis
                      type="number"
                      dataKey="sold"
                      name="Sold (30d)"
                      stroke="var(--color-muted-foreground)"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      label={{
                        value: "Dishes sold (30 days) →",
                        position: "insideBottom",
                        offset: -12,
                        fontSize: 10,
                        fill: "var(--color-muted-foreground)",
                      }}
                    />
                    <YAxis
                      type="number"
                      dataKey="gross_profit"
                      name="Profit / plate"
                      stroke="var(--color-muted-foreground)"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) => fmtCurrency(v, currency)}
                    />
                    {/* Median split — the quadrant boundary (relative to this menu) */}
                    <ReferenceLine
                      x={medianSold}
                      stroke="var(--color-border)"
                      strokeDasharray="4 4"
                    />
                    <ReferenceLine
                      y={medianProfit}
                      stroke="var(--color-border)"
                      strokeDasharray="4 4"
                    />
                    {/* Break-even — actual profit vs. loss, not just relative to the menu */}
                    <ReferenceLine
                      y={0}
                      stroke="var(--color-destructive)"
                      strokeOpacity={0.5}
                      strokeDasharray="2 2"
                      label={{
                        value: "Break-even",
                        position: "insideBottomRight",
                        fontSize: 9,
                        fill: "var(--color-destructive)",
                      }}
                    />
                    <Tooltip
                      cursor={{ strokeDasharray: "3 3" }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload as MenuEngineeringItem;
                        return (
                          <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-[11px] shadow-lg">
                            <p className="font-bold text-foreground">{row.dish}</p>
                            <p className="mt-0.5 tabular-nums text-muted-foreground">
                              {row.sold} sold ·{" "}
                              <span
                                className={cn(
                                  "font-semibold",
                                  row.gross_profit >= 0 ? "text-success" : "text-destructive",
                                )}
                              >
                                {fmtCurrency(row.gross_profit, currency)}{" "}
                                {row.gross_profit >= 0 ? "profit" : "loss"}
                              </span>
                            </p>
                            <p
                              className="mt-0.5 font-semibold"
                              style={{ color: QUADRANT[row.quadrant].color }}
                            >
                              {QUADRANT[row.quadrant].label}
                            </p>
                          </div>
                        );
                      }}
                    />
                    {QUADRANT_KEYS.map((q) => (
                      <Scatter
                        key={q}
                        data={items.filter((i) => i.quadrant === q)}
                        fill={QUADRANT[q].color}
                        fillOpacity={0.75}
                      />
                    ))}
                  </ScatterChart>
                </ResponsiveContainer>
              </div>
            </div>

            <Link
              to="/dashboard/menu-engineering"
              className="mt-3 flex items-center gap-0.5 self-start text-[10px] font-semibold text-primary hover:underline"
            >
              View full report <ChevronRight className="h-3 w-3" />
            </Link>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
