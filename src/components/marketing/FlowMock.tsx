import { GREEN, MUTED, SAMPLE_CHIP } from "@/components/marketing/AiMock";
import { Styles } from "@/components/marketing/DashboardMock";

/**
 * "Sources converge into PlatePielet" diagrams, drawn as one scalable SVG so
 * they stay legible at any column width. Light-theme literals like
 * DashboardMock; every figure is sample data and each header says so.
 * Numbers agree with MockRecon and MockWasteList (AED 482.0k revenue,
 * AED 150.4k net cost, AED 11,640 surplus).
 */

const VB_W = 600;
const VB_H = 280;
const COL_W = 176;
const HUB_X = 240;
const HUB_W = 120;
const RIGHT_X = VB_W - COL_W - 2;

export type FlowNode = { label: string; value?: string; img?: string };

function rows(n: number) {
  const h = n >= 4 ? 52 : 64;
  const gap = (VB_H - n * h) / (n + 1);
  return Array.from({ length: n }, (_, i) => {
    const y = gap + i * (h + gap);
    return { y, h, cy: y + h / 2 };
  });
}

function Node({ node, x, y, h }: { node: FlowNode; x: number; y: number; h: number }) {
  const hasImg = Boolean(node.img);
  const tx = x + (hasImg ? 52 : 14);
  const mid = y + h / 2;
  return (
    <g>
      <rect
        x={x}
        y={y}
        width={COL_W}
        height={h}
        rx={12}
        fill="#fff"
        stroke="#e3ece7"
        strokeWidth={1}
      />
      {hasImg ? (
        <>
          <clipPath id={`clip-${node.label.replace(/\W/g, "")}`}>
            <circle cx={x + 30} cy={mid} r={16} />
          </clipPath>
          <image
            href={node.img}
            x={x + 14}
            y={mid - 16}
            width={32}
            height={32}
            preserveAspectRatio="xMidYMid slice"
            clipPath={`url(#clip-${node.label.replace(/\W/g, "")})`}
          />
        </>
      ) : null}
      <text x={tx} y={node.value ? mid - 3 : mid + 4} fontSize={12} fontWeight={700} fill="#152019">
        {node.label}
      </text>
      {node.value ? (
        <text x={tx} y={mid + 13} fontSize={9.5} fill={MUTED}>
          {node.value}
        </text>
      ) : null}
    </g>
  );
}

function Link({ x1, y1, x2, y2, delay }: Record<"x1" | "y1" | "x2" | "y2" | "delay", number>) {
  const mx = (x1 + x2) / 2;
  return (
    <path
      d={`M${x1},${y1} C${mx},${y1} ${mx},${y2} ${x2},${y2}`}
      fill="none"
      stroke="#cfe3d7"
      strokeWidth={1.5}
      strokeDasharray="5 6"
      style={{ animation: `fm-dash 1.4s linear ${delay}s infinite` }}
    />
  );
}

