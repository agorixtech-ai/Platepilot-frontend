import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Maximize2,
  Rocket,
  Search,
  Sparkles,
  Star,
  TrendingDown,
} from "lucide-react";
import { toast } from "sonner";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { EmptyState } from "@/components/ui/empty-state";
import { fmtPct } from "@/components/dashboard/shared";
import type { Period, MenuEngineeringItem } from "@/services/dashboardService";

/* Quantity view of the same variance the table costs out: stock issued
   (portions purchases covered) vs. POS sales. Waste % = variance ÷ issued. */
type Zone = "waste_risk" | "high_usage" | "low_activity" | "efficient";

const ZONE = {
  waste_risk: {
    label: "WASTE RISK",
    blurb: "Investigate over-prep, spoilage, or low conversion.",
    icon: AlertTriangle,
    color: "#F97316",
    fill: "#FFEDD5",
    badge: "bg-orange-500 text-white",
    text: "text-orange-600",
    tip: "text-orange-500",
    card: "border-orange-200 bg-white",
  },
  high_usage: {
    label: "HIGH USAGE",
    blurb: "Strong demand, validate variance against recipe usage.",
    icon: Star,
    color: "#22C55E",
    fill: "#DCFCE7",
    badge: "bg-emerald-500 text-white",
    text: "text-emerald-700",
    tip: "text-emerald-600",
    card: "border-emerald-200 bg-white",
  },
  low_activity: {
    label: "LOW ACTIVITY",
    blurb: "Low-demand items, review or de-prioritize.",
    icon: TrendingDown,
    color: "#E11D48",
    fill: "#FFE4E6",
    badge: "bg-rose-500 text-white",
    text: "text-rose-700",
    tip: "text-rose-600",
    card: "border-rose-200 bg-white",
  },
  efficient: {
    label: "EFFICIENT SELLERS",
    blurb: "Efficient items, monitor demand and stock levels.",
    icon: Rocket,
    color: "#3B82F6",
    fill: "#DBEAFE",
    badge: "bg-blue-500 text-white",
    text: "text-blue-700",
    tip: "text-blue-600",
    card: "border-blue-200 bg-white",
  },
} as const;

const PERIODS: { label: string; value: Period }[] = [
  { label: "Day", value: "today" },
  { label: "Week", value: "week" },
  { label: "Month", value: "month" },
];

const ALERT_WARN_PCT = 8;
const PAD = { top: 78, right: 120, bottom: 28, left: 28 };

type Point = {
  dish: string;
  sold: number;
  issued: number;
  expected: number;
  variance: number;
  wastePct: number;
  wasteCost: number;
  zone: Zone;
  x: number;
  y: number;
  labelDx: number;
  labelDy: number;
};

function median(nums: number[]): number {
  if (!nums.length) return 0;
  const sorted = [...nums].sort((a, b) => a - b);
  const mid = Math.floor(sorted.length / 2);
  return sorted.length % 2 ? sorted[mid] : (sorted[mid - 1] + sorted[mid]) / 2;
}

function estimateLabelWidth(text: string): number {
  return Math.min(150, 10 + text.length * 6.4);
}

