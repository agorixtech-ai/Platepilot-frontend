import { AppPage } from "@/components/ionic/AppPage";
// Self-hosted, landing-only: imported here (not main.tsx) so the dashboard's
// route chunk never downloads it — mirrors main.tsx's Inter setup.
import "@fontsource-variable/plus-jakarta-sans";
import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type FormEvent,
  type ReactNode,
} from "react";
import { Link, useHistory } from "react-router-dom";
import Lenis from "lenis";
import {
  ArrowRight,
  ArrowUp,
  ArrowUpRight,
  BarChart3,
  Bell,
  ClipboardCheck,
  FileText,
  IndianRupee,
  LayoutDashboard,
  LayoutGrid,
  Megaphone,
  Package,
  Plug,
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
        fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif",
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

/* Outcome cards: same placeholder figures as before, restyled as clickable
   photo-style tiles. `photo` is a dummy image (loremflickr, keyworded to each
   card's topic) — swap for real photography before launch; `gradient` stays
   as a translucent brand-color tint blended over it (see .outcome-card's
   background-blend-mode).
   Third slot is a CTA card instead of a third stat, matching the reference
   3-card widget (2 highlight cards + 1 email-capture card). */
type OutcomeCard = {
  pill: string;
  href: string;
  gradient: string;
  photo: string;
  value: string;
  caption: string;
};

const OUTCOME_CARDS: OutcomeCard[] = [
  {
    pill: "Food Cost",
    href: "/product/food-cost-analysis",
    gradient: "linear-gradient(160deg, #14532D 0%, #15803D 55%, #0A2E1E 100%)",
    photo: "https://loremflickr.com/800/900/restaurant,inventory",
    value: "AED 1,800/mo",
    caption: "Average leakage found per outlet, in month one",
  },
  {
    pill: "Tally + POS",
    href: "/integrations",
    gradient: "linear-gradient(160deg, #166534 0%, #16A34A 55%, #0F3D29 100%)",
    photo: "https://loremflickr.com/800/900/restaurant,pos",
    value: "6 hrs saved",
    caption: "Every week, per finance lead, on reconciliation",
  },
];

const OUTCOME_CTA_CARD = {
  pill: "Book a Demo",
  gradient: "linear-gradient(165deg, #0A2A1D 0%, #0F3D29 55%, #073B2A 100%)",
  photo: "https://loremflickr.com/800/900/restaurant,team",
  heading: "Start recovering margin today",
};

/* ─── Testimonials & FAQ content ─────────────────────────────────────────────
 * ⚠️ PLACEHOLDER DATA — quotes, names, and outlets are fabricated, same as
 * CUSTOMER_LOGOS/OUTCOME_CARDS above. `avatar` is a dummy portrait
 * (loremflickr placeholder) for the scrolling testimonial cards — replace
 * everything here with real customers/photos before launch. */
const TESTIMONIALS: { quote: string; name: string; place: string; role: string; avatar: string }[] =
  [
    {
      quote:
        "PlatePielet found ₹40,000 a month we didn't know we were losing. It paid for itself in the first week.",
      name: "Priya R.",
      place: "3-outlet restaurant group · Chennai",
      role: "Owner",
      avatar: "https://loremflickr.com/200/200/portrait,woman",
    },
    {
      quote:
        "Tally reconciliation used to eat my Sundays. Now it's finished before I open the laptop.",
      name: "Suresh M.",
      place: "Madras Meals Co. · Chennai",
      role: "Finance Lead",
      avatar: "https://loremflickr.com/200/200/portrait,man",
    },
    {
      quote:
        "Food cost dropped 3% in the first month. The waste alerts alone are worth the subscription.",
      name: "Kavitha N.",
      place: "GreenLeaf Kitchens · Coimbatore",
      role: "Owner",
      avatar: "https://loremflickr.com/200/200/portrait,woman,chef",
    },
    {
      quote: "I check one dashboard instead of calling five managers every morning.",
      name: "Arjun V.",
      place: "Urban Tandoor · Bengaluru",
      role: "Owner",
      avatar: "https://loremflickr.com/200/200/portrait,man,chef",
    },
    {
      quote: "The VAT mismatch alert saved us from a filing penalty in our very first week.",
      name: "Deepa S.",
      place: "Biryani House · Chennai",
      role: "Finance Lead",
      avatar: "https://loremflickr.com/200/200/portrait,woman,indian",
    },
    {
      quote: "Pilot AI answers in seconds what my accountant needed days to pull together.",
      name: "Rahul K.",
      place: "Cafe Azzure · Chennai",
      role: "Owner",
      avatar: "https://loremflickr.com/200/200/portrait,man,indian",
    },
  ];

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
    color: "#2563EB",
    bg: "rgba(37,99,235,0.1)",
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
    color: "#B7791F",
    bg: "rgba(245,158,11,0.12)",
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

const WASTE_RECOMMENDATIONS = [
  ["OVERPRODUCTION", "More prepared than sold", "Reduce preparation quantities based on actual sales and demand patterns.", "Reduce Prep · Improve Forecasting", "#2563EB"],
  ["HIGH WASTE", "Unusually high ingredient loss", "Review preparation, storage, handling, portion control, and supplier quality.", "Investigate · Reduce Loss", "#B91C1C"],
  ["STOCK VARIANCE", "Stock usage is higher than expected", "Review recipes, portions, stock movements, and wastage records.", "Review · Investigate · Correct", "#B7791F"],
  ["SPOILAGE RISK", "Stock may expire before it is used", "Prioritise existing stock, reduce future purchases, or promote dishes that use those ingredients.", "Use First · Reduce Orders", "#15803D"],
] as const;

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

/* ─── How It Works: hub-and-spoke stage ──────────────────────────────────────
   Centred copy over a flanked diagram: source tiles → Pilot AI hub → output
   tiles, with a dashboard mock on the left and an outlet console on the right.
   Only the connector wires are SVG; everything else is real DOM so the mocks
   keep crisp text and shadows. */

/** Rounded orthogonal elbow: (x1,y1) → vertical bus at `bx` → (x2,y2). */
function elbow(x1: number, y1: number, bx: number, x2: number, y2: number, r = 14) {
  if (y1 === y2) return `M${x1} ${y1} H${x2}`;
  const s = y2 > y1 ? 1 : -1;
  return `M${x1} ${y1} H${bx - r} Q${bx} ${y1} ${bx} ${y1 + s * r} V${y2 - s * r} Q${bx} ${y2} ${bx + r} ${y2} H${x2}`;
}

/** Tile-column centres for a 58px tile with a 22px gap (see .hiw-tiles). */
const HIW_CY = [29, 109, 189];

const HIW_IN = [
  { Icon: FileText, tint: "#E8F7ED", color: "#15803D", label: "Tally ERP" },
  { Icon: Receipt, tint: "#EAF1FE", color: "#2563EB", label: "POS billing" },
  { Icon: Package, tint: "#FDF1E3", color: "#C2760B", label: "Inventory" },
];

const HIW_OUT = [
  { Icon: LayoutDashboard, tint: "#EEEDFD", color: "#5B4BD6", label: "Dashboards" },
  { Icon: Bell, tint: "#FDECEF", color: "#DC2657", label: "Risk alerts" },
  { Icon: ShoppingCart, tint: "#E8F7ED", color: "#15803D", label: "Purchase calls" },
];

const HIW_STATS: [typeof IndianRupee, string, string][] = [
  [IndianRupee, "Sales today", "₹2,18,300"],
  [Receipt, "Bills", "611"],
  [Target, "Food cost", "28.4%"],
  [Package, "Items tracked", "980"],
  [Bell, "Open alerts", "12"],
];

const HIW_OUTLETS: [string, string][] = [
  ["Anna Nagar", "Margin 31% · healthy"],
  ["Velachery", "Margin 24% · watch"],
  ["T. Nagar", "Margin 28% · healthy"],
];

const DATA_DECISION_STEPS = [
  {
    Icon: Plug,
    title: "Connect Your Data",
    description: "Bring together data from your POS, inventory, accounting, and other restaurant systems.",
  },
  {
    Icon: LayoutDashboard,
    title: "See Everything in One Place",
    description: "View sales, costs, inventory, menu performance, and branch activity from one simple dashboard.",
  },
  {
    Icon: BarChart3,
    title: "Understand Your Performance",
    description: "Identify trends, issues, and opportunities across your restaurant.",
  },
  {
    Icon: Bell,
    title: "Discover What Needs Attention",
    description: "Spot wastage, stock and sales mismatches, underperforming items, and unusual changes early.",
  },
  {
    Icon: Target,
    title: "Make Better Decisions",
    description: "Use clear insights to reduce costs, improve operations, and decide with confidence.",
  },
] as const;

function HiwWire({ side }: { side: "in" | "out" }) {
  return (
    <svg className="hiw-wire" viewBox="0 0 54 218" aria-hidden="true">
      {HIW_CY.map((cy) => (
        <path key={cy} d={side === "in" ? elbow(0, cy, 27, 54, 109) : elbow(0, 109, 27, 54, cy)} />
      ))}
    </svg>
  );
}

function HowItWorksFlow() {
  return (
    <div className="hiw-stage">
      <div className="hiw-stage-head">
        <div className="hiw-badge">
          <LayoutGrid size={13} strokeWidth={2.2} />
          From Data to Decision
        </div>
        <h2 className="hiw-h2">
          Data In. <span style={{ color: "#15803D" }}>Decisions Out.</span>
        </h2>
        <p className="hiw-lede">
          Bring your Tally, POS, and inventory data into PlatePielet and turn everyday operational
          information into live dashboards, risk alerts, and action-ready recommendations.
        </p>
        <p className="hiw-lede" style={{ marginTop: "0.85rem" }}>
          PlatePielet helps you connect the numbers behind your restaurant and turn them into faster,
          smarter decisions on purchasing, stock control, costs, and daily operations.
        </p>
        <div className="hiw-mantra">Connect your data. See what matters. Act the same day.</div>
        <Link to="/demo" className="hiw-cta">
          See it on your data <ArrowRight size={15} strokeWidth={2.4} />
        </Link>
      </div>
      {/* floating accent tiles, matching the corners of the stage */}
      {[
        { Icon: FileText, tint: "#E8F7ED", color: "#15803D", style: { top: "6%", left: "9%" } },
        { Icon: Bell, tint: "#FDECEF", color: "#DC2657", style: { top: "9%", right: "10%" } },
        { Icon: BarChart3, tint: "#EAF1FE", color: "#2563EB", style: { top: "27%", left: "3.5%" } },
        { Icon: ShoppingCart, tint: "#EEEDFD", color: "#5B4BD6", style: { top: "30%", right: "4%" } },
      ].map(({ Icon, tint, color, style }, i) => (
        <div key={i} className="hiw-tile hiw-tile-float" style={style as CSSProperties}>
          <span style={{ background: tint, color }}><Icon size={19} strokeWidth={1.9} /></span>
        </div>
      ))}

      <div className="hiw-stage-grid">
        <div className="hiw-panel">
          <div className="hiw-browser">
            <div className="hiw-browser-bar"><span /><span /><span /></div>
            <div className="hiw-browser-body">
              <div className="hiw-sk" style={{ width: "62%" }} />
              <div className="hiw-sk" style={{ width: "44%" }} />
              <svg className="hiw-spark" viewBox="0 0 120 44" preserveAspectRatio="none">
                <path d="M0 34 L15 28 L30 31 L45 20 L60 24 L75 12 L90 16 L105 6 L120 9" fill="none" stroke="#16A34A" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
              <div className="hiw-sk" style={{ width: "78%" }} />
              <div className="hiw-sk" style={{ width: "52%" }} />
            </div>
          </div>
          <div className="hiw-statlist">
            {HIW_STATS.map(([Icon, label, value], i) => (
              <div key={label} className={`hiw-statrow${i === 2 ? " hl" : ""}`}>
                <span className="hiw-statrow-ico"><Icon size={13} strokeWidth={2} /></span>
                <div><b>{label}</b><em>{value}</em></div>
              </div>
            ))}
          </div>
        </div>

        <div className="hiw-core">
          <div className="hiw-tiles">
            {HIW_IN.map(({ Icon, tint, color, label }) => (
              <div key={label} className="hiw-tile" title={label}><span style={{ background: tint, color }}><Icon size={19} strokeWidth={1.9} /></span></div>
            ))}
          </div>
          <HiwWire side="in" />
          <div className="hiw-hub">Pilot AI</div>
          <HiwWire side="out" />
          <div className="hiw-tiles">
            {HIW_OUT.map(({ Icon, tint, color, label }) => (
              <div key={label} className="hiw-tile" title={label}><span style={{ background: tint, color }}><Icon size={19} strokeWidth={1.9} /></span></div>
            ))}
          </div>
        </div>

        <div className="hiw-panel">
          <div className="hiw-rail">
            <span className="on"><LayoutDashboard size={16} strokeWidth={1.9} /></span>
            <span><Sparkles size={16} strokeWidth={1.9} /></span>
            <span><Shield size={16} strokeWidth={1.9} /></span>
            <span><Trash2 size={16} strokeWidth={1.9} /></span>
          </div>
          <div className="hiw-console">
            {HIW_OUTLETS.map(([name, meta]) => (
              <div key={name} className="hiw-userrow">
                <span className="hiw-avatar"><Star size={12} strokeWidth={2} /></span>
                <div><b>{name}</b><span>{meta}</span></div>
              </div>
            ))}
            <div className="hiw-enter">Open dashboard</div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ─── Main page ──────────────────────────────────────────────────────────── */
function Index() {
  const mainRef = useRef<HTMLElement | null>(null);
  const lenisRef = useRef<Lenis | null>(null);
  const [showTop, setShowTop] = useState(false);
  const [ctaEmail, setCtaEmail] = useState("");
  const history = useHistory();

  // Outcome-card CTA hands the typed email to /demo (via router state) rather
  // than submitting anywhere itself — there's no standalone capture endpoint,
  // and DemoPage already owns the real form + POST /api/demo-requests.
  const handleOutcomeCtaSubmit = (e: FormEvent) => {
    e.preventDefault();
    history.push("/demo", { email: ctaEmail });
  };

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
      anchors: { offset: -76 },
    });
    lenisRef.current = lenis;

    let raf = 0;
    const tick = (time: number) => {
      lenis.raf(time);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // Back-to-top visibility — separate from the Lenis effect above since it
  // must track scroll position even when Lenis is skipped (reduced motion).
  useEffect(() => {
    const wrapper = mainRef.current?.closest<HTMLElement>(".app-page-scroll");
    if (!wrapper) return;
    const onScroll = () => setShowTop(wrapper.scrollTop > 800);
    onScroll();
    wrapper.addEventListener("scroll", onScroll, { passive: true });
    return () => wrapper.removeEventListener("scroll", onScroll);
  }, []);

  const scrollToTop = () => {
    if (lenisRef.current) {
      lenisRef.current.scrollTo(0, { duration: 1 });
      return;
    }
    const wrapper = mainRef.current?.closest<HTMLElement>(".app-page-scroll");
    wrapper?.scrollTo({ top: 0, behavior: "auto" });
  };

  const sec1 = useReveal();
  const sec2 = useReveal();
  const sec3 = useReveal();
  const sec4 = useReveal();
  const sec5 = useReveal();
  const sec6 = useReveal();
  const sec10 = useReveal();

  return (
    <div
      className="pp-landing"
      style={{
        background: "#FFFFFF",
        color: "#152019",
        fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif",
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
        .pp-landing *:where(:not(.ig-root, .ig-root *, .pp-nav, .pp-nav *)) { box-sizing: border-box; margin: 0; padding: 0; }
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

        /* ── Back-to-top ── */
        .pp-back-to-top {
          position: fixed;
          right: 1.5rem;
          bottom: 1.5rem;
          z-index: 40;
          width: 44px;
          height: 44px;
          border-radius: 9999px;
          border: none;
          display: flex;
          align-items: center;
          justify-content: center;
          background: ${T.gradientCTA};
          color: #FFFFFF;
          cursor: pointer;
          box-shadow: 0 4px 14px rgba(15,122,76,0.3);
          opacity: 0;
          transform: translateY(12px);
          pointer-events: none;
          transition: opacity 0.25s ease, transform 0.25s ease, box-shadow 0.2s ease;
        }
        .pp-back-to-top.show {
          opacity: 1;
          transform: none;
          pointer-events: auto;
        }
        .pp-back-to-top:hover {
          box-shadow: 0 10px 26px rgba(15,122,76,0.4);
        }
        @media (max-width: 640px) {
          .pp-back-to-top { right: 1rem; bottom: 1rem; width: 40px; height: 40px; }
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

        /* ── How It Works stage: centred copy over sources → Pilot AI → outputs ── */
        .hiw-stage {
          position: relative;
          margin-top: 1rem;
          padding: 3.5rem 2.5rem 3rem;
          border-radius: 30px;
          background: #F3F6F4;
          border: 1px solid #E4EBE6;
          overflow: hidden;
        }
        /* dashed guide grid — pure background, no extra markup */
        .hiw-stage::before {
          content: '';
          position: absolute;
          inset: 0;
          pointer-events: none;
          background:
            repeating-linear-gradient(180deg, #DCE5DF 0 6px, transparent 6px 14px) 17% 0/1px 100% no-repeat,
            repeating-linear-gradient(180deg, #DCE5DF 0 6px, transparent 6px 14px) 83% 0/1px 100% no-repeat,
            repeating-linear-gradient(90deg, #DCE5DF 0 6px, transparent 6px 14px) 0 24%/100% 1px no-repeat,
            repeating-linear-gradient(90deg, #DCE5DF 0 6px, transparent 6px 14px) 0 82%/100% 1px no-repeat;
        }
        .hiw-stage > * { position: relative; z-index: 1; }

        .hiw-stage-head { max-width: 760px; margin: 0 auto 3.5rem; text-align: center; }
        .hiw-stage-head .hiw-badge { margin-bottom: 1.25rem; }
        .hiw-h2 {
          font-size: clamp(2rem, 3.6vw, 3.1rem);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          margin-bottom: 1rem;
        }
        .hiw-lede {
          max-width: 690px;
          margin-inline: auto;
          font-size: 0.9rem;
          color: #66736B;
          line-height: 1.75;
          text-wrap: pretty;
        }
        .hiw-mantra {
          margin-top: 1.15rem;
          color: #15803D;
          font-size: 0.84rem;
          font-weight: 800;
        }
        .hiw-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.6rem;
          margin-top: 1.75rem;
          padding: 0.85rem 1.6rem;
          border-radius: 999px;
          background: #12211A;
          color: #FFFFFF !important;
          font-size: 0.85rem;
          font-weight: 700;
          box-shadow: 0 14px 30px -14px rgba(18,33,26,0.7);
          transition: transform 0.2s ease, box-shadow 0.2s ease;
        }
        .hiw-cta:hover { transform: translateY(-2px); box-shadow: 0 18px 36px -14px rgba(18,33,26,0.8); }
        .hiw-cta svg { transition: transform 0.2s ease; }
        .hiw-cta:hover svg { transform: translateX(3px); }

        .hiw-stage-grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          gap: 1.5rem;
          align-items: center;
        }

        /* icon tiles */
        .hiw-tile {
          width: 58px;
          height: 58px;
          border-radius: 17px;
          background: #FFFFFF;
          display: grid;
          place-items: center;
          box-shadow: 0 8px 20px -10px rgba(21,32,25,0.35), 0 1px 2px rgba(21,32,25,0.06);
          transition: transform 0.25s ease;
        }
        .hiw-tile:hover { transform: translateY(-3px); }
        .hiw-tile > span {
          width: 38px;
          height: 38px;
          border-radius: 12px;
          display: grid;
          place-items: center;
        }
        .hiw-tile-float { position: absolute; z-index: 0; }
        @media (max-width: 1080px) { .hiw-tile-float { display: none; } }

        /* centre column: tiles → wire → hub → wire → tiles */
        .hiw-core {
          display: grid;
          grid-template-columns: 58px 54px auto 54px 58px;
          align-items: center;
        }
        .hiw-tiles { display: flex; flex-direction: column; gap: 22px; }
        .hiw-wire { display: block; width: 54px; height: 218px; }
        .hiw-wire path { fill: none; stroke: #C6D5CC; stroke-width: 1.5; }
        .hiw-hub {
          padding: 1rem 1.6rem;
          border-radius: 999px;
          background: #12211A;
          color: #FFFFFF;
          font-size: 1.05rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          text-align: center;
          white-space: nowrap;
          box-shadow: 0 16px 32px -14px rgba(18,33,26,0.65), 0 0 0 7px rgba(22,163,74,0.07);
        }

        /* flanking panels */
        .hiw-panel {
          display: flex;
          gap: 12px;
          padding: 14px;
          border-radius: 24px;
          background: rgba(255,255,255,0.5);
          border: 1px solid #E4EBE6;
        }
        .hiw-browser {
          flex: 1 1 0;
          min-width: 0;
          background: #FFFFFF;
          border: 1px solid #EDF2EF;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 10px 24px -16px rgba(21,32,25,0.5);
        }
        .hiw-browser-bar { display: flex; gap: 5px; padding: 12px 14px; border-bottom: 1px solid #F1F5F3; }
        .hiw-browser-bar span { width: 8px; height: 8px; border-radius: 50%; background: #DDE5E0; }
        .hiw-browser-body { padding: 14px; display: flex; flex-direction: column; gap: 9px; }
        .hiw-sk { height: 8px; border-radius: 999px; background: #EDF2EF; }
        .hiw-spark { display: block; width: 100%; height: 44px; margin: 3px 0; }

        .hiw-statlist { flex: 0 0 150px; display: flex; flex-direction: column; gap: 2px; }
        .hiw-statrow { display: flex; align-items: center; gap: 9px; padding: 7px 9px; border-radius: 12px; }
        .hiw-statrow.hl { background: #FFFFFF; box-shadow: 0 8px 18px -14px rgba(21,32,25,0.7); }
        .hiw-statrow-ico {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #F1F5F3;
          color: #66736B;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .hiw-statrow b { display: block; font-size: 0.68rem; font-weight: 600; color: #8A968F; }
        .hiw-statrow em { display: block; font-style: normal; font-size: 0.8rem; font-weight: 800; color: #152019; margin-top: 1px; }

        .hiw-rail {
          flex: 0 0 42px;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 18px;
          color: #98A49D;
        }
        .hiw-rail > span { width: 34px; height: 34px; border-radius: 11px; display: grid; place-items: center; }
        .hiw-rail > span.on { background: #FFFFFF; color: #15803D; box-shadow: 0 8px 18px -12px rgba(21,32,25,0.7); }
        .hiw-console {
          flex: 1;
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding: 6px;
          background: #FFFFFF;
          border: 1px solid #EDF2EF;
          border-radius: 18px;
          box-shadow: 0 12px 26px -18px rgba(21,32,25,0.6);
        }
        .hiw-userrow { display: flex; align-items: center; gap: 10px; padding: 10px 8px; border-bottom: 1px solid #F3F7F5; }
        .hiw-avatar {
          width: 26px;
          height: 26px;
          border-radius: 50%;
          background: #EEF3F0;
          color: #9AA69F;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .hiw-userrow b { display: block; font-size: 0.78rem; font-weight: 700; color: #152019; }
        .hiw-userrow span { display: block; font-size: 0.67rem; color: #8A968F; margin-top: 1px; }
        .hiw-enter {
          margin: 10px 4px 4px;
          padding: 10px;
          border-radius: 12px;
          border: 1px solid #E4EBE6;
          text-align: center;
          font-size: 0.78rem;
          font-weight: 700;
          color: #152019;
        }

        @media (max-width: 1080px) {
          .hiw-stage-grid { grid-template-columns: 1fr; justify-items: center; gap: 2rem; }
          .hiw-panel { width: 100%; max-width: 420px; }
          .hiw-stage-head { margin-bottom: 2.5rem; }
        }
        @media (max-width: 560px) {
          .hiw-stage { padding: 2.5rem 1.25rem; border-radius: 22px; }
          .hiw-core { grid-template-columns: 52px 34px auto 34px 52px; }
          .hiw-tile { width: 52px; height: 52px; border-radius: 15px; }
          .hiw-tiles { gap: 16px; }
          .hiw-wire { width: 34px; height: 188px; }
          .hiw-hub { padding: 0.8rem 0.9rem; font-size: 0.85rem; }
          .hiw-panel { flex-direction: column; }
          .hiw-statlist, .hiw-rail { flex: none; }
          .hiw-rail { flex-direction: row; justify-content: flex-start; gap: 10px; }
        }

        /* ── How It Works: bottom stat bar ── */
        .hiw-stats {
          margin-top: 3rem;
          display: grid;
          grid-template-columns: repeat(5, minmax(0, 1fr));
          gap: 12px;
        }
        .hiw-stat {
          display: flex;
          min-height: 218px;
          flex-direction: column;
          align-items: flex-start;
          gap: 0.85rem;
          padding: 1.75rem 1.5rem;
          border: 1px solid #DDE7E1;
          border-radius: 18px;
          background: #FFFFFF;
          box-shadow: 0 2px 10px rgba(21,32,25,0.05);
        }
        .hiw-stat-top { display: flex; align-items: center; gap: 10px; }
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
        .hiw-stat-step { font-size: 0.7rem; font-weight: 800; color: #15803D; }
        .hiw-stat-title {
          min-height: 2.6em;
          font-size: 0.9rem;
          font-weight: 700;
          color: #152019;
          line-height: 1.3;
          margin-bottom: 5px;
        }
        .hiw-stat-sub { font-size: 0.78rem; color: #66736B; line-height: 1.5; }
        @media (max-width: 1100px) {
          .hiw-stats { grid-template-columns: repeat(2, minmax(0, 1fr)); }
          .hiw-stat:nth-child(5) {
            grid-column: 1 / -1;
            width: calc(50% - 6px);
            justify-self: center;
          }
        }
        @media (max-width: 560px) {
          .hiw-stats { grid-template-columns: 1fr; }
          .hiw-stat { min-height: 0; }
          .hiw-stat:nth-child(5) { grid-column: auto; width: auto; }
        }
        .hiw-journey-footer {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 0.7rem;
          margin-top: 1.5rem;
          color: #66736B;
          font-size: 0.82rem;
        }
        .hiw-journey-footer strong { color: #152019; }
        .hiw-journey-footer span::after { content: "·"; margin-left: 0.7rem; color: #A8B4AD; }
        @media (max-width: 560px) {
          .hiw-journey-footer { flex-direction: column; gap: 0.25rem; }
          .hiw-journey-footer span::after { display: none; }
        }

        .waste-lede { max-width: 760px; }
        .waste-metrics { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; margin-top: 2.5rem; }
        .waste-metrics > div { display: flex; flex-direction: column; gap: 5px; padding: 1.2rem 1.3rem; border: 1px solid #DDE7E1; border-radius: 16px; background: #F7FAF8; }
        .waste-metrics strong { color: #152019; font-size: 0.85rem; }
        .waste-metrics span { color: #66736B; font-size: 0.75rem; line-height: 1.5; }
        .waste-ai-heading { display: flex; justify-content: space-between; align-items: baseline; gap: 1rem; margin: 3.5rem 0 1.25rem; }
        .waste-ai-heading span { color: #152019; font-size: 1.1rem; font-weight: 800; }
        .waste-ai-heading small { color: #15803D; font-size: 0.75rem; font-weight: 700; }
        .waste-recommendations { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 12px; }
        .waste-card { min-height: 245px; padding: 1.35rem; border: 1px solid #DDE7E1; border-top: 4px solid var(--waste-color); border-radius: 16px; background: #FFFFFF; box-shadow: 0 10px 24px -20px rgba(21,32,25,0.55); }
        .waste-card-label { color: var(--waste-color); font-size: 0.62rem; font-weight: 800; letter-spacing: 0.12em; }
        .waste-card h3 { margin: 0.65rem 0 0.9rem; color: #152019; font-size: 0.95rem; line-height: 1.3; }
        .waste-card-ai { display: inline-block; padding: 4px 8px; border-radius: 999px; background: #E8F7ED; color: #15803D; font-size: 0.6rem; font-weight: 800; text-transform: uppercase; letter-spacing: 0.06em; }
        .waste-card p { margin: 0.7rem 0 1rem; color: #66736B; font-size: 0.77rem; line-height: 1.55; }
        .waste-card-action { color: #152019; font-size: 0.7rem; line-height: 1.4; }
        .waste-footer { margin: 3.5rem auto 0; text-align: center; max-width: 620px; }
        .waste-footer strong { display: block; color: #152019; font-size: 1.4rem; }
        .waste-footer span { display: block; margin-top: 0.45rem; color: #15803D; font-weight: 800; }
        .waste-footer p { margin: 0.7rem 0 0; color: #66736B; font-size: 0.85rem; line-height: 1.6; }
        @media (max-width: 980px) { .waste-recommendations { grid-template-columns: repeat(2, minmax(0, 1fr)); } }
        @media (max-width: 700px) {
          .waste-metrics, .waste-recommendations { grid-template-columns: 1fr; }
          .waste-ai-heading { flex-direction: column; gap: 0.4rem; }
        }
        .about-section { padding: 5rem 0; }
        .about-intro { display: grid; grid-template-columns: minmax(0, 1.1fr) minmax(300px, 0.9fr); gap: 4rem; align-items: end; }
        .about-intro .sw-section-body { margin-bottom: 0; }
        .about-grid { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 14px; margin-top: 3.5rem; }
        .about-copy, .about-card { min-height: 220px; padding: 1.5rem; border: 1px solid #DDE7E1; border-radius: 18px; background: #F7FAF8; }
        .about-copy { display: flex; align-items: center; color: #66736B; font-size: 0.9rem; line-height: 1.75; }
        .about-copy p { margin: 0; }
        .about-card { background: #FFFFFF; box-shadow: 0 12px 28px -22px rgba(21,32,25,0.55); }
        .about-card--accent { background: #E8F7ED; border-color: #C9E9D6; }
        .about-card-label { margin-bottom: 1rem; color: #15803D; font-size: 0.7rem; font-weight: 800; letter-spacing: 0.12em; text-transform: uppercase; }
        .about-card p { margin: 0; color: #66736B; font-size: 0.84rem; line-height: 1.7; }
        .about-card strong { display: block; margin-top: 1.25rem; color: #152019; font-size: 0.85rem; line-height: 1.45; }
        @media (max-width: 900px) {
          .about-intro { grid-template-columns: 1fr; gap: 1.5rem; }
          .about-grid { grid-template-columns: 1fr 1fr; }
          .about-copy { grid-column: 1 / -1; min-height: 0; }
        }
        @media (max-width: 600px) {
          .about-grid { grid-template-columns: 1fr; }
          .about-copy { grid-column: auto; }
        }

        /* ── Testimonials: copy-left / stacked-quote-cards-right ── */
        .tm-section { padding: 6rem 0; }
        .tm-split {
          display: grid;
          grid-template-columns: minmax(0, 4fr) minmax(0, 7fr);
          gap: 3rem;
          align-items: center;
        }
        @media (max-width: 900px) { .tm-split { grid-template-columns: 1fr; gap: 2.5rem; } }
        .tm-badge {
          display: inline-flex;
          align-items: center;
          background: #66736B;
          color: #FFFFFF;
          font-size: 0.8rem;
          font-weight: 600;
          padding: 0.5rem 1.1rem;
          border-radius: 9999px;
        }
        .tm-cta {
          display: inline-flex;
          align-items: center;
          gap: 0.75rem;
          margin-top: 2rem;
          background: #0A2A1D;
          color: #FFFFFF;
          border-radius: 9999px;
          padding: 0.4rem 0.4rem 0.4rem 1.5rem;
          font-size: 0.85rem;
          font-weight: 700;
          text-decoration: none;
        }
        .tm-cta-arrow {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 9999px;
          background: rgba(255,255,255,0.14);
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .tm-cta:hover .tm-cta-arrow { background: rgba(255,255,255,0.24); transform: scale(1.06) rotate(6deg); }
        /* Vertical auto-scroll: content is rendered twice, then translated by
           exactly one copy's height (-50%) so the loop seams invisibly. */
        .tm-stack {
          max-height: 640px;
          overflow: hidden;
          -webkit-mask-image: linear-gradient(180deg, transparent, #000 8%, #000 92%, transparent);
          mask-image: linear-gradient(180deg, transparent, #000 8%, #000 92%, transparent);
        }
        .tm-stack-track {
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 1.5rem;
          animation: tm-scroll-y 36s linear infinite;
        }
        .tm-stack:hover .tm-stack-track { animation-play-state: paused; }
        @keyframes tm-scroll-y { from { transform: translateY(0); } to { transform: translateY(-50%); } }
        .tm-qcard {
          position: relative;
          display: flex;
          align-items: flex-start;
          gap: 1.25rem;
          padding: 1.75rem 2rem;
          border-radius: 20px;
          margin: 0;
        }
        .tm-qcard--side {
          width: 88%;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
        }
        .tm-qcard--muted { opacity: 0.55; }
        .tm-qcard--featured {
          width: 100%;
          overflow: hidden;
          background: linear-gradient(165deg, #0A2A1D 0%, #0F3D29 60%, #073B2A 100%);
          box-shadow: 0 20px 45px rgba(10,26,16,0.25);
        }
        .tm-avatar {
          width: 60px;
          height: 60px;
          flex-shrink: 0;
          border-radius: 50%;
          object-fit: cover;
          border: 3px solid #FFFFFF;
          box-shadow: 0 4px 12px rgba(21,32,25,0.12);
        }
        .tm-qcard--featured .tm-avatar { width: 72px; height: 72px; }
        .tm-qtext { font-size: 1rem; font-weight: 500; line-height: 1.6; }
        .tm-qcard--side .tm-qtext { color: #152019; }
        .tm-qcard--featured .tm-qtext { color: #FFFFFF; position: relative; z-index: 1; }
        .tm-qattr { margin-top: 0.75rem; font-size: 0.85rem; }
        .tm-qcard--side .tm-qattr { color: #66736B; }
        .tm-qcard--featured .tm-qattr { color: rgba(255,255,255,0.75); position: relative; z-index: 1; }
        .tm-qattr b { font-style: normal; }
        .tm-qmark {
          position: absolute;
          right: 1.5rem;
          bottom: -1.5rem;
          font-family: Georgia, serif;
          font-size: 10rem;
          line-height: 1;
          color: rgba(255,255,255,0.06);
          pointer-events: none;
          user-select: none;
        }
        @media (max-width: 700px) {
          .tm-qcard--side { width: 100%; }
          .tm-qcard { padding: 1.5rem; }
        }

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
          padding: 1.75rem 0;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: -0.01em;
          color: #152019;
        }
        .faq-item summary::-webkit-details-marker { display: none; }
        .faq-item summary::after {
          content: '+';
          font-size: 1.3rem;
          font-weight: 400;
          color: #9CA3AF;
          flex-shrink: 0;
        }
        .faq-item[open] summary::after { content: '×'; }
        .faq-a {
          padding: 0 2rem 1.75rem 0;
          font-size: 0.9rem;
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
        .me-quad-ai {
          display: inline-flex;
          align-items: center;
          margin-top: 2px;
          padding: 3px 7px;
          border-radius: 999px;
          background: rgba(255,255,255,0.78);
          color: #152019;
          font-size: 0.58rem;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
        }
        .me-quad-desc {
          font-size: 0.74rem;
          line-height: 1.45;
          color: rgba(21,32,25,0.68);
          max-width: 15rem;
        }
        .me-subhead {
          margin-top: -0.45rem;
          margin-bottom: 1rem;
          color: #15803D;
          font-size: 1rem;
          font-weight: 800;
          letter-spacing: -0.01em;
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
           .hiw-stage::before / .xp-section, reused here for two more sections. */
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

        /* Full-bleed alternating band. The page canvas is white, so section
           rhythm comes from a true-neutral surface + the forest CTA band, not
           from the old green tint. Wraps .sw-section (which is width-capped and
           therefore can't go edge to edge itself). */
        .sw-band { background: var(--brand-surface); }
        /* Cards inside a band need to stay white or they vanish into it. */
        .sw-band .sw-card { background: #FFFFFF; }

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

        /* ── Outcome cards: photo-style tiles (dummy photo tinted by the brand
           gradient via background-blend-mode) ── */
        .outcome-cards {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
          gap: 1rem;
          padding: 3.5rem 0;
        }
        .outcome-card {
          position: relative;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
          min-height: 380px;
          padding: 1.25rem;
          border-radius: 22px;
          overflow: hidden;
          color: #FFFFFF;
          background-size: cover;
          background-position: center;
          background-blend-mode: multiply;
          box-shadow: 0 10px 30px rgba(10,26,16,0.18);
          transition: transform 0.25s ease, box-shadow 0.25s ease;
        }
        a.outcome-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 38px rgba(10,26,16,0.26);
        }
        .outcome-card::after {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(180deg, rgba(0,0,0,0) 45%, rgba(0,0,0,0.4) 100%);
          pointer-events: none;
        }
        .outcome-card-top,
        .outcome-bottom { position: relative; z-index: 1; }
        .outcome-card-top {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 0.75rem;
        }
        .outcome-pill {
          display: inline-flex;
          align-items: center;
          background: #FFFFFF;
          color: #152019;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.5rem 0.9rem;
          border-radius: 9999px;
          white-space: nowrap;
        }
        .outcome-arrow {
          flex-shrink: 0;
          width: 36px;
          height: 36px;
          border-radius: 9999px;
          background: #FFFFFF;
          color: #152019;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s ease;
        }
        a.outcome-arrow:hover,
        a.outcome-card:hover .outcome-arrow { transform: scale(1.08) rotate(6deg); }
        .outcome-value {
          font-size: clamp(1.4rem, 2.6vw, 1.7rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.15;
        }
        .outcome-caption {
          margin-top: 0.4rem;
          font-size: 0.85rem;
          line-height: 1.45;
          color: rgba(255,255,255,0.82);
          max-width: 88%;
        }
        .outcome-cta-heading {
          font-size: clamp(1.3rem, 2.4vw, 1.55rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.2;
          margin-bottom: 1rem;
        }
        .outcome-cta-form {
          display: flex;
          align-items: center;
          gap: 4px;
          padding: 4px;
          background: rgba(255,255,255,0.14);
          border: 1px solid rgba(255,255,255,0.35);
          border-radius: 9999px;
          backdrop-filter: blur(6px);
        }
        .outcome-cta-form input {
          flex: 1;
          min-width: 0;
          background: transparent;
          border: none;
          outline: none;
          color: #FFFFFF;
          font-size: 0.85rem;
          padding: 0.5rem 0.25rem 0.5rem 0.75rem;
        }
        .outcome-cta-form input::placeholder { color: rgba(255,255,255,0.65); }
        .outcome-cta-form button {
          flex-shrink: 0;
          background: #FFFFFF;
          color: #152019;
          font-size: 0.78rem;
          font-weight: 700;
          padding: 0.55rem 1.05rem;
          border: none;
          border-radius: 9999px;
          cursor: pointer;
          white-space: nowrap;
          transition: transform 0.15s ease;
        }
        .outcome-cta-form button:hover { transform: translateY(-1px); }

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
        /* Heading-left / intro-right header row (Solution section only) */
        .sw-section-header-split {
          display: flex;
          justify-content: space-between;
          align-items: flex-end;
          gap: 2.5rem;
          margin-bottom: 3.5rem;
        }
        @media (max-width: 900px) {
          .sw-section-header-split { flex-direction: column; align-items: flex-start; }
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
          grid-template-columns: repeat(3, 1fr) 1.3fr;
          align-items: start;
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
          min-height: 380px;
          box-shadow: 0 2px 8px rgba(21,32,25,0.04);
          position: relative;
          display: flex;
          flex-direction: column;
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
        .sw-card--featured {
          background: #E8F7ED;
          border-color: rgba(22,163,74,0.22);
          min-height: 460px;
          border-radius: 16px 96px 16px 16px;
        }
        @media (max-width: 1100px) {
          .sw-card--featured { border-radius: 16px 64px 16px 16px; }
        }
        .sw-card-icon {
          display: flex;
          margin-bottom: 1.75rem;
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
          flex: 1;
        }
        .sw-card-arrow {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          align-self: flex-start;
          width: 40px;
          height: 40px;
          flex-shrink: 0;
          border-radius: 9999px;
          background: #FFFFFF;
          border: 1px solid #DDE7E1;
          color: #152019;
          transition: transform 0.2s ease, background 0.2s ease, color 0.2s ease;
        }
        .sw-card:hover .sw-card-arrow {
          transform: scale(1.08) rotate(6deg);
        }
        .sw-card-arrow--solid {
          background: #15803D;
          border-color: #15803D;
          color: #FFFFFF;
        }

        /* ── Capabilities section (exact match to reference) ── */
        /* ── Feature bento grid ── */
        .ft-grid {
          display: grid;
          grid-template-columns: repeat(6, 1fr);
          gap: 1.25rem;
          margin-top: 3rem;
        }
        .ft-card { grid-column: span 2; }
        .ft-card.ft-wide { grid-column: span 3; }
        @media (max-width: 1024px) {
          .ft-grid { grid-template-columns: repeat(2, 1fr); }
          .ft-card, .ft-card.ft-wide { grid-column: span 1; }
          .ft-card:last-child { grid-column: span 2; }
        }
        @media (max-width: 640px) {
          .ft-grid { grid-template-columns: 1fr; gap: 1rem; }
          .ft-card, .ft-card.ft-wide, .ft-card:last-child { grid-column: span 1; }
        }
        .ft-card {
          background: #F6FAF8;
          border: 1px solid #DDE7E1;
          border-radius: 18px;
          padding: 1.5rem;
          display: flex;
          flex-direction: column;
          transition: border-color 0.25s ease, transform 0.25s ease, box-shadow 0.25s ease;
        }
        .ft-card:hover {
          border-color: #B6DCC6;
          transform: translateY(-3px);
          box-shadow: 0 18px 40px -24px rgba(15,42,28,0.35);
        }
        .ft-vis {
          position: relative;
          height: 200px;
          margin-bottom: 1.5rem;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
        }
        .ft-card.ft-wide .ft-vis { height: 244px; }
        .ft-title {
          font-size: 1.3rem;
          font-weight: 700;
          letter-spacing: -0.025em;
          line-height: 1.25;
          margin-bottom: 0.55rem;
        }
        .ft-card.ft-wide .ft-title { font-size: 1.45rem; }
        .ft-desc { font-size: 0.85rem; color: #66736B; line-height: 1.65; }

        /* window chrome shared by the feature mock-ups */
        .ft-win {
          background: #FFFFFF;
          border: 1px solid #E4EDE8;
          border-radius: 12px;
          box-shadow: 0 12px 30px -18px rgba(15,42,28,0.45);
          overflow: hidden;
        }
        .ft-win-bar {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 9px 12px;
          border-bottom: 1px solid #EFF5F2;
        }
        .ft-dot { width: 7px; height: 7px; border-radius: 50%; background: #16A34A; flex-shrink: 0; }
        .ft-sk { display: block; height: 7px; border-radius: 999px; background: #E6EDE9; }
        .ft-sk-a { background: rgba(22,163,74,0.28); }

        /* 1 · Pilot AI */
        .ft-ai-win { width: 88%; }
        .ft-ai-body { padding: 14px 14px 36px; display: flex; flex-direction: column; gap: 12px; }
        .ft-ai-q {
          align-self: flex-end;
          max-width: 80%;
          font-size: 0.72rem;
          font-weight: 600;
          color: #15803D;
          background: #E8F7ED;
          border: 1px solid #C9E9D6;
          padding: 7px 11px;
          border-radius: 12px 12px 3px 12px;
        }
        .ft-ai-a { display: flex; gap: 9px; }
        .ft-ai-ico {
          width: 20px; height: 20px; border-radius: 7px; flex-shrink: 0;
          background: linear-gradient(135deg, #0F7A4C, #16A34A);
          color: #FFFFFF; display: grid; place-items: center;
        }
        .ft-ai-lines { flex: 1; display: flex; flex-direction: column; gap: 7px; padding-top: 5px; }
        .ft-ai-bar {
          position: absolute;
          left: 10%; right: 10%; bottom: 4px;
          display: flex; align-items: center; justify-content: space-between; gap: 10px;
          padding: 6px 6px 6px 13px;
          background: #FFFFFF;
          border: 1.5px solid #16A34A;
          border-radius: 11px;
          box-shadow: 0 12px 26px -12px rgba(15,122,76,0.55);
          font-size: 0.68rem;
          color: #8A968F;
        }
        .ft-ai-btn {
          display: inline-flex; align-items: center; gap: 5px; flex-shrink: 0;
          background: linear-gradient(135deg, #0F7A4C, #16A34A);
          color: #FFFFFF; font-size: 0.66rem; font-weight: 700;
          padding: 6px 12px; border-radius: 8px;
        }

        /* 2 · Realtime dashboards */
        .ft-stack { position: relative; width: 90%; padding-top: 28px; }
        .ft-layer-2 { position: absolute; top: 0; left: 8%; right: 8%; height: 36px; opacity: 0.45; z-index: 1; }
        .ft-layer-1 { position: absolute; top: 14px; left: 4%; right: 4%; height: 36px; opacity: 0.7; z-index: 2; }
        .ft-layer-0 { position: relative; z-index: 3; }
        .ft-live {
          margin-left: auto; flex-shrink: 0;
          font-size: 0.55rem; font-weight: 800; letter-spacing: 0.12em;
          color: #15803D; background: #E8F7ED; border: 1px solid #C9E9D6;
          padding: 2px 7px; border-radius: 999px;
        }
        .ft-dash-body { padding: 13px 14px 15px; display: flex; flex-direction: column; gap: 13px; }
        .ft-kpis { display: flex; gap: 22px; }
        .ft-kpis b { display: block; font-size: 0.95rem; font-weight: 800; color: #152019; line-height: 1; }
        .ft-kpis span { display: block; font-size: 0.6rem; color: #8A968F; margin-top: 4px; }
        .ft-bars { display: flex; align-items: flex-end; gap: 5px; height: 58px; }
        .ft-bars i {
          flex: 1; border-radius: 3px 3px 0 0; background: #D8EEE1;
          transform-origin: bottom;
          animation: ft-grow 0.9s cubic-bezier(0.22,1,0.36,1) backwards;
        }
        .ft-bars i:last-child { background: linear-gradient(180deg, #16A34A, #0F7A4C); }
        @keyframes ft-grow { from { transform: scaleY(0.12); opacity: 0; } }

        /* 3 · Integrations orbit */
        .ft-orbit { position: relative; width: 230px; height: 230px; display: grid; place-items: center; }
        .ft-ring { position: absolute; border-radius: 50%; border: 1px dashed #D6E5DC; }
        .ft-ring-1 { inset: 36px; }
        .ft-ring-2 { inset: 0; }
        .ft-hub {
          width: 48px; height: 48px; border-radius: 15px; position: relative; z-index: 2;
          background: linear-gradient(135deg, #0F7A4C, #16A34A);
          color: #FFFFFF; display: grid; place-items: center;
          box-shadow: 0 14px 28px -10px rgba(15,122,76,0.7);
        }
        .ft-node {
          position: absolute; z-index: 2;
          font-size: 0.62rem; font-weight: 700; color: #3C4A42;
          background: #FFFFFF; border: 1px solid #E4EDE8; border-radius: 999px;
          padding: 5px 10px; white-space: nowrap;
          box-shadow: 0 8px 16px -10px rgba(15,42,28,0.55);
        }

        /* 4 · Alerts */
        .ft-alerts { display: flex; flex-direction: column; gap: 9px; width: 100%; }
        .ft-alert {
          display: flex; align-items: center; gap: 10px;
          background: #FFFFFF; border: 1px solid #E4EDE8; border-radius: 10px;
          padding: 9px 11px;
          box-shadow: 0 10px 20px -16px rgba(15,42,28,0.6);
        }
        .ft-alert b { display: block; font-size: 0.72rem; font-weight: 700; color: #152019; }
        .ft-alert span { display: block; font-size: 0.63rem; color: #8A968F; margin-top: 2px; }
        .ft-alert-ico { width: 26px; height: 26px; border-radius: 8px; display: grid; place-items: center; flex-shrink: 0; }

        /* 5 · Reports */
        .ft-doc { width: 84%; }
        .ft-doc-body { padding: 13px 14px 15px; display: flex; flex-direction: column; gap: 10px; }
        .ft-doc-h { display: flex; align-items: center; gap: 7px; font-size: 0.72rem; font-weight: 700; color: #152019; }
        .ft-doc-row { display: flex; align-items: center; justify-content: space-between; gap: 12px; }
        .ft-doc-row em { font-style: normal; font-size: 0.65rem; font-weight: 700; color: #152019; flex-shrink: 0; }
        .ft-badge {
          align-self: flex-start; margin-top: 2px;
          font-size: 0.6rem; font-weight: 700; color: #15803D;
          background: #E8F7ED; border: 1px solid #C9E9D6;
          padding: 4px 9px; border-radius: 999px;
        }

        /* ── Product-preview tile animations ── */
        @keyframes pp-scroll-x { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        @keyframes pp-blink { 0%, 49% { opacity: 1; } 50%, 100% { opacity: 0; } }

        /* ── Smooth anchor scrolling + offset for the sticky nav ── */
        .app-page-scroll { scroll-behavior: smooth; }
        .pp-landing [id] { scroll-margin-top: 76px; }

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
        <PlatePieletNav variant="brand" sticky />
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
          <div className="outcome-cards">
            {OUTCOME_CARDS.map((c) => (
              <Link
                to={c.href}
                className="outcome-card"
                key={c.pill}
                style={{ backgroundImage: `${c.gradient}, url(${c.photo})` }}
              >
                <div className="outcome-card-top">
                  <span className="outcome-pill">{c.pill}</span>
                  <span className="outcome-arrow" aria-hidden="true">
                    <ArrowUpRight size={16} strokeWidth={2.5} />
                  </span>
                </div>
                <div className="outcome-bottom">
                  <div className="outcome-value">{c.value}</div>
                  <div className="outcome-caption">{c.caption}</div>
                </div>
              </Link>
            ))}

            <div
              className="outcome-card"
              style={{
                backgroundImage: `${OUTCOME_CTA_CARD.gradient}, url(${OUTCOME_CTA_CARD.photo})`,
              }}
            >
              <div className="outcome-card-top">
                <span className="outcome-pill">{OUTCOME_CTA_CARD.pill}</span>
                <Link to="/demo" className="outcome-arrow" aria-label="Book a demo">
                  <ArrowUpRight size={16} strokeWidth={2.5} />
                </Link>
              </div>
              <div className="outcome-bottom">
                <div className="outcome-cta-heading">{OUTCOME_CTA_CARD.heading}</div>
                <form className="outcome-cta-form" onSubmit={handleOutcomeCtaSubmit}>
                  <input
                    type="email"
                    required
                    placeholder="Your email"
                    aria-label="Your email"
                    value={ctaEmail}
                    onChange={(e) => setCtaEmail(e.target.value)}
                  />
                  <button type="submit">Get Started</button>
                </form>
              </div>
            </div>
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
                PlatePielet transforms your restaurant data into clear, actionable insights in real
                time. Monitor performance, identify trends, detect issues, and uncover opportunities
                across sales, inventory, costs, and operations, all from one intelligent platform.
              </p>
              <p className="intro-body" style={{ marginTop: "1rem" }}>
                Make faster, data-driven decisions with the information that matters most to your
                restaurant.
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
              <HowItWorksFlow />
              <div className="hiw-stats">
                {DATA_DECISION_STEPS.map(({ Icon, title, description }, index) => (
                  <div className="hiw-stat" key={title}>
                    <div className="hiw-stat-top">
                      <div className="hiw-stat-icon">
                        <Icon size={20} strokeWidth={1.8} />
                      </div>
                      <div className="hiw-stat-step">Step {index + 1}</div>
                    </div>
                    <div>
                      <div className="hiw-stat-title">{title}</div>
                      <div className="hiw-stat-sub">{description}</div>
                    </div>
                  </div>
                ))}
              </div>
              <div className="hiw-journey-footer">
                <span>From Data to Decision</span>
                <strong>Connect. Understand. Improve.</strong>
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
            <div className="sw-section-header-split">
              <div>
                <div className="sw-section-tag">↳ The Solution</div>
                <h2 className="sw-section-h2" style={{ marginBottom: 0 }}>
                  Stop guessing. Run your restaurant on data.
                </h2>
              </div>
              <p className="sw-section-body" style={{ marginBottom: 0, maxWidth: 380 }}>
                PlatePielet connects the systems you already use and turns them into one
                intelligence layer for your entire operation.
              </p>
            </div>
            <div className="sw-cards-grid">
              <PlatformCard
                tag="Inventory"
                title="Smart Inventory Tracking"
                description="Live stock counts built from your POS sales and purchase bills — with alerts before you run out or over-order."
                cta="Explore Inventory"
                href="/product/inventory-intelligence"
                accent="#22C55E"
                icon={Package}
              />
              <PlatformCard
                tag="Waste AI"
                title="Waste Detection"
                description="Pilot AI flags spoilage, over-prep, and shrinkage patterns per outlet — before they hit your month-end P&L."
                cta="Explore Waste AI"
                href="#menu-engineering"
                accent="#D97706"
                icon={Trash2}
              />
              <PlatformCard
                tag="Purchasing"
                title="Purchase Optimization"
                description="Market-price intelligence and demand forecasts tell you what to buy, how much, and when — so you stop overpaying vendors."
                cta="Explore Purchasing"
                href="/product/purchase-suggestions"
                accent="#16A34A"
                icon={ShoppingCart}
              />
              <PlatformCard
                tag="Accounting"
                title="Tally & POS Sync"
                description="Your books reconcile themselves — every sale, purchase, and voucher matched automatically between POS and Tally."
                cta="Explore Integrations"
                href="/integrations"
                accent="#0F7A4C"
                icon={Receipt}
                featured
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
            <div className="sw-section-tag">AI-Powered Insights</div>
            <h2 className="sw-section-h2">
              Everything You Need to Run a Smarter, More Profitable Restaurant.
            </h2>
            <p className="sw-section-body">
              Connect your restaurant data, understand performance in real time, and turn insights
              into actions that improve your business.
            </p>
            <div className="ft-grid">
              <article className="ft-card ft-wide">
                <div className="ft-vis">
                  <div className="ft-win ft-ai-win">
                    <div className="ft-win-bar">
                      <span className="ft-dot" />
                      <span className="ft-sk" style={{ width: "46%" }} />
                    </div>
                    <div className="ft-ai-body">
                      <div className="ft-ai-q">Why is food cost up in Velachery?</div>
                      <div className="ft-ai-a">
                        <span className="ft-ai-ico">
                          <Sparkles size={11} strokeWidth={2.2} />
                        </span>
                        <div className="ft-ai-lines">
                          <span className="ft-sk" style={{ width: "100%" }} />
                          <span className="ft-sk" style={{ width: "84%" }} />
                          <span className="ft-sk ft-sk-a" style={{ width: "44%" }} />
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="ft-ai-bar">
                    <span>Ask Pilot anything about your outlets…</span>
                    <span className="ft-ai-btn">
                      <Zap size={11} strokeWidth={2.4} /> Ask
                    </span>
                  </div>
                </div>
                <h3 className="ft-title">Pilot AI Insights</h3>
                <p className="ft-desc">
                  Ask in plain language, get an answer from your own numbers. Pilot reads every
                  bill, voucher, and stock movement, then tells you where money is leaking.
                </p>
              </article>

              <article className="ft-card ft-wide">
                <div className="ft-vis">
                  <div className="ft-stack">
                    <div className="ft-win ft-layer-2" />
                    <div className="ft-win ft-layer-1" />
                    <div className="ft-win ft-layer-0">
                      <div className="ft-win-bar">
                        <span className="ft-dot" />
                        <span className="ft-sk" style={{ width: "34%" }} />
                        <span className="ft-live">LIVE</span>
                      </div>
                      <div className="ft-dash-body">
                        <div className="ft-kpis">
                          <div>
                            <b>₹2.4L</b>
                            <span>Sales today</span>
                          </div>
                          <div>
                            <b>28.4%</b>
                            <span>Food cost</span>
                          </div>
                          <div>
                            <b>847</b>
                            <span>Bills</span>
                          </div>
                        </div>
                        <div className="ft-bars">
                          {[38, 56, 44, 72, 58, 84, 66, 94].map((h, i) => (
                            <i key={i} style={{ height: `${h}%`, animationDelay: `${i * 60}ms` }} />
                          ))}
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                <h3 className="ft-title">Realtime Dashboards</h3>
                <p className="ft-desc">
                  Sales, food cost, stock, and receivables update as they happen — not at month-end.
                  Drill from the group view to a single outlet or invoice in two taps.
                </p>
              </article>

              <article className="ft-card">
                <div className="ft-vis">
                  <div className="ft-orbit">
                    <span className="ft-ring ft-ring-2" />
                    <span className="ft-ring ft-ring-1" />
                    <span className="ft-hub">
                      <Zap size={20} strokeWidth={2} />
                    </span>
                    <span
                      className="ft-node"
                      style={{ top: 0, left: "50%", transform: "translateX(-50%)" }}
                    >
                      Tally ERP
                    </span>
                    <span
                      className="ft-node"
                      style={{ top: "50%", right: 0, transform: "translateY(-50%)" }}
                    >
                      POS
                    </span>
                    <span
                      className="ft-node"
                      style={{ bottom: 0, left: "50%", transform: "translateX(-50%)" }}
                    >
                      Zoho
                    </span>
                    <span
                      className="ft-node"
                      style={{ top: "50%", left: 0, transform: "translateY(-50%)" }}
                    >
                      Excel
                    </span>
                  </div>
                </div>
                <h3 className="ft-title">Tally &amp; POS Sync</h3>
                <p className="ft-desc">
                  No migration, no new hardware. Your books reconcile themselves against POS
                  billing.
                </p>
              </article>

              <article className="ft-card">
                <div className="ft-vis">
                  <div className="ft-alerts">
                    {(
                      [
                        [
                          Package,
                          "#EF4444",
                          "rgba(239,68,68,0.12)",
                          "Tomatoes below par",
                          "Reorder 12 kg before service",
                        ],
                        [
                          Trash2,
                          "#D97706",
                          "rgba(217,119,6,0.12)",
                          "Prep waste up 18%",
                          "Anna Nagar · dinner shift",
                        ],
                        [
                          ShoppingCart,
                          "#16A34A",
                          "rgba(22,163,74,0.12)",
                          "Paneer price dropped 6%",
                          "Good day to buy 40 kg",
                        ],
                      ] as const
                    ).map(([Icon, color, bg, title, sub]) => (
                      <div
                        key={title}
                        className="ft-alert"
                        style={{ borderLeft: `3px solid ${color}` }}
                      >
                        <span className="ft-alert-ico" style={{ background: bg, color }}>
                          <Icon size={13} strokeWidth={2.2} />
                        </span>
                        <div>
                          <b>{title}</b>
                          <span>{sub}</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
                <h3 className="ft-title">Stock &amp; Waste Alerts</h3>
                <p className="ft-desc">
                  Get told before you run out, over-order, or quietly bleed margin to spoilage.
                </p>
              </article>

              <article className="ft-card">
                <div className="ft-vis">
                  <div className="ft-win ft-doc">
                    <div className="ft-win-bar">
                      <span className="ft-dot" />
                      <span className="ft-sk" style={{ width: "38%" }} />
                    </div>
                    <div className="ft-doc-body">
                      <div className="ft-doc-h">
                        <FileText size={13} strokeWidth={2} /> VAT Summary · August
                      </div>
                      {(
                        [
                          ["72%", "₹18.4L"],
                          ["58%", "₹92,100"],
                          ["64%", "₹4,820"],
                        ] as const
                      ).map(([w, amt]) => (
                        <div key={amt} className="ft-doc-row">
                          <span className="ft-sk" style={{ width: w }} />
                          <em>{amt}</em>
                        </div>
                      ))}
                      <span className="ft-badge">Ready to file</span>
                    </div>
                  </div>
                </div>
                <h3 className="ft-title">Reports &amp; VAT</h3>
                <p className="ft-desc">
                  Filing-ready summaries built from reconciled data, with mismatches flagged early.
                </p>
              </article>
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
            <h2 className="sw-section-h2">Understand What Sells. Know What Makes Money.</h2>
            <div className="me-subhead">Every Dish. One Clear Strategy.</div>
            <p className="sw-section-body" style={{ marginBottom: 0 }}>
              PlatePielet combines sales, food cost, and menu performance data to show exactly how
              every dish is performing.
              <br /><br />
              See which items drive profit, which need attention, and get AI-powered recommendations
              on what to promote, optimise, reprice, or review.
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
                          <span className="me-quad-ai">AI suggestion</span>
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
        {/* WASTE MANAGEMENT                                                  */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="waste-management" />
        <div className="sw-section sw-glow-wrap">
          <div className="platforms-section waste-section">
            <div className="sw-section-tag">↳ Waste Management</div>
            <h2 className="sw-section-h2">See Where Waste Happens. Understand Why. Reduce It.</h2>
            <p className="sw-section-body waste-lede">
              PlatePielet gives you a clear view of where food and inventory waste is happening, what
              it is costing your business, and how to reduce it.
              <br /><br />
              By connecting stock movements, consumption, sales, and wastage data, PlatePielet helps
              you identify patterns, investigate unusual losses, and take action before waste impacts
              profitability.
            </p>
            <div className="waste-metrics">
              <div><strong>Track the true cost</strong><span>By item, category, branch, and time period.</span></div>
              <div><strong>Identify waste patterns</strong><span>Overproduction, spoilage, excess consumption, and slow-moving stock.</span></div>
              <div><strong>Compare stock vs sales</strong><span>Spot unexpected variances and unrecorded usage.</span></div>
            </div>
            <div className="waste-ai-heading">
              <span>AI-Powered Waste Recommendations</span>
              <small>Understand the cause. Know what to do next.</small>
            </div>
            <div className="waste-recommendations">
              {WASTE_RECOMMENDATIONS.map(([label, issue, recommendation, action, color]) => (
                <article className="waste-card" key={label} style={{ "--waste-color": color } as CSSProperties}>
                  <div className="waste-card-label">{label}</div>
                  <h3>{issue}</h3>
                  <div className="waste-card-ai">AI recommendation</div>
                  <p>{recommendation}</p>
                  <strong className="waste-card-action">Action: {action}</strong>
                </article>
              ))}
            </div>
            <div className="waste-footer">
              <strong>Turn Waste Into Savings</strong>
              <span>Detect. Understand. Recommend. Reduce.</span>
              <p>PlatePielet turns waste data into clear actions that help reduce food cost, improve inventory control, and protect your margins.</p>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* ABOUT US                                                           */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="about-us" />
        <div className="sw-section">
          <div className="about-section">
            <div className="sw-section-tag">About Us</div>
            <div className="about-intro">
              <div>
                <h2 className="sw-section-h2">Optimise Your Restaurant’s Performance with PlatePielet</h2>
              </div>
              <p className="sw-section-body">
                PlatePielet is built for restaurateurs who want a smarter, clearer way to run their
                business.
                <br /><br />
                Our mission is to help restaurants improve performance by turning everyday operational
                data into meaningful insights and actions. We put your business goals at the centre of
                everything we build.
              </p>
            </div>
            <div className="about-grid">
              <div className="about-copy">
                <p>
                  Restaurant owners often manage sales, inventory, food costs, wastage, and financial
                  information across multiple disconnected systems. PlatePielet brings this data
                  together, giving you one clear view of your restaurant’s performance and helping you
                  make faster, better-informed decisions.
                </p>
              </div>
              <article className="about-card">
                <div className="about-card-label">Built for the Restaurant Industry</div>
                <p>
                  We understand that every restaurant operates differently. PlatePielet is designed to
                  work alongside your existing systems and simplify the way you understand your
                  business, whether you operate a single restaurant or multiple locations.
                </p>
              </article>
              <article className="about-card about-card--accent">
                <div className="about-card-label">Our Vision</div>
                <p>
                  We believe restaurant owners should spend less time searching through spreadsheets
                  and disconnected systems, and more time focusing on their customers and growing
                  their business.
                </p>
                <strong>Better visibility. Smarter decisions. Stronger restaurants.</strong>
              </article>
            </div>
          </div>
        </div>

        {/* ══════════════════════════════════════════════════════════════════ */}
        {/* QUOTE                                                              */}
        {/* ══════════════════════════════════════════════════════════════════ */}
        <div className="sw-rule" id="testimonials" />
        <div className="sw-band">
          <div className="sw-section">
            <div className="tm-section">
              <div className="tm-split">
                <div className="tm-copy">
                  <span className="tm-badge">Testimonials &amp; Reviews</span>
                  <h2 className="sw-section-h2" style={{ marginTop: "1.5rem", maxWidth: 420 }}>
                    Restaurant owners run on PlatePielet.
                  </h2>
                  <p className="sw-section-body" style={{ maxWidth: 380 }}>
                    Real feedback from outlet owners and finance leads who use PlatePielet every day
                    to control cost and cut manual work.
                  </p>
                  <Link to="/demo" className="tm-cta">
                    <span>Book a Demo</span>
                    <span className="tm-cta-arrow">
                      <ArrowUpRight size={16} strokeWidth={2.5} />
                    </span>
                  </Link>
                </div>
                <div className="tm-stack">
                  <div className="tm-stack-track">
                    {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => {
                      const variant = i % 3;
                      const cls =
                        variant === 1
                          ? "tm-qcard tm-qcard--featured"
                          : variant === 2
                            ? "tm-qcard tm-qcard--side tm-qcard--muted"
                            : "tm-qcard tm-qcard--side";
                      return (
                        <figure className={cls} key={i}>
                          <img className="tm-avatar" src={t.avatar} alt="" />
                          <div>
                            <blockquote className="tm-qtext">"{t.quote}"</blockquote>
                            <figcaption className="tm-qattr">
                              –{t.name} as <b>{t.role}</b>
                            </figcaption>
                          </div>
                          {variant === 1 && (
                            <span className="tm-qmark" aria-hidden="true">
                              "
                            </span>
                          )}
                        </figure>
                      );
                    })}
                  </div>
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
                <div className="sw-section-tag">FAQ</div>
                <h2 className="sw-section-h2" style={{ marginBottom: 0 }}>
                  Questions, answered.
                </h2>
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

      <button
        type="button"
        aria-label="Back to top"
        onClick={scrollToTop}
        className={`pp-back-to-top${showTop ? " show" : ""}`}
      >
        <ArrowUp size={18} strokeWidth={2.5} />
      </button>
    </div>
  );
}

function PlatformCard({
  tag,
  title,
  description,
  cta,
  href,
  accent,
  icon: Icon,
  featured,
}: {
  tag: string;
  title: string;
  description: string;
  cta: string;
  href: string;
  accent: string;
  icon: React.ComponentType<{ size?: number; strokeWidth?: number }>;
  featured?: boolean;
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

  const arrowClass = `sw-card-arrow${featured ? " sw-card-arrow--solid" : ""}`;

  return (
    <div
      ref={cardRef}
      className={`sw-card group${featured ? " sw-card--featured" : ""}`}
      onMouseMove={handleMouseMove}
      onMouseLeave={() => setTilt({ rx: 0, ry: 0, scale: 1 })}
      style={{
        transform: `perspective(800px) rotateX(${tilt.rx}deg) rotateY(${tilt.ry}deg) scale(${tilt.scale})`,
      }}
    >
      <div className="sw-card-icon" style={{ color: featured ? accent : T.text }}>
        <Icon size={30} strokeWidth={1.5} />
      </div>
      <h3 className="sw-card-title">{title}</h3>
      <p className="sw-card-desc">{description}</p>
      {/* in-page anchors stay native; routes go through the router or the SPA
          does a full reload */}
      {href.startsWith("#") ? (
        <a href={href} className={arrowClass} aria-label={cta}>
          <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </a>
      ) : (
        <Link to={href} className={arrowClass} aria-label={cta}>
          <ArrowUpRight size={16} strokeWidth={2.5} aria-hidden="true" />
        </Link>
      )}
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
