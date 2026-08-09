import { AppPage } from "@/components/ionic/AppPage";
import { useEffect, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Link } from "react-router-dom";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUp,
  BarChart3,
  Bell,
  ChevronRight,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Package,
  Receipt,
  Shield,
  ShoppingCart,
  Sparkles,
  Star,
  Tag,
  Target,
  Trash2,
  TrendingUp,
  Zap,
} from "lucide-react";
import { PlatePieletHero, T } from "@/components/PlatePieletHero";
import PlugConnectedIcon from "@/components/ui/icons/plug-connected-icon";
import { MagicCard } from "@/components/ui/magic-card";
import { PlatePieletNav } from "@/components/PlatePieletNav";
import InteractiveBentoGallery, {
  type BentoMediaItem,
} from "@/components/blocks/interactive-bento-gallery";
import { CrossPlatformSection } from "@/components/CrossPlatformSection";
import { PlatePieletFooter } from "@/components/PlatePieletFooter";
import { Seo } from "@/components/Seo";
import { SALES_PHONE, SALES_PHONE_HREF } from "@/lib/contact";

/* ─── Product-preview tiles ──────────────────────────────────────────────────
   Coded mini-mockups of the real dashboard modules (src/pages/dashboard/*):
   Overview, Pos, Tally, Inventory, Ai, MarketPrices, Reports — rendered as
   "ui" bento items instead of stock media. Inline styles only, colored via
   the shared T palette exported from PlatePieletHero.tsx. */

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
        fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
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

/* One string, two consumers: AppPage owns document.title, Seo owns og:title.
   Keeping them in sync by hand is how they drift. */
const PAGE_TITLE = "Restaurant Management Software for UAE Restaurants | PlatePielet";
const PAGE_DESCRIPTION =
  "PlatePielet unifies your Tally books, POS sales and inventory into one restaurant intelligence platform — live margin dashboards, waste alerts and AI purchase calls. Book a demo.";

/* ─── Social proof: logo wall + outcome stats ────────────────────────────────
 *
 * ⚠️ PLACEHOLDER DATA. Both arrays below MUST be replaced with real customers
 * and real measured figures before launch. qlub and Syrve lead with "3,000+
 * restaurants" and "10,000+ / 50+ countries" — a logo wall directly under the
 * hero is the single biggest trust signal this page is missing, but a fabricated
 * one is worse than none.
 *
 * Logos render as text wordmarks deliberately: no image assets to source, and
 * placeholder text can never be mistaken for a real brand's mark.
 * ponytail: swap to <img> once real logo SVGs exist — same grid, same classes.
 */
const CUSTOMER_LOGOS = [
  "Your Client 1",
  "Your Client 2",
  "Your Client 3",
  "Your Client 4",
  "Your Client 5",
  "Your Client 6",
];

const OUTCOME_STATS: { value: string; label: string; sub: string }[] = [
  { value: "AED 1,800", label: "Average monthly leakage found", sub: "per outlet, in month one" },
  { value: "6 hrs", label: "Tally reconciliation time saved", sub: "every week, per finance lead" },
  { value: "3 → 1", label: "Systems your team logs into", sub: "Tally, POS and stock, unified" },
];

