import {
  createContext,
  useContext,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import {
  ArrowDownRight,
  AlertTriangle,
  ArrowUpRight,
  BarChart3,
  BookOpen,
  ChevronDown,
  ChevronRight,
  DollarSign,
  FileText,
  Layers,
  LayoutDashboard,
  Lightbulb,
  MapPin,
  Package,
  Percent,
  RefreshCw,
  Settings,
  ShoppingCart,
  Soup,
  Sparkles,
  Star,
  TrendingDown,
  Truck,
  User,
  Wallet,
  XCircle,
  type LucideIcon,
} from "lucide-react";
import { LOGO_ALT, LOGO_SRC } from "@/components/AppLogo";

/**
 * Static replica of the real Overview screen (pages/dashboard/Overview.tsx +
 * DashboardLayout.tsx) for marketing pages. Colours are the literal light-theme
 * values of the design tokens in styles.css, so it stays light in dark mode.
 * All numbers are sample data and are captioned as such where it is shown.
 */

const CSS = `
.dm { font-family: 'Inter Variable','Inter',system-ui,sans-serif; color: #152019; text-align: left; }
.dm *, .dm *::before, .dm *::after { box-sizing: border-box; }
.dm a { text-decoration: none; }
.dm > .dm-card { height:100%; }
.dm-card { background:#fff; border:1px solid #e3ece7; border-radius:16px; box-shadow:0 1px 2px rgba(7,26,20,.04); }
.dm-card-h { padding:14px 18px 10px; border-bottom:1px solid #eaf1ed; }
.dm-card-t { font-size:13px; font-weight:700; line-height:1.2; }
.dm-card-s { font-size:10px; color:#66736b; margin-top:2px; }
.dm-kpis { display:grid; grid-template-columns:repeat(auto-fit,minmax(150px,1fr)); gap:12px; }
.dm-kpi { padding:16px; display:flex; flex-direction:column; gap:12px; }
.dm-kpi-top { display:flex; height:36px; align-items:flex-start; justify-content:space-between; }
.dm-tile { display:grid; place-items:center; width:36px; height:36px; border-radius:12px; }
.dm-delta { display:inline-flex; align-items:center; gap:2px; padding:2px 6px; border-radius:6px; font-size:10px; font-weight:700; font-variant-numeric:tabular-nums; }
.dm-kpi-l { font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#66736b; }
.dm-kpi-v { font-size:18px; font-weight:900; letter-spacing:-.01em; font-variant-numeric:tabular-nums; }
.dm-kpi-f { font-size:10px; line-height:1.35; color:#66736b; margin-top:auto; }
.dm-tabs { display:inline-flex; gap:2px; padding:2px; border:1px solid #e3ece7; border-radius:8px; background:#f1f6f3; font-size:11px; font-weight:600; color:#66736b; }
.dm-tabs span { padding:4px 10px; border-radius:6px; }
.dm-tabs .on { background:#16a34a; color:#fff; box-shadow:0 1px 2px rgba(0,0,0,.12); }
.dm-legend { display:flex; gap:16px; margin-top:8px; font-size:10px; font-weight:500; color:#66736b; align-items:center; }
.dm-legend i { display:inline-block; width:16px; margin-right:6px; vertical-align:middle; }
.dm-alert { display:flex; align-items:center; gap:10px; padding:10px 14px; border-top:1px solid #eaf1ed; border-left:3px solid; }
.dm-chip { padding:1px 7px; border-radius:999px; font-size:10px; font-weight:700; }
.dm-row3 { display:grid; grid-template-columns:minmax(0,1fr) auto 72px; column-gap:8px; align-items:center; padding:7px 0; white-space:nowrap; border-bottom:1px solid #eef3f0; font-size:12px; }
.dm-banner { display:flex; flex-wrap:wrap; gap:12px; align-items:center; justify-content:space-between; padding:16px 20px; border-radius:12px; color:#fff; background:linear-gradient(90deg,#073b2a 0%,#0f7a4c 50%,#22c55e 100%); box-shadow:0 8px 24px rgba(0,0,0,.05); }
.dm-pill { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 12px; border-radius:8px; font-size:12px; font-weight:600; border:1px solid rgba(255,255,255,.3); background:rgba(255,255,255,.1); color:#fff; }
.dm-pill.on { background:#fff; color:#0f7a4c; border-color:#fff; }
@keyframes dm-ping { 75%,100% { transform:scale(2.2); opacity:0; } }
.dm-live { position:relative; width:8px; height:8px; }
.dm-live { --dot:#d97706; }
.dm-live::before, .dm-live::after { content:""; position:absolute; inset:0; border-radius:50%; background:var(--dot); }
.dm-live::before { animation:dm-ping 1.6s cubic-bezier(0,0,.2,1) infinite; opacity:.75; }
@media (prefers-reduced-motion: reduce) { .dm-live::before { animation:none; } }
.dm-app { display:flex; width:1120px; background:#fff; overflow:hidden; }
.dm-side { width:208px; flex-shrink:0; background:#071a14; color:#dde7e1; display:flex; flex-direction:column; border-right:1px solid rgba(255,255,255,.08); }
.dm-side-h { height:64px; display:flex; align-items:center; gap:10px; padding:0 14px; border-bottom:1px solid rgba(255,255,255,.08); }
.dm-side-g { padding:10px 8px 2px; }
.dm-side-gl { padding:6px 8px; font-size:10.5px; font-weight:600; letter-spacing:.08em; text-transform:uppercase; opacity:.5; }
.dm-nav { display:flex; align-items:center; gap:10px; height:40px; padding:0 10px; border-radius:12px; font-size:13px; font-weight:500; margin-bottom:2px; }
.dm-nav.on { background:#16a34a; color:#fff; }
.dm-nav-b { margin-left:auto; padding:1px 6px; border-radius:4px; font-size:9px; font-weight:700; letter-spacing:.08em; background:rgba(22,163,74,.15); color:#4ade80; }
.dm-main { flex:1; min-width:0; display:flex; flex-direction:column; position:relative; }
.dm-top { height:64px; flex-shrink:0; display:flex; align-items:center; gap:12px; padding:0 24px; border-bottom:1px solid #dde7e1; background:#fff; }
.dm-content { padding:20px 24px; display:flex; flex-direction:column; gap:16px; }
/* POS Sales page */
.dm-h1 { display:flex; align-items:center; gap:8px; font-size:20px; font-weight:700; letter-spacing:-.01em; }
.dm-btn { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 12px; border-radius:8px; border:1px solid #e3ece7; background:#fff; font-size:11px; font-weight:500; }
.dm-pkpi { padding:16px 20px; }
.dm-pkpi-top { display:flex; align-items:center; justify-content:space-between; margin-bottom:12px; }
.dm-pkpi-v { font-size:20px; font-weight:700; font-variant-numeric:tabular-nums; line-height:1.15; white-space:nowrap; }
.dm-field { display:inline-flex; align-items:center; gap:6px; height:32px; padding:0 12px; border-radius:8px; border:1px solid #e3ece7; background:#fff; font-size:11px; color:#152019; }
.dm-table { width:100%; border-collapse:collapse; }
.dm-table th { padding:10px 16px; text-align:left; font-size:10px; font-weight:700; letter-spacing:.08em; text-transform:uppercase; color:#66736b; white-space:nowrap; background:#f4f8f6; border-bottom:1px solid #e3ece7; }
.dm-table td { padding:11px 16px; border-bottom:1px solid #eef3f0; font-size:11px; white-space:nowrap; }
.dm-table.plain th { background:transparent; font-size:9.5px; padding:10px 12px; }
.dm-table.plain td { padding:12px; }
.dm-table.plain th:first-child, .dm-table.plain td:first-child { padding-left:20px; }
.dm-table.tight th, .dm-table.tight td { padding-left:8px; padding-right:8px; }
.dm-table.tight th:first-child, .dm-table.tight td:first-child { padding-left:16px; }
.dm-badge { display:inline-block; padding:1px 6px; border-radius:6px; border:1px solid; font-size:9px; font-weight:700; text-transform:uppercase; }
`;

type Tone = "primary" | "info" | "warning" | "destructive" | "success";
const TILE: Record<Tone, { bg: string; fg: string }> = {
  primary: { bg: "rgba(22,163,74,.15)", fg: "#16a34a" },
  success: { bg: "rgba(22,163,74,.15)", fg: "#16a34a" },
  info: { bg: "rgba(37,99,235,.15)", fg: "#2563eb" },
  warning: { bg: "rgba(245,158,11,.15)", fg: "#f59e0b" },
  destructive: { bg: "rgba(220,38,38,.15)", fg: "#dc2626" },
};

const KPIS: {
  label: string;
  value: string;
  icon: LucideIcon;
  tone: Tone;
  delta?: { text: string; up: boolean };
  foot: string;
  spark?: number[];
}[] = [
  {
    label: "Revenue",
    value: "AED 482.0k",
    icon: DollarSign,
    tone: "primary",
    delta: { text: "+12.4%", up: true },
    foot: "vs last month",
    spark: [38, 41, 40, 45, 44, 49, 52, 58],
  },
  {
    label: "Orders",
    value: "1,284",
    icon: ShoppingCart,
    tone: "info",
    delta: { text: "+6.1%", up: true },
    foot: "this month",
    spark: [30, 34, 33, 36, 39, 37, 42, 44],
  },
  {
    label: "Food Cost %",
    value: "31.2%",
    icon: Percent,
    tone: "warning",
    delta: { text: "0.8pp", up: false },
    foot: "vs prior period",
    spark: [34, 33, 34, 33, 32, 32, 31, 31],
  },
  {
    label: "Waste %",
    value: "2.4%",
    icon: TrendingDown,
    tone: "destructive",
    foot: "month · ingredient variance vs. revenue",
  },
  {
    label: "Profit",
    value: "AED 331.6k",
    icon: Wallet,
    tone: "success",
    foot: "gross margin, POS vs Tally",
  },
];

function Spark({ data }: { data: number[] }) {
  const min = Math.min(...data);
  const max = Math.max(...data);
  const pts = data
    .map(
      (v, i) =>
        `${(i / (data.length - 1)) * 100},${21 - (max === min ? 0.5 : (v - min) / (max - min)) * 18}`,
    )
    .join(" ");
  return (
    <svg viewBox="0 0 100 24" preserveAspectRatio="none" style={{ width: "100%", height: 20 }}>
      <polyline
        fill="none"
        stroke="rgba(22,163,74,.6)"
        strokeWidth={2}
        strokeLinejoin="round"
        strokeLinecap="round"
        vectorEffect="non-scaling-stroke"
        points={pts}
      />
    </svg>
  );
}

const StylesMounted = createContext(false);

export function Styles() {
  return useContext(StylesMounted) ? null : <style>{CSS}</style>;
}

/** Row of five KPI cards — the top of the Overview screen. */
export function MockKpis() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-kpis">
        {KPIS.map((k) => {
          const Icon = k.icon;
          const t = TILE[k.tone];
          return (
            <div key={k.label} className="dm-card dm-kpi">
              <div className="dm-kpi-top">
                <span className="dm-tile" style={{ background: t.bg, color: t.fg }}>
                  <Icon size={16} />
                </span>
                {k.delta ? (
                  <span
                    className="dm-delta"
                    style={{ background: "rgba(22,163,74,.1)", color: "#16a34a" }}
                  >
                    {k.delta.up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
                    {k.delta.text}
                  </span>
                ) : null}
              </div>
              <div>
                <div className="dm-kpi-l">{k.label}</div>
                <div className="dm-kpi-v">{k.value}</div>
              </div>
              <div style={{ height: 20 }}>{k.spark ? <Spark data={k.spark} /> : null}</div>
              <div className="dm-kpi-f">{k.foot}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CUR = Array.from(
  { length: 30 },
  (_, i) => 12.3 + i * 0.22 + 2.6 * Math.sin(i / 2.1) + ((i * 7) % 5) * 0.3,
);
const PREV = Array.from(
  { length: 30 },
  (_, i) => 11 + i * 0.18 + 2.4 * Math.sin(i / 2.4 + 0.8) + ((i * 5) % 4) * 0.3,
);

/** Quadratic midpoint smoothing — close enough to the app's monotone curve. */
function curve(pts: [number, number][]) {
  let d = `M${pts[0][0]},${pts[0][1]}`;
  for (let i = 1; i < pts.length - 1; i++) {
    const [x, y] = pts[i];
    const [nx, ny] = pts[i + 1];
    d += ` Q${x},${y} ${(x + nx) / 2},${(y + ny) / 2}`;
  }
  const last = pts[pts.length - 1];
  return `${d} L${last[0]},${last[1]}`;
}

/** "Performance Trends" card — this period solid, previous period dashed. */
export function MockTrends() {
  const W = 560;
  const H = 210;
  const L = 40;
  const R = 10;
  const T = 10;
  const B = 24;
  const max = 24;
  const xy = (arr: number[]): [number, number][] =>
    arr.map((v, i) => [L + (i * (W - L - R)) / (arr.length - 1), T + (1 - v / max) * (H - T - B)]);
  const cur = xy(CUR);
  const prev = xy(PREV);
  const area = `${curve(cur)} L${cur[cur.length - 1][0]},${H - B} L${cur[0][0]},${H - B} Z`;
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div
          className="dm-card-h"
          style={{ display: "flex", justifyContent: "space-between", gap: 12, flexWrap: "wrap" }}
        >
          <div>
            <div className="dm-card-t">Performance Trends</div>
            <div className="dm-card-s">Trailing metrics this month</div>
            <div className="dm-legend">
              <span>
                <i style={{ height: 2, borderRadius: 2, background: "#16a34a" }} />
                This Month
              </span>
              <span>
                <i style={{ height: 0, borderTop: "2px dashed #66736b" }} />
                Last Month
              </span>
            </div>
          </div>
          <div className="dm-tabs" style={{ alignSelf: "flex-start" }}>
            <span className="on">Sales</span>
            <span>Orders</span>
            <span>Food Cost</span>
            <span>Margin</span>
          </div>
        </div>
        <div style={{ padding: "12px 14px 14px" }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              <linearGradient id="dmFill" x1="0" y1="0" x2="0" y2="1">
                <stop offset="0%" stopColor="#16a34a" stopOpacity="0.28" />
                <stop offset="100%" stopColor="#16a34a" stopOpacity="0" />
              </linearGradient>
            </defs>
            {[0, 8, 16, 24].map((v) => {
              const y = T + (1 - v / max) * (H - T - B);
              return (
                <g key={v}>
                  <line x1={L} x2={W - R} y1={y} y2={y} stroke="#eaf1ed" strokeDasharray="3 3" />
                  <text x={L - 8} y={y + 3} textAnchor="end" fontSize="9.5" fill="#66736b">
                    {v === 0 ? "0" : `${v}k`}
                  </text>
                </g>
              );
            })}
            {[0, 7, 14, 21, 29].map((i) => (
              <text
                key={i}
                x={cur[i][0]}
                y={H - 6}
                textAnchor={i === 29 ? "end" : "middle"}
                fontSize="9.5"
                fill="#66736b"
              >
                {`09-${String(i + 1).padStart(2, "0")}`}
              </text>
            ))}
            <path
              d={curve(prev)}
              fill="none"
              stroke="#66736b"
              strokeWidth="1.6"
              strokeDasharray="4 4"
              opacity="0.7"
            />
            <path d={area} fill="url(#dmFill)" />
            <path
              d={curve(cur)}
              fill="none"
              stroke="#16a34a"
              strokeWidth="2.2"
              strokeLinecap="round"
            />
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Live-dot + count badge + subtitle header shared by the Inventory Alerts states. */
function AlertsShell({
  live,
  count,
  sub,
  subTone,
  children,
}: {
  live: "red" | "amber" | "green";
  count?: number;
  sub: ReactNode;
  subTone?: string;
  children: ReactNode;
}) {
  const dot = { red: "#dc2626", amber: "#f59e0b", green: "#16a34a" }[live];
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ display: "flex", flexDirection: "column" }}>
        <div style={{ padding: "16px 16px 10px", borderBottom: "1px solid #eaf1ed" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <span className="dm-live" style={{ ["--dot" as string]: dot }} />
            <span
              style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".16em", color: "#66736b" }}
            >
              LIVE
            </span>
            <span style={{ fontSize: 12, fontWeight: 700, flex: 1 }}>Inventory Alerts</span>
            {count ? (
              <span
                style={{
                  padding: "1px 8px",
                  borderRadius: 999,
                  fontSize: 10,
                  fontWeight: 700,
                  background: "rgba(220,38,38,.1)",
                  color: "#dc2626",
                }}
              >
                {count}
              </span>
            ) : null}
          </div>
          <div style={{ marginTop: 4, fontSize: 10, color: subTone ?? "#66736b" }}>{sub}</div>
        </div>
        <div style={{ padding: "12px 16px 16px" }}>{children}</div>
      </div>
    </div>
  );
}

const ALERTS = [
  { item: "Paneer", sev: "critical", units: "0", detail: "out of stock", isNew: true },
  { item: "Chicken Breast", sev: "critical", units: "1.2", detail: "below safety level" },
  { item: "Tomato", sev: "low", units: "3.5", detail: "below 5 units" },
  { item: "Basmati Rice", sev: "low", units: "4.1", detail: "below 5 units" },
] as const;

const SEV = {
  critical: {
    rail: "#dc2626",
    bg: "rgba(220,38,38,.1)",
    fg: "#dc2626",
    label: "Critical",
    Icon: XCircle,
  },
  low: {
    rail: "#f59e0b",
    bg: "rgba(245,158,11,.14)",
    fg: "#f59e0b",
    label: "Low",
    Icon: AlertTriangle,
  },
} as const;

/** "Inventory Alerts" — the live critical/low stock feed (InventoryAlertsCard). */
export function MockAlerts() {
  return (
    <AlertsShell live="red" count={4} sub="2 critical · 2 low · updated 12s ago">
      <div style={{ display: "grid", gap: 8 }}>
        {ALERTS.map((a) => {
          const s = SEV[a.sev];
          return (
            <div
              key={a.item}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 10,
                border: "1px solid #e3ece7",
                borderLeft: `2px solid ${s.rail}`,
                background: "rgba(241,246,243,.5)",
                outline: "isNew" in a && a.isNew ? "1px solid rgba(22,163,74,.4)" : undefined,
              }}
            >
              <s.Icon size={16} color={s.fg} style={{ flexShrink: 0 }} />
              <div style={{ minWidth: 0, flex: 1 }}>
                <div style={{ display: "flex", gap: 6, alignItems: "center" }}>
                  <span
                    style={{
                      padding: "1px 6px",
                      borderRadius: 4,
                      fontSize: 8,
                      fontWeight: 700,
                      letterSpacing: ".08em",
                      textTransform: "uppercase",
                      background: s.bg,
                      color: s.fg,
                    }}
                  >
                    {s.label}
                  </span>
                  {"isNew" in a && a.isNew ? (
                    <span
                      style={{
                        padding: "1px 6px",
                        borderRadius: 4,
                        fontSize: 8,
                        fontWeight: 700,
                        letterSpacing: ".08em",
                        textTransform: "uppercase",
                        background: "rgba(22,163,74,.15)",
                        color: "#16a34a",
                      }}
                    >
                      New
                    </span>
                  ) : null}
                </div>
                <div style={{ marginTop: 2, fontSize: 11, fontWeight: 600 }}>{a.item}</div>
                <div style={{ fontSize: 10, color: "#66736b" }}>
                  {a.units} units left · {a.detail}
                </div>
              </div>
              <ChevronRight size={14} color="rgba(102,115,107,.45)" />
            </div>
          );
        })}
      </div>
      <div
        style={{
          marginTop: 10,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          padding: "8px 10px",
          borderRadius: 10,
          border: "1px solid #e3ece7",
          fontSize: 10,
          fontWeight: 600,
          color: "#66736b",
        }}
      >
        View all 4 alerts in Inventory
        <ChevronRight size={14} />
      </div>
    </AlertsShell>
  );
}

/** The two non-happy states of the same card: feed unreachable, and nothing to flag. */
export function MockAlertStates() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <AlertsShell live="red" sub="Stock feed unavailable" subTone="#dc2626">
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            gap: 8,
            padding: "14px 0",
            textAlign: "center",
          }}
        >
          <AlertTriangle size={20} color="rgba(220,38,38,.7)" />
          <div style={{ fontSize: 11.5, fontWeight: 500, color: "#66736b" }}>
            Could not reach the stock feed
          </div>
          <span className="dm-btn" style={{ height: 28, fontSize: 10 }}>
            <RefreshCw size={12} /> Retry
          </span>
        </div>
      </AlertsShell>
      <AlertsShell live="green" sub="0 critical · 0 low · updated 4s ago">
        <div
          style={{
            display: "grid",
            justifyItems: "center",
            gap: 6,
            padding: "14px 0",
            textAlign: "center",
          }}
        >
          <Package size={20} color="rgba(102,115,107,.5)" />
          <div style={{ fontSize: 11.5, fontWeight: 500, color: "#66736b" }}>
            No active stock alerts
          </div>
          <div style={{ fontSize: 10, color: "rgba(102,115,107,.75)" }}>
            All tracked items are within healthy levels
          </div>
        </div>
      </AlertsShell>
    </div>
  );
}

