import { useMemo } from "react";
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
import {
  AlertTriangle,
  CheckCircle2,
  ClipboardList,
  Rocket,
  Star,
  TrendingDown,
} from "lucide-react";

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

/* Chart geometry is pinned rather than left to Recharts' defaults so the
   caption overlay can sit exactly on the plot rectangle:
   plot left = margin.left + Y_AXIS_W, plot bottom = X_AXIS_H. */
const CHART_MARGIN = { top: 8, right: 24, bottom: 0, left: 4 };
const Y_AXIS_W = 56;
const X_AXIS_H = 44;
const PLOT_INSET = {
  top: CHART_MARGIN.top,
  right: CHART_MARGIN.right,
  bottom: X_AXIS_H,
  left: CHART_MARGIN.left + Y_AXIS_W,
};

type Point = {
  dish: string;
  label: string;
  sold: number;
  issued: number;
  expected: number;
  variance: number;
  wastePct: number;
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

/** Captions sit in the outer corner of their own quadrant — pushed to the
    chart's edges so they stay clear of the dots, which cluster mid-plot. */
function ZoneCaption({
  zone,
  corner,
}: {
  zone: Zone;
  corner: `${"top" | "bottom"}-${"left" | "right"}`;
}) {
  const config = ZONE[zone];
  const Icon = config.icon;
  const right = corner.endsWith("right");
  const bottom = corner.startsWith("bottom");
  return (
    <div
      className={cn(
        "pointer-events-none flex w-[13.5rem] max-w-full items-start gap-2",
        right ? "flex-row-reverse justify-self-end text-right" : "justify-self-start",
        bottom ? "self-end" : "self-start",
      )}
    >
      <span className="grid h-7 w-7 shrink-0 place-items-center rounded-full bg-card ring-1 ring-border">
        <Icon className={cn("h-4 w-4", config.text)} />
      </span>
      <div>
        <p className={cn("text-xs font-extrabold tracking-wide", config.text)}>{config.label}</p>
        <p className="mt-0.5 text-[11px] leading-snug text-muted-foreground">{config.blurb}</p>
      </div>
    </div>
  );
}

export function MenuWasteAnalysis({
  items,
  period,
  onPeriodChange,
  isLoading,
}: {
  items: MenuEngineeringItem[];
  period: Period;
  onPeriodChange: (p: Period) => void;
  isLoading?: boolean;
}) {
  const points = useMemo(() => buildPoints(items), [items]);
  const medSold = useMemo(() => median(points.map((p) => p.sold)), [points]);
  const medIssued = useMemo(() => median(points.map((p) => p.issued)), [points]);
  const maxSold = useMemo(() => Math.max(1, ...points.map((p) => p.sold)) * 1.15, [points]);
  const maxIssued = useMemo(() => Math.max(1, ...points.map((p) => p.issued)) * 1.15, [points]);

  const alerts = useMemo(
    () => [...points].sort((a, b) => b.wastePct - a.wastePct).slice(0, 6),
    [points],
  );
  const worst = alerts[0];

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
    <Card>
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 pb-3">
        <CardTitle className="text-base font-bold">
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

      <CardContent>
        {isLoading ? (
          <div className="h-[26rem] animate-pulse rounded-xl bg-secondary" />
        ) : !points.length ? (
          <EmptyState
            icon={AlertTriangle}
            title="No dishes sold in this period"
            description="Stock-issued vs. sales appears once POS sales are synced for the window."
          />
        ) : (
          <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_16rem]">
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
                    fillOpacity={0.07}
                  />
                  <ReferenceArea
                    x1={medSold}
                    x2={maxSold}
                    y1={medIssued}
                    y2={maxIssued}
                    fill={ZONE.high_usage.fill}
                    fillOpacity={0.07}
                  />
                  <ReferenceArea
                    x1={0}
                    x2={medSold}
                    y1={0}
                    y2={medIssued}
                    fill={ZONE.low_activity.fill}
                    fillOpacity={0.06}
                  />
                  <ReferenceArea
                    x1={medSold}
                    x2={maxSold}
                    y1={0}
                    y2={medIssued}
                    fill={ZONE.efficient.fill}
                    fillOpacity={0.07}
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
                      shape="circle"
                      isAnimationActive={false}
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

              {/* Quadrant captions sit above the plot, out of the pointer's way */}
              <div
                className="pointer-events-none absolute grid grid-cols-2 grid-rows-2 gap-2 p-2.5"
                style={{
                  top: PLOT_INSET.top,
                  right: PLOT_INSET.right,
                  bottom: PLOT_INSET.bottom,
                  left: PLOT_INSET.left,
                }}
              >
                <ZoneCaption zone="waste_risk" corner="top-left" />
                <ZoneCaption zone="high_usage" corner="top-right" />
                <ZoneCaption zone="low_activity" corner="bottom-left" />
                <ZoneCaption zone="efficient" corner="bottom-right" />
              </div>
            </div>

            {/* Alerts + recommendation rail */}
            <div className="space-y-3">
              <div className="rounded-xl border border-border/60 p-3">
                <p className="text-xs font-bold text-foreground">Waste Alerts</p>
                <ul className="mt-2 space-y-2">
                  {alerts.map((p) => {
                    const high = p.wastePct >= 10;
                    return (
                      <li key={p.dish} className="flex items-center gap-2 text-xs">
                        {high ? (
                          <AlertTriangle className="h-3.5 w-3.5 shrink-0 text-destructive" />
                        ) : (
                          <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-success" />
                        )}
                        <span className="min-w-0 flex-1 truncate text-foreground">{p.dish}</span>
                        <span
                          className={cn(
                            "shrink-0 font-bold tabular-nums",
                            high ? "text-destructive" : "text-success",
                          )}
                        >
                          +{fmtPct(p.wastePct)}
                        </span>
                      </li>
                    );
                  })}
                </ul>
              </div>

              {worst && worst.variance > 0 && (
                <div className="rounded-xl border border-info/25 bg-info/5 p-3">
                  <div className="flex items-start gap-2">
                    <ClipboardList className="mt-0.5 h-4 w-4 shrink-0 text-info" />
                    <div>
                      <p className="text-xs font-bold text-foreground">Waste Risk Detected</p>
                      <p className="mt-1 text-[11px] leading-relaxed text-muted-foreground">
                        {worst.dish} was issued {worst.issued.toFixed(1)} portions against{" "}
                        {worst.expected.toFixed(1)} sold — {fmtPct(worst.wastePct)} over. Review
                        prep quantity and portion control.
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
