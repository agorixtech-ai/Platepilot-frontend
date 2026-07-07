import { useQuery } from "@tanstack/react-query";
import { Trash2, AlertCircle } from "lucide-react";
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

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtCurrency } from "@/components/dashboard/shared";
import { dashboardService } from "@/services/dashboardService";
import { DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";

/** Reason → bar/legend color. Keep in sync with the badge tones used across
    the dashboard: spoilage/expired = red, prep = amber, plate = green. */
const REASON_CHART_COLORS: Record<string, string> = {
  spoilage: "var(--color-destructive)",
  expired: "var(--color-destructive)",
  "prep waste": "var(--color-warning)",
  prep: "var(--color-warning)",
  "plate waste": "var(--color-success)",
  plate: "var(--color-success)",
};

function reasonColor(reason: string | null): string {
  return (reason && REASON_CHART_COLORS[reason.toLowerCase()]) || "var(--color-destructive)";
}

export function WasteComposition() {
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);

  const { data, isLoading } = useQuery({
    queryKey: ["dashboard", "waste-composition", period, branch],
    queryFn: () => dashboardService.getWasteComposition(period, branch, 8),
    ...DASHBOARD_LIVE_QUERY,
  });

  const currency = data?.currency ?? "AED";
  const items = data?.items ?? [];

  return (
    <Card className="flex h-full flex-col border border-border/60 bg-card shadow-sm animate-fade-in-up">
      <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
        <div className="flex items-center justify-between gap-3">
          <div>
            <CardTitle className="text-[13px] font-bold text-foreground">
              Waste Composition Analysis
            </CardTitle>
            <p className="mt-0.5 text-[10px] text-muted-foreground">
              Waste cost per dish — bar color shows the main reason
            </p>
          </div>
          <Badge
            variant="outline"
            className="shrink-0 border-warning/30 bg-warning-soft/30 text-[9px] font-bold text-warning"
          >
            Live
          </Badge>
        </div>
      </CardHeader>
      <CardContent className="px-5 pb-5 pt-3">
        {isLoading ? (
          <div className="flex h-[280px] flex-col gap-2">
            <div className="grid shrink-0 grid-cols-2 gap-2">
              <div className="h-12 animate-pulse rounded-lg bg-secondary" />
              <div className="h-12 animate-pulse rounded-lg bg-secondary" />
            </div>
            <div className="flex-1 animate-pulse rounded-lg bg-secondary" />
          </div>
        ) : !items.length ? (
          <div className="flex h-[280px] items-center justify-center">
            <EmptyState
              icon={Trash2}
              title="No waste data yet"
              description="Waste records will appear here once tracked"
            />
          </div>
        ) : (
          <div className="flex h-[280px] flex-col">
            {/* Summary */}
            <div className="mb-2 grid shrink-0 grid-cols-2 gap-2">
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
                  Total Quantity
                </p>
                <p className="text-[13px] font-bold tabular-nums text-foreground">
                  {data!.total_qty.toFixed(1)} units
                </p>
              </div>
            </div>

            {/* Bar graph — waste cost per dish, colored by top reason */}
            <div className="min-h-0 flex-1">
              <ResponsiveContainer width="100%" height="100%">
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
                    dataKey="dish"
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
                      const row = payload[0].payload as (typeof items)[number];
                      return (
                        <div className="rounded-xl border border-border/60 bg-popover px-3 py-2 text-[11px] shadow-lg">
                          <p className="font-bold text-foreground">{row.dish}</p>
                          <p className="mt-0.5 tabular-nums text-muted-foreground">
                            {fmtCurrency(row.cost, currency)} · {row.qty.toFixed(1)} units ·{" "}
                            {row.pct.toFixed(1)}% of waste
                          </p>
                          {row.top_reason && (
                            <p className="mt-0.5 text-muted-foreground">
                              Main reason:{" "}
                              <span
                                className="font-semibold"
                                style={{ color: reasonColor(row.top_reason) }}
                              >
                                {row.top_reason}
                              </span>
                            </p>
                          )}
                        </div>
                      );
                    }}
                  />
                  <Bar dataKey="cost" radius={[0, 4, 4, 0]} maxBarSize={14}>
                    {items.map((row) => (
                      <Cell
                        key={row.dish}
                        fill={reasonColor(row.top_reason)}
                        fillOpacity={0.8}
                      />
                    ))}
                  </Bar>
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* Footer: reason legend + sync */}
            <div className="mt-2 flex shrink-0 items-center justify-between border-t border-border/30 pt-2">
              <div className="flex items-center gap-3 text-[9.5px] text-muted-foreground">
                {[
                  ["Spoilage / Expired", "var(--color-destructive)"],
                  ["Prep waste", "var(--color-warning)"],
                  ["Plate waste", "var(--color-success)"],
                ].map(([label, color]) => (
                  <span key={label} className="flex items-center gap-1">
                    <span className="h-2 w-2 rounded-sm" style={{ backgroundColor: color }} />
                    {label}
                  </span>
                ))}
              </div>
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