function assignLabelOffsets(rows: Point[]): void {
  type Box = { left: number; right: number; top: number; bottom: number };
  const placed: Box[] = [];
  const ordered = [...rows].sort(
    (a, b) => b.wastePct - a.wastePct || b.sold - a.sold || a.dish.localeCompare(b.dish),
  );

  for (const row of ordered) {
    const w = estimateLabelWidth(row.dish) / 520;
    const h = 0.038;
    const candidates = [
      { dx: 12, dy: 0, ox: 0.025, oy: -0.01 },
      { dx: 12, dy: -14, ox: 0.025, oy: 0.03 },
      { dx: 12, dy: 14, ox: 0.025, oy: -0.04 },
      { dx: 12, dy: -28, ox: 0.025, oy: 0.06 },
      { dx: 12, dy: 28, ox: 0.025, oy: -0.07 },
      { dx: -estimateLabelWidth(row.dish) - 8, dy: 0, ox: -w - 0.02, oy: -0.01 },
      { dx: -estimateLabelWidth(row.dish) - 8, dy: -14, ox: -w - 0.02, oy: 0.03 },
      { dx: 20, dy: -42, ox: 0.04, oy: 0.09 },
      { dx: 20, dy: 42, ox: 0.04, oy: -0.1 },
    ];

    let chosen = candidates[0];
    for (const c of candidates) {
      const left = row.x + c.ox;
      const right = left + w;
      const top = 1 - row.y + c.oy;
      const bottom = top + h;
      if (left < -0.02 || right > 1.12 || top < -0.06 || bottom > 1.1) continue;
      const hit = placed.some(
        (box) => left < box.right && right > box.left && top < box.bottom && bottom > box.top,
      );
      if (!hit) {
        chosen = c;
        placed.push({ left, right, top, bottom });
        break;
      }
    }
    row.labelDx = chosen.dx;
    row.labelDy = chosen.dy;
  }
}

function buildPoints(items: MenuEngineeringItem[]): Point[] {
  const rows = items
    .filter((item) => item.sold > 0 || item.waste_qty > 0)
    .map((item) => {
      const expected = item.sold;
      const variance = item.waste_qty;
      const issued = expected + variance;
      return {
        dish: item.dish,
        sold: item.sold,
        expected,
        variance,
        wasteCost: item.waste_cost,
        issued,
        wastePct: issued > 0 ? (variance / issued) * 100 : 0,
        zone: "low_activity" as Zone,
        x: 0,
        y: 0,
        labelDx: 12,
        labelDy: 0,
      };
    });

  if (!rows.length) return rows;

  const medSold = median(rows.map((row) => row.sold));
  const medIssued = median(rows.map((row) => row.issued));
  const maxSold = Math.max(1, ...rows.map((row) => row.sold)) * 1.08;
  const maxIssued = Math.max(1, ...rows.map((row) => row.issued)) * 1.08;

  for (const row of rows) {
    const highSales = row.sold >= medSold;
    const highIssued = row.issued >= medIssued;
    row.zone = highIssued
      ? highSales
        ? "high_usage"
        : "waste_risk"
      : highSales
        ? "efficient"
        : "low_activity";
    row.x = Math.sqrt(row.sold / maxSold);
    row.y = Math.sqrt(row.issued / maxIssued);
  }

  assignLabelOffsets(rows);
  return rows;
}

function buildRecommendations(points: Point[]): string[] {
  const tips: string[] = [];
  const wasteRisk = [...points]
    .filter((point) => point.zone === "waste_risk")
    .sort((a, b) => b.wastePct - a.wastePct);
  const lowActivity = [...points]
    .filter((point) => point.zone === "low_activity")
    .sort((a, b) => a.sold - b.sold);
  const efficient = [...points]
    .filter((point) => point.zone === "efficient")
    .sort((a, b) => a.wastePct - b.wastePct || b.sold - a.sold);
  const highUsage = [...points]
    .filter((point) => point.zone === "high_usage" && point.wastePct >= ALERT_WARN_PCT)
    .sort((a, b) => b.wastePct - a.wastePct);

  if (wasteRisk[0]) {
    tips.push(
      `Waste Risk Detected: ${wasteRisk[0].dish} has high stock issued versus sales. Review prep quantity and portion control.`,
    );
  }
  if (wasteRisk[1]) {
    tips.push(
      `${wasteRisk[1].dish} is also over-issued (${fmtPct(wasteRisk[1].wastePct)} variance). Align prep sheets with forecasted covers.`,
    );
  }
  if (highUsage[0]) {
    tips.push(
      `${highUsage[0].dish} sells well but variance is ${fmtPct(highUsage[0].wastePct)}. Validate recipe yield against actual usage.`,
    );
  }
  if (lowActivity[0]) {
    tips.push(
      `${lowActivity[0].dish} sits in Low Activity — consider de-prioritizing prep or bundling it into a promo.`,
    );
  }
  if (efficient[0]) {
    tips.push(
      `${efficient[0].dish} is an Efficient Seller. Keep stock lean and protect portion standards as demand grows.`,
    );
  }
  if (!tips.length) {
    tips.push(
      "No material waste risk in this window. Keep monitoring stock issued against menu sales as covers change.",
    );
  }
  return tips.slice(0, 3);
}

