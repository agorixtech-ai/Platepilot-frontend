import {
  AlertTriangle,
  ArrowDownRight,
  ArrowUpRight,
  Building2,
  CheckCircle2,
  Crown,
  DollarSign,
  RefreshCw,
  ShoppingCart,
  type LucideIcon,
} from "lucide-react";
import { AppFrame, Styles } from "./DashboardMock";

/**
 * Static replica of the real Branch Insights screen (pages/dashboard/Branches.tsx).
 * Same rules as DashboardMock: literal light-theme token values, sample data only.
 * Sample figures agree with the Overview and POS mocks (482.0k across 5 outlets).
 */

type Row = {
  name: string;
  color: string;
  revenue: string;
  share: number;
  orders: string;
  avg: string;
  margin: number | null;
  delta: number;
  issues: number;
  spark: number[];
};

const ROWS: Row[] = [
  {
    name: "Marina",
    color: "#16a34a",
    revenue: "AED 148.2k",
    share: 31,
    orders: "395",
    avg: "AED 375",
    margin: 68.9,
    delta: 14.2,
    issues: 3,
    spark: [8, 9, 8, 10, 11, 10, 12, 11, 13, 12, 14, 13, 15, 16],
  },
  {
    name: "Business Bay",
    color: "#22c55e",
    revenue: "AED 121.6k",
    share: 25,
    orders: "324",
    avg: "AED 375",
    margin: 67.5,
    delta: 9.8,
    issues: 2,
    spark: [7, 7, 8, 8, 9, 8, 9, 10, 9, 10, 11, 10, 11, 12],
  },
  {
    name: "JLT",
    color: "#0f7a4c",
    revenue: "AED 96.4k",
    share: 20,
    orders: "258",
    avg: "AED 374",
    margin: 70.1,
    delta: 6.4,
    issues: 0,
    spark: [6, 6, 7, 6, 7, 7, 8, 7, 8, 8, 8, 9, 9, 9],
  },
  {
    name: "Deira",
    color: "#d97706",
    revenue: "AED 71.3k",
    share: 15,
    orders: "190",
    avg: "AED 375",
    margin: 64.2,
    delta: -13.1,
    issues: 5,
    spark: [8, 8, 7, 8, 7, 7, 6, 7, 6, 6, 5, 5, 5, 4],
  },
  {
    name: "Al Barsha",
    color: "#073b2a",
    revenue: "AED 44.5k",
    share: 9,
    orders: "117",
    avg: "AED 380",
    margin: null,
    delta: 2.3,
    issues: 2,
    spark: [4, 4, 5, 4, 5, 4, 5, 5, 4, 5, 5, 5, 5, 6],
  },
];

function Spark({ values, color }: { values: number[]; color: string }) {
  const w = 88;
  const h = 24;
  const min = Math.min(...values);
  const span = Math.max(...values) - min || 1;
  const pts = values
    .map(
      (v, i) =>
        `${((i / (values.length - 1)) * w).toFixed(1)},${(h - 2 - ((v - min) / span) * (h - 4)).toFixed(1)}`,
    )
    .join(" ");
  return (
    <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} aria-hidden style={{ display: "block" }}>
      <polyline points={pts} fill="none" stroke={color} strokeWidth={1.5} />
    </svg>
  );
}

