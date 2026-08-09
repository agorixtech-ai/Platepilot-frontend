import { useMemo, useState } from "react";
import {
  CartesianGrid,
  LabelList,
  ReferenceArea,
  ResponsiveContainer,
  Scatter,
  ScatterChart,
  Tooltip,
  XAxis,
  YAxis,
  ZAxis,
} from "recharts";
import { AlertTriangle, Rocket, Star, TrendingDown } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { PeriodChip, fmtPct } from "@/components/dashboard/shared";
import type { Period, MenuEngineeringItem } from "@/services/dashboardService";

/* Quantity view of the same variance the table costs out below: stock issued
   (portions the purchases covered) vs. what the POS actually sold. Waste % here
   is variance ÷ issued — a portion-efficiency number, deliberately different
   from the table's waste-cost-as-%-of-revenue. */
type Zone = "waste_risk" | "high_usage" | "low_activity" | "efficient";

const ZONE = {
  waste_risk: {
    label: "WASTE RISK",
    blurb: "High stock issued, low sales. Investigate over-prep, spoilage, or low conversion.",
    icon: AlertTriangle,
    dot: "var(--color-destructive)",
    fill: "var(--color-destructive)",
    text: "text-destructive",
  },
  high_usage: {
    label: "HIGH USAGE",
    blurb: "High stock issued, high sales. Strong demand — validate variance against recipe usage.",
    icon: Star,
    dot: "var(--color-success)",
    fill: "var(--color-success)",
    text: "text-success",
  },
  low_activity: {
    label: "LOW ACTIVITY",
    blurb: "Low stock issued, low sales. Low-demand items — review or de-prioritize.",
    icon: TrendingDown,
    dot: "var(--color-warning)",
    fill: "var(--color-warning)",
    text: "text-warning",
  },
  efficient: {
    label: "EFFICIENT SELLERS",
    blurb: "Low stock issued, high sales. Efficient items — monitor demand and stock levels.",
    icon: Rocket,
    dot: "var(--color-info)",
    fill: "var(--color-info)",
    text: "text-info",
  },
} as const;

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const LABEL_LIMIT = 6;

const CHART_MARGIN = { top: 8, right: 24, bottom: 0, left: 4 };
const Y_AXIS_W = 56;
const X_AXIS_H = 44;

type Point = {
  dish: string;
  label: string;
  sold: number;
  issued: number;
  expected: number;
  variance: number;
  wastePct: number;
  wasteCost: number;
  zone: Zone;
};

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const s = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(s.length / 2);
  return s.length % 2 ? s[mid] : (s[mid - 1] + s[mid]) / 2;
}

function buildPoints(items: MenuEngineeringItem[]): Point[] {
  const rows = items
    .filter((i) => i.sold > 0 || i.waste_qty > 0)
    .map((i) => {
      const expected = i.sold; // portions the sales required
      const variance = i.waste_qty; // portions purchased beyond that
      const issued = expected + variance;
      return {
        dish: i.dish,
        sold: i.sold,
        expected,
        variance,
        wasteCost: i.waste_cost,
        issued,
        wastePct: issued > 0 ? (variance / issued) * 100 : 0,
        zone: "low_activity" as Zone,
        label: "",
      };
    });
  const medSold = median(rows.map((r) => r.sold));
  const medIssued = median(rows.map((r) => r.issued));
  for (const r of rows) {
    const highSales = r.sold >= medSold;
    const highIssued = r.issued >= medIssued;
    r.zone = highIssued
      ? highSales
        ? "high_usage"
        : "waste_risk"
      : highSales
        ? "efficient"
        : "low_activity";
  }
  /* Only the wasteful dishes get a printed label — labelling all 15 turns the
     efficient cluster into an unreadable pile. Everything stays hoverable. */
  const labelled = new Set(
    [...rows]
      .sort((a, b) => b.wastePct - a.wastePct)
      .filter((r) => r.wastePct > 0)
      .slice(0, LABEL_LIMIT)
      .map((r) => r.dish),
  );
  for (const r of rows) r.label = labelled.has(r.dish) ? r.dish : "";
  return rows;
}