function QuadrantBadge({ zone }: { zone: Zone }) {
  const config = ZONE[zone];
  const Icon = config.icon;
  return (
    <div
      className={cn(
        "pointer-events-none flex h-[68px] w-[196px] items-start gap-2 rounded-xl border px-2.5 py-2 shadow-sm",
        config.card,
      )}
    >
      <span
        className={cn("mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full", config.badge)}
      >
        <Icon className="h-3.5 w-3.5" strokeWidth={2.5} />
      </span>
      <div className="min-w-0">
        <p className={cn("text-[11px] font-extrabold tracking-wide", config.text)}>
          {config.label}
        </p>
        <p className="mt-0.5 text-[10px] leading-snug text-slate-600">{config.blurb}</p>
      </div>
    </div>
  );
}

function WasteMatrix({
  points,
  medSold,
  medIssued,
  maxSold,
  maxIssued,
  onInvestigate,
}: {
  points: Point[];
  medSold: number;
  medIssued: number;
  maxSold: number;
  maxIssued: number;
  onInvestigate?: (dish: string) => void;
}) {
  const [hover, setHover] = useState<Point | null>(null);

  const splitX = Math.sqrt(medSold / maxSold);
  const splitY = Math.sqrt(medIssued / maxIssued);

  const viewW = 1000;
  const viewH = 640;
  const plotW = viewW - PAD.left - PAD.right;
  const plotH = viewH - PAD.top - PAD.bottom;

  const toPx = (point: Point) => ({
    cx: PAD.left + point.x * plotW,
    cy: PAD.top + (1 - point.y) * plotH,
  });

  const splitPxX = PAD.left + splitX * plotW;
  const splitPxY = PAD.top + (1 - splitY) * plotH;
  const hoverPos = hover ? toPx(hover) : null;

  return (
    <div className="relative h-full min-h-[28rem] w-full overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm dark:border-border dark:bg-card">
      <div className="pointer-events-none absolute inset-0 z-20 grid grid-cols-2 grid-rows-2 p-3">
        <div className="justify-self-start self-start">
          <QuadrantBadge zone="waste_risk" />
        </div>
        <div className="justify-self-end self-start">
          <QuadrantBadge zone="high_usage" />
        </div>
        <div className="justify-self-start self-end">
          <QuadrantBadge zone="low_activity" />
        </div>
        <div className="justify-self-end self-end">
          <QuadrantBadge zone="efficient" />
        </div>
      </div>

      <svg
        viewBox={`0 0 ${viewW} ${viewH}`}
        className="absolute inset-0 h-full w-full"
        role="img"
        aria-label="Menu waste analysis matrix: stock issued versus menu sales"
      >
        <rect
          x={PAD.left}
          y={PAD.top}
          width={Math.max(0, splitPxX - PAD.left)}
          height={Math.max(0, splitPxY - PAD.top)}
          fill={ZONE.waste_risk.fill}
        />
        <rect
          x={splitPxX}
          y={PAD.top}
          width={Math.max(0, PAD.left + plotW - splitPxX)}
          height={Math.max(0, splitPxY - PAD.top)}
          fill={ZONE.high_usage.fill}
        />
        <rect
          x={PAD.left}
          y={splitPxY}
          width={Math.max(0, splitPxX - PAD.left)}
          height={Math.max(0, PAD.top + plotH - splitPxY)}
          fill={ZONE.low_activity.fill}
        />
        <rect
          x={splitPxX}
          y={splitPxY}
          width={Math.max(0, PAD.left + plotW - splitPxX)}
          height={Math.max(0, PAD.top + plotH - splitPxY)}
          fill={ZONE.efficient.fill}
        />

        {[0.25, 0.5, 0.75].map((t) => (
          <g key={t} opacity={0.35}>
            <line
              x1={PAD.left + t * plotW}
              y1={PAD.top}
              x2={PAD.left + t * plotW}
              y2={PAD.top + plotH}
              stroke="#CBD5E1"
              strokeDasharray="4 6"
            />
            <line
              x1={PAD.left}
              y1={PAD.top + t * plotH}
              x2={PAD.left + plotW}
              y2={PAD.top + t * plotH}
              stroke="#CBD5E1"
              strokeDasharray="4 6"
            />
          </g>
        ))}

        <line
          x1={splitPxX}
          y1={PAD.top}
          x2={splitPxX}
          y2={PAD.top + plotH}
          stroke="#94A3B8"
          strokeWidth={1.75}
        />
        <line
          x1={PAD.left}
          y1={splitPxY}
          x2={PAD.left + plotW}
          y2={splitPxY}
          stroke="#94A3B8"
          strokeWidth={1.75}
        />

        <rect
          x={PAD.left}
          y={PAD.top}
          width={plotW}
          height={plotH}
          fill="none"
          stroke="#E2E8F0"
          strokeWidth={1.5}
          rx={4}
        />

        {points.map((point) => {
          const { cx, cy } = toPx(point);
          const color = ZONE[point.zone].color;
          const active = hover?.dish === point.dish;
          return (
            <g
              key={point.dish}
              className="cursor-pointer"
              onMouseEnter={() => setHover(point)}
              onMouseLeave={() => setHover(null)}
              onClick={() => onInvestigate?.(point.dish)}
            >
              <circle
                cx={cx}
                cy={cy}
                r={active ? 9 : 7}
                fill={color}
                stroke="#fff"
                strokeWidth={2}
                opacity={hover && !active ? 0.45 : 1}
              />
              <text
                x={cx + point.labelDx}
                y={cy + point.labelDy}
                fill="#0F172A"
                fontSize={11}
                fontWeight={600}
                dominantBaseline="middle"
                style={{ paintOrder: "stroke", stroke: "#fff", strokeWidth: 3 }}
              >
                {point.dish}
              </text>
            </g>
          );
        })}
      </svg>

      {hover && hoverPos && (
        <div
          className="pointer-events-none absolute z-30 min-w-[210px] -translate-y-full rounded-xl bg-slate-900 px-3.5 py-3 text-[11px] text-white shadow-xl ring-1 ring-white/10"
          style={{
            left: `min(calc(${(hoverPos.cx / viewW) * 100}% + 14px), calc(100% - 230px))`,
            top: `max(12px, calc(${(hoverPos.cy / viewH) * 100}% - 12px))`,
          }}
        >
          <p className="mb-2 text-[12px] font-bold">{hover.dish}</p>
          <dl className="space-y-1.5">
            <div className="flex justify-between gap-6">
              <dt className="text-slate-400">Stock Issued</dt>
              <dd className="font-semibold tabular-nums">{hover.issued.toFixed(0)} portions</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-slate-400">Units Sold</dt>
              <dd className="font-semibold tabular-nums">{hover.sold.toLocaleString()} portions</dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-slate-400">Variance</dt>
              <dd
                className={cn(
                  "font-semibold tabular-nums",
                  hover.variance > 0 && hover.wastePct >= ALERT_WARN_PCT
                    ? ZONE[hover.zone].tip
                    : "text-white",
                )}
              >
                {hover.variance >= 0 ? "+" : ""}
                {hover.variance.toFixed(0)} portions
              </dd>
            </div>
            <div className="flex justify-between gap-6">
              <dt className="text-slate-400">Waste %</dt>
              <dd
                className={cn(
                  "font-semibold tabular-nums",
                  hover.wastePct >= ALERT_WARN_PCT ? ZONE[hover.zone].tip : "text-white",
                )}
              >
                {fmtPct(hover.wastePct)}
              </dd>
            </div>
            <div className="flex justify-between gap-6 border-t border-white/10 pt-1.5">
              <dt className="text-slate-400">Status</dt>
              <dd className={cn("font-bold", ZONE[hover.zone].tip)}>{ZONE[hover.zone].label}</dd>
            </div>
          </dl>
        </div>
      )}
    </div>
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
  onPeriodChange: (period: Period) => void;
  isLoading?: boolean;
  /** Opens the page's existing DishDialog — the investigation surface. */
  onInvestigate?: (dish: string) => void;
}) {
  const points = useMemo(() => buildPoints(items), [items]);
  const medSold = useMemo(() => median(points.map((point) => point.sold)), [points]);
  const medIssued = useMemo(() => median(points.map((point) => point.issued)), [points]);
  const maxSold = useMemo(() => Math.max(1, ...points.map((point) => point.sold)) * 1.08, [points]);
  const maxIssued = useMemo(
    () => Math.max(1, ...points.map((point) => point.issued)) * 1.08,
    [points],
  );

  const alerts = useMemo(
    () => [...points].sort((a, b) => b.wastePct - a.wastePct).slice(0, 6),
    [points],
  );

  const recommendations = useMemo(() => buildRecommendations(points), [points]);
  const [activeTip, setActiveTip] = useState(0);
  const tip = recommendations[Math.min(activeTip, recommendations.length - 1)];

  const worstWaste = useMemo(
    () =>
      [...points]
        .filter((point) => point.zone === "waste_risk")
        .sort((a, b) => b.wastePct - a.wastePct)[0] ??
      [...points].sort((a, b) => b.wastePct - a.wastePct)[0],
    [points],
  );

  const investigate = () => {
    if (worstWaste) onInvestigate?.(worstWaste.dish);
    else toast.message("No waste-risk dishes in this period.");
  };

  return (
    <Card className="flex h-full flex-col overflow-hidden border border-border/60 bg-card shadow-sm">
      <CardHeader className="flex flex-row flex-wrap items-center justify-between gap-3 border-b border-border/40 px-5 pb-3 pt-4">
        <CardTitle className="text-[14px] font-bold tracking-tight text-foreground">
          Menu Waste Analysis: Stock Issued vs. Menu Sales
        </CardTitle>
        <div className="flex items-center gap-2">
          <div className="flex items-center rounded-lg bg-slate-100 p-0.5 dark:bg-muted">
            {PERIODS.map(({ label, value }) => (
              <button
                key={value}
                type="button"
                onClick={() => onPeriodChange(value)}
                className={cn(
                  "rounded-md px-3 py-1.5 text-[11px] font-semibold transition-colors",
                  period === value
                    ? "bg-slate-900 text-white shadow-sm dark:bg-primary dark:text-primary-foreground"
                    : "text-slate-500 hover:text-slate-800 dark:text-muted-foreground dark:hover:text-foreground",
                )}
              >
                {label}
              </button>
            ))}
          </div>
          <button
            type="button"
            aria-label="Expand chart"
            className="grid h-8 w-8 place-items-center rounded-md text-slate-400 transition-colors hover:bg-slate-100 hover:text-slate-700 dark:hover:bg-muted"
          >
            <Maximize2 className="h-3.5 w-3.5" />
          </button>
        </div>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col gap-4 px-5 pb-5 pt-4">
        {isLoading ? (
          <div className="h-[28rem] animate-pulse rounded-xl bg-secondary" />
        ) : !points.length ? (
          <EmptyState
            icon={AlertTriangle}
            title="No dishes sold in this period"
            description="Stock-issued vs. sales appears once POS sales are synced for the window."
          />
        ) : (
          <>
            <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_260px]">
              <div className="grid grid-cols-[40px_minmax(0,1fr)] grid-rows-[minmax(0,1fr)_24px] gap-x-1">
                <div className="relative row-start-1 min-h-[28rem]">
                  <span className="absolute left-1/2 top-4 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    High
                  </span>
                  <span className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 -rotate-90 whitespace-nowrap text-[11px] font-semibold text-slate-500">
                    Stock Issued →
                  </span>
                  <span className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Low
                  </span>
                </div>

                <div className="row-start-1 min-h-[28rem]">
                  <WasteMatrix
                    points={points}
                    medSold={medSold}
                    medIssued={medIssued}
                    maxSold={maxSold}
                    maxIssued={maxIssued}
                    onInvestigate={onInvestigate}
                  />
                </div>

                <div className="col-start-2 flex items-center justify-between px-3">
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    Low
                  </span>
                  <span className="text-[11px] font-semibold text-slate-500">Menu Sales →</span>
                  <span className="text-[10px] font-semibold uppercase tracking-wide text-slate-400">
                    High
                  </span>
                </div>
              </div>

              <aside className="flex flex-col gap-4">
                <div className="rounded-xl border border-border/60 bg-card p-3.5 shadow-sm">
                  <h3 className="mb-3 text-[12px] font-bold text-foreground">Waste Alerts</h3>
                  <ul className="space-y-2.5">
                    {alerts.map((point) => {
                      const warn = point.wastePct >= ALERT_WARN_PCT || point.zone === "waste_risk";
                      return (
                        <li key={point.dish}>
                          <button
                            type="button"
                            onClick={() => onInvestigate?.(point.dish)}
                            className="flex w-full items-center gap-2.5 rounded-lg px-1 py-0.5 text-left transition-colors hover:bg-muted/50"
                          >
                            {warn ? (
                              <AlertTriangle className="h-4 w-4 shrink-0 text-orange-500" />
                            ) : (
                              <CheckCircle2 className="h-4 w-4 shrink-0 text-emerald-500" />
                            )}
                            <span className="min-w-0 flex-1 truncate text-[12px] font-medium text-foreground">
                              {point.dish}
                            </span>
                            <span
                              className={cn(
                                "shrink-0 text-[12px] font-bold tabular-nums",
                                warn ? "text-orange-600" : "text-emerald-600",
                              )}
                            >
                              {point.wastePct >= 0 ? "+" : ""}
                              {Math.round(point.wastePct)}%
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                </div>

                <div className="rounded-xl border border-sky-200/80 bg-sky-50/90 p-3.5 shadow-sm dark:border-sky-900/40 dark:bg-sky-950/30">
                  <div className="mb-2 flex items-center gap-2">
                    <span className="grid h-7 w-7 place-items-center rounded-lg bg-sky-500/15 text-sky-600 dark:text-sky-400">
                      <Sparkles className="h-3.5 w-3.5" />
                    </span>
                    <h3 className="text-[12px] font-bold text-sky-900 dark:text-sky-200">
                      Recommendations
                    </h3>
                  </div>
                  <p className="text-[11.5px] leading-relaxed text-sky-950/80 dark:text-sky-100/80">
                    {tip}
                  </p>
                  {recommendations.length > 1 && (
                    <div className="mt-3 flex gap-1.5">
                      {recommendations.map((_, index) => (
                        <button
                          key={index}
                          type="button"
                          aria-label={`Recommendation ${index + 1}`}
                          onClick={() => setActiveTip(index)}
                          className={cn(
                            "h-1.5 rounded-full transition-all",
                            index === activeTip ? "w-4 bg-sky-500" : "w-1.5 bg-sky-300/80",
                          )}
                        />
                      ))}
                    </div>
                  )}
                </div>
              </aside>
            </div>

            <div className="flex flex-wrap items-center gap-2.5 border-t border-border/40 pt-4">
              <button
                type="button"
                onClick={investigate}
                className="inline-flex items-center gap-2 rounded-lg bg-slate-900 px-4 py-2.5 text-[12px] font-semibold text-white shadow-sm transition-opacity hover:opacity-90 dark:bg-primary dark:text-primary-foreground"
              >
                <Search className="h-3.5 w-3.5" />
                Investigate Waste
              </button>
            </div>
          </>
        )}
      </CardContent>
    </Card>
  );
}
