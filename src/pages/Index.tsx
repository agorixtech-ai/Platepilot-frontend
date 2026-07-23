import { AppPage } from "@/components/ionic/AppPage";
import { useEffect, useRef, useState, type ReactNode } from "react";
import {
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  Megaphone,
  Package,
  Receipt,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Trash2,
} from "lucide-react";
import { AgorixHero, T } from "@/components/AgorixHero";
import { AgorixNav } from "@/components/AgorixNav";
import InteractiveBentoGallery, {
  type BentoMediaItem,
} from "@/components/blocks/interactive-bento-gallery";
import { CrossPlatformSection } from "@/components/CrossPlatformSection";

/* ─── Product-preview tiles ──────────────────────────────────────────────────
   Coded mini-mockups of the real dashboard modules (src/pages/dashboard/*):
   Overview, Pos, Tally, Inventory, Ai, MarketPrices, Reports — rendered as
   "ui" bento items instead of stock media. Inline styles only, colored via
   the shared T palette exported from AgorixHero.tsx. */

function Tile({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div
      style={{
        height: "100%",
        display: "flex",
        flexDirection: "column",
        gap: 7,
        padding: "10px 12px",
        background: `linear-gradient(180deg,${T.surface} 0%,${T.bg} 100%)`,
        fontFamily: "'Inter', system-ui, sans-serif",
        overflow: "hidden",
        textAlign: "left",
      }}
    >
      <div style={{ display: "flex", alignItems: "center", gap: 6, flexShrink: 0 }}>
        <span style={{ width: 6, height: 6, borderRadius: "50%", background: T.accent }} />
        <span
          style={{
            fontSize: 8.5,
            fontWeight: 700,
            letterSpacing: "0.14em",
            textTransform: "uppercase",
            color: T.muted,
            whiteSpace: "nowrap",
          }}
        >
          {label}
        </span>
      </div>
      <div
        style={{
          flex: 1,
          minHeight: 0,
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          gap: 6,
        }}
      >
        {children}
      </div>
    </div>
  );
}

function OverviewTile() {
  return (
    <Tile label="Dashboard · Overview">
      <div style={{ display: "flex", gap: 14 }}>
        {[
          ["₹2.4L", "Sales Today"],
          ["847", "Bills"],
        ].map(([v, l]) => (
          <div key={l}>
            <div style={{ fontSize: 15, fontWeight: 800, color: T.text, lineHeight: 1 }}>{v}</div>
            <div style={{ fontSize: 8.5, color: T.muted, marginTop: 2 }}>{l}</div>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", alignItems: "flex-end", gap: 3, flex: 1, minHeight: 14 }}>
        {[38, 55, 44, 70, 58, 82, 64, 92].map((h, i) => (
          <div
            key={i}
            style={{
              flex: 1,
              height: `${h}%`,
              borderRadius: 2,
              background: i === 7 ? T.accent : T.accentBorder,
            }}
          />
        ))}
      </div>
    </Tile>
  );
}

const POS_BILLS = [
  ["#2249", "₹430"],
  ["#2250", "₹1,120"],
  ["#2251", "₹260"],
  ["#2252", "₹840"],
  ["#2253", "₹1,560"],
  ["#2254", "₹375"],
];

function PosTile() {
  return (
    <Tile label="POS Sales · Live">
      <div style={{ overflow: "hidden", flex: 1, display: "flex", alignItems: "center" }}>
        <div
          style={{
            display: "flex",
            gap: 6,
            width: "max-content",
            animation: "pp-scroll-x 14s linear infinite",
          }}
        >
          {[...POS_BILLS, ...POS_BILLS].map(([id, amt], i) => (
            <span
              key={i}
              style={{
                display: "inline-flex",
                gap: 5,
                alignItems: "baseline",
                padding: "5px 9px",
                border: `1px solid ${T.border}`,
                borderRadius: 7,
                background: T.surface,
                whiteSpace: "nowrap",
              }}
            >
              <span style={{ fontSize: 9, color: T.muted, fontWeight: 600 }}>{id}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: T.text }}>{amt}</span>
            </span>
          ))}
        </div>
      </div>
      <div style={{ fontSize: 8.5, color: T.faint, flexShrink: 0 }}>
        Streaming from 5 outlets → reconciled in Tally
      </div>
    </Tile>
  );
}

const VOUCHERS: [string, string, string, "Matched" | "Pending"][] = [
  ["INV-8821", "Sales · Anna Nagar", "₹84,200", "Matched"],
  ["PO-1192", "Purchase · Head Office", "₹18,400", "Pending"],
  ["JV-5521", "Journal · Accounts", "₹2,100", "Matched"],
];

function TallyTile() {
  return (
    <Tile label="Tally · Vouchers">
      {VOUCHERS.map(([id, sub, amt, status]) => (
        <div key={id} style={{ display: "flex", alignItems: "center", gap: 8, minHeight: 0 }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <span style={{ fontSize: 9.5, fontWeight: 700, color: T.text }}>{id}</span>
            <span style={{ fontSize: 8.5, color: T.muted, marginLeft: 6 }}>{sub}</span>
          </div>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: T.text, whiteSpace: "nowrap" }}>
            {amt}
          </span>
          <span
            style={{
              fontSize: 8,
              fontWeight: 700,
              padding: "2px 7px",
              borderRadius: 999,
              whiteSpace: "nowrap",
              color: status === "Matched" ? "#15803D" : "#92400E",
              background: status === "Matched" ? T.inset : "rgba(245,158,11,0.14)",
              border: `1px solid ${status === "Matched" ? T.accentBorder : "rgba(245,158,11,0.35)"}`,
            }}
          >
            {status}
          </span>
        </div>
      ))}
    </Tile>
  );
}

const STOCK: [string, number, string][] = [
  ["Rice", 72, T.accent],
  ["Paneer", 41, T.warn],
  ["Tomatoes", 12, "#EF4444"],
];

function InventoryTile() {
  return (
    <Tile label="Inventory">
      {STOCK.map(([name, pct, color]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 7 }}>
          <span style={{ fontSize: 8.5, color: T.muted, width: 46, flexShrink: 0 }}>{name}</span>
          <div
            style={{
              flex: 1,
              height: 5,
              borderRadius: 999,
              background: T.border,
              overflow: "hidden",
            }}
          >
            <div
              style={{ width: `${pct}%`, height: "100%", borderRadius: 999, background: color }}
            />
          </div>
          <span style={{ fontSize: 8.5, fontWeight: 700, color, width: 26, textAlign: "right" }}>
            {pct}%
          </span>
        </div>
      ))}
    </Tile>
  );
}

function PilotAiTile() {
  return (
    <Tile label="Pilot AI">
      <div
        style={{
          alignSelf: "flex-start",
          fontSize: 8.5,
          fontWeight: 600,
          color: "#15803D",
          background: T.inset,
          border: `1px solid ${T.accentBorder}`,
          padding: "3px 8px",
          borderRadius: 999,
          whiteSpace: "nowrap",
        }}
      >
        "Why is food cost up this week?"
      </div>
      <div style={{ fontSize: 9.5, color: T.muted, lineHeight: 1.5 }}>
        Velachery over-ordered paneer by 18% — ₹6,300 recoverable.
        <span
          style={{
            display: "inline-block",
            width: 1.5,
            height: 8,
            background: T.accent,
            marginLeft: 2,
            verticalAlign: "middle",
            animation: "pp-blink 1s steps(1) infinite",
          }}
        />
      </div>
    </Tile>
  );
}