function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: 2,
        fontSize: 11,
        fontWeight: 700,
        color: up ? "#16a34a" : "#dc2626",
        fontVariantNumeric: "tabular-nums",
      }}
    >
      {up ? <ArrowUpRight size={12} /> : <ArrowDownRight size={12} />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

const marginColor = (m: number | null) =>
  m == null ? "rgba(102,115,107,.6)" : m >= 50 ? "#16a34a" : m >= 25 ? "#f59e0b" : "#dc2626";

const dot = (color: string) => (
  <span style={{ width: 10, height: 10, borderRadius: 99, background: color, flexShrink: 0 }} />
);

/** Which columns of the leaderboard a given section wants to show. */
type Cols = "full" | "compact" | "trend" | "issues";

/** "Branch leaderboard" — ranked by revenue, one row per outlet. */
export function BranchLeaderboard({ cols = "full" }: { cols?: Cols }) {
  const heads: Record<Cols, string[]> = {
    full: [
      "#",
      "Branch",
      "14-day trend",
      "Revenue",
      "Share",
      "Orders",
      "Avg order",
      "Margin",
      "vs prev",
      "Issues",
    ],
    compact: ["#", "Branch", "Revenue", "Share", "Margin", "Issues"],
    trend: ["#", "Branch", "14-day trend", "vs prev"],
    issues: ["#", "Branch", "Orders", "Issues"],
  };
  const has = (h: string) => heads[cols].includes(h);
  const right = new Set(["Revenue", "Orders", "Avg order", "Margin", "vs prev", "Issues"]);
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div className="dm-card-h" style={{ padding: "16px 20px 12px" }}>
          <div className="dm-card-t">Branch leaderboard</div>
          <div className="dm-card-s">
            Ranked by revenue this month — click a branch to focus the whole dashboard on it
          </div>
        </div>
        <div style={{ overflowX: "auto", paddingBottom: 6 }}>
          <table className={`dm-table plain${cols === "full" ? "" : " tight"}`}>
            <thead>
              <tr>
                {heads[cols].map((h) => (
                  <th key={h} style={{ textAlign: right.has(h) ? "right" : "left" }}>
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.map((r, i) => (
                <tr key={r.name}>
                  <td>
                    {i === 0 ? (
                      <Crown size={14} color="#f59e0b" />
                    ) : (
                      <b style={{ fontSize: 11, color: "rgba(102,115,107,.7)" }}>{i + 1}</b>
                    )}
                  </td>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {dot(r.color)}
                      {r.name}
                    </span>
                  </td>
                  {has("14-day trend") ? (
                    <td>
                      <Spark values={r.spark} color={r.color} />
                    </td>
                  ) : null}
                  {has("Revenue") ? (
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: 12,
                        fontWeight: 700,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.revenue}
                    </td>
                  ) : null}
                  {has("Share") ? (
                    <td style={{ minWidth: 110 }}>
                      <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
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
                              width: `${(r.share / 31) * 100}%`,
                              background: r.color,
                              borderRadius: 99,
                            }}
                          />
                        </span>
                        <span
                          style={{ width: 30, textAlign: "right", fontSize: 10, color: "#66736b" }}
                        >
                          {r.share}%
                        </span>
                      </span>
                    </td>
                  ) : null}
                  {has("Orders") ? (
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: 11.5,
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.orders}
                    </td>
                  ) : null}
                  {has("Avg order") ? (
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: 11.5,
                        color: "#66736b",
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.avg}
                    </td>
                  ) : null}
                  {has("Margin") ? (
                    <td
                      style={{
                        textAlign: "right",
                        fontSize: 11.5,
                        fontWeight: 600,
                        color: marginColor(r.margin),
                        fontVariantNumeric: "tabular-nums",
                      }}
                    >
                      {r.margin == null ? "—" : `${r.margin.toFixed(1)}%`}
                    </td>
                  ) : null}
                  {has("vs prev") ? (
                    <td style={{ textAlign: "right" }}>
                      <Delta value={r.delta} />
                    </td>
                  ) : null}
                  {has("Issues") ? (
                    <td style={{ textAlign: "right" }}>
                      {r.issues > 0 ? (
                        <span
                          className="dm-badge"
                          style={{
                            background: "rgba(220,38,38,.08)",
                            borderColor: "rgba(220,38,38,.3)",
                            color: "#dc2626",
                            fontSize: 10,
                          }}
                        >
                          {r.issues}
                        </span>
                      ) : (
                        <span style={{ fontSize: 11, color: "rgba(102,115,107,.5)" }}>0</span>
                      )}
                    </td>
                  ) : null}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

const TONES = {
  success: {
    border: "rgba(22,163,74,.25)",
    bg: "rgba(22,163,74,.04)",
    Icon: CheckCircle2,
    fg: "#16a34a",
  },
  warning: {
    border: "rgba(245,158,11,.3)",
    bg: "rgba(245,158,11,.05)",
    Icon: AlertTriangle,
    fg: "#f59e0b",
  },
  destructive: {
    border: "rgba(220,38,38,.35)",
    bg: "rgba(220,38,38,.05)",
    Icon: AlertTriangle,
    fg: "#dc2626",
  },
} as const;

type Tone = keyof typeof TONES;

const INSIGHTS: { tone: Tone; title: string; text: string }[] = [
  {
    tone: "success",
    title: "Marina leads the network",
    text: "AED 148.2k — 31% of network revenue this month",
  },
  {
    tone: "success",
    title: "Business Bay is trending up",
    text: "Revenue up 9.8% vs the previous month",
  },
  {
    tone: "warning",
    title: "Deira needs attention",
    text: "Trailing its 7-day average by 18% · 5 open issues",
  },
];

function Callout({ tone, title, text }: { tone: Tone; title: string; text: string }) {
  const t = TONES[tone];
  return (
    <div
      style={{
        display: "flex",
        alignItems: "flex-start",
        gap: 10,
        padding: "12px 16px",
        borderRadius: 12,
        border: `1px solid ${t.border}`,
        background: t.bg,
      }}
    >
      <t.Icon size={16} color={t.fg} style={{ flexShrink: 0 }} />
      <div style={{ minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
        <div style={{ marginTop: 2, fontSize: 11, color: "#66736b" }}>{text}</div>
      </div>
    </div>
  );
}

/** Donut + bars, stacked — the page's charts row for a narrow column. */
export function BranchCompare() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <BranchDonut />
      <BranchBars />
    </div>
  );
}

/** The auto-written insight callouts above the leaderboard. */
export function BranchInsights({ columns = 1 }: { columns?: 1 | 3 }) {
  return (
    <div className="dm">
      <Styles />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          gap: 12,
        }}
      >
        {INSIGHTS.map((i) => (
          <Callout key={i.title} {...i} />
        ))}
      </div>
    </div>
  );
}