function WasteTooltip({ point }: { point: Point }) {
  const zone = ZONE[point.zone];
  const rows: [string, string][] = [
    ["Stock Issued", `${point.issued.toFixed(1)} portions`],
    ["Units Sold", `${point.sold.toLocaleString()} portions`],
    ["Expected Consumption", `${point.expected.toFixed(1)} portions`],
    ["Variance", `+${point.variance.toFixed(1)} portions`],
    ["Waste %", fmtPct(point.wastePct)],
  ];
  return (
    <div className="rounded-xl bg-popover px-3 py-2.5 text-[11px] shadow-lg ring-1 ring-border">
      <p className="mb-1.5 font-bold text-foreground">{point.dish}</p>
      <dl className="space-y-1">
        {rows.map(([label, value]) => (
          <div key={label} className="flex justify-between gap-6">
            <dt className="text-muted-foreground">{label}</dt>
            <dd className="font-semibold tabular-nums text-foreground">{value}</dd>
          </div>
        ))}
        <div className="flex justify-between gap-6 border-t border-border/50 pt-1">
          <dt className="text-muted-foreground">Status</dt>
          <dd className={cn("font-bold", zone.text)}>{zone.label}</dd>
        </div>
      </dl>
    </div>
  );
}

/** Static legend chip (one per zone) — sits outside the plot rather than
    floating in its quadrant's corner, so it never fights a data point or
    label for space when the card renders narrow. */
function ZoneLegendChip({
  zone,
  active,
  dimmed,
  onHover,
}: {
  zone: Zone;
  active: boolean;
  dimmed: boolean;
  onHover: (zone: Zone | null) => void;
}) {
  const config = ZONE[zone];
  const Icon = config.icon;
  return (
    <button
      type="button"
      title={config.blurb}
      onMouseEnter={() => onHover(zone)}
      onMouseLeave={() => onHover(null)}
      onFocus={() => onHover(zone)}
      onBlur={() => onHover(null)}
      className={cn(
        "flex cursor-default items-center gap-1.5 rounded-full p-1 pr-2.5 transition-all duration-200",
        active ? "bg-card shadow-sm ring-1 ring-border" : "",
        dimmed ? "opacity-40" : "opacity-100",
      )}
    >
      <span
        className={cn(
          "grid h-5 w-5 shrink-0 place-items-center rounded-full bg-card ring-1 transition-all duration-200",
          active ? "scale-110 ring-current" : "ring-border",
          config.text,
        )}
      >
        <Icon className="h-3 w-3" />
      </span>
      <p className={cn("whitespace-nowrap text-[10px] font-extrabold tracking-wide", config.text)}>
        {config.label}
      </p>
    </button>
  );
}

