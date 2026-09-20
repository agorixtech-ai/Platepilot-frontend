import type { ReactNode } from "react";
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  CreditCard,
  DollarSign,
  Download,
  FileText,
  LayoutDashboard,
  MapPin,
  Percent,
  RefreshCw,
  Search,
  ShoppingCart,
  Soup,
  Tag,
  TrendingUp,
  User,
  type LucideIcon,
} from "lucide-react";
import { AppFrame, Styles } from "./DashboardMock";

/**
 * Static replica of the real POS Sales screen (pages/dashboard/Pos.tsx) for the
 * Sales Analytics product page. Same rules as DashboardMock: literal light-theme
 * token values, sample data only, captioned as such where it is shown.
 */

type Tone = "primary" | "info" | "warning" | "success" | "destructive";
const TONE: Record<Tone, { bg: string; fg: string; border: string }> = {
  primary: { bg: "rgba(22,163,74,.15)", fg: "#16a34a", border: "rgba(22,163,74,.3)" },
  success: { bg: "rgba(22,163,74,.15)", fg: "#16a34a", border: "rgba(22,163,74,.3)" },
  info: { bg: "rgba(37,99,235,.15)", fg: "#2563eb", border: "rgba(37,99,235,.3)" },
  warning: { bg: "rgba(245,158,11,.15)", fg: "#f59e0b", border: "rgba(245,158,11,.3)" },
  destructive: { bg: "rgba(220,38,38,.15)", fg: "#dc2626", border: "rgba(220,38,38,.3)" },
};

const STATUS_TONE: Record<string, Tone> = {
  Completed: "success",
  Pending: "warning",
  Cancelled: "destructive",
  Refunded: "info",
};
const CHANNEL_TONE: Record<string, Tone> = {
  "Dine-in": "primary",
  Delivery: "info",
  Takeaway: "warning",
  Aggregator: "success",
};
/** Bar colours in the Channels Summary card (CHANNEL_COLORS in Pos.tsx). */
const CHANNEL_BAR: Record<string, string> = {
  "Dine-in": "#16a34a",
  Aggregator: "#2563eb",
  Delivery: "#f59e0b",
  Takeaway: "#d97706",
};

function Badge({ text, tone, big }: { text: string; tone: Tone; big?: boolean }) {
  const t = TONE[tone];
  return (
    <span
      className="dm-badge"
      style={{
        background: t.bg,
        color: t.fg,
        borderColor: t.border,
        ...(big ? { fontSize: 10, padding: "2px 8px", textTransform: "none" } : null),
      }}
    >
      {text}
    </span>
  );
}

const KPIS: { label: string; value: string; sub: string; icon: LucideIcon; tone: Tone }[] = [
  {
    label: "TOTAL POS VOLUME",
    value: "AED 482,000.00",
    sub: "Based on 1,284 invoices",
    icon: DollarSign,
    tone: "primary",
  },
  {
    label: "AVERAGE BASKET (AOV)",
    value: "AED 375.39",
    sub: "Per receipt average",
    icon: TrendingUp,
    tone: "info",
  },
  {
    label: "DISCOUNTS DISTRIBUTED",
    value: "AED 9,640.00",
    sub: "Promo and campaign codes",
    icon: Percent,
    tone: "warning",
  },
  {
    label: "TOTAL VAT COLLECTED",
    value: "AED 22,952.38",
    sub: "VAT 5% standard ledger output",
    icon: Clock,
    tone: "success",
  },
];