const PRICES: [string, string, string, string][] = [
  ["Tomato", "₹38/kg", "▼ 4%", T.accent],
  ["Onion", "₹52/kg", "▲ 6%", "#EF4444"],
  ["Paneer", "₹340/kg", "▼ 2%", T.accent],
];

function MarketPricesTile() {
  return (
    <Tile label="Market Prices">
      {PRICES.map(([name, price, delta, color]) => (
        <div key={name} style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <span style={{ fontSize: 9, color: T.muted, flex: 1 }}>{name}</span>
          <span style={{ fontSize: 9.5, fontWeight: 700, color: T.text }}>{price}</span>
          <span style={{ fontSize: 8.5, fontWeight: 700, color, width: 32, textAlign: "right" }}>
            {delta}
          </span>
        </div>
      ))}
    </Tile>
  );
}

function ReportsTile() {
  return (
    <Tile label="Reports · Monthly">
      <div style={{ display: "flex", alignItems: "baseline", gap: 6 }}>
        <span style={{ fontSize: 15, fontWeight: 800, color: T.text, lineHeight: 1 }}>28.4%</span>
        <span style={{ fontSize: 8.5, fontWeight: 700, color: T.accent }}>▼ 1.2%</span>
      </div>
      <div style={{ fontSize: 8.5, color: T.muted, marginTop: -3 }}>Food cost vs last month</div>
      {[
        ["Sales", "₹68.2L"],
        ["Wastage", "₹1.9L"],
      ].map(([l, v]) => (
        <div key={l} style={{ display: "flex", justifyContent: "space-between" }}>
          <span style={{ fontSize: 8.5, color: T.muted }}>{l}</span>
          <span style={{ fontSize: 9, fontWeight: 700, color: T.text }}>{v}</span>
        </div>
      ))}
    </Tile>
  );
}

/**
 * Reference alignment (3-col bento):
 *  [1] [  2  ]
 *  [  3  ] [4]
 *  [5] [6] [7]
 */
const GALLERY_MEDIA: BentoMediaItem[] = [
  {
    id: 1,
    type: "ui",
    title: "Live Dashboard",
    desc: "Sales, bills, and margin per outlet — live",
    node: <OverviewTile />,
    span: "bento-span-1",
  },
  {
    id: 2,
    type: "ui",
    title: "POS Sales Stream",
    desc: "Every bill imported the moment it prints",
    node: <PosTile />,
    span: "bento-span-2",
  },
  {
    id: 3,
    type: "ui",
    title: "Tally Auto-Reconciliation",
    desc: "Vouchers matched against POS automatically",
    node: <TallyTile />,
    span: "bento-span-2",
  },
  {
    id: 4,
    type: "ui",
    title: "Inventory Alerts",
    desc: "Low stock flagged before you run out",
    node: <InventoryTile />,
    span: "bento-span-1",
  },
  {
    id: 5,
    type: "ui",
    title: "Pilot AI",
    desc: "Ask your books anything in plain language",
    node: <PilotAiTile />,
    span: "bento-span-1",
  },
  {
    id: 6,
    type: "ui",
    title: "Market Prices",
    desc: "Buy when prices dip, not when you notice",
    node: <MarketPricesTile />,
    span: "bento-span-1",
  },
  {
    id: 7,
    type: "ui",
    title: "Monthly Reports",
    desc: "Food cost and margin on one page",
    node: <ReportsTile />,
    span: "bento-span-1",
  },
];

/* ─── Testimonials & FAQ content ─────────────────────────────────────────── */
const TESTIMONIALS: { quote: string; name: string; place: string }[] = [
  {
    quote:
      "PlatePilot found ₹40,000 a month we didn't know we were losing. It paid for itself in the first week.",
    name: "Priya R.",
    place: "3-outlet restaurant group · Chennai",
  },
  {
    quote:
      "Tally reconciliation used to eat my Sundays. Now it's finished before I open the laptop.",
    name: "Suresh M.",
    place: "Madras Meals Co. · Chennai",
  },
  {
    quote:
      "Food cost dropped 3% in the first month. The waste alerts alone are worth the subscription.",
    name: "Kavitha N.",
    place: "GreenLeaf Kitchens · Coimbatore",
  },
  {
    quote: "I check one dashboard instead of calling five managers every morning.",
    name: "Arjun V.",
    place: "Urban Tandoor · Bengaluru",
  },
  {
    quote: "The GST mismatch alert saved us from a filing penalty in our very first week.",
    name: "Deepa S.",
    place: "Biryani House · Chennai",
  },
  {
    quote: "Pilot AI answers in seconds what my accountant needed days to pull together.",
    name: "Rahul K.",
    place: "Cafe Azzure · Chennai",
  },
];
const TM_ROW2 = [...TESTIMONIALS.slice(3), ...TESTIMONIALS.slice(0, 3)];

const FAQS: [string, string][] = [
  [
    "Do I need new hardware?",
    "No. PlatePilot connects to the Tally and POS systems you already run — there's nothing to install at the outlet.",
  ],
  [
    "How long does setup take?",
    "Most single outlets are live in one afternoon. Multi-outlet groups typically finish onboarding within a week, including historical data import.",
  ],
  [
    "Which POS systems are supported?",
    "POS sales import works with common billing systems, and CSV / Excel import covers everything else. Tally ERP sync is two-way.",
  ],
  [
    "Is my business data safe?",
    "Yes. Data is encrypted in transit and at rest, scoped per tenant, and never shared. Your books remain yours — export them anytime.",
  ],
  [
    "What happens after the free trial?",
    "Pick a plan to continue, or export your data and walk away. No credit card is needed to start, so there's nothing to cancel.",
  ],
];

/* ─── Menu-engineering report cards (mirrors dashboard/MenuEngineering) ──── */
const ME_DISHES = [
  {
    dish: "Chicken Biryani",
    sells: "High",
    sellsPct: 88,
    earns: "₹92",
    earnsPct: 80,
    tier: "Best Seller",
    classic: "Star",
    act: "Customers love it and it earns well. Keep it front and center.",
    color: "#15803D",
    bg: "rgba(22,163,74,0.08)",
    icon: Star,
  },
  {
    dish: "Butter Naan",
    sells: "High",
    sellsPct: 82,
    earns: "₹18",
    earnsPct: 22,
    tier: "Underpriced",
    classic: "Plow Horse",
    act: "Everyone orders it, but it barely profits. Raise the price a little.",
    color: "#92400E",
    bg: "rgba(245,158,11,0.1)",
    icon: Tag,
  },
  {
    dish: "Mutton Sukka",
    sells: "Low",
    sellsPct: 28,
    earns: "₹120",
    earnsPct: 95,
    tier: "Hidden Gem",
    classic: "Puzzle",
    act: "Earns a lot, but few people order it. Recommend it more.",
    color: "#0F7A4C",
    bg: "#E8F7ED",
    icon: Megaphone,
  },
  {
    dish: "Veg Cutlet",
    sells: "Low",
    sellsPct: 15,
    earns: "₹9",
    earnsPct: 8,
    tier: "Dead Weight",
    classic: "Dog",
    act: "Rarely ordered and barely profits. Take it off the menu.",
    color: "#B91C1C",
    bg: "rgba(239,68,68,0.08)",
    icon: Trash2,
  },
];