const AI_ITEMS: {
  dish: string;
  copy: string;
  sold: string;
  revenue: string;
  waste?: string;
}[] = [
  {
    dish: "Falafel Bowl",
    copy: "Review the recipe and supplier cost first; if neither improves, consider removing it.",
    sold: "141 sold",
    revenue: "AED 3.4k revenue",
    waste: "6.1% waste",
  },
  {
    dish: "Butter Chicken Rice",
    copy: "A AED 3.00 price increase could add about AED 678.00 over 30 days at current sales.",
    sold: "226 sold",
    revenue: "AED 7.9k revenue",
    waste: "2.8% waste",
  },
  {
    dish: "Paneer Tikka",
    copy: "Don't discount first. Make it easier to notice and pair it with a popular item.",
    sold: "164 sold",
    revenue: "AED 4.9k revenue",
  },
];

/** Overview's "AI Insights" card — next actions from menu engineering. */
export function MockAiInsights() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div
          className="dm-card-h"
          style={{ display: "flex", alignItems: "center", gap: 8, padding: "16px 20px 12px" }}
        >
          <span
            style={{
              display: "grid",
              placeItems: "center",
              width: 28,
              height: 28,
              borderRadius: 8,
              background: "rgba(22,163,74,.1)",
              color: "#16a34a",
            }}
          >
            <Lightbulb size={14} />
          </span>
          <div style={{ flex: 1 }}>
            <div className="dm-card-t">AI Insights</div>
            <div className="dm-card-s" style={{ marginTop: 0 }}>
              Recommended next actions from your live data
            </div>
          </div>
          <span style={{ fontSize: 10, fontWeight: 600, color: "#16a34a" }}>Ask Pilot AI →</span>
        </div>
        <div style={{ display: "grid", gap: 8, padding: "16px 20px" }}>
          {AI_ITEMS.map((r) => (
            <div
              key={r.dish}
              style={{
                display: "flex",
                gap: 12,
                alignItems: "flex-start",
                padding: 12,
                borderRadius: 10,
                border: "1px solid #e8efeb",
                background: "rgba(241,246,243,.5)",
              }}
            >
              <Lightbulb size={16} color="#16a34a" style={{ marginTop: 2, flexShrink: 0 }} />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 11, fontWeight: 700 }}>{r.dish}</div>
                <div style={{ marginTop: 2, fontSize: 11, lineHeight: 1.6, color: "#66736b" }}>
                  {r.copy}
                </div>
                <div
                  style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 8,
                    marginTop: 8,
                    fontSize: 10,
                    fontWeight: 500,
                    color: "#66736b",
                  }}
                >
                  <span style={{ padding: "2px 6px", borderRadius: 4, background: "#fff" }}>
                    {r.sold}
                  </span>
                  <span style={{ padding: "2px 6px", borderRadius: 4, background: "#fff" }}>
                    {r.revenue}
                  </span>
                  {r.waste ? (
                    <span
                      style={{
                        padding: "2px 6px",
                        borderRadius: 4,
                        background: "rgba(249,115,22,.1)",
                        color: "#ea580c",
                      }}
                    >
                      {r.waste}
                    </span>
                  ) : null}
                </div>
              </div>
              <span
                style={{
                  marginTop: 2,
                  display: "flex",
                  alignItems: "center",
                  fontSize: 10,
                  fontWeight: 600,
                  color: "#16a34a",
                  opacity: 0.7,
                }}
              >
                View <ChevronRight size={14} />
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** "POS vs Tally Reconciliation" — margin ring, headline pair, branch coverage, mismatch warning. */
export function MockRecon() {
  const C = 2 * Math.PI * 28;
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div className="dm-card-h" style={{ padding: "16px 16px 8px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
            <span style={{ fontSize: 12, fontWeight: 700 }}>POS vs Tally Reconciliation</span>
            <ChevronRight size={12} color="#66736b" />
          </div>
          <div style={{ fontSize: 10, color: "#66736b", marginTop: 2 }}>
            Click to view full detail
          </div>
        </div>
        <div style={{ display: "grid", gap: 12, padding: "12px 16px 16px" }}>
          <div style={{ display: "flex", gap: 16, alignItems: "flex-start" }}>
            <div style={{ position: "relative", width: 72, height: 72, flexShrink: 0 }}>
              <svg width="72" height="72" viewBox="0 0 72 72">
                <circle cx="36" cy="36" r="28" fill="none" stroke="#dde7e1" strokeWidth="8" />
                <circle
                  cx="36"
                  cy="36"
                  r="28"
                  fill="none"
                  stroke="#16a34a"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={`${0.688 * C} ${C}`}
                  transform="rotate(-90 36 36)"
                />
              </svg>
              <span
                style={{
                  position: "absolute",
                  inset: 0,
                  display: "grid",
                  placeItems: "center",
                  fontSize: 11,
                  fontWeight: 900,
                }}
              >
                68.8%
              </span>
            </div>
            <div style={{ display: "grid", gap: 6 }}>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#66736b" }}>POS Revenue</div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#16a34a" }}>AED 482.0k</div>
              </div>
              <div>
                <div style={{ fontSize: 10, fontWeight: 600, color: "#66736b" }}>
                  Tally Purchases
                </div>
                <div style={{ fontSize: 14, fontWeight: 900, color: "#dc2626" }}>AED 150.4k</div>
              </div>
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 8 }}>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(22,163,74,.2)",
                background: "rgba(22,163,74,.06)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#66736b",
                }}
              >
                Gross Margin
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#16a34a" }}>AED 331.6k</div>
            </div>
            <div
              style={{
                padding: "6px 10px",
                borderRadius: 8,
                border: "1px solid rgba(245,158,11,.2)",
                background: "rgba(245,158,11,.07)",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 600,
                  textTransform: "uppercase",
                  color: "#66736b",
                }}
              >
                Food Cost
              </div>
              <div style={{ fontSize: 13, fontWeight: 700, color: "#f59e0b" }}>31.2%</div>
            </div>
          </div>
          <div style={{ display: "grid", gap: 4, fontSize: 10 }}>
            <div
              style={{
                fontWeight: 700,
                letterSpacing: ".08em",
                textTransform: "uppercase",
                color: "#66736b",
              }}
            >
              Branch Coverage
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "#16a34a" }} />
              <span style={{ color: "#66736b" }}>Both systems:</span>
              <b>4</b>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
              <span style={{ width: 8, height: 8, borderRadius: 99, background: "#f59e0b" }} />
              <span style={{ color: "#66736b" }}>POS only:</span>
              <b style={{ color: "#f59e0b", fontWeight: 600 }}>Al Barsha</b>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              gap: 6,
              alignItems: "flex-start",
              padding: 8,
              borderRadius: 8,
              background: "rgba(245,158,11,.1)",
              border: "1px solid rgba(245,158,11,.2)",
            }}
          >
            <AlertTriangle size={14} color="#f59e0b" style={{ marginTop: 2, flexShrink: 0 }} />
            <span style={{ fontSize: 10, fontWeight: 500, color: "#f59e0b" }}>
              1 branch(es) have POS sales but no Tally entries
            </span>
          </div>
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              borderTop: "1px solid #eaf1ed",
              paddingTop: 8,
              fontSize: 10,
              color: "#66736b",
            }}
          >
            <span>1,284 POS orders</span>
            <span>86 Tally vouchers</span>
          </div>
        </div>
      </div>
    </div>
  );
}

