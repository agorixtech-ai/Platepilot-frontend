import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { Sparkles } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { fmtCurrency, fmtPct } from "@/components/dashboard/shared";
import type { MenuEngineeringItem } from "@/services/dashboardService";

/** a dish losing this much of its own revenue to ingredient variance is a waste risk */
export const WASTE_RISK_PCT = 5;

export type ActivityBucket = "waste_risk" | "high_usage" | "low_activity" | "efficient";

/**
 * Waste comes first — this page is about variance, so a leaky dish is a waste
 * risk no matter how well it sells. Everything else falls out of the quadrant
 * the backend already computed.
 */
export function bucketOf(
  item: Pick<MenuEngineeringItem, "waste_pct" | "quadrant">,
): ActivityBucket {
  if (item.waste_pct >= WASTE_RISK_PCT) return "waste_risk";
  if (item.quadrant === "star") return "efficient";
  if (item.quadrant === "plow_horse") return "high_usage";
  return "low_activity"; // puzzle + dog — profitable or not, they barely move
}

const BUCKET: Record<ActivityBucket, { label: string; dot: string; text: string; hint: string }> = {
  waste_risk: {
    label: "Waste risk",
    dot: "bg-destructive",
    text: "text-destructive",
    hint: `loses ≥${WASTE_RISK_PCT}% of its revenue to ingredient variance`,
  },
  high_usage: {
    label: "High usage",
    dot: "bg-info",
    text: "text-info",
    hint: "sells above the menu median but on a thin margin",
  },
  low_activity: {
    label: "Low activity",
    dot: "bg-warning",
    text: "text-warning",
    hint: "rarely ordered — profitable or not, it barely moves",
  },
  efficient: {
    label: "Efficient seller",
    dot: "bg-success",
    text: "text-success",
    hint: "above median on both volume and margin",
  },
};

const COLUMNS = 12;
const DOT_ROWS = 10;
const ROW_PX = 14; // 10px dot + 4px gap

