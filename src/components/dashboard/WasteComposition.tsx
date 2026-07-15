import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Trash2 } from "lucide-react";
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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtCurrency, fmtPct, DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { dashboardService, type WasteCompositionItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";

const TOP_N = 8;
const ROW_PX = 30; // chart grows with item count when "All" is on

function utilizationTone(pct: number): string {
  return pct >= 85 ? "text-success" : pct >= 60 ? "text-warning" : "text-destructive";
}

/** Horizontal quantity bar used in the detail panel (width relative to bought qty). */
function QtyBar({
  label,
  qty,
  unit,
  pctOfBought,
  barClass,
}: {
  label: string;
  qty: number;
  unit: string;
  pctOfBought: number;
  barClass: string;
}) {
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wide text-muted-foreground">
          {label}
        </span>
        <span className="text-[11px] font-bold tabular-nums text-foreground">
          {qty.toFixed(1)} {unit}
        </span>
      </div>
      <div className="h-2 overflow-hidden rounded-full bg-muted/60">
        <div
          className={cn("h-full rounded-full transition-all duration-500", barClass)}
          style={{ width: `${Math.max(2, Math.min(100, pctOfBought))}%` }}
        />
      </div>
    </div>
  );
}

function DetailPanel({
  item,
  currency,
  totalCost,
}: {
  item: WasteCompositionItem;
  currency: string;
  totalCost: number;
}) {
  const utilization = item.bought_qty > 0 ? (item.needed_qty / item.bought_qty) * 100 : 0;
  const shareOfTotal = totalCost > 0 ? (item.cost / totalCost) * 100 : item.pct;

  return (
    <div className="flex h-full flex-col rounded-xl border border-border/50 bg-muted/20 p-4">
      <div className="flex items-start justify-between gap-2">
        <div>
          <p className="text-[13px] font-bold text-foreground">{item.name}</p>
          <p className="mt-0.5 text-[10px] text-muted-foreground">
            Purchased vs. what sold dishes required
          </p>
        </div>
        <Badge
          variant="outline"
          className="shrink-0 border-destructive/30 bg-destructive/10 text-[9px] font-bold text-destructive"
        >
          {fmtPct(shareOfTotal)} of waste
        </Badge>
      </div>

      <div className="mt-4 space-y-3">
        <QtyBar
          label="Bought"
          qty={item.bought_qty}
          unit={item.unit}
          pctOfBought={100}
          barClass="bg-info/70"
        />
        <QtyBar
          label="Needed"
          qty={item.needed_qty}
          unit={item.unit}
          pctOfBought={item.bought_qty > 0 ? (item.needed_qty / item.bought_qty) * 100 : 0}
          barClass="bg-success/70"
        />
        <QtyBar
          label="Wasted"
          qty={item.qty}
          unit={item.unit}
          pctOfBought={item.bought_qty > 0 ? (item.qty / item.bought_qty) * 100 : 0}
          barClass="bg-destructive/80"
        />
      </div>

      <div className="mt-4 grid grid-cols-2 gap-2">
        <div className="rounded-lg border border-border/40 bg-card px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
            Waste Cost
          </p>
          <p className="text-[13px] font-bold tabular-nums text-destructive">
            {fmtCurrency(item.cost, currency)}
          </p>
        </div>
        <div className="rounded-lg border border-border/40 bg-card px-3 py-2">
          <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
            Utilization
          </p>
          <p className={cn("text-[13px] font-bold tabular-nums", utilizationTone(utilization))}>
            {fmtPct(utilization)}
          </p>
        </div>
      </div>

      <p className="mt-auto pt-3 text-[10px] leading-relaxed text-muted-foreground">
        {fmtPct(100 - utilization)} of the {item.name.toLowerCase()} purchased in this period was
        not used by any dish sold — check portioning, spoilage or over-ordering.
      </p>
    </div>
  );
}

