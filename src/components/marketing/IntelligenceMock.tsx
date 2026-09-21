import { Fragment, type ReactNode } from "react";
import { ArrowRight, Search } from "lucide-react";
import { Styles } from "@/components/marketing/DashboardMock";
import { GREEN, MUTED, SAMPLE_CHIP } from "@/components/marketing/AiMock";

/**
 * Static replicas of the Menu Engineering, Inventory, cost-variance, waste and
 * Market Prices screens for the Intelligence product pages. Light-theme literals
 * like DashboardMock; all figures are sample data and each header says so.
 * The numbers agree with each other and with MockRecon (AED 482.0k revenue,
 * 31.2% food cost) and MockAiInsights (Butter Chicken Rice: AED 35 x 226 sold).
 */

const RED = "#dc2626";
const AMBER = "#d97706";
const BLUE = "#2563eb";

function Panel({ title, sub, children }: { title: string; sub: string; children: ReactNode }) {
  return (
    <div className="dm">
      <Styles />
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div className="dm-card-h" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="dm-card-t">{title}</div>
            <div className="dm-card-s">{sub}</div>
          </div>
          {SAMPLE_CHIP}
        </div>
        {children}
      </div>
    </div>
  );
}

function Chip({ color, children }: { color: string; children: ReactNode }) {
  return (
    <span
      style={{
        padding: "1px 8px",
        borderRadius: 999,
        fontSize: 10,
        fontWeight: 700,
        background: `${color}1a`,
        color,
        whiteSpace: "nowrap",
      }}
    >
      {children}
    </span>
  );
}

/* ── Menu Performance ─────────────────────────────────────────────────── */

const TIERS = [
  {
    label: "Optimize Price",
    hint: "Popular, but profit per plate can improve.",
    dish: "Butter Chicken Rice",
    color: BLUE,
  },
  {
    label: "Keep & Promote",
    hint: "Sells well and makes strong profit.",
    dish: "Chicken Shawarma Wrap",
    color: GREEN,
  },
  { label: "Reconsider", hint: "Low sales and low profit.", dish: "Falafel Bowl", color: RED },
  {
    label: "Boost Visibility",
    hint: "Profitable, but rarely ordered.",
    dish: "Paneer Tikka",
    color: AMBER,
  },
];

/** The 2x2 menu-engineering grid, split at the menu's own medians. */
export function MockMenuTiers() {
  return (
    <Panel title="Menu grades" sub="Every dish, sorted by how often it sells and how much it earns">
      <div style={{ display: "grid", gridTemplateColumns: "20px 1fr 1fr", gap: 8, padding: 16 }}>
        <span />
        {["Lower margin", "Higher margin"].map((c) => (
          <span
            key={c}
            style={{ fontSize: 10, fontWeight: 700, color: MUTED, textAlign: "center" }}
          >
            {c.toUpperCase()}
          </span>
        ))}
        {[0, 1].map((row) => (
          <Fragment key={row}>
            <span
              style={{
                writingMode: "vertical-rl",
                transform: "rotate(180deg)",
                fontSize: 10,
                fontWeight: 700,
                color: MUTED,
                textAlign: "center",
              }}
            >
              {row ? "FEWER SALES" : "MORE SALES"}
            </span>
            {TIERS.slice(row * 2, row * 2 + 2).map((t) => (
              <div
                key={t.label}
                style={{
                  padding: 12,
                  borderRadius: 12,
                  border: `1px solid ${t.color}4d`,
                  background: `${t.color}14`,
                }}
              >
                <div style={{ fontSize: 12, fontWeight: 700, color: t.color }}>{t.label}</div>
                <div style={{ marginTop: 3, fontSize: 11, lineHeight: 1.5, color: MUTED }}>
                  {t.hint}
                </div>
                <div style={{ marginTop: 8, fontSize: 11, fontWeight: 600 }}>{t.dish}</div>
              </div>
            ))}
          </Fragment>
        ))}
      </div>
      <div style={{ padding: "0 16px 14px", fontSize: 10.5, color: MUTED }}>
        Split at your menu’s median units sold and median margin %.
      </div>
    </Panel>
  );
}

const TILES = [
  ["Price", "AED 35.00"],
  ["Should cost / plate", "AED 14.70"],
  ["Profit / plate", "AED 20.30"],
  ["Food cost", "42.0%"],
  ["Sold (30 days)", "226"],
  ["Revenue (30 days)", "AED 7,910.00"],
];