export function DishActivityMatrix({
  items,
  isLoading,
  currency = "AED",
  className,
}: {
  items: MenuEngineeringItem[];
  isLoading?: boolean;
  currency?: string;
  className?: string;
}) {
  const [selected, setSelected] = useState(0);

  const columns = useMemo(
    () =>
      [...items]
        .sort((a, b) => b.revenue - a.revenue)
        .slice(0, COLUMNS)
        .map((item) => ({ item, bucket: bucketOf(item) })),
    [items],
  );

  const maxRevenue = Math.max(...columns.map((c) => c.item.revenue), 0);
  const step = maxRevenue > 0 ? maxRevenue / DOT_ROWS : 0;

  const counts = useMemo(() => {
    const next: Record<ActivityBucket, number> = {
      waste_risk: 0,
      high_usage: 0,
      low_activity: 0,
      efficient: 0,
    };
    for (const item of items) next[bucketOf(item)] += 1;
    return next;
  }, [items]);

  // The callout states a real number off the same data — no generic advice.
  const worstWaste = useMemo(
    () =>
      [...items]
        .filter((i) => bucketOf(i) === "waste_risk")
        .sort((a, b) => b.waste_cost - a.waste_cost)[0],
    [items],
  );

  const active = columns[Math.min(selected, columns.length - 1)];

  return (
    <Card
      className={cn("flex h-full flex-col border border-border/60 bg-card shadow-sm", className)}
    >
      <CardHeader className="border-b border-border/40 px-5 pb-3 pt-4">
        <CardTitle className="text-[13px] font-bold text-foreground">
          Menu Engineering Activity
        </CardTitle>
        <p className="mt-0.5 text-[10px] text-muted-foreground">
          Top {Math.min(COLUMNS, columns.length)} dishes by revenue — each dot is{" "}
          {step > 0 ? fmtCurrency(step, currency) : "—"} · tap a column
        </p>
      </CardHeader>

      <CardContent className="flex-1 px-5 pb-5 pt-4">
        {isLoading ? (
          <div className="h-[220px] w-full animate-pulse rounded-xl bg-secondary" />
        ) : !columns.length ? (
          <p className="py-10 text-center text-[11px] text-muted-foreground">
            Dishes will appear here once POS sales are synced.
          </p>
        ) : (
          <div className="grid gap-4 sm:grid-cols-[150px_1fr]">
            {/* ── Left rail: legend + insight + CTA ─────────────────────── */}
            <div className="flex flex-col gap-3">
              <ul className="space-y-1.5">
                {(Object.keys(BUCKET) as ActivityBucket[]).map((key) => (
                  <li key={key} className="flex items-center gap-2" title={BUCKET[key].hint}>
                    <span className={cn("h-2.5 w-2.5 shrink-0 rounded-full", BUCKET[key].dot)} />
                    <span className="text-[11px] font-medium text-foreground">
                      {BUCKET[key].label}
                    </span>
                    <span className="ml-auto text-[11px] font-bold tabular-nums text-muted-foreground">
                      {counts[key]}
                    </span>
                  </li>
                ))}
              </ul>

              <div className="rounded-xl border border-border/60 bg-secondary/20 px-3 py-2.5">
                <p className="text-[10.5px] leading-relaxed text-muted-foreground">
                  {worstWaste ? (
                    <>
                      <span className="font-bold text-foreground">{worstWaste.dish}</span> loses{" "}
                      <span className="font-bold text-destructive">
                        {fmtCurrency(worstWaste.waste_cost, currency)}
                      </span>{" "}
                      to ingredient variance — {fmtPct(worstWaste.waste_pct)} of its own revenue.
                    </>
                  ) : (
                    <>
                      No dish is losing more than {WASTE_RISK_PCT}% of its revenue to ingredient
                      variance.
                    </>
                  )}
                </p>
              </div>

              <Link
                to="/dashboard/ai"
                className="flex items-center justify-center gap-1.5 rounded-full bg-primary px-4 py-2 text-[11px] font-bold text-primary-foreground transition-opacity hover:opacity-90"
              >
                <Sparkles className="h-3.5 w-3.5" />
                Run Analysis
              </Link>
            </div>

            {/* ── Dot matrix ───────────────────────────────────────────── */}
            <div className="flex min-w-0 gap-2">
              {/* y axis */}
              <div
                className="flex shrink-0 flex-col justify-between pt-5 text-right text-[9px] tabular-nums text-muted-foreground"
                style={{ height: DOT_ROWS * ROW_PX + 20 }}
              >
                <span>{fmtCurrency(step * DOT_ROWS, currency)}</span>
                <span>{fmtCurrency(step * (DOT_ROWS / 2), currency)}</span>
                <span>0</span>
              </div>

              <div className="flex min-w-0 flex-1 items-end gap-1">
                {columns.map((col, i) => {
                  const isActive = col === active;
                  const dots = step > 0 ? Math.round(col.item.revenue / step) : 0;
                  const filled = Math.min(DOT_ROWS, Math.max(col.item.revenue > 0 ? 1 : 0, dots));
                  return (
                    <button
                      key={col.item.id}
                      type="button"
                      onClick={() => setSelected(i)}
                      aria-pressed={isActive}
                      title={`${col.item.dish} · ${fmtCurrency(col.item.revenue, currency)}`}
                      className="flex min-w-0 flex-1 flex-col items-center gap-1"
                    >
                      {/* fixed slot keeps every column bottom-aligned */}
                      <span className="flex h-5 items-center">
                        {isActive && (
                          <span className="whitespace-nowrap rounded-md bg-primary px-1.5 py-0.5 text-[9px] font-bold tabular-nums text-primary-foreground">
                            {fmtCurrency(col.item.revenue, currency)}
                          </span>
                        )}
                      </span>
                      <span
                        className="flex flex-col-reverse justify-start gap-1"
                        style={{ height: DOT_ROWS * ROW_PX }}
                      >
                        {Array.from({ length: filled }).map((_, d) => (
                          <span
                            key={d}
                            className={cn(
                              "h-2.5 w-2.5 rounded-full transition-opacity",
                              BUCKET[col.bucket].dot,
                              isActive ? "opacity-100" : "opacity-45",
                            )}
                          />
                        ))}
                      </span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        )}

        {/* selected dish readout — the x axis would never fit dish names */}
        {!isLoading && active && (
          <div className="mt-3 flex flex-wrap items-center gap-2 border-t border-border/40 pt-3">
            <span className={cn("h-2.5 w-2.5 rounded-full", BUCKET[active.bucket].dot)} />
            <span className="text-[12px] font-bold text-foreground">{active.item.dish}</span>
            <span className={cn("text-[10px] font-semibold", BUCKET[active.bucket].text)}>
              {BUCKET[active.bucket].label}
            </span>
            <span className="ml-auto text-[10px] tabular-nums text-muted-foreground">
              {active.item.sold} sold · {fmtCurrency(active.item.revenue, currency)} ·{" "}
              {fmtPct(active.item.waste_pct)} wasted
            </span>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