/* ─── Scroll reveal hook ─────────────────────────────────────────────────── */
function useReveal(threshold = 0.18) {
  const ref = useRef<HTMLDivElement | null>(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, visible };
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
function Index() {
  const [activeTab, setActiveTab] = useState(0);

  const sec1 = useReveal();
  const sec2 = useReveal();
  const sec3 = useReveal();
  const sec4 = useReveal();
  const sec5 = useReveal();
  const sec6 = useReveal();
  const sec10 = useReveal();

  const tabs = [
    {
      label: "PILOT AI INSIGHTS",
      heading: "Your smartest back-office hire",
      body: "Pilot AI reads every bill, voucher, and stock movement across your outlets — then tells you, in plain language, where money is leaking and what to do about it. No reports to build, no analyst to hire.",
      bullets: [
        "Daily digest of anomalies worth your attention",
        'Ask questions in plain language — "why is food cost up in Velachery?"',
        "Predictive purchase suggestions before you run out",
        "GST and reconciliation risks flagged before filing day",
      ],
    },
    {
      label: "REALTIME DASHBOARDS",
      heading: "Every outlet's numbers, live",
      body: "Sales, food cost, stock, and receivables update as they happen — not at month-end. Drill from the group view down to a single outlet, item, or invoice in two taps.",
      bullets: [
        "Live sales, bills, and margin KPIs per outlet",
        "Stock levels with low-inventory and variance alerts",
        "Wastage trends tracked week over week",
        "Mobile-first — check the numbers from anywhere",
      ],
    },
    {
      label: "TALLY + POS INTEGRATIONS",
      heading: "Works with the tools you already use",
      body: "No migration project, no new hardware. PlatePilot connects to your existing Tally books and POS billing, keeps them in sync, and reconciles them against each other automatically.",
      bullets: [
        "Two-way Tally ERP sync — vouchers, ledgers, GST",
        "Automatic POS sales import across outlets",
        "CSV / Excel import for everything else",
        "POS-to-Tally reconciliation with mismatch alerts",
      ],
    },
  ];

  return (
    <main
      className="agorix-landing"
      style={{
        background: "#F6FAF7",
        color: "#152019",
        fontFamily: "'Inter', system-ui, sans-serif",
        overflowX: "clip",
      }}
    >
      <style>{`
        /* ── Shared resets — scoped to this page: Ionic keeps this page
           mounted during SPA navigation, so unscoped rules would leak into
           other pages and override their Tailwind utilities ── */
        /* Reset skips the bento gallery (.ig-root) — it spaces itself with
           Tailwind utilities, which this unlayered reset would override.
           :where() keeps the reset's specificity at (0,1,0) so page classes
           like .sw-section still override it by source order. */
        .agorix-landing,
        .agorix-landing *:where(:not(.ig-root, .ig-root *)) { box-sizing: border-box; margin: 0; padding: 0; }
        .agorix-landing a { text-decoration: none; }

        /* ── Reveal animation ── */
        .reveal { opacity: 0; transform: translateY(28px); transition: opacity 0.75s ease, transform 0.75s ease; }
        .reveal.show { opacity: 1; transform: none; }

        /* ── Section shared ── */
        .sw-section {
          max-width: 1280px;
          margin: 0 auto;
          padding: 0 2.5rem;
        }
        @media (max-width: 640px) {
          .sw-section { padding: 0 1.25rem; }
        }
        .sw-rule {
          height: 1px;
          background: #DDE7E1;
        }

        /* ── Eyebrow label ── */
        .sw-eyebrow {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #66736B;
          text-transform: uppercase;
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 3rem;
        }
        .sw-eyebrow::before {
          content: '';
          width: 2.5rem;
          height: 1px;
          background: rgba(21,32,25,0.2);
          flex-shrink: 0;
        }

        /* ── Intro band ── */
        .intro-band {
          display: flex;
          flex-direction: column;
          gap: 2.5rem;
          padding: 7rem 0;
          align-items: start;
        }
        .intro-h2 {
          font-size: clamp(2.25rem, 4.5vw, 4rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          color: #152019;
          max-width: 900px;
        }
        .intro-body {
          font-size: 1rem;
          color: #66736B;
          line-height: 1.8;
        }
        .intro-body strong { color: #152019; font-weight: 600; }
        .btn-white {
          background: #16A34A;
          color: #FFFFFF !important;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          padding: 0.85rem 1.75rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 12px rgba(22, 163, 74, 0.22);
          transition: background 0.2s, transform 0.15s, box-shadow 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          line-height: 1;
        }
        .btn-white:hover {
          background: #15803D;
          transform: translateY(-1px);
          box-shadow: 0 8px 18px rgba(22, 163, 74, 0.28);
        }
        .btn-ghost {
          background: transparent;
          color: #152019 !important;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          padding: 0.85rem 1.75rem;
          border: 1px solid rgba(21,32,25,0.22);
          border-radius: 9999px;
          cursor: pointer;
          transition: border-color 0.2s, color 0.2s, transform 0.15s, background 0.2s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          line-height: 1;
        }
        .btn-ghost:hover { border-color: #66736B; color: #152019 !important; background: #E8F7ED; transform: translateY(-1px); }

        .platforms-section { padding: 6rem 0; }

        .caps-section { padding: 6rem 0; }

        /* ── Concept flow: sources → Pilot AI → outcomes ── */
        .pp-flow {
          display: grid;
          grid-template-columns: 1fr 70px 250px 70px 1fr;
          align-items: start;
          margin-top: 2.5rem;
        }
        .pp-flow-lbl {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #66736B;
          height: 16px;
          line-height: 16px;
          margin-bottom: 12px;
        }
        .pp-flow-col { display: flex; flex-direction: column; gap: 20px; height: 280px; }
        .pp-node {
          height: 80px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 16px;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 12px;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        .pp-node > svg { color: #16A34A; flex-shrink: 0; }
        .pp-node-title { font-size: 0.85rem; font-weight: 700; color: #152019; line-height: 1.2; }
        .pp-node-sub { font-size: 0.72rem; color: #66736B; margin-top: 2px; }
        .pp-conn-cell { margin-top: 28px; }
        .pp-conn-cell svg { display: block; width: 100%; height: 280px; }
        .pp-conn-cell path {
          fill: none;
          stroke: #16A34A;
          stroke-opacity: 0.5;
          stroke-width: 2.5;
          stroke-linecap: round;
          stroke-dasharray: 1 12;
          animation: pp-dash 1.1s linear infinite;
        }
        @keyframes pp-dash { to { stroke-dashoffset: -26; } }
        .pp-engine-cell {
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pp-engine {
          background: #FFFFFF;
          border: 1.5px solid #16A34A;
          border-radius: 16px;
          padding: 1.6rem 1.4rem;
          text-align: center;
          max-width: 250px;
          animation: pp-pulse 2.6s ease-in-out infinite;
        }
        @keyframes pp-pulse {
          0%, 100% { box-shadow: 0 0 0 0 rgba(22,163,74,0.22); }
          50% { box-shadow: 0 0 0 14px rgba(22,163,74,0); }
        }
        .pp-engine > svg { color: #16A34A; }
        .pp-engine-title { font-size: 1.05rem; font-weight: 800; color: #152019; margin-top: 8px; }
        .pp-engine-sub { font-size: 0.72rem; color: #66736B; margin-top: 5px; line-height: 1.55; }
        @keyframes pp-vdash { to { background-position-y: 12px; } }
        @media (max-width: 900px) {
          .pp-flow { display: flex; flex-direction: column; align-items: stretch; }
          .pp-flow-col { height: auto; }
          .pp-conn-cell {
            margin: 12px auto;
            width: 2px;
            height: 44px;
            background: repeating-linear-gradient(180deg, #16A34A 0 3px, transparent 3px 12px);
            animation: pp-vdash 1.1s linear infinite;
          }
          .pp-conn-cell svg { display: none; }
          .pp-engine-cell { height: auto; }
          .pp-flow-lbl { height: auto; margin-bottom: 10px; text-align: center; }
          .pp-engine { max-width: none; width: 100%; }
        }

        /* ── Testimonials marquee ── */
        .tm-section { padding: 6rem 0; }
        .tm-marquee {
          overflow: hidden;
          -webkit-mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(90deg, transparent, #000 8%, #000 92%, transparent);
        }
        .tm-track {
          display: flex;
          gap: 1.25rem;
          width: max-content;
          padding: 0.75rem 0;
          animation: pp-scroll-x 48s linear infinite;
        }
        .tm-track.tm-reverse { animation-direction: reverse; }
        .tm-marquee:hover .tm-track { animation-play-state: paused; }
        .tm-card {
          width: 340px;
          flex-shrink: 0;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 14px;
          padding: 1.5rem;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        @media (max-width: 600px) { .tm-card { width: 280px; } }
        .tm-quote { font-size: 0.9rem; color: #152019; line-height: 1.65; }
        .tm-attr { margin-top: 1rem; font-size: 0.78rem; font-weight: 700; color: #16A34A; }
        .tm-attr span { display: block; font-weight: 500; color: #66736B; margin-top: 2px; }

        /* ── FAQ (native details/summary) ── */
        .faq-split {
          display: grid;
          grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
          gap: 4rem;
          align-items: start;
        }
        @media (max-width: 900px) { .faq-split { grid-template-columns: 1fr; gap: 2.5rem; } }
        .faq-list { border-top: 1px solid #DDE7E1; }
        .faq-item { border-bottom: 1px solid #DDE7E1; }
        .faq-item summary {
          cursor: pointer;
          list-style: none;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 1.5rem;
          padding: 1.25rem 0;
          font-size: 0.95rem;
          font-weight: 600;
          color: #152019;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after {
          content: '+';
          font-size: 1.1rem;
          font-weight: 700;
          color: #16A34A;
          flex-shrink: 0;
        }
        .faq-item[open] summary::after { content: '−'; }
        .faq-a {
          padding: 0 2rem 1.25rem 0;
          font-size: 0.85rem;
          color: #66736B;
          line-height: 1.7;
        }

        /* ── Menu Engineering: formula strip + dish report cards ── */
        .me-formula {
          display: flex;
          align-items: stretch;
          margin: 2.5rem 0 2.75rem;
          border: 1px solid #DDE7E1;
          border-radius: 14px;
          background: #FFFFFF;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        .me-f-step {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 14px;
          padding: 1.25rem 1.5rem;
        }
        .me-f-ico {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: #E8F7ED;
          color: #16A34A;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .me-f-title { font-size: 0.9rem; font-weight: 700; color: #152019; line-height: 1.25; }
        .me-f-sub { font-size: 0.75rem; color: #66736B; margin-top: 2px; }
        .me-f-op {
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          width: 34px;
        }
        .me-f-op span {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          background: #16A34A;
          color: #FFFFFF;
          font-weight: 800;
          font-size: 0.95rem;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 2px 6px rgba(22,163,74,0.3);
        }
        @media (max-width: 900px) {
          .me-formula { flex-direction: column; }
          .me-f-op { width: auto; margin: -8px 0; z-index: 1; }
        }
        .me-example-lbl {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: #66736B;
          margin-bottom: 1.1rem;
        }
        .me-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1100px) { .me-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .me-grid { grid-template-columns: 1fr; } }
        .me-card {
          display: flex;
          flex-direction: column;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 14px;
          padding: 1.4rem 1.4rem 0;
          overflow: hidden;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        .me-dish-name {
          font-size: 1rem;
          font-weight: 800;
          color: #152019;
          margin-bottom: 1.1rem;
        }
        .me-stat { margin-bottom: 0.9rem; }
        .me-stat-top {
          display: flex;
          justify-content: space-between;
          align-items: baseline;
          gap: 8px;
          font-size: 0.72rem;
          color: #66736B;
          margin-bottom: 5px;
        }
        .me-stat-val { font-weight: 700; }
        .me-bar {
          height: 6px;
          border-radius: 9999px;
          background: rgba(21,32,25,0.07);
          overflow: hidden;
        }
        .me-bar > span {
          display: block;
          height: 100%;
          border-radius: 9999px;
          transform-origin: left;
        }
        @keyframes me-grow { from { transform: scaleX(0); } }
        .reveal.show .me-bar > span { animation: me-grow 0.9s cubic-bezier(0.2, 0.7, 0.3, 1) both; }
        .reveal.show .me-card:nth-child(2) .me-bar > span { animation-delay: 0.12s; }
        .reveal.show .me-card:nth-child(3) .me-bar > span { animation-delay: 0.24s; }
        .reveal.show .me-card:nth-child(4) .me-bar > span { animation-delay: 0.36s; }
        .me-verdict {
          margin: 1.1rem -1.4rem 0;
          margin-top: auto;
          padding: 0.9rem 1.4rem 1rem;
          display: flex;
          gap: 0.6rem;
          align-items: flex-start;
        }
        .me-verdict svg { flex-shrink: 0; margin-top: 1px; }
        .me-verdict-tier {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .me-verdict-classic {
          opacity: 0.65;
          font-weight: 600;
          letter-spacing: 0;
          text-transform: none;
        }
        .me-verdict-act {
          font-size: 0.78rem;
          line-height: 1.5;
          margin-top: 3px;
          color: rgba(21,32,25,0.8);
        }
        .me-note { margin-top: 1.75rem; font-size: 0.85rem; color: #66736B; }

        /* ── CTA Band ── */
        .cta-band {
          padding: 7rem 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
          border-top: 1px solid #DDE7E1;
        }
        .cta-heading {
          font-size: clamp(2rem, 4vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1;
          max-width: 520px;
        }
        .cta-actions { display: flex; gap: 1rem; flex-wrap: wrap; }

        /* ── Footer ── */
        .sw-footer {
          border-top: 1px solid #DDE7E1;
          padding: 2rem 2.5rem;
          display: flex;
          align-items: center;
          justify-content: space-between;
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: #66736B;
          flex-wrap: wrap;
          gap: 1rem;
        }
        .sw-footer a { color: inherit; transition: color 0.2s; }
        .sw-footer a:hover { color: #16A34A; }
        .sw-footer-links { display: flex; gap: 2rem; }

        /* ── Sections padding and layout ── */
        .caps-section, .platforms-section, .loop-section {
          padding: 5rem 0;
        }

        /* ── New platform section styles (exact match to reference) ── */
        .sw-section-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.25em;
          color: #66736B;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .sw-section-h2 {
          font-size: clamp(2.25rem, 4vw, 3.5rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1rem;
          max-width: 700px;
        }
        .sw-section-body {
          font-size: 0.9rem;
          color: #66736B;
          line-height: 1.75;
          max-width: 560px;
          margin-bottom: 3.5rem;
        }

        /* ── Split gallery section: half copy / half bento ── */
        .agorix-landing .gallery-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        .agorix-landing .gallery-split-copy {
          text-align: left;
          max-width: 480px;
        }
        .agorix-landing .gallery-split-copy .sw-section-tag,
        .agorix-landing .gallery-split-copy .sw-section-h2,
        .agorix-landing .gallery-split-copy .sw-section-body {
          margin-left: 0 !important;
          margin-right: 0 !important;
          text-align: left;
        }
        .agorix-landing .gallery-split-copy .sw-section-h2 {
          max-width: none;
        }
        .agorix-landing .gallery-split-copy .sw-section-body {
          margin-bottom: 0 !important;
          max-width: none;
        }
        .agorix-landing .gallery-split-media {
          width: 100%;
          min-width: 0;
        }
        .agorix-landing .bento-gallery-grid {
          display: grid;
          width: 100%;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: 100px;
          gap: 10px;
        }
        .agorix-landing .bento-span-1 { grid-column: span 1; }
        .agorix-landing .bento-span-2 { grid-column: span 2; }
        @media (max-width: 900px) {
          .agorix-landing .gallery-split {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .agorix-landing .gallery-split-copy {
            max-width: none;
          }
          .agorix-landing .bento-gallery-grid {
            grid-auto-rows: 110px;
            gap: 10px;
          }
        }
        @media (max-width: 640px) {
          .agorix-landing .bento-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: 96px;
            gap: 8px;
          }
          .agorix-landing .bento-span-2 { grid-column: span 1; }
        }
        @media (min-width: 1100px) {
          .agorix-landing .bento-gallery-grid {
            grid-auto-rows: 120px;
            gap: 12px;
          }
        }

        /* ── Cross-platform / Available Everywhere ── */
        .agorix-landing .xp-section {
          position: relative;
          isolation: isolate;
          padding: 5.5rem 2.5rem;
          background:
            radial-gradient(ellipse 70% 55% at 50% 42%, rgba(34, 197, 94, 0.14), transparent 70%),
            linear-gradient(180deg, #EAF7EF 0%, #F6FAF7 55%, #F6FAF7 100%);
          border-top: 1px solid #DDE7E1;
          border-bottom: 1px solid #DDE7E1;
          overflow: hidden;
        }
        .agorix-landing .xp-inner {
          max-width: 1100px;
          margin: 0 auto !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .agorix-landing .xp-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.45rem;
          padding: 0.4rem 0.85rem !important;
          margin: 0 0 1.25rem !important;
          border-radius: 999px;
          border: 1px solid rgba(22, 163, 74, 0.28);
          background: rgba(255, 255, 255, 0.75);
          color: #15803D;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.04em;
          box-shadow: 0 1px 2px rgba(21, 32, 25, 0.04);
        }
        .agorix-landing .xp-title {
          font-size: clamp(2.1rem, 4.5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.05;
          color: #152019;
          margin: 0 0 0.75rem !important;
        }
        .agorix-landing .xp-sub {
          font-size: 1.05rem;
          color: #66736B;
          margin: 0 0 2.75rem !important;
          max-width: 420px;
        }
        .agorix-landing .xp-devices {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          width: 100%;
          margin: 0 0 2.5rem !important;
          padding: 0.5rem 0 0 !important;
        }
        .agorix-landing .xp-device {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0 0 auto;
        }
        .agorix-landing .xp-bezel {
          background: #1A2B20;
          border: 1px solid #2A3F32;
          border-radius: 10px;
          padding: 6px !important;
          box-shadow:
            0 12px 28px rgba(21, 32, 25, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }
        .agorix-landing .xp-bezel-flat { border-radius: 14px; padding: 8px !important; }
        .agorix-landing .xp-bezel-phone {
          border-radius: 18px;
          padding: 10px 6px 8px !important;
          position: relative;
        }
        .agorix-landing .xp-notch {
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          width: 28%;
          height: 5px;
          border-radius: 999px;
          background: #0F1A14;
          z-index: 2;
        }
        .agorix-landing .xp-screen {
          background: #0F1A14;
          border-radius: 4px;
          padding: 8px !important;
          display: flex;
          flex-direction: column;
          gap: 6px;
          height: 100%;
          min-height: 0;
        }
        .agorix-landing .xp-screen-bar {
          height: 7px;
          border-radius: 3px;
          background: linear-gradient(90deg, #16A34A, #4ADE80);
          width: 100%;
          flex-shrink: 0;
        }
        .agorix-landing .xp-screen-meta {
          display: flex;
          gap: 4px;
        }
        .agorix-landing .xp-screen-meta span {
          height: 4px;
          border-radius: 2px;
          background: rgba(74, 222, 128, 0.22);
          flex: 1;
        }
        .agorix-landing .xp-chart {
          width: 100%;
          height: 42%;
          min-height: 28px;
          flex: 1;
        }
        .agorix-landing .xp-screen-rows {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .agorix-landing .xp-screen-rows span {
          display: block;
          height: 3px;
          border-radius: 2px;
          background: rgba(74, 222, 128, 0.16);
        }
        .agorix-landing .xp-screen-rows span:nth-child(2) { width: 78%; }
        .agorix-landing .xp-screen-rows span:nth-child(3) { width: 54%; }

        .agorix-landing .xp-monitor .xp-bezel { width: clamp(88px, 12vw, 130px); height: clamp(70px, 9vw, 98px); }
        .agorix-landing .xp-stand {
          width: 10px;
          height: 14px;
          background: #2A3F32;
          margin-top: 0 !important;
        }
        .agorix-landing .xp-base {
          width: 48px;
          height: 5px;
          border-radius: 3px;
          background: #2A3F32;
        }
        .agorix-landing .xp-laptop .xp-bezel { width: clamp(130px, 18vw, 200px); height: clamp(82px, 11vw, 120px); border-radius: 8px 8px 2px 2px; }
        .agorix-landing .xp-laptop-deck {
          width: clamp(150px, 20vw, 230px);
          height: 8px;
          border-radius: 0 0 8px 8px;
          background: linear-gradient(180deg, #2A3F32, #1A2B20);
          box-shadow: 0 4px 10px rgba(21, 32, 25, 0.12);
        }
        .agorix-landing .xp-tablet .xp-bezel { width: clamp(100px, 14vw, 150px); height: clamp(72px, 10vw, 105px); }
        .agorix-landing .xp-phone .xp-bezel { width: clamp(42px, 6vw, 58px); height: clamp(84px, 12vw, 118px); }

        .agorix-landing .xp-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.55rem;
          list-style: none;
          margin: 0 0 2rem !important;
          padding: 0 !important;
          max-width: 820px;
        }
        .agorix-landing .xp-pill {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.45rem 0.85rem !important;
          border-radius: 999px;
          border: 1px solid rgba(22, 163, 74, 0.3);
          background: rgba(255, 255, 255, 0.82);
          color: #152019;
          font-size: 0.78rem;
          font-weight: 600;
          box-shadow: 0 1px 2px rgba(21, 32, 25, 0.04);
        }
        .agorix-landing .xp-pill svg { color: #16A34A; flex-shrink: 0; }

        .agorix-landing .xp-stores {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }
        .agorix-landing .xp-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 1.1rem !important;
          border-radius: 12px;
          border: 1px solid #DDE7E1;
          background: #152019;
          color: #F6FAF7 !important;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
          min-width: 168px;
        }
        .agorix-landing .xp-store-btn:hover {
          background: #1F3328;
          border-color: #16A34A;
          transform: translateY(-1px);
        }
        .agorix-landing .xp-store-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
          text-align: left;
        }
        .agorix-landing .xp-store-copy small {
          font-size: 0.62rem;
          font-weight: 500;
          opacity: 0.7;
        }
        .agorix-landing .xp-store-copy strong {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        @media (max-width: 700px) {
          .agorix-landing .xp-section { padding: 4rem 1.25rem; }
          .agorix-landing .xp-devices { gap: 0.5rem; }
          .agorix-landing .xp-sub { margin-bottom: 2rem !important; }
          /* Below 700px the four-device row's clamp() floors (88+130+100+42px)
             no longer fit any phone viewport — fix the floors smaller here so
             the row stays inside .xp-section's padding instead of silently
             clipping under overflow:hidden. */
          .agorix-landing .xp-monitor .xp-bezel { width: 52px; height: 42px; }
          .agorix-landing .xp-laptop .xp-bezel { width: 86px; height: 54px; }
          .agorix-landing .xp-laptop-deck { width: 92px; }
          .agorix-landing .xp-tablet .xp-bezel { width: 64px; height: 46px; }
          .agorix-landing .xp-phone .xp-bezel { width: 28px; height: 56px; }
        }
        .sw-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 0;
          border: 1px solid #DDE7E1;
          border-radius: 8px;
          overflow: hidden;
        }
        @media (max-width: 1100px) { .sw-cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .sw-cards-grid { grid-template-columns: 1fr; } }
        .sw-card {
          padding: 3.5rem 2.25rem;
          border-right: 1px solid #DDE7E1;
          border-bottom: 1px solid #DDE7E1;
          background: transparent;
          transition: background 0.2s ease;
          position: relative;
        }
        .sw-card:nth-child(4n) { border-right: none; }
        .sw-card:nth-child(n+5) { border-bottom: none; }
        @media (max-width: 1100px) {
          .sw-card:nth-child(2n) { border-right: none; }
          .sw-card:nth-child(3), .sw-card:nth-child(4) { border-bottom: none; }
        }
        @media (max-width: 600px) {
          .sw-card { border-right: none; padding: 2.25rem 1.5rem; }
          .sw-card:nth-child(4) { border-bottom: none; }
        }
        .sw-card:hover {
          background: #E8F7ED;
        }
        .sw-card-number {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          color: rgba(21,32,25,0.2);
          font-variant-numeric: tabular-nums;
          margin-bottom: 1.5rem;
        }
        .sw-card-tag {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.15em;
          text-transform: uppercase;
          margin-bottom: 1rem;
        }
        .sw-card-title {
          font-size: clamp(1rem, 1.8vw, 1.25rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 1rem;
        }
        .sw-card-desc {
          font-size: 0.82rem;
          color: #66736B;
          line-height: 1.65;
          margin-bottom: 1.75rem;
        }
        .sw-card-cta {
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          transition: color 0.2s;
        }
        .sw-card-cta:hover { color: #16A34A !important; }

        /* ── Capabilities section (exact match to reference) ── */
        .sw-tabs-wrap {
          margin-top: 2.5rem;
          border: 1px solid #DDE7E1;
          border-radius: 8px;
          overflow: hidden;
        }
        .sw-tabs-bar {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          border-bottom: 1px solid #DDE7E1;
          background: #E8F7ED;
        }
        @media (max-width: 768px) {
          .sw-tabs-bar { grid-template-columns: 1fr; }
        }
        .sw-tab-btn {
          padding: 1.25rem 1.5rem;
          border: none;
          background: transparent;
          color: #66736B;
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          cursor: pointer;
          transition: color 0.2s ease;
          position: relative;
          border-right: 1px solid #DDE7E1;
        }
        .sw-tab-btn:nth-child(3) { border-right: none; }
        @media (max-width: 768px) {
          .sw-tab-btn { border-right: none; border-bottom: 1px solid #DDE7E1; }
          .sw-tab-btn:nth-child(3) { border-bottom: none; }
        }
        .sw-tab-btn:hover {
          color: #152019;
        }
        .sw-tab-btn.active {
          color: #16A34A;
          background: #E8F7ED;
        }
        .sw-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #22C55E, #A3E635);
        }
        .sw-tab-content {
          display: grid;
          grid-template-columns: 1fr 1fr;
          padding: 3rem 2.5rem;
        }
        @media (max-width: 768px) {
          .sw-tab-content { grid-template-columns: 1fr; gap: 2rem; padding: 2.5rem 1.75rem; }
        }
        .sw-tab-left {
          padding-right: 3rem;
          border-right: 1px solid #DDE7E1;
        }
        @media (max-width: 768px) {
          .sw-tab-left {
            padding-right: 0;
            border-right: none;
            border-bottom: 1px solid #DDE7E1;
            padding-bottom: 2rem;
          }
        }
        .sw-tab-heading {
          font-size: clamp(1.25rem, 2.2vw, 1.75rem);
          font-weight: 700;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 1rem;
        }
        .sw-tab-body {
          font-size: 0.9rem;
          color: #66736B;
          line-height: 1.7;
        }
        .sw-tab-right {
          padding-left: 3rem;
        }
        @media (max-width: 768px) {
          .sw-tab-right { padding-left: 0; padding-top: 2rem; }
        }
        .sw-tab-bullets {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }
        .sw-tab-bullets li {
          display: flex;
          align-items: center;
          gap: 1rem;
          font-size: 0.85rem;
          color: #66736B;
          line-height: 1.5;
        }
        .sw-tab-bullets li::before {
          content: '—';
          color: rgba(21,32,25,0.35);
          flex-shrink: 0;
          font-size: 0.8rem;
          margin-top: 0.1em;
        }

        /* ── Product-preview tile animations ── */
        @keyframes pp-scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pp-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        /* ── Smooth anchor scrolling + offset for the sticky nav ── */
        .app-page-scroll { scroll-behavior: smooth; }
        .agorix-landing [id] { scroll-margin-top: 110px; }

        /* ── Reduced motion: page-level guard (hero has its own) ── */
        @media (prefers-reduced-motion: reduce) {
          .agorix-landing *,
          .agorix-landing *::before,
          .agorix-landing *::after {
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001s !important;
          }
        }

      `}</style>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* NAV (sticky — CTA stays reachable while scrolling) + HERO          */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <AgorixNav variant="light" sticky />
      <AgorixHero />

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* INTRO BAND — "Our software powers…"                               */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div id="software-section" />
      <div className="sw-rule" />
      <div className="sw-section">
        <div
          ref={sec1.ref}
          className={`intro-band reveal${sec1.visible ? " show" : ""} flex flex-col gap-6`}
        >
          <div>
            <div className="sw-eyebrow">Why PlatePilot</div>
            <h2 className="intro-h2">
              Restaurant intelligence powered by <span className="gradient-text-a">realtime</span>{" "}
              <span className="gradient-text-b">AI&#8209;driven</span> analysis
            </h2>
          </div>
          <div>
            <p className="intro-body">
              PlatePilot connects your <strong>Tally books</strong>, <strong>POS sales</strong>, and{" "}
              <strong>inventory</strong> into one intelligence layer — so every purchasing, pricing,
              and prep decision is backed by live data instead of gut feel.
            </p>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* SOLUTION — feature cards                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="features" />
      <div className="sw-section">
        <div ref={sec3.ref} className={`platforms-section reveal${sec3.visible ? " show" : ""}`}>
          <div className="sw-section-tag">↳ The Solution</div>
          <h2 className="sw-section-h2">Stop guessing. Run your restaurant on data.</h2>
          <p className="sw-section-body">
            PlatePilot connects the systems you already use and turns them into one intelligence
            layer for your entire operation.
          </p>
          <div className="sw-cards-grid">
            <PlatformCard
              number="01 "
              tag="Inventory"
              title="Smart Inventory Tracking"
              description="Live stock counts built from your POS sales and purchase bills — with alerts before you run out or over-order."
              cta="Explore Inventory"
              accent="#22C55E"
            />
            <PlatformCard
              number="02 "
              tag="Waste AI"
              title="Waste Detection"
              description="Pilot AI flags spoilage, over-prep, and shrinkage patterns per outlet — before they hit your month-end P&L."
              cta="Explore Waste AI"
              accent="#A3E635"
            />
            <PlatformCard
              number="03 "
              tag="Purchasing"
              title="Purchase Optimization"
              description="Market-price intelligence and demand forecasts tell you what to buy, how much, and when — so you stop overpaying vendors."
              cta="Explore Purchasing"
              accent="#16A34A"
            />
            <PlatformCard
              number="04 "
              tag="Accounting"
              title="Tally & POS Sync"
              description="Your books reconcile themselves — every sale, purchase, and voucher matched automatically between POS and Tally."
              cta="Explore Integrations"
              accent="#0F7A4C"
            />
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CAPABILITIES TABS                                                  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" />
      <div className="sw-section">
        <div ref={sec4.ref} className={`caps-section reveal${sec4.visible ? " show" : ""}`}>
          <div className="sw-section-tag">↳ Features</div>
          <h2 className="sw-section-h2">Everything you need to run a profitable kitchen.</h2>
          <div className="sw-tabs-wrap">
            <div className="sw-tabs-bar">
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  className={`sw-tab-btn${activeTab === i ? " active" : ""}`}
                  onClick={() => setActiveTab(i)}
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="sw-tab-content">
              <div className="sw-tab-left">
                <h3 className="sw-tab-heading">{tabs[activeTab].heading}</h3>
                <p className="sw-tab-body">{tabs[activeTab].body}</p>
              </div>
              <div className="sw-tab-right">
                <ul className="sw-tab-bullets">
                  {tabs[activeTab].bullets.map((b, idx) => (
                    <li key={idx}>{b}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* MENU ENGINEERING SPOTLIGHT                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="menu-engineering" />
      <div className="sw-section">
        <div ref={sec10.ref} className={`platforms-section reveal${sec10.visible ? " show" : ""}`}>
          <div className="sw-section-tag">↳ Menu Engineering</div>
          <h2 className="sw-section-h2">Every dish gets a report card.</h2>
          <p className="sw-section-body" style={{ marginBottom: 0 }}>
            No spreadsheets, no consultants — PlatePilot grades your whole menu automatically, from
            data it already tracks.
          </p>
          <div className="me-formula">
            <div className="me-f-step">
              <span className="me-f-ico">
                <BarChart3 size={20} strokeWidth={1.8} />
              </span>
              <div>
                <div className="me-f-title">How often it sells</div>
                <div className="me-f-sub">Counted from your POS bills</div>
              </div>
            </div>
            <div className="me-f-op" aria-hidden="true">
              <span>+</span>
            </div>
            <div className="me-f-step">
              <span className="me-f-ico">
                <IndianRupee size={20} strokeWidth={1.8} />
              </span>
              <div>
                <div className="me-f-title">Profit per plate</div>
                <div className="me-f-sub">Selling price minus ingredient cost</div>
              </div>
            </div>
            <div className="me-f-op" aria-hidden="true">
              <span>=</span>
            </div>
            <div className="me-f-step">
              <span className="me-f-ico">
                <ClipboardCheck size={20} strokeWidth={1.8} />
              </span>
              <div>
                <div className="me-f-title">A clear verdict</div>
                <div className="me-f-sub">Promote, re-price, push, or remove</div>
              </div>
            </div>
          </div>
          <div className="me-example-lbl">Example · Four dishes from one menu</div>
          <div className="me-grid">
            {ME_DISHES.map((d) => {
              const sellColor = d.sellsPct >= 50 ? "#16A34A" : "#EF4444";
              const earnColor = d.earnsPct >= 50 ? "#16A34A" : "#EF4444";
              return (
                <div key={d.dish} className="me-card">
                  <div className="me-dish-name">{d.dish}</div>
                  <div className="me-stat">
                    <div className="me-stat-top">
                      <span>How often it sells</span>
                      <span className="me-stat-val" style={{ color: sellColor }}>
                        {d.sells}
                      </span>
                    </div>
                    <div className="me-bar">
                      <span style={{ width: `${d.sellsPct}%`, background: sellColor }} />
                    </div>
                  </div>
                  <div className="me-stat">
                    <div className="me-stat-top">
                      <span>Profit per plate</span>
                      <span className="me-stat-val" style={{ color: earnColor }}>
                        {d.earns}
                      </span>
                    </div>
                    <div className="me-bar">
                      <span style={{ width: `${d.earnsPct}%`, background: earnColor }} />
                    </div>
                  </div>
                  <div className="me-verdict" style={{ background: d.bg, color: d.color }}>
                    <d.icon size={18} strokeWidth={2} />
                    <div>
                      <div className="me-verdict-tier">
                        {d.tier} <span className="me-verdict-classic">· "{d.classic}"</span>
                      </div>
                      <div className="me-verdict-act">{d.act}</div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
          <p className="me-note">
            PlatePilot builds this report for every item on your menu, automatically — from the POS
            sales and purchase costs it already tracks.
          </p>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* HOW IT WORKS                                                       */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="how-it-works" />
      <div className="sw-section">
        <div ref={sec5.ref} className={`loop-section reveal${sec5.visible ? " show" : ""}`}>
          <div className="sw-section-tag">↳ How It Works</div>
          <h2 className="sw-section-h2">Data in. Decisions out.</h2>
          <p className="sw-section-body">
            The whole product in one picture: your Tally books, POS bills, and stock movements
            stream into Pilot AI — and come out the other side as live dashboards, risk alerts, and
            purchase calls you can act on the same day.
          </p>
          <div className="pp-flow">
            <div>
              <div className="pp-flow-lbl">1 · Connect</div>
              <div className="pp-flow-col">
                <div className="pp-node">
                  <FileText size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">Tally ERP</div>
                    <div className="pp-node-sub">Vouchers, ledgers, GST</div>
                  </div>
                </div>
                <div className="pp-node">
                  <Receipt size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">POS Billing</div>
                    <div className="pp-node-sub">Every bill, as it prints</div>
                  </div>
                </div>
                <div className="pp-node">
                  <Package size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">Inventory</div>
                    <div className="pp-node-sub">Stock in, stock out</div>
                  </div>
                </div>
              </div>
            </div>
            <div className="pp-conn-cell" aria-hidden="true">
              <svg viewBox="0 0 70 280">
                <path d="M4 40 C40 40 30 140 66 140" />
                <path d="M4 140 L66 140" />
                <path d="M4 240 C40 240 30 140 66 140" />
              </svg>
            </div>
            <div>
              <div className="pp-flow-lbl" style={{ textAlign: "center" }}>
                2 · Analyze
              </div>
              <div className="pp-engine-cell">
                <div className="pp-engine">
                  <Sparkles size={26} strokeWidth={1.7} />
                  <div className="pp-engine-title">Pilot AI</div>
                  <div className="pp-engine-sub">
                    Scans every transaction for waste, variance, and margin risk
                  </div>
                </div>
              </div>
            </div>
            <div className="pp-conn-cell" aria-hidden="true">
              <svg viewBox="0 0 70 280">
                <path d="M4 140 C40 140 30 40 66 40" />
                <path d="M4 140 L66 140" />
                <path d="M4 140 C40 140 30 240 66 240" />
              </svg>
            </div>
            <div>
              <div className="pp-flow-lbl">3 · Act</div>
              <div className="pp-flow-col">
                <div className="pp-node">
                  <LayoutDashboard size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">Live Dashboards</div>
                    <div className="pp-node-sub">Sales & margin, per outlet</div>
                  </div>
                </div>
                <div className="pp-node">
                  <Bell size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">Risk Alerts</div>
                    <div className="pp-node-sub">Waste, GST, reconciliation</div>
                  </div>
                </div>
                <div className="pp-node">
                  <ShoppingCart size={22} strokeWidth={1.7} />
                  <div>
                    <div className="pp-node-title">Purchase Calls</div>
                    <div className="pp-node-sub">What to buy, and when</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* QUOTE                                                              */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="testimonials" />
      <div className="sw-section">
        <div className="tm-section">
          <div className="sw-section-tag">↳ Testimonials</div>
          <h2 className="sw-section-h2">Restaurant owners run on PlatePilot.</h2>
          <div className="tm-marquee">
            <div className="tm-track">
              {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
                <figure className="tm-card" key={i}>
                  <blockquote className="tm-quote">"{t.quote}"</blockquote>
                  <figcaption className="tm-attr">
                    {t.name}
                    <span>{t.place}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
          <div className="tm-marquee">
            <div className="tm-track tm-reverse">
              {[...TM_ROW2, ...TM_ROW2].map((t, i) => (
                <figure className="tm-card" key={i}>
                  <blockquote className="tm-quote">"{t.quote}"</blockquote>
                  <figcaption className="tm-attr">
                    {t.name}
                    <span>{t.place}</span>
                  </figcaption>
                </figure>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* INTERACTIVE BENTO GALLERY                                         */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="gallery" />
      <div className="sw-section">
        <div ref={sec2.ref} className={`platforms-section reveal${sec2.visible ? " show" : ""}`}>
          <div className="gallery-split">
            <div className="gallery-split-copy">
              <div className="sw-section-tag">↳ Product Preview</div>
              <h2 className="sw-section-h2">
                See PlatePilot in <span style={{ color: "#16A34A" }}>Action</span>
              </h2>
              <p className="sw-section-body">
                Drag and explore the surfaces your team will use every day — live dashboards,
                inventory alerts, and Pilot AI insights.
              </p>
            </div>
            <div className="gallery-split-media">
              <InteractiveBentoGallery mediaItems={GALLERY_MEDIA} showHeader={false} />
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CROSS-PLATFORM                                                     */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div ref={sec6.ref} className={`reveal${sec6.visible ? " show" : ""}`}>
        <CrossPlatformSection />
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FAQ                                                                */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-rule" id="faq" />
      <div className="sw-section">
        <div className="platforms-section">
          <div className="faq-split">
            <div>
              <div className="sw-section-tag">↳ FAQ</div>
              <h2 className="sw-section-h2">Questions, answered.</h2>
              <p className="sw-section-body" style={{ marginBottom: "1.75rem" }}>
                Everything owners usually ask before connecting their data.
              </p>
              <a href="/demo" className="btn-ghost">
                TALK TO US
              </a>
            </div>
            <div className="faq-list">
              {FAQS.map(([q, a]) => (
                <details className="faq-item" key={q}>
                  <summary>{q}</summary>
                  <p className="faq-a">{a}</p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CTA BAND                                                           */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <div className="sw-section" id="contact">
        <div className="cta-band">
          <h2 className="cta-heading">Start optimizing your restaurant today.</h2>
          <div className="cta-actions">
            <a href="/signup" className="btn-white">
              START FREE TRIAL
            </a>
            <a href="/demo" className="btn-ghost">
              VIEW DEMO
            </a>
          </div>
        </div>
      </div>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* FOOTER                                                             */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <footer className="sw-footer">
        <span>© 2026 PlatePilot. All rights reserved.</span>
        <div className="sw-footer-links">
          <a href="#privacy">Privacy</a>
          <a href="#terms">Terms</a>
          <a href="#security">Security</a>
        </div>
      </footer>
    </main>
  );
}

function PlatformCard({
  number,
  tag,
  title,
  description,
  cta,
  accent,
}: {
  number?: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  accent: string;
}) {
  return (
    <div className="sw-card group">
      {number && <div className="sw-card-number">{number}</div>}
      <div className="sw-card-tag" style={{ color: accent }}>
        ↳ {tag}
      </div>
      <h3 className="sw-card-title">{title}</h3>
      <p className="sw-card-desc">{description}</p>
      <a href="#contact" className="sw-card-cta" style={{ color: accent }}>
        {cta} →
      </a>
      <div className="sw-card-line" style={{ background: accent }} />
    </div>
  );
}

export default function IndexRoute() {
  return (
    <AppPage title="PlatePilot — AI-Powered Restaurant Intelligence">
      <Index />
    </AppPage>
  );
}