const BRANCHES = [
  { name: "Marina", rev: "AED 148.2k", pct: 30.7 },
  { name: "Business Bay", rev: "AED 121.6k", pct: 25.2 },
  { name: "JLT", rev: "AED 96.4k", pct: 20.0 },
  { name: "Deira", rev: "AED 71.3k", pct: 14.8 },
  { name: "Al Barsha", rev: "AED 44.5k", pct: 9.3 },
];

/** "Branch Comparison" — revenue and share of network per outlet. */
export function MockBranches() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div className="dm-card-h">
          <div className="dm-card-t">Branch Comparison</div>
          <div className="dm-card-s">Revenue and share of network this month</div>
        </div>
        <div style={{ padding: "8px 18px 12px" }}>
          <div
            className="dm-row3"
            style={{ fontSize: 10, fontWeight: 600, color: "#66736b", padding: "0 0 4px" }}
          >
            <span>Branch</span>
            <span>Revenue</span>
            <span>Share</span>
          </div>
          {BRANCHES.map((b, i) => (
            <div key={b.name} className="dm-row3">
              <span style={{ fontWeight: 600 }}>{b.name}</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>{b.rev}</span>
              <span style={{ display: "flex", alignItems: "center", gap: 6 }}>
                <span
                  style={{
                    flex: 1,
                    height: 6,
                    borderRadius: 99,
                    background: "#eef3f0",
                    overflow: "hidden",
                  }}
                >
                  <span
                    style={{
                      display: "block",
                      height: "100%",
                      width: `${(b.pct / BRANCHES[0].pct) * 100}%`,
                      background: i === 0 ? "#16a34a" : "#86d0a5",
                      borderRadius: 99,
                    }}
                  />
                </span>
                <span style={{ fontSize: 10.5, color: "#66736b", width: 34, textAlign: "right" }}>
                  {b.pct}%
                </span>
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function Banner({ compact }: { compact?: boolean }) {
  return (
    <div className="dm-banner">
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span style={{ fontSize: 20, fontWeight: 800, letterSpacing: "-.01em" }}>Overview</span>
          <span className="dm-live" />
          <span style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".14em", color: "#fbbf24" }}>
            LIVE
          </span>
        </div>
        <div style={{ fontSize: 12, color: "rgba(255,255,255,.8)", marginTop: 2 }}>
          Key metrics and performance at a glance
        </div>
      </div>
      <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
        {compact ? null : (
          <>
            <span className="dm-pill">Today</span>
            <span className="dm-pill">Week</span>
          </>
        )}
        <span className="dm-pill on">Month</span>
        <span className="dm-pill">
          <RefreshCw size={13} />
          Refresh
        </span>
      </div>
    </div>
  );
}

/** The gradient "Overview · Live" banner with period chips and Refresh. */
export function MockLive() {
  return (
    <div className="dm">
      <Styles />
      <Banner />
      <div
        className="dm-card"
        style={{
          marginTop: 12,
          padding: "12px 16px",
          display: "flex",
          gap: 10,
          alignItems: "center",
          fontSize: 12,
        }}
      >
        <span style={{ width: 8, height: 8, borderRadius: 99, background: "#16a34a" }} />
        <span style={{ color: "#3d4a43" }}>
          Every card states its period and comparison label — <b>vs last month</b>,{" "}
          <b>this month</b>.
        </span>
      </div>
    </div>
  );
}

const NAV: { label: string; items: [LucideIcon, string, string?][] }[] = [
  {
    label: "Main",
    items: [
      [LayoutDashboard, "Overview"],
      [ShoppingCart, "POS Sales"],
      [FileText, "Tally / Accounting"],
    ],
  },
  {
    label: "Operations",
    items: [
      [Layers, "Inventory"],
      [BookOpen, "Menu"],
      [Soup, "Menu Engineering"],
      [Truck, "Suppliers"],
      [DollarSign, "Market Prices"],
      [MapPin, "Branches"],
      [Star, "Reviews"],
    ],
  },
  {
    label: "Intelligence",
    items: [
      [Sparkles, "Pilot AI", "AI"],
      [BarChart3, "Reports"],
    ],
  },
  {
    label: "Administration",
    items: [
      [User, "Profile"],
      [Settings, "Settings"],
    ],
  },
];

const TOP_ITEMS = [
  { ini: "BC", name: "Butter Chicken Rice", sold: 226, rev: "AED 7.9k" },
  { ini: "CS", name: "Chicken Shawarma Wrap", sold: 198, rev: "AED 4.0k" },
  { ini: "PT", name: "Paneer Tikka", sold: 164, rev: "AED 4.9k" },
  { ini: "FB", name: "Falafel Bowl", sold: 141, rev: "AED 3.4k" },
];

function BottomCards() {
  return (
    <div style={{ display: "grid", gridTemplateColumns: "repeat(3, minmax(0,1fr))", gap: 16 }}>
      <div className="dm-card">
        <div className="dm-card-h">
          <div className="dm-card-t">Top Selling Items</div>
        </div>
        <div style={{ padding: "6px 18px 12px" }}>
          {TOP_ITEMS.map((t) => (
            <div
              key={t.name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "6px 0",
                borderBottom: "1px solid #eef3f0",
              }}
            >
              <span
                style={{
                  display: "grid",
                  placeItems: "center",
                  width: 28,
                  height: 28,
                  borderRadius: 99,
                  background: "#e8f7ed",
                  color: "#16a34a",
                  fontSize: 10,
                  fontWeight: 700,
                }}
              >
                {t.ini}
              </span>
              <div style={{ flex: 1, minWidth: 0 }}>
                <div
                  style={{
                    fontSize: 12,
                    fontWeight: 600,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {t.name}
                </div>
                <div style={{ fontSize: 10, color: "#66736b" }}>{t.sold} sold</div>
              </div>
              <span style={{ fontSize: 11.5, fontWeight: 700 }}>{t.rev}</span>
            </div>
          ))}
        </div>
      </div>
      <MockRecon />
      <MockBranches />
    </div>
  );
}

/** Scales a fixed-size design to the container width — same idea as the landing hero stage. */
function Stage({ w, h, children }: { w: number; h: number; children: ReactNode }) {
  const ref = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(1);
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el) return;
    const fit = () => setScale(Math.min(1, el.clientWidth / w));
    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(el);
    return () => ro.disconnect();
  }, [w]);
  return (
    <div
      ref={ref}
      style={{ width: "100%", height: h * scale, position: "relative", overflow: "hidden" }}
    >
      <div
        style={{ width: w, height: h, transform: `scale(${scale})`, transformOrigin: "top left" }}
      >
        {children}
      </div>
    </div>
  );
}