/** The four headline cards above the log. */
export function PosKpis({ columns = 4 }: { columns?: 2 | 4 }) {
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
        {KPIS.map((k) => {
          const Icon = k.icon;
          const t = TONE[k.tone];
          return (
            <div key={k.label} className="dm-card dm-pkpi">
              <div className="dm-pkpi-top">
                <span
                  style={{
                    fontSize: 10,
                    fontWeight: 700,
                    letterSpacing: ".08em",
                    color: "#66736b",
                  }}
                >
                  {k.label}
                </span>
                <span className="dm-tile" style={{ background: t.bg, color: t.fg }}>
                  <Icon size={18} />
                </span>
              </div>
              <div className="dm-pkpi-v">{k.value}</div>
              <div style={{ fontSize: 11, color: "rgba(102,115,107,.85)", marginTop: 4 }}>
                {k.sub}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

const CHANNELS = [
  { name: "Dine-in", value: "AED 231,360.00", pct: 48 },
  { name: "Delivery", value: "AED 101,220.00", pct: 21 },
  { name: "Aggregator", value: "AED 96,400.00", pct: 20 },
  { name: "Takeaway", value: "AED 53,020.00", pct: 11 },
];

/** "Channels Summary" — sales volume per order channel. */
export function PosChannels() {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ background: "linear-gradient(135deg,#fff,#f6faf8)" }}>
        <div style={{ padding: "18px 20px 8px" }}>
          <div style={{ fontSize: 14, fontWeight: 700 }}>Channels Summary</div>
          <div style={{ fontSize: 11, color: "#66736b", marginTop: 2 }}>
            Aggregate sales volume per order channel
          </div>
        </div>
        <div style={{ padding: "10px 20px 20px", display: "grid", gap: 16 }}>
          {CHANNELS.map((c) => (
            <div key={c.name}>
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 6,
                  gap: 8,
                }}
              >
                <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
                  <span
                    style={{
                      width: 10,
                      height: 10,
                      borderRadius: 99,
                      background: CHANNEL_BAR[c.name],
                    }}
                  />
                  <span style={{ fontSize: 12, fontWeight: 700 }}>{c.name}</span>
                </span>
                <span style={{ fontSize: 12, fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                  {c.value} <span style={{ color: "#66736b", fontWeight: 500 }}>({c.pct}%)</span>
                </span>
              </div>
              <div
                style={{
                  height: 8,
                  borderRadius: 99,
                  background: "rgba(238,243,240,.9)",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    width: `${c.pct}%`,
                    height: "100%",
                    borderRadius: 99,
                    background: CHANNEL_BAR[c.name],
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

const LOCATIONS: [string, number, string][] = [
  ["Marina", 148.2, "#16a34a"],
  ["Business Bay", 121.6, "#22c55e"],
  ["JLT", 96.4, "#0f7a4c"],
  ["Deira", 71.3, "#d97706"],
  ["Al Barsha", 44.5, "#073b2a"],
];

/** "Sales Revenue by Location" — one bar per branch, colour = branch identity. */
function PosLocations() {
  const W = 470;
  const H = 250;
  const L = 34;
  const T = 10;
  const B = 24;
  const max = 160;
  const slot = (W - L) / LOCATIONS.length;
  return (
    <div className="dm-card">
      <div style={{ padding: "18px 20px 4px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <span style={{ width: 10, height: 10, borderRadius: 99, background: "#16a34a" }} />
          <span style={{ fontSize: 14, fontWeight: 700 }}>Sales Revenue by Location</span>
        </div>
        <div style={{ fontSize: 11, color: "#66736b", marginTop: 2 }}>
          Total POS receipts generated at individual branch sites
        </div>
      </div>
      <div style={{ padding: "8px 20px 16px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
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
          {LOCATIONS.map(([name, v, color], i) => {
            const bw = 44;
            const x = L + slot * i + (slot - bw) / 2;
            const h = (v / max) * (H - T - B);
            return (
              <g key={name}>
                <path
                  d={`M${x},${H - B} V${H - B - h + 8} Q${x},${H - B - h} ${x + 8},${H - B - h} H${x + bw - 8} Q${x + bw},${H - B - h} ${x + bw},${H - B - h + 8} V${H - B} Z`}
                  fill={color}
                  fillOpacity={0.85}
                />
                <text x={x + bw / 2} y={H - 8} textAnchor="middle" fontSize="10" fill="#66736b">
                  {name}
                </text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}

type Row = {
  inv: string;
  at: string;
  branch: string;
  channel: string;
  tax: string;
  disc: string;
  total: string;
  status: string;
};
const ROWS: Row[] = [
  {
    inv: "INV-24815",
    at: "2026-09-14 19:42",
    branch: "Marina",
    channel: "Dine-in",
    tax: "59.05",
    disc: "0.00",
    total: "AED 1,240.00",
    status: "Completed",
  },
  {
    inv: "INV-24816",
    at: "2026-09-14 19:47",
    branch: "Marina",
    channel: "Delivery",
    tax: "32.38",
    disc: "0.00",
    total: "AED 680.00",
    status: "Completed",
  },
  {
    inv: "INV-24817",
    at: "2026-09-14 19:51",
    branch: "Deira",
    channel: "Aggregator",
    tax: "44.52",
    disc: "-30.00",
    total: "AED 935.00",
    status: "Pending",
  },
  {
    inv: "INV-24818",
    at: "2026-09-14 19:58",
    branch: "JLT",
    channel: "Takeaway",
    tax: "14.76",
    disc: "0.00",
    total: "AED 310.00",
    status: "Completed",
  },
  {
    inv: "INV-24819",
    at: "2026-09-14 20:03",
    branch: "Business Bay",
    channel: "Dine-in",
    tax: "102.38",
    disc: "0.00",
    total: "AED 2,150.00",
    status: "Refunded",
  },
  {
    inv: "INV-24820",
    at: "2026-09-14 20:09",
    branch: "Al Barsha",
    channel: "Delivery",
    tax: "21.90",
    disc: "0.00",
    total: "AED 460.00",
    status: "Cancelled",
  },
  {
    inv: "INV-24821",
    at: "2026-09-14 20:14",
    branch: "Marina",
    channel: "Dine-in",
    tax: "76.19",
    disc: "-20.00",
    total: "AED 1,600.00",
    status: "Completed",
  },
];

const COLS = [
  "INVOICE NO",
  "DATETIME",
  "BRANCH",
  "CHANNEL",
  "TAX",
  "DISCOUNT",
  "GRAND TOTAL",
  "STATUS",
];

/** "Sales Logs" — search, channel and status filters over the bill-level table. */
export function PosLog({ compact, rows = 6 }: { compact?: boolean; rows?: number }) {
  const cols = compact ? ["INVOICE NO", "BRANCH", "CHANNEL", "GRAND TOTAL", "STATUS"] : COLS;
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div
          style={{
            padding: "18px 20px 12px",
            display: "flex",
            flexWrap: "wrap",
            gap: 10,
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <div>
            <div style={{ fontSize: 14, fontWeight: 700 }}>Sales Logs</div>
            <div style={{ fontSize: 11, color: "#66736b", marginTop: 2 }}>
              Detailed lists of transactions pulled from the database
            </div>
          </div>
          <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
            <span className="dm-field" style={{ minWidth: 170, color: "#66736b" }}>
              <Search size={13} /> Invoice No...
            </span>
            <span className="dm-field">All Channels</span>
            <span className="dm-field">All Status</span>
          </div>
        </div>
        <div style={{ overflowX: "auto" }}>
          <table className={`dm-table${compact ? " tight" : ""}`}>
            <thead>
              <tr>
                {cols.map((c) => (
                  <th key={c}>{c}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {ROWS.slice(0, rows).map((r) => {
                const cell: Record<string, ReactNode> = {
                  "INVOICE NO": (
                    <span
                      style={{
                        fontFamily: "ui-monospace,Menlo,monospace",
                        fontWeight: 600,
                        color: "#16a34a",
                      }}
                    >
                      {r.inv}
                    </span>
                  ),
                  DATETIME: <span style={{ color: "#66736b" }}>{r.at}</span>,
                  BRANCH: <span style={{ fontWeight: 500 }}>{r.branch}</span>,
                  CHANNEL: <Badge text={r.channel} tone={CHANNEL_TONE[r.channel]} />,
                  TAX: <span style={{ color: "#66736b" }}>{r.tax}</span>,
                  DISCOUNT: (
                    <span style={{ color: r.disc.startsWith("-") ? "#dc2626" : "#66736b" }}>
                      {r.disc}
                    </span>
                  ),
                  "GRAND TOTAL": (
                    <span style={{ fontWeight: 700, fontVariantNumeric: "tabular-nums" }}>
                      {r.total}
                    </span>
                  ),
                  STATUS: <Badge text={r.status} tone={STATUS_TONE[r.status]} />,
                };
                return (
                  <tr key={r.inv}>
                    {cols.map((c) => (
                      <td key={c}>{cell[c]}</td>
                    ))}
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            padding: "10px 16px",
            borderTop: "1px solid #eaf1ed",
            fontSize: 11,
            color: "#66736b",
          }}
        >
          <span>Page 1 of 52 · 1,284 records</span>
          <span style={{ display: "flex", gap: 4 }}>
            <ChevronLeft size={14} opacity={0.4} />
            <ChevronRight size={14} />
          </span>
        </div>
      </div>
    </div>
  );
}

/** The sale-detail dialog — what opens when you click a row. */
export function PosSale() {
  const info: [LucideIcon, string, string][] = [
    [Tag, "Sale ID", "S-2409-24815"],
    [MapPin, "Branch", "Marina (Dubai Marina)"],
    [User, "Cashier", "Cashier 03"],
    [CreditCard, "Payment", "Card"],
  ];
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ padding: 20, boxShadow: "0 24px 60px rgba(7,26,20,.12)" }}>
        <div
          style={{ display: "flex", alignItems: "center", gap: 8, fontSize: 15, fontWeight: 700 }}
        >
          <ShoppingCart size={16} color="#16a34a" /> INV-24815
        </div>
        <div style={{ display: "flex", gap: 8, marginTop: 14 }}>
          <Badge text="Completed" tone="success" big />
          <Badge text="Dine-in" tone="primary" big />
        </div>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 10, marginTop: 14 }}>
          {info.map(([Icon, l, v]) => (
            <div
              key={l}
              style={{
                display: "flex",
                gap: 8,
                alignItems: "flex-start",
                padding: "8px 12px",
                borderRadius: 8,
                border: "1px solid #eaf1ed",
                background: "#fafcfb",
              }}
            >
              <Icon size={14} color="#66736b" style={{ marginTop: 2, flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 10, color: "#66736b" }}>{l}</div>
                <div style={{ fontSize: 12, fontWeight: 600 }}>{v}</div>
              </div>
            </div>
          ))}
        </div>
        <div
          style={{
            marginTop: 14,
            padding: 12,
            borderRadius: 8,
            border: "1px solid #eaf1ed",
            background: "#fafcfb",
          }}
        >
          <div style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: "#66736b" }}>
            ITEM DETAILS
          </div>
          <div style={{ display: "flex", justifyContent: "space-between", margin: "8px 0" }}>
            <div>
              <div style={{ fontSize: 13, fontWeight: 700 }}>Family Platter</div>
              <div style={{ fontSize: 11, color: "#66736b" }}>Platters · ITM-0231</div>
            </div>
            <span style={{ fontSize: 10, color: "#66736b" }}>Terminal: POS-2</span>
          </div>
          <div
            style={{
              borderTop: "1px solid #eaf1ed",
              paddingTop: 8,
              display: "grid",
              gap: 4,
              fontSize: 12,
            }}
          >
            {[
              ["Qty × Unit Price", "5 × AED 236.19", "#152019"],
              ["Discount", "-AED 0.00", "#dc2626"],
              ["Tax (VAT)", "+AED 59.05", "#152019"],
            ].map(([l, v, c]) => (
              <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
                <span style={{ color: "#66736b" }}>{l}</span>
                <span style={{ fontVariantNumeric: "tabular-nums", color: c }}>{v}</span>
              </div>
            ))}
            <div
              style={{
                display: "flex",
                justifyContent: "space-between",
                borderTop: "1px solid #eaf1ed",
                paddingTop: 6,
                fontWeight: 700,
              }}
            >
              <span>Total</span>
              <span style={{ fontVariantNumeric: "tabular-nums" }}>AED 1,240.00</span>
            </div>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            marginTop: 12,
            fontSize: 10,
            color: "#66736b",
          }}
        >
          <span>Customer: Walk-in</span>
          <span>Sep 14, 2026 at 7:42 PM</span>
        </div>
      </div>
    </div>
  );
}

/** Where the same bills go next — the "Downstream" section's visual. */
export function PosFlow() {
  const rows: [LucideIcon, string, string][] = [
    [LayoutDashboard, "Overview", "Revenue and Orders are summed from these bills"],
    [Soup, "Menu Engineering", "Every dish is graded on its sell rate here"],
    [FileText, "Reconciliation", "Bills are matched against your Tally vouchers"],
  ];
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ padding: 20 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <span className="dm-tile" style={{ background: TONE.primary.bg, color: "#16a34a" }}>
            <ShoppingCart size={16} />
          </span>
          <div>
            <div style={{ fontSize: 13, fontWeight: 700 }}>POS bills</div>
            <div style={{ fontSize: 10, color: "#66736b" }}>one row per receipt</div>
          </div>
        </div>
        <div style={{ margin: "0 0 0 17px", borderLeft: "2px solid #cfe6d8", paddingLeft: 26 }}>
          {rows.map(([Icon, title, sub]) => (
            <div
              key={title}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                margin: "14px 0",
                padding: "10px 12px",
                borderRadius: 12,
                border: "1px solid #e3ece7",
                background: "#fff",
              }}
            >
              <span
                className="dm-tile"
                style={{ width: 30, height: 30, background: "#e8f7ed", color: "#16a34a" }}
              >
                <Icon size={15} />
              </span>
              <div>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{title}</div>
                <div style={{ fontSize: 11, color: "#66736b" }}>{sub}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/** The whole POS Sales screen inside the app frame. */
export function PosMock() {
  return (
    <AppFrame active="POS Sales" height={1040}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <div>
          <div className="dm-h1">
            <ShoppingCart size={20} color="#16a34a" /> POS Sales
          </div>
          <div style={{ marginTop: 2, fontSize: 12, color: "#66736b" }}>
            Transaction logs and branch sales aggregates
          </div>
        </div>
        <div style={{ display: "flex", gap: 8 }}>
          <span className="dm-btn">
            <Download size={14} /> Export logs
          </span>
          <span className="dm-btn">
            <RefreshCw size={14} />
          </span>
        </div>
      </div>
      <PosKpis />
      <div
        style={{ display: "grid", gridTemplateColumns: "3fr 2fr", gap: 12, alignItems: "start" }}
      >
        <PosLocations />
        <PosChannels />
      </div>
      <PosLog rows={7} />
    </AppFrame>
  );
}