function KpiCard({
  label,
  value,
  sub,
  Icon,
  tone,
}: {
  label: string;
  value: string;
  sub: string;
  Icon: LucideIcon;
  tone: { bg: string; fg: string };
}) {
  return (
    <div
      className="dm-card"
      style={{ display: "flex", alignItems: "center", gap: 12, padding: 16 }}
    >
      <span className="dm-tile" style={{ background: tone.bg, color: tone.fg, flexShrink: 0 }}>
        <Icon size={16} />
      </span>
      <div style={{ minWidth: 0 }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            textTransform: "uppercase",
            color: "#66736b",
          }}
        >
          {label}
        </div>
        <div
          style={{
            fontSize: 16,
            fontWeight: 900,
            fontVariantNumeric: "tabular-nums",
            whiteSpace: "nowrap",
          }}
        >
          {value}
        </div>
        <div style={{ fontSize: 10, color: "#66736b", whiteSpace: "nowrap" }}>{sub}</div>
      </div>
    </div>
  );
}

const T_PRIMARY = { bg: "rgba(22,163,74,.15)", fg: "#16a34a" };
const T_INFO = { bg: "rgba(37,99,235,.15)", fg: "#2563eb" };
const T_WARN = { bg: "rgba(245,158,11,.15)", fg: "#f59e0b" };
const T_BAD = { bg: "rgba(220,38,38,.15)", fg: "#dc2626" };

/** The four network cards at the top of the page. */
export function BranchKpis({ columns = 4 }: { columns?: 2 | 4 }) {
  return (
    <div className="dm">
      <Styles />
      <div
        style={{
          display: "grid",
          gridTemplateColumns: `repeat(${columns}, minmax(0,1fr))`,
          gap: 12,
        }}
      >
        <KpiCard
          label="Revenue"
          value="AED 482.0k"
          sub="across 5 locations"
          Icon={DollarSign}
          tone={T_PRIMARY}
        />
        <KpiCard
          label="Orders"
          value="1,284"
          sub="AED 375 avg order"
          Icon={ShoppingCart}
          tone={T_INFO}
        />
        <KpiCard label="Top branch" value="Marina" sub="AED 148.2k" Icon={Crown} tone={T_WARN} />
        <KpiCard
          label="Open issues"
          value="12"
          sub="incomplete orders to review"
          Icon={AlertTriangle}
          tone={T_BAD}
        />
      </div>
    </div>
  );
}