const RECIPE: [string, string, boolean][] = [
  ["Chicken thigh, 150 g", "AED 7.20", true],
  ["Butter and cream, 40 g", "AED 4.10", true],
  ["Basmati rice, 120 g", "AED 1.80", true],
  ["Spice mix, 15 g", "AED 1.60", false],
];

/** The dish dialog: grade, unit economics, should-vs-actual, next step, costed recipe. */
export function MockDishGrade() {
  return (
    <Panel title="Butter Chicken Rice" sub="Mains">
      <div style={{ display: "grid", gap: 12, padding: 16 }}>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: 8 }}>
          {TILES.map(([l, v]) => (
            <div
              key={l}
              style={{
                padding: "8px 10px",
                borderRadius: 8,
                border: "1px solid #e8efeb",
                background: "rgba(241,246,243,.5)",
              }}
            >
              <div style={{ fontSize: 9, fontWeight: 700, letterSpacing: ".06em", color: MUTED }}>
                {l.toUpperCase()}
              </div>
              <div style={{ marginTop: 2, fontSize: 12, fontWeight: 800 }}>{v}</div>
            </div>
          ))}
        </div>
        <div style={{ padding: 12, borderRadius: 12, border: "1px solid #e3ece7", fontSize: 11.5 }}>
          <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".06em", color: MUTED }}>
            INGREDIENTS — SHOULD VS ACTUAL (30 DAYS)
          </div>
          {[
            ["Should have cost (226 sold)", "AED 3,322.20"],
            ["Purchased beyond that (wastage)", "AED 221.48 · 2.8%"],
          ].map(([l, v]) => (
            <div key={l} style={{ display: "flex", justifyContent: "space-between", marginTop: 6 }}>
              <span style={{ color: MUTED }}>{l}</span>
              <b>{v}</b>
            </div>
          ))}
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              marginTop: 8,
              paddingTop: 6,
              borderTop: "1px solid #eaf1ed",
            }}
          >
            <b>Actual ingredient spend</b>
            <b>AED 3,543.68</b>
          </div>
        </div>
        <div
          style={{
            padding: 12,
            borderRadius: 12,
            border: "1px solid rgba(22,163,74,.2)",
            background: "rgba(22,163,74,.05)",
          }}
        >
          <div style={{ fontSize: 12, fontWeight: 700 }}>Optimize Price</div>
          <div style={{ marginTop: 3, fontSize: 11.5, lineHeight: 1.55, color: MUTED }}>
            A AED 3.00 price increase could add about AED 678.00 over 30 days at current sales.
          </div>
          <div style={{ marginTop: 6, fontSize: 11, fontWeight: 600, color: GREEN }}>
            Next: Review price, portion size, or supplier cost.
          </div>
        </div>
        <div style={{ borderRadius: 8, border: "1px solid #e8efeb" }}>
          {RECIPE.map(([n, c, tally], i) => (
            <div
              key={n}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 8,
                padding: "8px 12px",
                borderTop: i ? "1px solid #eef3f0" : undefined,
                fontSize: 11.5,
              }}
            >
              <span style={{ flex: 1, fontWeight: 500 }}>{n}</span>
              <Chip color={tally ? GREEN : MUTED}>{tally ? "Tally price" : "Estimate"}</Chip>
              <span style={{ width: 62, textAlign: "right", fontWeight: 600 }}>{c}</span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ── Food cost ────────────────────────────────────────────────────────── */

const VARIANCE = [
  {
    label: "Should have cost",
    hint: "Recipes priced from Tally × units sold on POS",
    value: "AED 138.8k",
    sub: "28.8% of revenue",
    tone: "#152019",
  },
  {
    label: "Actually purchased",
    hint: "What the Tally purchase vouchers add up to",
    value: "AED 150.4k",
    sub: "31.2% of revenue",
    tone: "#152019",
  },
  {
    label: "Wastage",
    hint: "Purchased beyond what the dishes sold required",
    value: "AED 11.6k",
    sub: "2.4% of revenue",
    tone: AMBER,
  },
];

/** The three variance tiles on the Menu Engineering screen. */
export function MockCostVariance() {
  return (
    <Panel title="Should-cost vs actual spend" sub="This month · all outlets">
      <div style={{ display: "grid", gap: 10, padding: 16 }}>
        {VARIANCE.map((v) => (
          <div
            key={v.label}
            style={{
              padding: "12px 14px",
              borderRadius: 12,
              border: "1px solid #e8efeb",
              background: "rgba(241,246,243,.5)",
            }}
          >
            <div
              style={{
                display: "flex",
                alignItems: "baseline",
                justifyContent: "space-between",
                gap: 8,
              }}
            >
              <span style={{ fontSize: 10, fontWeight: 700, letterSpacing: ".08em", color: MUTED }}>
                {v.label.toUpperCase()}
              </span>
              <span style={{ fontSize: 10.5, color: MUTED }}>{v.sub}</span>
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 20,
                fontWeight: 900,
                color: v.tone,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v.value}
            </div>
            <div style={{ marginTop: 2, fontSize: 10.5, color: MUTED }}>{v.hint}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Inventory ────────────────────────────────────────────────────────── */

const STOCK_KPIS: [string, string, string, string][] = [
  ["TOTAL ITEMS", "148", "144 currently in stock", "#152019"],
  ["TOTAL UNITS", "4,286", "Across all stock items", "#152019"],
  ["CRITICAL", "4", "Zero or negative stock", RED],
  ["LOW STOCK", "9", "Below 5 units remaining", AMBER],
  ["INVENTORY HEALTH", "91%", "Healthy", GREEN],
];

/** The Inventory screen's KPI row. Health = share of items that are neither critical nor low. */
export function MockStockKpis() {
  return (
    <Panel title="Inventory" sub="Stock from Tally material in and out">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(140px, 1fr))",
          gap: 10,
          padding: 16,
        }}
      >
        {STOCK_KPIS.map(([l, v, s, c]) => (
          <div
            key={l}
            style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #e8efeb" }}
          >
            <div style={{ fontSize: 9.5, fontWeight: 700, letterSpacing: ".08em", color: MUTED }}>
              {l}
            </div>
            <div
              style={{
                marginTop: 4,
                fontSize: 22,
                fontWeight: 900,
                color: c,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {v}
            </div>
            <div style={{ marginTop: 2, fontSize: 10.5, color: MUTED }}>{s}</div>
          </div>
        ))}
      </div>
    </Panel>
  );
}

const STOCK_ROWS: [string, number, "Critical" | "Low" | "In stock"][] = [
  ["Fresh cream", 0, "Critical"],
  ["Coriander leaves", 0, "Critical"],
  ["Paneer", 2.5, "Low"],
  ["Lemons", 4, "Low"],
  ["Chicken thigh", 38.5, "In stock"],
  ["Basmati rice", 120, "In stock"],
];
const STATUS_COLOR = { Critical: RED, Low: AMBER, "In stock": GREEN };

/** Stock Items list: search, status chip, gauge, units. Lowest stock first. */
export function MockStockItems() {
  return (
    <Panel title="Stock Items" sub="Lowest stock first, so the most at-risk items lead">
      <div style={{ padding: "12px 16px 4px" }}>
        <span className="dm-field" style={{ width: "100%", color: MUTED }}>
          <Search size={12} /> Search stock items...
        </span>
      </div>
      <div style={{ padding: "4px 16px 12px" }}>
        {STOCK_ROWS.map(([name, units, status]) => (
          <div
            key={name}
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              padding: "9px 0",
              borderBottom: "1px solid #eef3f0",
              fontSize: 12,
            }}
          >
            <span style={{ flex: 1, fontWeight: 500 }}>{name}</span>
            <Chip color={STATUS_COLOR[status]}>{status}</Chip>
            <span
              style={{
                width: 60,
                height: 6,
                borderRadius: 3,
                background: "#eef3f0",
                overflow: "hidden",
              }}
            >
              <span
                style={{
                  display: "block",
                  height: "100%",
                  width: `${Math.max(units > 0 ? 3 : 0, (units / 120) * 100)}%`,
                  background: STATUS_COLOR[status],
                }}
              />
            </span>
            <span
              style={{
                width: 44,
                textAlign: "right",
                fontWeight: 700,
                fontVariantNumeric: "tabular-nums",
              }}
            >
              {units}
            </span>
          </div>
        ))}
      </div>
    </Panel>
  );
}

/* ── Waste ────────────────────────────────────────────────────────────── */

/** 14 days of waste cost, trending down as the habit is corrected. */
const WASTE_TREND = [512, 486, 498, 455, 470, 432, 441, 408, 415, 386, 394, 368, 372, 351];

const FLAGGED: [name: string, img: string, cost: string, share: string, cause: string][] = [
  ["Chicken thigh", "/hero/waste/chicken.jpg", "AED 2,700", "23.2%", "Over-prep"],
  ["Bread rolls", "/hero/waste/bread.jpg", "AED 850", "7.3%", "Spoilage"],
  ["Tomatoes", "/hero/hero-tomatoes1.jpg", "AED 460", "4.0%", "Stock gap"],
];

const CAUSE_COLOR: Record<string, string> = {
  "Over-prep": AMBER,
  Spoilage: RED,
  "Stock gap": BLUE,
};

/**
 * The waste headline: what it cost, which way it is moving, and the few
 * ingredients driving it. Deliberately not a bin graphic.
 */
export function MockWasteComposition() {
  const W = 560;
  const H = 92;
  const max = Math.max(...WASTE_TREND);
  const min = Math.min(...WASTE_TREND);
  const pts = WASTE_TREND.map(
    (v, i) =>
      [
        (i * W) / (WASTE_TREND.length - 1),
        6 + (1 - (v - min * 0.9) / (max - min * 0.9)) * (H - 18),
      ] as [number, number],
  );
  const line = pts.map(([x, y], i) => `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`).join(" ");
  return (
    <Panel title="Waste cost" sub="Ingredient variance · this month · all outlets">
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          gap: 12,
          alignItems: "baseline",
          padding: "14px 16px 0",
        }}
      >
        <span
          style={{
            fontSize: 30,
            fontWeight: 900,
            letterSpacing: "-.02em",
            fontVariantNumeric: "tabular-nums",
          }}
        >
          AED 11,640
        </span>
        <Chip color={GREEN}>↓ 18% vs last month</Chip>
        <span style={{ marginLeft: "auto", fontSize: 10.5, color: MUTED }}>
          2.4% of revenue · 27 ingredients
        </span>
      </div>

      <div style={{ padding: "6px 16px 10px" }}>
        <svg viewBox={`0 0 ${W} ${H}`} style={{ width: "100%", height: "auto", display: "block" }}>
          <defs>
            <linearGradient id="wasteFill" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor={AMBER} stopOpacity="0.22" />
              <stop offset="100%" stopColor={AMBER} stopOpacity="0" />
            </linearGradient>
          </defs>
          <path d={`${line} L${W},${H} L0,${H} Z`} fill="url(#wasteFill)" />
          <path d={line} fill="none" stroke={AMBER} strokeWidth={2} strokeLinejoin="round" />
          <circle
            cx={pts[pts.length - 1][0] - 2}
            cy={pts[pts.length - 1][1]}
            r={3.5}
            fill={AMBER}
          />
        </svg>
        <div
          style={{ display: "flex", justifyContent: "space-between", fontSize: 9.5, color: MUTED }}
        >
          <span>14 days ago</span>
          <span>Daily waste cost</span>
          <span>Today</span>
        </div>
      </div>

      <div style={{ padding: "4px 16px 16px" }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: MUTED,
            marginBottom: 8,
          }}
        >
          FLAGGED INGREDIENTS
        </div>
        <div style={{ display: "grid", gap: 8 }}>
          {FLAGGED.map(([name, img, cost, share, cause]) => (
            <div
              key={name}
              style={{
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "8px 10px",
                borderRadius: 12,
                border: "1px solid #e8efeb",
                background: "rgba(241,246,243,.5)",
              }}
            >
              <img
                src={img}
                alt=""
                style={{
                  width: 34,
                  height: 34,
                  borderRadius: 10,
                  objectFit: "cover",
                  flexShrink: 0,
                }}
              />
              <div style={{ flex: 1, minWidth: 0 }}>
                <div style={{ fontSize: 12, fontWeight: 700 }}>{name}</div>
                <div style={{ fontSize: 10.5, color: MUTED }}>{share} of waste cost</div>
              </div>
              <Chip color={CAUSE_COLOR[cause]}>{cause}</Chip>
              <span
                style={{
                  width: 72,
                  textAlign: "right",
                  fontSize: 12,
                  fontWeight: 800,
                  color: AMBER,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {cost}
              </span>
            </div>
          ))}
        </div>
      </div>
    </Panel>
  );
}

/* ── Purchasing ───────────────────────────────────────────────────────── */

const WASTE: [string, string, string, string, string, string][] = [
  ["Chicken thigh", "kg", "1,240.0", "1,090.0", "AED 2,700", "23.2%"],
  ["Basmati rice", "kg", "1,500.0", "1,320.0", "AED 1,260", "10.8%"],
  ["Paneer", "kg", "128.0", "96.0", "AED 1,216", "10.4%"],
  ["Fresh cream", "l", "262.0", "210.0", "AED 728", "6.3%"],
  ["Tomatoes", "kg", "620.0", "505.0", "AED 460", "4.0%"],
];

/** Waste composition: bought vs needed per ingredient, ranked by cost of the surplus. */
export function MockWasteList() {
  return (
    <Panel
      title="Bought vs needed"
      sub="Purchased beyond what the dishes you sold required · this month"
    >
      <div style={{ overflowX: "auto" }}>
        <table className="dm-table plain">
          <thead>
            <tr>
              <th>Ingredient</th>
              <th style={{ textAlign: "right" }}>Bought</th>
              <th style={{ textAlign: "right" }}>Needed</th>
              <th style={{ textAlign: "right" }}>Surplus cost</th>
              <th style={{ textAlign: "right" }}>Share</th>
            </tr>
          </thead>
          <tbody>
            {WASTE.map(([n, u, b, need, c, p]) => (
              <tr key={n}>
                <td>{n}</td>
                <td style={{ textAlign: "right" }}>
                  {b} {u}
                </td>
                <td style={{ textAlign: "right" }}>
                  {need} {u}
                </td>
                <td style={{ textAlign: "right", fontWeight: 700, color: AMBER }}>{c}</td>
                <td style={{ textAlign: "right" }}>{p}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "10px 16px 14px", fontSize: 10.5, color: MUTED }}>
        Top 5 of 27 ingredients bought beyond need · AED 11,640 in total
      </div>
    </Panel>
  );
}

/** Spend sums to the AED 150.4k net cost MockRecon and the food-cost page show. */
const SUPPLIERS: [name: string, spend: string, share: string, move: number, spark: number[]][] = [
  ["Gulf Fresh Meats", "AED 64,200", "42.7%", 6.2, [38, 41, 39, 46, 44, 52, 58]],
  ["Al Noor Grains", "AED 38,900", "25.9%", -2.1, [34, 36, 33, 35, 32, 33, 31]],
  ["Emirates Dairy", "AED 27,400", "18.2%", 1.4, [22, 24, 23, 25, 24, 26, 27]],
  ["Green Valley Produce", "AED 19,900", "13.2%", -0.8, [20, 18, 21, 19, 20, 18, 19]],
];

const PRICE_MOVES: [item: string, from: string, to: string, move: string, supplier: string][] = [
  ["Chicken thigh", "AED 18.40", "AED 19.60", "+6.5%", "Gulf Fresh Meats"],
  ["Fresh cream", "AED 12.10", "AED 12.95", "+7.0%", "Emirates Dairy"],
  ["Basmati rice", "AED 6.20", "AED 5.95", "−4.0%", "Al Noor Grains"],
];

function Spark({ pts, color }: { pts: number[]; color: string }) {
  const max = Math.max(...pts);
  const min = Math.min(...pts);
  const d = pts
    .map((v, i) => {
      const x = (i * 64) / (pts.length - 1);
      const y = 2 + (1 - (v - min) / (max - min || 1)) * 18;
      return `${i ? "L" : "M"}${x.toFixed(1)},${y.toFixed(1)}`;
    })
    .join(" ");
  return (
    <svg viewBox="0 0 64 22" style={{ width: 64, height: 22, flexShrink: 0 }}>
      <path d={d} fill="none" stroke={color} strokeWidth={1.75} strokeLinejoin="round" />
    </svg>
  );
}

/** Supplier spend cards, each with its own trend and price movement, plus price-change alerts. */
export function MockSuppliers() {
  return (
    <Panel title="Supplier spend" sub="From your purchase vouchers · this month · all outlets">
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(210px, 1fr))",
          gap: 10,
          padding: 16,
        }}
      >
        {SUPPLIERS.map(([name, spend, share, move, spark]) => {
          const up = move > 0;
          const tone = up ? RED : GREEN;
          return (
            <div
              key={name}
              style={{ padding: "12px 14px", borderRadius: 12, border: "1px solid #e8efeb" }}
            >
              <div style={{ fontSize: 11.5, fontWeight: 700 }}>{name}</div>
              <div
                style={{
                  marginTop: 4,
                  fontSize: 18,
                  fontWeight: 900,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {spend}
              </div>
              <div style={{ fontSize: 10.5, color: MUTED }}>{share} of purchase spend</div>
              <div
                style={{
                  marginTop: 8,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                }}
              >
                <Spark pts={spark} color={tone} />
                <Chip color={tone}>
                  {up ? "▲" : "▼"} {Math.abs(move).toFixed(1)}% unit cost
                </Chip>
              </div>
            </div>
          );
        })}
      </div>

      <div style={{ padding: "0 16px 16px" }}>
        <div
          style={{
            fontSize: 9.5,
            fontWeight: 700,
            letterSpacing: ".08em",
            color: MUTED,
            marginBottom: 8,
          }}
        >
          PRICE-CHANGE ALERTS
        </div>
        <div style={{ display: "grid", gap: 6 }}>
          {PRICE_MOVES.map(([item, from, to, move, supplier]) => {
            const up = move.startsWith("+");
            return (
              <div
                key={item}
                style={{
                  display: "flex",
                  alignItems: "center",
                  flexWrap: "wrap",
                  gap: "4px 10px",
                  padding: "9px 12px",
                  borderRadius: 10,
                  border: "1px solid #e8efeb",
                  borderLeft: `3px solid ${up ? RED : GREEN}`,
                  background: "rgba(241,246,243,.5)",
                  fontSize: 11.5,
                }}
              >
                <span style={{ fontWeight: 700, whiteSpace: "nowrap" }}>{item}</span>
                <span
                  style={{
                    color: MUTED,
                    fontVariantNumeric: "tabular-nums",
                    whiteSpace: "nowrap",
                  }}
                >
                  {from} <ArrowRight size={9} style={{ verticalAlign: "middle" }} /> {to} / kg
                </span>
                <Chip color={up ? RED : GREEN}>{move}</Chip>
                <span style={{ marginLeft: "auto", fontSize: 10.5, color: MUTED }}>{supplier}</span>
              </div>
            );
          })}
        </div>
        <div style={{ marginTop: 10, fontSize: 10.5, color: MUTED }}>
          Measured against each ingredient's 90-day weighted-average purchase price.
        </div>
      </div>
    </Panel>
  );
}

const CATEGORIES = [
  "Cooking oil",
  "Wheat",
  "Rice",
  "Dairy",
  "Legumes",
  "Sugar",
  "Eggs",
  "Bread",
  "Chicken",
];
const PRICES: [string, string, string, string, string][] = [
  ["Basmati rice, 5 kg", "AED 24.90", "Store B", "AED 31.50", "Store D"],
  ["Basmati rice, 1 kg", "AED 5.95", "Store A", "AED 7.25", "Store C"],
  ["Long-grain rice, 2 kg", "AED 8.75", "Store B", "AED 11.40", "Store D"],
  ["Sella rice, 5 kg", "AED 27.50", "Store A", "AED 33.00", "Store C"],
];

/** Market Prices: best vs worst store price per item, with a compare-branches action. */
export function MockMarketPrices() {
  return (
    <Panel title="Market Prices" sub="Essential goods, best price against worst across stores">
      <div style={{ display: "flex", flexWrap: "wrap", gap: 6, padding: "12px 16px 4px" }}>
        {CATEGORIES.map((c) => (
          <span
            key={c}
            style={{
              padding: "3px 10px",
              borderRadius: 999,
              fontSize: 10.5,
              fontWeight: 600,
              border: "1px solid #e3ece7",
              ...(c === "Rice"
                ? { background: GREEN, color: "#fff", borderColor: GREEN }
                : { color: MUTED }),
            }}
          >
            {c}
          </span>
        ))}
      </div>
      <div style={{ overflowX: "auto" }}>
        <table className="dm-table plain">
          <thead>
            <tr>
              <th>Item</th>
              <th>Best price</th>
              <th>Worst price</th>
              <th />
            </tr>
          </thead>
          <tbody>
            {PRICES.map(([n, bp, bs, wp, ws]) => (
              <tr key={n}>
                <td style={{ fontWeight: 500 }}>{n}</td>
                <td>
                  <b style={{ color: GREEN }}>{bp}</b>
                  <div style={{ fontSize: 9.5, color: MUTED }}>at {bs}</div>
                </td>
                <td>
                  <b>{wp}</b>
                  <div style={{ fontSize: 9.5, color: MUTED }}>at {ws}</div>
                </td>
                <td style={{ color: GREEN, fontWeight: 600, whiteSpace: "nowrap" }}>
                  Compare <ArrowRight size={11} style={{ verticalAlign: "-2px" }} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div style={{ padding: "10px 16px 14px", fontSize: 10.5, color: MUTED }}>
        Source: UAE Ministry of Economy public price platform. Store names and prices here are
        examples.
      </div>
    </Panel>
  );
}