export function MenuWasteAnalysis({
  items,
  period,
  onPeriodChange,
  isLoading,
  onInvestigate,
}: {
  items: MenuEngineeringItem[];
  period: Period;
  onPeriodChange: (p: Period) => void;
  isLoading?: boolean;
  /** Opens the page's existing DishDialog — the investigation surface. */
  onInvestigate?: (dish: string) => void;
}) {
  const points = useMemo(() => buildPoints(items), [items]);
  const medSold = useMemo(() => median(points.map((p) => p.sold)), [points]);
  const medIssued = useMemo(() => median(points.map((p) => p.issued)), [points]);
  const maxSold = useMemo(() => Math.max(1, ...points.map((p) => p.sold)) * 1.15, [points]);
  const maxIssued = useMemo(() => Math.max(1, ...points.map((p) => p.issued)) * 1.15, [points]);

  const [hovered, setHovered] = useState<Zone | null>(null);

  const washOpacity = (zone: Zone) =>
    hovered === zone ? 0.18 : hovered ? 0.025 : zone === "low_activity" ? 0.06 : 0.07;

  const byZone = useMemo(() => {
    const next: Record<Zone, Point[]> = {
      waste_risk: [],
      high_usage: [],
      low_activity: [],
      efficient: [],
    };
    for (const p of points) next[p.zone].push(p);
    return next;
  }, [points]);

  return (
    <Card className="flex h-full flex-col border border-border/60 bg-card shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/40 px-5 pb-3 pt-4">
        <CardTitle className="text-[13px] font-bold text-foreground">
          Menu Waste Analysis: Stock Issued vs. Menu Sales
        </CardTitle>
        <div className="flex items-center gap-1 rounded-full border border-border/60 p-0.5">
          {PERIODS.map(({ label, value }) => (
            <PeriodChip
              key={value}
              label={label}
              active={period === value}
              onClick={() => onPeriodChange(value)}
            />
          ))}
        </div>
      </CardHeader>

      <CardContent className="px-5 pb-5 pt-3">
        {!isLoading && points.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-x-1 gap-y-1.5">
            {(Object.keys(ZONE) as Zone[]).map((zone) => (
              <ZoneLegendChip
                key={zone}
                zone={zone}
                active={hovered === zone}
                dimmed={!!hovered && hovered !== zone}
                onHover={setHovered}
              />
            ))}
          </div>
        )}
        {isLoading ? (
          <div className="h-[26rem] animate-pulse rounded-xl bg-secondary" />
        ) : !points.length ? (
          <EmptyState
            icon={AlertTriangle}
            title="No dishes sold in this period"
            description="Stock-issued vs. sales appears once POS sales are synced for the window."
          />
        ) : (
          <div>
            {/* Quadrant plot */}
            <div className="relative h-[26rem]">
              <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={CHART_MARGIN}>
                  <CartesianGrid strokeDasharray="3 3" stroke="var(--color-border)" opacity={0.4} />
                  {/* quadrant washes, split at the menu's own medians */}
                  <ReferenceArea
                    x1={0}
                    x2={medSold}
                    y1={medIssued}
                    y2={maxIssued}
                    fill={ZONE.waste_risk.fill}
                    fillOpacity={washOpacity("waste_risk")}
                  />
                  <ReferenceArea
                    x1={medSold}
                    x2={maxSold}
                    y1={medIssued}
                    y2={maxIssued}
                    fill={ZONE.high_usage.fill}
                    fillOpacity={washOpacity("high_usage")}
                  />
                  <ReferenceArea
                    x1={0}
                    x2={medSold}
                    y1={0}
                    y2={medIssued}
                    fill={ZONE.low_activity.fill}
                    fillOpacity={washOpacity("low_activity")}
                  />
                  <ReferenceArea
                    x1={medSold}
                    x2={maxSold}
                    y1={0}
                    y2={medIssued}
                    fill={ZONE.efficient.fill}
                    fillOpacity={washOpacity("efficient")}
                  />
                  {/* sqrt scale: one runaway dish (hundreds of wasted portions
                      against double-digit sales) flattens every other point to
                      the floor on a linear axis. Order and the median splits are
                      unchanged; only the spacing is compressed. */}
                  <XAxis
                    type="number"
                    dataKey="sold"
                    scale="sqrt"
                    domain={[0, maxSold]}
                    height={X_AXIS_H}
                    tickFormatter={(v: number) => Math.round(v).toLocaleString()}
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    label={{
                      value: "Menu Sales →",
                      position: "insideBottom",
                      offset: -14,
                      fontSize: 11,
                      fill: "var(--color-muted-foreground)",
                    }}
                  />
                  <YAxis
                    type="number"
                    dataKey="issued"
                    scale="sqrt"
                    domain={[0, maxIssued]}
                    width={Y_AXIS_W}
                    tickFormatter={(v: number) => Math.round(v).toLocaleString()}
                    stroke="var(--color-muted-foreground)"
                    fontSize={10}
                    tickLine={false}
                    label={{
                      value: "Stock Issued →",
                      angle: -90,
                      position: "insideLeft",
                      fontSize: 11,
                      fill: "var(--color-muted-foreground)",
                    }}
                  />
                  {/* fixed symbol area — the default ~64px² reads as a speck at this size */}
                  <ZAxis range={[120, 120]} />
                  <Tooltip
                    cursor={{ strokeDasharray: "3 3" }}
                    content={({ active, payload }) =>
                      active && payload?.length ? (
                        <WasteTooltip point={payload[0].payload as Point} />
                      ) : null
                    }
                  />
                  {(Object.keys(ZONE) as Zone[]).map((zone) => (
                    <Scatter
                      key={zone}
                      data={byZone[zone]}
                      fill={ZONE[zone].dot}
                      fillOpacity={hovered && hovered !== zone ? 0.2 : 1}
                      shape="circle"
                      isAnimationActive={false}
                      cursor={onInvestigate ? "pointer" : undefined}
                      onClick={(node: unknown) => {
                        const dish = (node as { dish?: string } | undefined)?.dish;
                        if (dish) onInvestigate?.(dish);
                      }}
                    >
                      <LabelList
                        dataKey="label"
                        position="right"
                        offset={10}
                        style={{ fontSize: 10, fill: "var(--color-foreground)" }}
                      />
                    </Scatter>
                  ))}
                </ScatterChart>
              </ResponsiveContainer>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