/** "Revenue share" donut with the network total in the middle. */
export function BranchDonut() {
  const R = 90;
  const C = 2 * Math.PI * R;
  const gap = 4;
  let acc = 0;
  const total = ROWS.reduce((n, r) => n + r.share, 0);
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div className="dm-card-h" style={{ padding: "16px 20px 12px" }}>
          <div className="dm-card-t">Revenue share</div>
          <div className="dm-card-s">Each location&apos;s slice of network revenue</div>
        </div>
        <div style={{ padding: "12px 20px 20px" }}>
          <div style={{ position: "relative", width: 230, height: 230, margin: "0 auto" }}>
            <svg viewBox="0 0 240 240" width="230" height="230">
              {ROWS.map((r) => {
                const len = (r.share / total) * C - gap;
                const offset = -acc;
                acc += (r.share / total) * C;
                return (
                  <circle
                    key={r.name}
                    cx="120"
                    cy="120"
                    r={R}
                    fill="none"
                    stroke={r.color}
                    strokeWidth="31"
                    strokeDasharray={`${len} ${C - len}`}
                    strokeDashoffset={offset}
                    transform="rotate(-90 120 120)"
                  />
                );
              })}
            </svg>
            <div
              style={{
                position: "absolute",
                inset: 0,
                display: "grid",
                placeContent: "center",
                textAlign: "center",
              }}
            >
              <div
                style={{
                  fontSize: 10,
                  fontWeight: 700,
                  letterSpacing: ".08em",
                  textTransform: "uppercase",
                  color: "#66736b",
                }}
              >
                Total
              </div>
              <div style={{ fontSize: 17, fontWeight: 900 }}>AED 482.0k</div>
            </div>
          </div>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: "6px 16px",
              justifyContent: "center",
              marginTop: 12,
            }}
          >
            {ROWS.map((r) => (
              <span
                key={r.name}
                style={{
                  display: "inline-flex",
                  alignItems: "center",
                  gap: 6,
                  fontSize: 10.5,
                  color: "#66736b",
                }}
              >
                <span style={{ width: 8, height: 8, borderRadius: 99, background: r.color }} />
                {r.name}
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

/** "Revenue by branch" — side-by-side bars in each branch's identity colour. */
export function BranchBars() {
  const W = 520;
  const H = 260;
  const L = 36;
  const T = 10;
  const B = 24;
  const max = 160;
  const values = [148.2, 121.6, 96.4, 71.3, 44.5];
  const slot = (W - L) / ROWS.length;
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card">
        <div className="dm-card-h" style={{ padding: "16px 20px 12px" }}>
          <div className="dm-card-t">Revenue by branch</div>
          <div className="dm-card-s">Side-by-side revenue this month</div>
        </div>
        <div style={{ padding: "12px 16px 16px" }}>
          <svg
            viewBox={`0 0 ${W} ${H}`}
            style={{ width: "100%", height: "auto", display: "block" }}
          >
            <defs>
              {ROWS.map((r) => (
                <linearGradient
                  key={r.name}
                  id={`bb-${r.name.replace(/\s/g, "")}`}
                  x1="0"
                  y1="0"
                  x2="0"
                  y2="1"
                >
                  <stop offset="0%" stopColor={r.color} stopOpacity="0.55" />
                  <stop offset="100%" stopColor={r.color} stopOpacity="1" />
                </linearGradient>
              ))}
            </defs>
            {[0, 40, 80, 120, 160].map((v) => {
              const y = T + (1 - v / max) * (H - T - B);
              return (
                <g key={v}>
                  <line x1={L} x2={W} y1={y} y2={y} stroke="#e3ece7" strokeDasharray="3 3" />
                  <text x={L - 8} y={y + 3} textAnchor="end" fontSize="9" fill="#66736b">
                    {v === 0 ? "0" : `${v}k`}
                  </text>
                </g>
              );
            })}
            {ROWS.map((r, i) => {
              const bw = 46;
              const x = L + slot * i + (slot - bw) / 2;
              const h = (values[i] / max) * (H - T - B);
              const y = H - B - h;
              return (
                <g key={r.name}>
                  <path
                    d={`M${x},${H - B} V${y + 6} Q${x},${y} ${x + 6},${y} H${x + bw - 6} Q${x + bw},${y} ${x + bw},${y + 6} V${H - B} Z`}
                    fill={`url(#bb-${r.name.replace(/\s/g, "")})`}
                  />
                  <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#66736b">
                    {r.name}
                  </text>
                </g>
              );
            })}
          </svg>
        </div>
      </div>
    </div>
  );
}

/** The "no data" states: the real no-POS callout, and margin left blank instead of guessed. */
export function BranchHonest() {
  const rows: { name: string; color: string; revenue: string; delta: number | null }[] = [
    { name: ROWS[4].name, color: ROWS[4].color, revenue: ROWS[4].revenue, delta: ROWS[4].delta },
    { name: "Sharjah", color: "#66736b", revenue: "AED 0.00", delta: null },
  ];
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="dm">
        <Styles />
        <Callout
          tone="warning"
          title="Sharjah has no POS data"
          text="Sales will appear here once the POS sync starts reporting for this location"
        />
      </div>
      <div className="dm">
        <div className="dm-card" style={{ overflow: "hidden" }}>
          <table className="dm-table plain tight">
            <thead>
              <tr>
                <th>Branch</th>
                <th style={{ textAlign: "right" }}>Revenue</th>
                <th style={{ textAlign: "right" }}>Margin</th>
                <th style={{ textAlign: "right" }}>vs prev</th>
              </tr>
            </thead>
            <tbody>
              {rows.map((r) => (
                <tr key={r.name}>
                  <td>
                    <span
                      style={{
                        display: "inline-flex",
                        alignItems: "center",
                        gap: 8,
                        fontSize: 12,
                        fontWeight: 600,
                      }}
                    >
                      {dot(r.color)}
                      {r.name}
                    </span>
                  </td>
                  <td style={{ textAlign: "right", fontSize: 12, fontWeight: 700 }}>{r.revenue}</td>
                  <td
                    style={{
                      textAlign: "right",
                      fontSize: 11.5,
                      fontWeight: 600,
                      color: marginColor(null),
                    }}
                  >
                    —
                  </td>
                  <td style={{ textAlign: "right" }}>
                    {r.delta == null ? (
                      <span style={{ fontSize: 11, color: "rgba(102,115,107,.6)" }}>—</span>
                    ) : (
                      <Delta value={r.delta} />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

/** Network "Open issues" card plus the per-branch counts that add up to it. */
export function BranchOpenIssues() {
  return (
    <div style={{ display: "grid", gap: 12 }}>
      <div className="dm">
        <Styles />
        <KpiCard
          label="Open issues"
          value="12"
          sub="incomplete orders to review"
          Icon={AlertTriangle}
          tone={T_BAD}
        />
      </div>
      <BranchLeaderboard cols="issues" />
    </div>
  );
}

/** The whole Branch Insights screen inside the app frame. */
export function BranchesMock() {
  return (
    <AppFrame active="Branches" height={1080}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="dm-h1">
            <Building2 size={20} color="#16a34a" /> Branch Insights
          </div>
          <div style={{ marginTop: 2, fontSize: 12, color: "#66736b" }}>
            How the network performed this month — ranked, compared, and mapped
          </div>
        </div>
        <span className="dm-btn">
          <RefreshCw size={14} />
        </span>
      </div>
      <BranchKpis />
      <BranchInsights columns={3} />
      <BranchLeaderboard />
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1.4fr", gap: 16, alignItems: "start" }}
      >
        <BranchDonut />
        <BranchBars />
      </div>
    </AppFrame>
  );
}