/* ─── Testimonials & FAQ content ─────────────────────────────────────────── */
const TESTIMONIALS: { quote: string; name: string; place: string }[] = [
  {
    quote:
      "PlatePielet found ₹40,000 a month we didn't know we were losing. It paid for itself in the first week.",
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
    quote: "The VAT mismatch alert saved us from a filing penalty in our very first week.",
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
    "No. PlatePielet connects to the Tally and POS systems you already run — there's nothing to install at the outlet.",
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

/* ─── Menu-engineering quadrant matrix (mirrors dashboard/MenuEngineering) ──
   area: which corner of the 2×2 grid this dish's tier occupies —
   tr = popular + profitable, br = popular only, tl = profitable only, bl = neither. */
const ME_DISHES = [
  {
    dish: "Chicken Biryani",
    sells: "High",
    sellsPct: 88,
    earns: "₹92",
    earnsPct: 80,
    tier: "Best Seller",
    act: "Sells well and earns well. Keep it front and center.",
    color: "#15803D",
    bg: "rgba(22,163,74,0.08)",
    icon: Star,
    area: "tr",
  },
  {
    dish: "Butter Naan",
    sells: "High",
    sellsPct: 82,
    earns: "₹18",
    earnsPct: 22,
    tier: "Underpriced",
    act: "Everyone orders it, but it barely profits. Raise the price a little.",
    color: "#92400E",
    bg: "rgba(245,158,11,0.1)",
    icon: Tag,
    area: "br",
  },
  {
    dish: "Mutton Sukka",
    sells: "Low",
    sellsPct: 28,
    earns: "₹120",
    earnsPct: 95,
    tier: "Hidden Gem",
    act: "Earns a lot, but few people order it. Recommend it more.",
    color: "#0F7A4C",
    bg: "#E8F7ED",
    icon: Megaphone,
    area: "tl",
  },
  {
    dish: "Veg Cutlet",
    sells: "Low",
    sellsPct: 15,
    earns: "₹9",
    earnsPct: 8,
    tier: "Dead Weight",
    act: "Rarely ordered and barely profits. Take it off the menu.",
    color: "#B91C1C",
    bg: "rgba(239,68,68,0.08)",
    icon: Trash2,
    area: "bl",
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
  const mainRef = useRef<HTMLElement | null>(null);

  /* Smooth, eased scrolling for this page only — scoped to the page's own
     .app-page-scroll ancestor so Dashboard/Login keep native touch scroll.
     Wheel input only (syncTouch: false): mobile keeps its fast native touch
     feel, which AppPage.tsx already tunes for. Skipped under
     prefers-reduced-motion, per the reduced-motion guard used elsewhere on
     this page. */
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const content = mainRef.current;
    const wrapper = content?.closest<HTMLElement>(".app-page-scroll");
    if (!content || !wrapper) return;

    const lenis = new Lenis({
      wrapper,
      content,
      duration: 1.1,
      smoothWheel: true,
      syncTouch: false,
      anchors: { offset: -110 },
    });

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
    };
  }, []);

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
        "VAT and reconciliation risks flagged before filing day",
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
      body: "No migration project, no new hardware. PlatePielet connects to your existing Tally books and POS billing, keeps them in sync, and reconciles them against each other automatically.",
      bullets: [
        "Two-way Tally ERP sync — vouchers, ledgers, VAT",
        "Automatic POS sales import across outlets",
        "CSV / Excel import for everything else",
        "POS-to-Tally reconciliation with mismatch alerts",
      ],
    },
  ];

  return (
    <div
      className="pp-landing"
      style={{
        background: "#FFFFFF",
        color: "#152019",
        fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
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
        .pp-landing,
        .pp-landing *:where(:not(.ig-root, .ig-root *)) { box-sizing: border-box; margin: 0; padding: 0; }
        .pp-landing a { text-decoration: none; }

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
          background: ${T.gradientCTA};
          color: #FFFFFF !important;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.18em;
          padding: 0.85rem 1.75rem;
          border: none;
          border-radius: 12px;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15,122,76,0.28);
          transition: box-shadow 0.2s, transform 0.15s;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          min-height: 3rem;
          line-height: 1;
        }
        .btn-white:hover {
          box-shadow: 0 10px 26px rgba(15,122,76,0.38), inset 0 1px 0 rgba(255,255,255,0.18);
          transform: translateY(-1px);
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

        /* ── How It Works: pill badges ── */
        .hiw-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.4rem;
          padding: 0.4rem 0.85rem;
          border-radius: 999px;
          border: 1px solid rgba(22,163,74,0.28);
          background: #E8F7ED;
          color: #15803D;
          font-size: 0.68rem;
          font-weight: 700;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          margin-bottom: 1.5rem;
        }
        .hiw-badge svg { flex-shrink: 0; transition: transform 0.25s ease; }
        .hiw-badge:hover svg { transform: scale(1.15) rotate(-8deg); }

        /* ── Concept flow: sources → Pilot AI → outcomes ── */
        .pp-flow {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 70px 250px 70px 1fr;
          align-items: start;
          margin-top: 2.5rem;
        }
        .pp-flow::before {
          content: '';
          position: absolute;
          inset: -30px 8%;
          background: radial-gradient(ellipse 55% 65% at 50% 50%, rgba(34,197,94,0.16), transparent 72%);
          filter: blur(24px);
          z-index: 0;
          pointer-events: none;
        }
        .pp-flow > * { position: relative; z-index: 1; }
        .hiw-col-head { margin-bottom: 14px; }
        .hiw-col-head.center { text-align: center; }
        .hiw-col-badge {
          display: inline-flex;
          align-items: center;
          gap: 0.35rem;
          padding: 0.35rem 0.75rem;
          border-radius: 999px;
          border: 1px solid rgba(22,163,74,0.3);
          background: #E8F7ED;
          color: #15803D;
          font-size: 0.62rem;
          font-weight: 700;
          letter-spacing: 0.1em;
          text-transform: uppercase;
        }
        .hiw-col-badge svg:not(.cursor-pointer) { transition: transform 0.25s ease; }
        .hiw-col-badge:hover svg:not(.cursor-pointer) { transform: scale(1.15) rotate(-8deg); }
        .hiw-col-sub {
          display: block;
          margin-top: 0.55rem;
          font-size: 0.78rem;
          color: #66736B;
        }
        .pp-flow-col { display: flex; flex-direction: column; gap: 20px; height: 280px; }
        .pp-node {
          height: 80px;
          box-sizing: border-box;
          display: flex;
          align-items: center;
          gap: 12px;
          padding: 0 14px;
          background: #FFFFFF;
          border: 1px solid #E3ECE6;
          border-radius: 18px;
          box-shadow: 0 2px 10px rgba(21,32,25,0.05);
        }
        .pp-node-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #E8F7ED;
          color: #15803D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .pp-node-body { flex: 1; min-width: 0; }
        .pp-node-title { font-size: 0.85rem; font-weight: 700; color: #152019; line-height: 1.2; }
        .pp-node-sub { font-size: 0.72rem; color: #66736B; margin-top: 2px; }
        .pp-node-chevron {
          width: 26px;
          height: 26px;
          border-radius: 999px;
          background: #E8F7ED;
          color: #15803D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .pp-node:hover .pp-node-icon { transform: scale(1.1); background: #16A34A; color: #FFFFFF; }
        .pp-node:hover .pp-node-chevron { transform: translateX(3px); background: #16A34A; color: #FFFFFF; }
        .pp-conn-cell { margin-top: 0; }
        .pp-conn-spacer { visibility: hidden; }
        .pp-conn-cell svg { display: block; width: 100%; height: 280px; }
        .pp-conn-cell path {
          fill: none;
          stroke: #16A34A;
          stroke-opacity: 0.65;
          stroke-width: 3;
          stroke-linecap: round;
          stroke-dasharray: 3 9;
          animation: pp-dash 1.1s linear infinite;
        }
        @keyframes pp-dash { to { stroke-dashoffset: -26; } }
        .pp-conn-arrow { fill: #16A34A; fill-opacity: 0.6; }
        .pp-engine-cell {
          height: 280px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pp-engine {
          background: #FFFFFF;
          border: 2px solid #16A34A;
          border-radius: 22px;
          padding: 2.2rem 1.6rem;
          text-align: center;
          max-width: 250px;
        }
        .pp-engine-icon {
          width: 68px;
          height: 68px;
          border-radius: 50%;
          background: #E8F7ED;
          color: #15803D;
          display: flex;
          align-items: center;
          justify-content: center;
          margin: 0 auto 0.85rem;
          transition: transform 0.3s ease;
        }
        .pp-engine:hover .pp-engine-icon { transform: scale(1.12) rotate(8deg); }
        .pp-engine-title { font-size: 1.05rem; font-weight: 800; color: #152019; }
        .pp-engine-divider { width: 28px; height: 2px; background: #16A34A; margin: 0.6rem auto; }
        .pp-engine-sub { font-size: 0.72rem; color: #66736B; line-height: 1.55; }
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
          .pp-conn-spacer { display: none; }
          .pp-engine-cell { height: auto; }
          .hiw-col-head { text-align: center; margin-bottom: 10px; }
          .pp-engine { max-width: none; width: 100%; }
        }

        /* ── How It Works: bottom stat bar ── */
        .hiw-stats {
          margin-top: 3rem;
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 18px;
          box-shadow: 0 2px 10px rgba(21,32,25,0.05);
          overflow: hidden;
        }
        .hiw-stat {
          display: flex;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1.75rem 1.5rem;
          border-right: 1px solid #E3ECE6;
        }
        .hiw-stat:last-child { border-right: none; }
        .hiw-stat-icon {
          width: 44px;
          height: 44px;
          border-radius: 12px;
          background: #E8F7ED;
          color: #15803D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .hiw-stat:hover .hiw-stat-icon { transform: scale(1.1); background: #16A34A; color: #FFFFFF; }
        .hiw-stat-title { font-size: 0.9rem; font-weight: 700; color: #152019; margin-bottom: 3px; }
        .hiw-stat-sub { font-size: 0.78rem; color: #66736B; line-height: 1.5; }
        @media (max-width: 900px) {
          .hiw-stats { grid-template-columns: repeat(2, 1fr); }
          .hiw-stat:nth-child(2) { border-right: none; }
          .hiw-stat:nth-child(1), .hiw-stat:nth-child(2) { border-bottom: 1px solid #E3ECE6; }
        }
        @media (max-width: 560px) {
          .hiw-stats { grid-template-columns: 1fr; }
          .hiw-stat { border-right: none !important; border-bottom: 1px solid #E3ECE6; }
          .hiw-stat:last-child { border-bottom: none; }
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
        .tm-attr { margin-top: 1rem; font-size: 0.78rem; font-weight: 700; color: #15803D; }
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
          color: #15803D;
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
          color: #15803D;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          transition: transform 0.25s ease, background 0.25s ease, color 0.25s ease;
        }
        .me-f-step:hover .me-f-ico { transform: scale(1.1); background: #16A34A; color: #FFFFFF; }
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
          background: #15803D;
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
        .me-matrix-wrap {
          display: flex;
          align-items: stretch;
          gap: 0.9rem;
        }
        .me-axis-y {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          flex-shrink: 0;
          font-size: 0.7rem;
          font-weight: 700;
          color: #66736B;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        .me-axis-y svg { transform: rotate(180deg); }
        .me-matrix-col { flex: 1; min-width: 0; }
        .me-matrix {
          position: relative;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          grid-template-areas: "tl tr" "bl br";
          gap: 3px;
          background: #DDE7E1;
          border: 1px solid #DDE7E1;
          border-radius: 16px;
          overflow: hidden;
          aspect-ratio: 16 / 8.5;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        .me-quad {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          gap: 3px;
          padding: 1.1rem 1.25rem;
        }
        .me-quad-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #FFFFFF;
          display: flex;
          align-items: center;
          justify-content: center;
          margin-bottom: 4px;
        }
        .me-quad-tier {
          font-size: 0.72rem;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
        }
        .me-quad-desc {
          font-size: 0.74rem;
          line-height: 1.45;
          color: rgba(21,32,25,0.68);
          max-width: 15rem;
        }
        .me-dot {
          position: absolute;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 2;
          transition: opacity 0.5s ease, transform 0.5s ease;
        }
        .reveal .me-dot { opacity: 0; transform: translate(-50%, -50%) scale(0.5); }
        .reveal.show .me-dot { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        .me-dot-marker {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: var(--dot-color);
          border: 2.5px solid #FFFFFF;
          box-shadow: 0 0 0 1px var(--dot-color), 0 4px 10px rgba(21,32,25,0.2);
        }
        .me-dot-label {
          font-size: 0.68rem;
          font-weight: 700;
          color: #152019;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 999px;
          padding: 3px 10px;
          white-space: nowrap;
          box-shadow: 0 2px 6px rgba(21,32,25,0.08);
        }
        .me-axis-x {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 6px;
          margin-top: 0.9rem;
          font-size: 0.7rem;
          font-weight: 700;
          color: #66736B;
          text-transform: uppercase;
          letter-spacing: 0.08em;
        }
        @media (max-width: 700px) {
          .me-axis-y { display: none; }
          .me-matrix { aspect-ratio: 3 / 4; }
          .me-quad-desc { display: none; }
          .me-quad { padding: 0.75rem 0.85rem; }
        }
        .me-note { margin-top: 1.75rem; font-size: 0.85rem; color: #66736B; }

        /* Subtle blurred green glow behind a section — same mechanism as
           .pp-flow::before / .xp-section, reused here for two more sections. */
        .sw-glow-wrap { position: relative; isolation: isolate; }
        .sw-glow-wrap::before {
          content: '';
          position: absolute;
          inset: -40px 8%;
          background: radial-gradient(ellipse 60% 60% at 50% 40%, rgba(34,197,94,0.14), transparent 72%);
          filter: blur(24px);
          z-index: 0;
          pointer-events: none;
        }
        .sw-glow-wrap > * { position: relative; z-index: 1; }

        /* Full-bleed alternating band. The page canvas is white now, so section
           rhythm comes from a true-neutral surface + the forest CTA band, not
           from the old green tint. Wraps .sw-section (which is width-capped and
           therefore can't go edge to edge itself). */
        .sw-band { background: var(--brand-surface); }
        /* Cards inside a band need to stay white or they vanish into it. */
        .sw-band .sw-card,
        .sw-band .tm-card { background: #FFFFFF; }

        /* ── Social proof: logo wall + outcome stats ──
           Sits directly under the hero because that is where both reference
           sites (qlub, Syrve) put theirs, and it is the first thing a UAE
           operator scans for before reading a single feature. */
        .proof-band {
          padding: 3rem 0 3.5rem;
          border-bottom: 1px solid #DDE7E1;
        }
        .proof-label {
          text-align: center;
          font-size: 0.72rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #66736B;
          margin-bottom: 1.75rem;
        }
        .proof-logos {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(140px, 1fr));
          align-items: center;
          gap: 1.25rem 2rem;
        }
        .proof-logo {
          text-align: center;
          font-size: 1.05rem;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: #9AA8A0;
          transition: color 0.2s ease;
        }
        .proof-logo:hover { color: #152019; }

        .stats-band {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
          gap: 1rem;
          padding: 3.5rem 0;
        }
        .stat-card {
          padding: 1.75rem 1.5rem;
          border: 1px solid #DDE7E1;
          border-radius: 16px;
          background: #FFFFFF;
        }
        /* Amber, not green: the one non-green accent, so the number reads as
           data rather than as another brand element. */
        .stat-value {
          font-size: clamp(1.9rem, 3.5vw, 2.5rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #B45309;
        }
        .stat-label {
          margin-top: 0.6rem;
          font-size: 0.95rem;
          font-weight: 700;
          color: #152019;
        }
        .stat-sub { margin-top: 0.2rem; font-size: 0.85rem; color: #66736B; }

        /* ── CTA Band ──
           Stays LIGHT on purpose. It renders inside .pp-footer-cover, the opaque
           layer that occludes the fixed dark footer until you scroll past it —
           the curtain reveal only reads if the cover contrasts with the #0A1A10
           footer behind it. A dark band here also cut light notches at the
           footer's 28px rounded top corners. The page's dark close is the
           footer itself; a second forest band above it was redundant. */
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

        /* Footer styles live in PlatePieletFooter (reveal + static modes). */

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
        .pp-landing .gallery-split {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 3rem;
          align-items: center;
          width: 100%;
        }
        .pp-landing .gallery-split-copy {
          text-align: left;
          max-width: 480px;
        }
        .pp-landing .gallery-split-copy .sw-section-tag,
        .pp-landing .gallery-split-copy .sw-section-h2,
        .pp-landing .gallery-split-copy .sw-section-body {
          margin-left: 0 !important;
          margin-right: 0 !important;
          text-align: left;
        }
        .pp-landing .gallery-split-copy .sw-section-h2 {
          max-width: none;
        }
        .pp-landing .gallery-split-copy .sw-section-body {
          margin-bottom: 0 !important;
          max-width: none;
        }
        .pp-landing .gallery-split-media {
          width: 100%;
          min-width: 0;
        }
        .pp-landing .bento-gallery-grid {
          display: grid;
          width: 100%;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          grid-auto-rows: 100px;
          gap: 10px;
        }
        .pp-landing .bento-span-1 { grid-column: span 1; }
        .pp-landing .bento-span-2 { grid-column: span 2; }
        @media (max-width: 900px) {
          .pp-landing .gallery-split {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          .pp-landing .gallery-split-copy {
            max-width: none;
          }
          .pp-landing .bento-gallery-grid {
            grid-auto-rows: 110px;
            gap: 10px;
          }
        }
        @media (max-width: 640px) {
          .pp-landing .bento-gallery-grid {
            grid-template-columns: repeat(2, minmax(0, 1fr));
            grid-auto-rows: 96px;
            gap: 8px;
          }
          .pp-landing .bento-span-2 { grid-column: span 1; }
        }
        @media (min-width: 1100px) {
          .pp-landing .bento-gallery-grid {
            grid-auto-rows: 120px;
            gap: 12px;
          }
        }

        /* ── Cross-platform / Available Everywhere ── */
        .pp-landing .xp-section {
          position: relative;
          isolation: isolate;
          padding: 5.5rem 2.5rem;
          background:
            radial-gradient(ellipse 70% 55% at 50% 42%, rgba(34, 197, 94, 0.14), transparent 70%),
            linear-gradient(180deg, #EAF7EF 0%, #FFFFFF 55%, #FFFFFF 100%);
          border-top: 1px solid #DDE7E1;
          border-bottom: 1px solid #DDE7E1;
          overflow: hidden;
        }
        .pp-landing .xp-inner {
          max-width: 1100px;
          margin: 0 auto !important;
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
        }
        .pp-landing .xp-badge {
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
        .pp-landing .xp-title {
          font-size: clamp(2.1rem, 4.5vw, 3.4rem);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.05;
          color: #152019;
          margin: 0 0 0.75rem !important;
        }
        .pp-landing .xp-sub {
          font-size: 1.05rem;
          color: #66736B;
          margin: 0 0 2.75rem !important;
          max-width: 420px;
        }
        .pp-landing .xp-devices {
          display: flex;
          align-items: flex-end;
          justify-content: center;
          gap: clamp(0.75rem, 2vw, 1.5rem);
          width: 100%;
          margin: 0 0 2.5rem !important;
          padding: 0.5rem 0 0 !important;
        }
        .pp-landing .xp-device {
          display: flex;
          flex-direction: column;
          align-items: center;
          flex: 0 0 auto;
        }
        .pp-landing .xp-bezel {
          background: #1A2B20;
          border: 1px solid #2A3F32;
          border-radius: 10px;
          padding: 6px !important;
          box-shadow:
            0 12px 28px rgba(21, 32, 25, 0.14),
            inset 0 1px 0 rgba(255, 255, 255, 0.06);
          overflow: hidden;
        }
        .pp-landing .xp-bezel-flat { border-radius: 14px; padding: 8px !important; }
        .pp-landing .xp-bezel-phone {
          border-radius: 18px;
          padding: 10px 6px 8px !important;
          position: relative;
        }
        .pp-landing .xp-notch {
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
        .pp-landing .xp-screen {
          background: #0F1A14;
          border-radius: 4px;
          padding: 8px !important;
          display: flex;
          flex-direction: column;
          gap: 6px;
          height: 100%;
          min-height: 0;
        }
        .pp-landing .xp-screen-bar {
          height: 7px;
          border-radius: 3px;
          background: linear-gradient(90deg, #16A34A, #4ADE80);
          width: 100%;
          flex-shrink: 0;
        }
        .pp-landing .xp-screen-meta {
          display: flex;
          gap: 4px;
        }
        .pp-landing .xp-screen-meta span {
          height: 4px;
          border-radius: 2px;
          background: rgba(74, 222, 128, 0.22);
          flex: 1;
        }
        .pp-landing .xp-chart {
          width: 100%;
          height: 42%;
          min-height: 28px;
          flex: 1;
        }
        .pp-landing .xp-screen-rows {
          display: flex;
          flex-direction: column;
          gap: 3px;
        }
        .pp-landing .xp-screen-rows span {
          display: block;
          height: 3px;
          border-radius: 2px;
          background: rgba(74, 222, 128, 0.16);
        }
        .pp-landing .xp-screen-rows span:nth-child(2) { width: 78%; }
        .pp-landing .xp-screen-rows span:nth-child(3) { width: 54%; }

        .pp-landing .xp-monitor .xp-bezel { width: clamp(88px, 12vw, 130px); height: clamp(70px, 9vw, 98px); }
        .pp-landing .xp-stand {
          width: 10px;
          height: 14px;
          background: #2A3F32;
          margin-top: 0 !important;
        }
        .pp-landing .xp-base {
          width: 48px;
          height: 5px;
          border-radius: 3px;
          background: #2A3F32;
        }
        .pp-landing .xp-laptop .xp-bezel { width: clamp(130px, 18vw, 200px); height: clamp(82px, 11vw, 120px); border-radius: 8px 8px 2px 2px; }
        .pp-landing .xp-laptop-deck {
          width: clamp(150px, 20vw, 230px);
          height: 8px;
          border-radius: 0 0 8px 8px;
          background: linear-gradient(180deg, #2A3F32, #1A2B20);
          box-shadow: 0 4px 10px rgba(21, 32, 25, 0.12);
        }
        .pp-landing .xp-tablet .xp-bezel { width: clamp(100px, 14vw, 150px); height: clamp(72px, 10vw, 105px); }
        .pp-landing .xp-phone .xp-bezel { width: clamp(42px, 6vw, 58px); height: clamp(84px, 12vw, 118px); }

        .pp-landing .xp-pills {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.55rem;
          list-style: none;
          margin: 0 0 2rem !important;
          padding: 0 !important;
          max-width: 820px;
        }
        .pp-landing .xp-pill {
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
        .pp-landing .xp-pill svg { color: #15803D; flex-shrink: 0; }

        .pp-landing .xp-stores {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          gap: 0.75rem;
        }
        .pp-landing .xp-store-btn {
          display: inline-flex;
          align-items: center;
          gap: 0.65rem;
          padding: 0.65rem 1.1rem !important;
          border-radius: 12px;
          border: 1px solid #DDE7E1;
          background: #152019;
          color: #FFFFFF !important;
          text-decoration: none;
          transition: transform 0.2s, background 0.2s, border-color 0.2s;
          min-width: 168px;
        }
        .pp-landing .xp-store-btn:hover {
          background: #1F3328;
          border-color: #16A34A;
          transform: translateY(-1px);
        }
        .pp-landing .xp-store-copy {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          line-height: 1.15;
          text-align: left;
        }
        .pp-landing .xp-store-copy small {
          font-size: 0.62rem;
          font-weight: 500;
          opacity: 0.7;
        }
        .pp-landing .xp-store-copy strong {
          font-size: 0.95rem;
          font-weight: 700;
          letter-spacing: -0.02em;
        }

        @media (max-width: 700px) {
          .pp-landing .xp-section { padding: 4rem 1.25rem; }
          .pp-landing .xp-devices { gap: 0.5rem; }
          .pp-landing .xp-sub { margin-bottom: 2rem !important; }
          /* Below 700px the four-device row's clamp() floors (88+130+100+42px)
             no longer fit any phone viewport — fix the floors smaller here so
             the row stays inside .xp-section's padding instead of silently
             clipping under overflow:hidden. */
          .pp-landing .xp-monitor .xp-bezel { width: 52px; height: 42px; }
          .pp-landing .xp-laptop .xp-bezel { width: 86px; height: 54px; }
          .pp-landing .xp-laptop-deck { width: 92px; }
          .pp-landing .xp-tablet .xp-bezel { width: 64px; height: 46px; }
          .pp-landing .xp-phone .xp-bezel { width: 28px; height: 56px; }
        }
        .sw-cards-grid {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          gap: 1.25rem;
        }
        @media (max-width: 1100px) { .sw-cards-grid { grid-template-columns: repeat(2, 1fr); } }
        @media (max-width: 600px) { .sw-cards-grid { grid-template-columns: 1fr; } }
        /* ── Bento tilt card: rotateX/rotateY follow the cursor (set inline
           per mouse move in PlatformCard), CSS only eases the return-to-rest
           on mouse-leave and lifts the shadow/accent line on hover ── */
        .sw-card {
          padding: 2.5rem 2rem;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          border-radius: 16px;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
          position: relative;
          transition: transform 0.15s ease-out, box-shadow 0.25s ease, border-color 0.25s ease;
          transform-style: preserve-3d;
          will-change: transform;
        }
        @media (max-width: 600px) {
          .sw-card { padding: 2rem 1.5rem; }
        }
        .sw-card:hover {
          border-color: rgba(22,163,74,0.3);
          box-shadow: 0 20px 45px rgba(21,32,25,0.12);
        }
        .sw-card-line {
          position: absolute;
          left: 1.5rem;
          right: 1.5rem;
          bottom: 0;
          height: 3px;
          border-radius: 3px 3px 0 0;
          opacity: 0;
          transform: scaleX(0.6);
          transform-origin: left;
          transition: opacity 0.25s ease, transform 0.25s ease;
        }
        .sw-card:hover .sw-card-line {
          opacity: 1;
          transform: scaleX(1);
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
        .sw-card-cta:hover { color: #15803D !important; }

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
          color: #15803D;
          background: #E8F7ED;
        }
        .sw-tab-btn.active::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 100%;
          height: 2px;
          background: linear-gradient(90deg, #0F7A4C, #16A34A);
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
        .pp-landing [id] { scroll-margin-top: 110px; }

        /* ── Reduced motion: page-level guard (hero has its own) ── */
        @media (prefers-reduced-motion: reduce) {
          .pp-landing *,
          .pp-landing *::before,
          .pp-landing *::after {
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.001s !important;
          }
        }

      `}</style>

      {/* position: relative + z-index: 1 puts every section here in the same
          stacking layer as .pp-footer-cover, so all of it — not just the
          CTA band — occludes PlatePieletFooter's fixed footer until scrolled past.
          Needs its own opaque background too: a transparent pixel lets the
          lower-stacked fixed footer show through regardless of z-index. */}
      <main
        ref={mainRef}
        style={{ overflowX: "clip", position: "relative", zIndex: 1, background: "#FFFFFF" }}
      >
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* NAV (sticky — CTA stays reachable while scrolling) + HERO          */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* H1 and title both lead with "restaurant" — the SEO audit flagged its
            absence as the second-biggest problem after the canonical. */}
        <Seo title={PAGE_TITLE} description={PAGE_DESCRIPTION} />
        <PlatePieletNav variant="light" sticky />
        <PlatePieletHero />

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* SOCIAL PROOF — logo wall + outcome stats, immediately after hero   */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-section">
          <div className="proof-band">
            <div className="proof-label">Trusted by restaurant groups across the UAE and India</div>
            <div className="proof-logos">
              {CUSTOMER_LOGOS.map((name) => (
                <div className="proof-logo" key={name}>
                  {name}
                </div>
              ))}
            </div>
          </div>
          <div className="stats-band">
            {OUTCOME_STATS.map((s) => (
              <div className="stat-card" key={s.label}>
                <div className="stat-value">{s.value}</div>
                <div className="stat-label">{s.label}</div>
                <div className="stat-sub">{s.sub}</div>
              </div>
            ))}
          </div>
        </div>

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
              <div className="sw-eyebrow">Why PlatePielet</div>
              <h2 className="intro-h2">
                Restaurant intelligence powered by <span className="gradient-text-a">realtime</span>{" "}
                <span className="gradient-text-b">AI&#8209;driven</span> analysis
              </h2>
            </div>
            <div>
              <p className="intro-body">
                PlatePielet connects your <strong>Tally books</strong>, <strong>POS sales</strong>,
                and <strong>inventory</strong> into one intelligence layer — so every purchasing,
                pricing, and prep decision is backed by live data instead of gut feel.
              </p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* HOW IT WORKS                                                       */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="how-it-works" />
        <div className="sw-band">
          <div className="sw-section">
            <div ref={sec5.ref} className={`loop-section reveal${sec5.visible ? " show" : ""}`}>
              <div className="hiw-badge">
                <LayoutGrid size={13} strokeWidth={2.2} />
                How It Works
              </div>
              <h2 className="sw-section-h2">
                Data in. <span style={{ color: "#15803D" }}>Decisions</span> out.
              </h2>
              <p className="sw-section-body">
                The whole product in one picture: your Tally books, POS bills, and stock movements
                stream into Pilot AI — and come out the other side as live dashboards, risk alerts,
                and purchase calls you can act on the same day.
              </p>
              <div className="pp-flow">
                <div>
                  <div className="hiw-col-head">
                    <span className="hiw-col-badge">
                      <PlugConnectedIcon size={14} strokeWidth={2.2} /> 1. CONNECT
                    </span>
                    <span className="hiw-col-sub">Your data sources</span>
                  </div>
                  <div className="pp-flow-col">
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <FileText size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">Tally ERP</div>
                        <div className="pp-node-sub">Vouchers, ledgers, VAT</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <Receipt size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">POS Billing</div>
                        <div className="pp-node-sub">Every bill, as it prints</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <Package size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">Inventory</div>
                        <div className="pp-node-sub">Stock in, stock out</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pp-conn-cell" aria-hidden="true">
                  <div className="hiw-col-head pp-conn-spacer">
                    <span className="hiw-col-badge">spacer</span>
                    <span className="hiw-col-sub">spacer</span>
                  </div>
                  <svg viewBox="0 0 70 280">
                    <path d="M4 40 C40 40 30 140 60 140" />
                    <path d="M4 140 L60 140" />
                    <path d="M4 240 C40 240 30 140 60 140" />
                    <polygon className="pp-conn-arrow" points="60,133 60,147 70,140" />
                  </svg>
                </div>
                <div>
                  <div className="hiw-col-head center">
                    <span className="hiw-col-badge">2. ANALYZE</span>
                    <span className="hiw-col-sub">AI engine</span>
                  </div>
                  <div className="pp-engine-cell">
                    <div className="pp-engine">
                      <div className="pp-engine-icon">
                        <Sparkles size={26} strokeWidth={1.7} />
                      </div>
                      <div className="pp-engine-title">Pilot AI</div>
                      <div className="pp-engine-divider" />
                      <div className="pp-engine-sub">
                        Scans every transaction for waste, variance, and margin risk
                      </div>
                    </div>
                  </div>
                </div>
                <div className="pp-conn-cell" aria-hidden="true">
                  <div className="hiw-col-head pp-conn-spacer">
                    <span className="hiw-col-badge">spacer</span>
                    <span className="hiw-col-sub">spacer</span>
                  </div>
                  <svg viewBox="0 0 70 280">
                    <polygon className="pp-conn-arrow" points="0,133 0,147 10,140" />
                    <path d="M10 140 C40 140 30 40 66 40" />
                    <path d="M10 140 L66 140" />
                    <path d="M10 140 C40 140 30 240 66 240" />
                  </svg>
                </div>
                <div>
                  <div className="hiw-col-head">
                    <span className="hiw-col-badge">3. ACT</span>
                    <span className="hiw-col-sub">Insights & actions</span>
                  </div>
                  <div className="pp-flow-col">
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <LayoutDashboard size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">Live Dashboards</div>
                        <div className="pp-node-sub">Sales & margin, per outlet</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <Bell size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">Risk Alerts</div>
                        <div className="pp-node-sub">Waste, VAT, reconciliation</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                    <div className="pp-node">
                      <div className="pp-node-icon">
                        <ShoppingCart size={20} strokeWidth={1.8} />
                      </div>
                      <div className="pp-node-body">
                        <div className="pp-node-title">Purchase Calls</div>
                        <div className="pp-node-sub">What to buy, and when</div>
                      </div>
                      <div className="pp-node-chevron">
                        <ChevronRight size={14} strokeWidth={2.4} />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="hiw-stats">
                <div className="hiw-stat">
                  <div className="hiw-stat-icon">
                    <Zap size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="hiw-stat-title">Real-time insights</div>
                    <div className="hiw-stat-sub">Always up-to-date data across all sources</div>
                  </div>
                </div>
                <div className="hiw-stat">
                  <div className="hiw-stat-icon">
                    <Shield size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="hiw-stat-title">Reduce risk</div>
                    <div className="hiw-stat-sub">Catch issues early and protect your margins</div>
                  </div>
                </div>
                <div className="hiw-stat">
                  <div className="hiw-stat-icon">
                    <Target size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="hiw-stat-title">Smarter decisions</div>
                    <div className="hiw-stat-sub">AI-powered recommendations you can act on</div>
                  </div>
                </div>
                <div className="hiw-stat">
                  <div className="hiw-stat-icon">
                    <TrendingUp size={20} strokeWidth={1.8} />
                  </div>
                  <div>
                    <div className="hiw-stat-title">Grow profitability</div>
                    <div className="hiw-stat-sub">
                      Optimize operations and increase your bottom line
                    </div>
                  </div>
                </div>
              </div>
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
              PlatePielet connects the systems you already use and turns them into one intelligence
              layer for your entire operation.
            </p>
            <div className="sw-cards-grid">
              <PlatformCard
                number="01 "
                tag="Inventory"
                title="Smart Inventory Tracking"
                description="Live stock counts built from your POS sales and purchase bills — with alerts before you run out or over-order."
                cta="Explore Inventory"
                href="/product/inventory-intelligence"
                accent="#22C55E"
              />
              <PlatformCard
                number="02 "
                tag="Waste AI"
                title="Waste Detection"
                description="Pilot AI flags spoilage, over-prep, and shrinkage patterns per outlet — before they hit your month-end P&L."
                cta="Explore Waste AI"
                href="#menu-engineering"
                accent="#D97706"
              />
              <PlatformCard
                number="03 "
                tag="Purchasing"
                title="Purchase Optimization"
                description="Market-price intelligence and demand forecasts tell you what to buy, how much, and when — so you stop overpaying vendors."
                cta="Explore Purchasing"
                href="/product/purchase-suggestions"
                accent="#16A34A"
              />
              <PlatformCard
                number="04 "
                tag="Accounting"
                title="Tally & POS Sync"
                description="Your books reconcile themselves — every sale, purchase, and voucher matched automatically between POS and Tally."
                cta="Explore Integrations"
                href="/integrations"
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
        <div className="sw-section sw-glow-wrap">
          <div
            ref={sec10.ref}
            className={`platforms-section reveal${sec10.visible ? " show" : ""}`}
          >
            <div className="sw-section-tag">↳ Menu Engineering</div>
            <h2 className="sw-section-h2">Every dish lands in one of four quadrants.</h2>
            <p className="sw-section-body" style={{ marginBottom: 0 }}>
              Plot how often a dish sells against how much it earns, and your menu sorts itself — no
              spreadsheets, no consultants, just data PlatePielet already tracks.
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
            <div className="me-matrix-wrap">
              <div className="me-axis-y" aria-hidden="true">
                <ArrowUp size={12} strokeWidth={2.5} />
                Profit per plate
              </div>
              <div className="me-matrix-col">
                <div className="me-matrix">
                  {ME_DISHES.map((d) => (
                    <div
                      key={`${d.dish}-quad`}
                      style={
                        {
                          gridArea: d.area,
                          "--color-background": d.bg,
                          "--color-border": "#DDE7E1",
                        } as CSSProperties
                      }
                    >
                      {/* Magic UI MagicCard — same mouse-tracking spotlight-border used on
                          the marketing pages (pages.tsx), tinted per quadrant so the glow
                          reinforces the tier's color instead of flattening it to one green. */}
                      <MagicCard
                        className="h-full w-full"
                        gradientColor={d.color}
                        gradientFrom={d.color}
                        gradientTo={d.bg}
                        gradientOpacity={0.14}
                        gradientSize={220}
                      >
                        <div className="me-quad">
                          <span className="me-quad-icon" style={{ color: d.color }}>
                            <d.icon size={15} strokeWidth={2.2} />
                          </span>
                          <span className="me-quad-tier" style={{ color: d.color }}>
                            {d.tier}
                          </span>
                          <span className="me-quad-desc">{d.act}</span>
                        </div>
                      </MagicCard>
                    </div>
                  ))}
                  {ME_DISHES.map((d) => (
                    <div
                      key={`${d.dish}-dot`}
                      className="me-dot"
                      style={
                        {
                          left: `${8 + d.sellsPct * 0.84}%`,
                          top: `${100 - (8 + d.earnsPct * 0.84)}%`,
                          "--dot-color": d.color,
                        } as CSSProperties
                      }
                      title={`${d.dish} — ${d.sells} sales, ${d.earns} profit / plate`}
                    >
                      <span className="me-dot-marker" />
                      <span className="me-dot-label">{d.dish}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
            <div className="me-axis-x" aria-hidden="true">
              How often it sells
              <ArrowRight size={12} strokeWidth={2.5} />
            </div>
            <p className="me-note">
              PlatePielet plots your whole menu like this, automatically — from the POS sales and
              purchase costs it already tracks.
            </p>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* QUOTE                                                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="testimonials" />
        <div className="sw-band">
          <div className="sw-section">
            <div className="tm-section">
              <div className="sw-section-tag">↳ Testimonials</div>
              <h2 className="sw-section-h2">Restaurant owners run on PlatePielet.</h2>
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
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* INTERACTIVE BENTO GALLERY                                         */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="gallery" />
        <div className="sw-section sw-glow-wrap">
          <div ref={sec2.ref} className={`platforms-section reveal${sec2.visible ? " show" : ""}`}>
            <div className="gallery-split">
              <div className="gallery-split-copy">
                <div className="sw-section-tag">↳ Product Preview</div>
                <h2 className="sw-section-h2">
                  See PlatePielet in <span style={{ color: "#15803D" }}>Action</span>
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
                  <details className="faq-item" name="faq" key={q}>
                    <summary>{q}</summary>
                    <p className="faq-a">{a}</p>
                  </details>
                ))}
              </div>
            </div>
          </div>
        </div>
      </main>

      {/* ══════════════════════════════════════════════════════════════════ */}
      {/* CTA BAND + FOOTER — footer slides up from underneath the CTA band  */}
      {/* ══════════════════════════════════════════════════════════════════ */}
      <PlatePieletFooter>
        <div className="sw-section" id="contact">
          <div className="cta-band">
            <h2 className="cta-heading">Start optimizing your restaurant today.</h2>
            <div className="cta-actions">
              <a href="/demo" className="btn-white">
                BOOK A DEMO
              </a>
              <a href={SALES_PHONE_HREF} className="btn-ghost">
                CALL {SALES_PHONE}
              </a>
            </div>
          </div>
        </div>
      </PlatePieletFooter>
    </div>
  );
}

function PlatformCard({
  number,
  tag,
  title,
  description,
  cta,
  href,
  accent,
}: {
  number?: string;
  tag: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
}) {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rx: 0, ry: 0, scale: 1 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const el = cardRef.current;
    if (!el) return;
    const rect = el.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({ rx: py * -8, ry: px * 8, scale: 1.03 });
  };

  return (
    <div
      ref={cardRef}
      className="sw-card group"
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, scale: 1 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
      }}
    >
      {number && <div className="sw-card-number">{number}</div>}
      <div className="sw-card-tag" style={{ color: accent }}>
        ↳ {tag}
      </div>
      <h3 className="sw-card-title">{title}</h3>
      <p className="sw-card-desc">{description}</p>
      {/* in-page anchors stay native; routes go through the router or the SPA
          does a full reload */}
      {href.startsWith("#") ? (
        <a href={href} className="sw-card-cta" style={{ color: accent }}>
          {cta} →
        </a>
      ) : (
        <Link to={href} className="sw-card-cta" style={{ color: accent }}>
          {cta} →
        </Link>
      )}
      <div className="sw-card-line" style={{ background: accent }} />
    </div>
  );
}

export default function IndexRoute() {
  return (
    <AppPage title={PAGE_TITLE}>
      <Index />
    </AppPage>
  );
}