export function WasteComposition() {
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);
  const [showAll, setShowAll] = useState(false);
  const [selectedName, setSelectedName] = useState<string | null>(null);

  const query = useQuery({
    queryKey: ["dashboard", "waste-composition", period, branch, showAll],
    queryFn: () => dashboardService.getWasteComposition(period, branch, showAll ? 50 : TOP_N),
    ...DASHBOARD_LIVE_QUERY,
  });

  const data = query.data;
  const currency = data?.currency ?? "AED";
  const items = data?.items ?? [];
  // Falls back to the top offender whenever the selection disappears
  // (branch/period switch, toggling back to Top 8).
  const selected = items.find((i) => i.name === selectedName) ?? items[0];
  const chartHeight = Math.max(240, items.length * ROW_PX);

  return (
    <Card className="flex h-full flex-col border border-border/60 bg-card shadow-sm animate-fade-in-up">
      <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <CardTitle className="text-[13px] font-bold text-foreground">
              Waste Composition Analysis
            </CardTitle>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Ingredients purchased beyond what sold dishes required — click a bar to inspect
            </p>
          </div>
          <div className="flex items-center gap-2">
            {(data?.over_count ?? 0) > TOP_N && (
              <div className="flex rounded-full border border-border/60 p-0.5">
                {([false, true] as const).map((all) => (
                  <button
                    key={String(all)}
                    onClick={() => setShowAll(all)}
                    className={cn(
                      "rounded-full px-2.5 py-0.5 text-[10px] font-semibold transition-colors",
                      showAll === all
                        ? "bg-primary/15 text-primary"
                        : "text-muted-foreground hover:text-foreground",
                    )}
                  >
                    {all ? `All ${data!.over_count}` : `Top ${TOP_N}`}
                  </button>
                ))}
              </div>
            )}
            <Badge
              variant="outline"
              className="shrink-0 border-warning/30 bg-warning-soft/30 text-[9px] font-bold text-warning"
            >
              Live
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-1 px-5 pb-5 pt-3">
        {query.isLoading ? (
          <div className="flex h-[300px] flex-col gap-2">
            <div className="grid shrink-0 grid-cols-3 gap-2">
              <div className="h-12 animate-pulse rounded-lg bg-secondary" />
              <div className="h-12 animate-pulse rounded-lg bg-secondary" />
              <div className="h-12 animate-pulse rounded-lg bg-secondary" />
            </div>
            <div className="flex-1 animate-pulse rounded-lg bg-secondary" />
          </div>
        ) : query.isError ? (
          <div className="flex h-[300px] items-center justify-center">
            <EmptyState
              icon={AlertCircle}
              title="Couldn't load waste data"
              description="The waste variance service didn't respond."
              action={{ label: "Retry", onClick: () => query.refetch() }}
            />
          </div>
        ) : !items.length || !selected ? (
          <div className="flex h-[300px] items-center justify-center">
            <EmptyState
              icon={Trash2}
              title="No waste detected"
              description="Waste is computed from POS sales vs. Tally purchases once both are synced"
            />
          </div>
        ) : (
          <div className="flex flex-col">
            {/* Summary tiles */}
            <div className="mb-3 grid shrink-0 grid-cols-2 gap-2 sm:grid-cols-3">
              <div className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Total Waste Cost
                </p>
                <p className="text-[13px] font-bold tabular-nums text-destructive">
                  {fmtCurrency(data!.total_cost, currency)}
                </p>
              </div>
              <div className="rounded-lg border border-border/40 bg-muted/30 px-3 py-2">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Over-purchased Items
                </p>
                <p className="text-[13px] font-bold tabular-nums text-foreground">
                  {data!.over_count}
                </p>
              </div>
              <div className="col-span-2 rounded-lg border border-border/40 bg-muted/30 px-3 py-2 sm:col-span-1">
                <p className="text-[9px] font-semibold uppercase tracking-wide text-muted-foreground">
                  Biggest Offender
                </p>
                <p className="truncate text-[13px] font-bold text-foreground">
                  {items[0].name}{" "}
                  <span className="tabular-nums text-muted-foreground">
                    · {fmtPct(items[0].pct)}
                  </span>
                </p>
              </div>
            </div>

            {/* Chart + detail panel */}
            <div className="grid gap-4 lg:grid-cols-[1.6fr_1fr]">
              <div className={cn(showAll && "max-h-[340px] overflow-y-auto")}>
                <ResponsiveContainer width="100%" height={chartHeight}>
                  <BarChart
                    data={items}
                    layout="vertical"
                    margin={{ top: 4, right: 8, left: 0, bottom: 0 }}
                  >
                    <CartesianGrid
                      strokeDasharray="3 3"
                      stroke="var(--color-border)"
                      opacity={0.35}
                      horizontal={false}
                    />
                    <XAxis
                      type="number"
                      stroke="var(--color-muted-foreground)"
                      fontSize={9}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(v: number) =>
                        v >= 1000 ? `${(v / 1000).toFixed(1)}k` : String(v)
                      }
                    />
                    <YAxis
                      type="category"
                      dataKey="name"
                      width={112}
                      interval={0}
                      stroke="var(--color-muted-foreground)"
                      fontSize={10}
                      tickLine={false}
                      axisLine={false}
                      tickFormatter={(name: string) =>
                        name.length > 15 ? `${name.slice(0, 15)}…` : name
                      }
                    />
                    <Tooltip
                      cursor={{ fill: "var(--color-muted)", opacity: 0.4 }}
                      content={({ active, payload }) => {
                        if (!active || !payload?.length) return null;
                        const row = payload[0].payload as WasteCompositionItem;
                        return (
                          <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-[11px] shadow-lg">
                            <p className="font-bold text-foreground">{row.name}</p>
                            <p className="mt-0.5 tabular-nums text-muted-foreground">
                              {fmtCurrency(row.cost, currency)} · {row.pct.toFixed(1)}% of waste
                            </p>
                            <p className="mt-0.5 tabular-nums text-muted-foreground">
                              bought {row.bought_qty.toFixed(1)} {row.unit} · needed{" "}
                              {row.needed_qty.toFixed(1)} {row.unit} →{" "}
                              <span className="font-semibold text-destructive">
                                {row.qty.toFixed(1)} {row.unit} over
                              </span>
                            </p>
                            <p className="mt-1 text-[10px] text-muted-foreground">
                              Click to inspect
                            </p>
                          </div>
                        );
                      }}
                    />
                    <Bar
                      dataKey="cost"
                      radius={[0, 4, 4, 0]}
                      maxBarSize={16}
                      cursor="pointer"
                      onClick={(row: WasteCompositionItem) => setSelectedName(row.name)}
                    >
                      {items.map((it) => (
                        <Cell
                          key={it.name}
                          fill="var(--color-destructive)"
                          fillOpacity={it.name === selected.name ? 0.95 : 0.35}
                        />
                      ))}
                    </Bar>
                  </BarChart>
                </ResponsiveContainer>
              </div>

              <DetailPanel item={selected} currency={currency} totalCost={data!.total_cost} />
            </div>

            {/* Footer: method note + sync */}
            <div className="mt-3 flex shrink-0 items-center justify-between border-t border-border/30 pt-2">
              <span className="text-[9.5px] text-muted-foreground">
                Variance: Tally purchases vs. recipe usage of sold dishes
              </span>
              {data!.last_sync && (
                <span className="flex items-center gap-1 text-[9px] text-muted-foreground">
                  <AlertCircle className="h-3 w-3" />
                  Last sync: {new Date(data!.last_sync).toLocaleDateString()}
                </span>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