function Flow({
  title,
  sub,
  left,
  hub,
  hubNote,
  right,
}: {
  title: string;
  sub: string;
  left: FlowNode[];
  hub: string;
  hubNote: string;
  right: FlowNode[];
}) {
  const ls = rows(left.length);
  const rs = rows(right.length);
  const hubCy = VB_H / 2;
  return (
    <div className="dm">
      <Styles />
      <style>{`
        @keyframes fm-dash { to { stroke-dashoffset: -22; } }
        @media (prefers-reduced-motion: reduce) { .dm path[style*="fm-dash"] { animation: none !important; } }
      `}</style>
      <div className="dm-card" style={{ overflow: "hidden" }}>
        <div className="dm-card-h" style={{ display: "flex", alignItems: "center", gap: 10 }}>
          <div style={{ flex: 1 }}>
            <div className="dm-card-t">{title}</div>
            <div className="dm-card-s">{sub}</div>
          </div>
          {SAMPLE_CHIP}
        </div>
        <div style={{ padding: 14, overflowX: "auto" }}>
          <svg
            viewBox={`0 0 ${VB_W} ${VB_H}`}
            style={{ width: "100%", minWidth: 520, height: "auto", display: "block" }}
          >
            <defs>
              <linearGradient id="fmHub" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#0f7a4c" />
                <stop offset="100%" stopColor="#22c55e" />
              </linearGradient>
            </defs>
            {ls.map((r, i) => (
              <Link key={`l${i}`} x1={2 + COL_W} y1={r.cy} x2={HUB_X} y2={hubCy} delay={i * 0.18} />
            ))}
            {rs.map((r, i) => (
              <Link
                key={`r${i}`}
                x1={HUB_X + HUB_W}
                y1={hubCy}
                x2={RIGHT_X}
                y2={r.cy}
                delay={0.5 + i * 0.18}
              />
            ))}
            {left.map((n, i) => (
              <Node key={n.label} node={n} x={2} y={ls[i].y} h={ls[i].h} />
            ))}
            {right.map((n, i) => (
              <Node key={n.label} node={n} x={RIGHT_X} y={rs[i].y} h={rs[i].h} />
            ))}
            <rect x={HUB_X} y={hubCy - 38} width={HUB_W} height={76} rx={16} fill="url(#fmHub)" />
            <text
              x={HUB_X + HUB_W / 2}
              y={hubCy - 4}
              textAnchor="middle"
              fontSize={13.5}
              fontWeight={800}
              fill="#fff"
            >
              {hub}
            </text>
            <text
              x={HUB_X + HUB_W / 2}
              y={hubCy + 14}
              textAnchor="middle"
              fontSize={10}
              fill="rgba(255,255,255,.82)"
            >
              {hubNote}
            </text>
          </svg>
        </div>
      </div>
    </div>
  );
}

/** Ingredient cards flowing into the stock, COGS and variance widgets. */
export function MockIngredientFlow() {
  return (
    <Flow
      title="Sales and inventory, together"
      sub="Every ingredient priced from your own purchases"
      left={[
        { label: "Chicken thigh", value: "AED 18.40 / kg", img: "/hero/waste/chicken.jpg" },
        { label: "Basmati rice", value: "AED 5.95 / kg", img: "/hero/hero-biryani.jpg" },
        { label: "Tomatoes", value: "AED 4.10 / kg", img: "/hero/hero-tomatoes1.jpg" },
      ]}
      hub="Recipe costing"
      hubNote="90-day average cost"
      right={[
        { label: "Stock on hand", value: "4,286 units · 148 items" },
        { label: "COGS", value: "AED 150.4K net cost" },
        { label: "Variance", value: "AED 11,640 over need" },
      ]}
    />
  );
}

/** The assistant reading all four connected sources, not a generic chatbot. */
export function MockAiSources() {
  return (
    <Flow
      title="Grounded in your connected data"
      sub="Four sources, already cleaned and joined"
      left={[
        { label: "Sales", value: "Bills by item and channel" },
        { label: "Stock", value: "Material in and out" },
        { label: "Waste", value: "Bought beyond need" },
        { label: "Purchasing", value: "Vouchers, by supplier" },
      ]}
      hub="PlatePielet AI"
      hubNote="Read-only queries"
      right={[
        { label: "Plain answers", value: "Branch and period named" },
        { label: "Result rows", value: "The rows behind the answer" },
        { label: "Next actions", value: "On your Overview" },
      ]}
    />
  );
}

/** POS, Tally and inventory sources converging into one intelligence layer. */
export function MockIntegrationFlow() {
  return (
    <Flow
      title="One intelligence layer above your stack"
      sub="Keep the systems you run — connect the data they already produce"
      left={[
        { label: "POS sales", value: "Bill-level, every outlet" },
        { label: "Tally books", value: "Purchase and return vouchers" },
        { label: "Inventory", value: "Material in and out" },
        { label: "CSV & Excel", value: "Workbooks you already keep" },
      ]}
      hub="PlatePielet"
      hubNote="One set of numbers"
      right={[
        { label: "Dashboards", value: "Group and outlet, one screen" },
        { label: "Alerts", value: "Stock, margin, coverage gaps" },
        { label: "Reports", value: "Month-end, CSV export" },
      ]}
    />
  );
}