/** Browser frame + sidebar + top bar of the real dashboard shell; `children` is the page content. */
export function AppFrame({
  active,
  height = 920,
  children,
}: {
  active: string;
  height?: number;
  children: ReactNode;
}) {
  return (
    <div
      style={{
        borderRadius: 16,
        border: "1px solid #dde7e1",
        background: "#fff",
        overflow: "hidden",
        boxShadow: "0 24px 60px rgba(7,26,20,.12)",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: 6,
          height: 34,
          padding: "0 14px",
          background: "#f1f6f3",
          borderBottom: "1px solid #dde7e1",
        }}
      >
        {["#f87171", "#fbbf24", "#4ade80"].map((c) => (
          <span key={c} style={{ width: 10, height: 10, borderRadius: 99, background: c }} />
        ))}
      </div>
      <Stage w={1120} h={height}>
        <StylesMounted.Provider value>
          <div className="dm dm-app" style={{ height }}>
            <style>{CSS}</style>
            <aside className="dm-side">
              <div className="dm-side-h">
                <img src={LOGO_SRC} alt={LOGO_ALT} style={{ height: 30, width: "auto" }} />
                <span style={{ fontSize: 10, fontWeight: 600, color: "rgba(74,222,128,.85)" }}>
                  Restaurant OS
                </span>
              </div>
              <div style={{ flex: 1, overflow: "hidden" }}>
                {NAV.map((g, gi) => (
                  <div
                    key={g.label}
                    className="dm-side-g"
                    style={gi ? { borderTop: "1px solid rgba(255,255,255,.06)" } : undefined}
                  >
                    <div className="dm-side-gl">{g.label}</div>
                    {g.items.map(([Icon, label, badge]) => (
                      <div key={label} className={`dm-nav${label === active ? " on" : ""}`}>
                        <Icon size={16} />
                        {label}
                        {badge ? <span className="dm-nav-b">{badge}</span> : null}
                      </div>
                    ))}
                  </div>
                ))}
              </div>
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: 10,
                  padding: 12,
                  borderTop: "1px solid rgba(255,255,255,.08)",
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 32,
                    height: 32,
                    borderRadius: 99,
                    background: "rgba(22,163,74,.2)",
                    color: "#4ade80",
                    fontSize: 12,
                    fontWeight: 700,
                  }}
                >
                  O
                </span>
                <div>
                  <div style={{ fontSize: 12, fontWeight: 600, color: "#fff" }}>Owner</div>
                  <div style={{ fontSize: 10, opacity: 0.5 }}>All outlets</div>
                </div>
              </div>
            </aside>
            <div className="dm-main">
              <div className="dm-top">
                <div style={{ flex: 1 }}>
                  <div style={{ fontSize: 18, fontWeight: 700, letterSpacing: "-.01em" }}>
                    Good morning!
                  </div>
                  <div style={{ fontSize: 12, color: "#66736b" }}>
                    Here&apos;s what&apos;s happening at your restaurant today.
                  </div>
                </div>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    height: 36,
                    padding: "0 12px",
                    borderRadius: 99,
                    border: "1px solid #e3ece7",
                    background: "#f6faf8",
                    fontSize: 12,
                    fontWeight: 500,
                    color: "#66736b",
                  }}
                >
                  <MapPin size={13} /> All locations <ChevronDown size={13} />
                </span>
              </div>
              <div className="dm-content">{children}</div>
              <div
                aria-hidden
                style={{
                  position: "absolute",
                  left: 0,
                  right: 0,
                  bottom: 0,
                  height: 90,
                  background: "linear-gradient(to bottom, rgba(255,255,255,0), #fff)",
                }}
              />
            </div>
          </div>
        </StylesMounted.Provider>
      </Stage>
    </div>
  );
}

/** The whole Overview screen inside the app frame. */
export function DashboardMock() {
  return (
    <AppFrame active="Overview">
      <Banner />
      <MockKpis />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "2fr 1fr",
          gap: 16,
        }}
      >
        <MockTrends />
        <MockAlerts />
      </div>
      <BottomCards />
    </AppFrame>
  );
}
