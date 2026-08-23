import { useEffect, useRef, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useIsMobile } from "@/hooks/use-mobile";
import { SALES_PHONE, SALES_PHONE_HREF } from "@/lib/contact";

/** Matches PlatePielet brand palette — light landing (soft green-white).
 *  Exported as the shared landing color theme (Index.tsx product tiles). */
export const T = {
  bg: "#FFFFFF",
  ink: "#FFFFFF",
  text: "#152019",
  soft: "rgba(21,32,25,0.78)",
  muted: "#66736B",
  faint: "rgba(21,32,25,0.42)",
  faint2: "rgba(21,32,25,0.35)",
  nav: "#66736B",
  border: "rgba(21,32,25,0.1)",
  borderMid: "rgba(21,32,25,0.14)",
  borderStrong: "rgba(21,32,25,0.2)",
  surface: "#FFFFFF",
  inset: "#E8F7ED",
  accent: "#16A34A",
  /* Button/badge fill under WHITE text. #16A34A is only 3.30:1 against white,
     which fails AA for a label; #15803D is 5.02:1. Fills that carry no text
     keep using `accent`. */
  accentSolid: "#15803D",
  accentSoft: "rgba(22,163,74,0.12)",
  accentBorder: "rgba(22,163,74,0.28)",
  accentGlow: "rgba(22,163,74,0.4)",
  purple: "#D97706",
  warn: "#F59E0B",
  limeDark: "#0A1A10",
  gradient: "linear-gradient(90deg, #073B2A 0%, #0F7A4C 50%, #22C55E 100%)",
  gradientHover: "linear-gradient(90deg, #0A4A35 0%, #12965C 50%, #4ADE80 100%)",
  /* Endpoints stay >= 3:1 on white (the AA floor for large text). The old
     gradientB ended on #22C55E at 2.28:1 — an H1 nobody with low vision could
     read. Both ramps now run dark -> mid -> brand so they still read as two
     distinct highlights. */
  gradientA: "linear-gradient(90deg, #073B2A 0%, #0F7A4C 100%)",
  gradientB: "linear-gradient(90deg, #0F7A4C 0%, #16A34A 100%)",
  /* Premium gradient/glow additions — button fill, decorative mint accents,
     hero glow, and card glass. Never reaches #16A34A/#22C55E under text
     (see the accentSolid note above on AA contrast). */
  gradientCTA: "linear-gradient(135deg, #073B2A 0%, #0F7A4C 55%, #15803D 100%)",
  gradientMint: "linear-gradient(135deg, #16A34A 0%, #84CC16 55%, #ECFCCB 100%)",
  glowHero:
    "radial-gradient(closest-side, rgba(34,197,94,0.28) 0%, rgba(163,230,53,0.14) 45%, rgba(255,255,255,0) 72%)",
  cardGlassBg: "rgba(255,255,255,0.86)",
} as const;

const gradientClip = (gradient: string) =>
  ({
    background: gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }) as const;

const cardShell = {
  border: `1px solid ${T.border}`,
  borderRadius: 14,
  background: T.cardGlassBg,
  backdropFilter: "blur(10px) saturate(160%)",
  WebkitBackdropFilter: "blur(10px) saturate(160%)",
  boxShadow: "0 2px 10px rgba(7,26,20,0.06)",
} as const;

const LAYOUT = { max: 1280, pad: 40, stage: 1225 } as const;
const STAGE_H = 640;
const HALF = LAYOUT.stage / 2;
const COPY_LEFT = 0;
const COPY_WIDTH = HALF - COPY_LEFT - 24;
const ANIM_INSET = 14;
const LIST_W = 162;
const LIST_LEFT = HALF + ANIM_INSET;
const LIST_RIGHT = LIST_LEFT + LIST_W;
const SPINE_GAP = 28;
const SPINE_X = LIST_RIGHT + SPINE_GAP;
const DASH_LEFT = SPINE_X + 8;
const DASH_WIDTH = LAYOUT.stage - DASH_LEFT;
const DASH_TOP = 36;
const DASH_GAP = 10;
const STAT_H = 90;
const DASH_BOTTOM = STAGE_H - 36;
const SPINE_BOTTOM = DASH_BOTTOM - 76; // trim ~7 dash segments below bottom stat row
const LIST_H = 320;
const LIST_TOP = (DASH_TOP + DASH_BOTTOM - LIST_H) / 2;
const CONNECT_Y = LIST_TOP + LIST_H / 2;

const btnBase = {
  display: "inline-flex" as const,
  alignItems: "center" as const,
  justifyContent: "center" as const,
  boxSizing: "border-box" as const,
  fontFamily: "inherit",
  textDecoration: "none",
  lineHeight: 1,
  whiteSpace: "nowrap" as const,
};
const btnOutlineSm = {
  ...btnBase,
  fontSize: 14,
  fontWeight: 700,
  letterSpacing: "0.06em",
  height: 40,
  padding: "0 18px",
  color: T.accentSolid,
  border: `1px solid ${T.accent}`,
  borderRadius: 12,
  background: "#FFFFFF",
};
const btnSolidSm = {
  ...btnOutlineSm,
  color: T.ink,
  border: "none",
  // background + boxShadow live in the .pp-btn-solid CSS class (below) so
  // its :hover rule can override them — inline style beats any CSS
  // selector, hover included. `undefined` here clears the "#FFFFFF" spread
  // in from btnOutlineSm (React omits undefined style props entirely), so
  // the CSS class's background can actually take effect.
  background: undefined,
};
const btnOutlineLg = { ...btnOutlineSm, fontSize: 16, height: 48, padding: "0 24px" };
const btnSolidLg = { ...btnSolidSm, fontSize: 16, height: 48, padding: "0 26px" };

// ── Alert card data ──────────────────────────────────────────────────────────
type AlertCard = {
  score: string;
  risk: string;
  date: string;
  title: string;
  subtitle: string;
  message: string;
  status: string;
  statusColor: string;
  badgeBg: string;
  badgeFg: string;
};

const ALERT_CARDS: AlertCard[] = [
  {
    score: "92",
    risk: "Food Cost Risk",
    date: "Tue, Sep 30",
    title: "Food Cost",
    subtitle: "Anna Nagar Outlet",
    message: "Food cost running 6.4% over target — ₹41,800 margin at risk",
    status: "Over Budget",
    statusColor: T.warn,
    badgeBg: "#FF5757", // red — highest risk
    badgeFg: "#fff",
  },
  {
    score: "67",
    risk: "Inventory Risk",
    date: "30 minutes ago",
    title: "Stock Variance",
    subtitle: "Velachery Branch",
    message: "Inventory shrinkage gap of ₹18,400 detected",
    status: "Variance Alert",
    statusColor: "#f87171",
    badgeBg: "#C8F135", // lime — lowest risk
    badgeFg: T.limeDark,
  },
  {
    score: "88",
    risk: "Wastage Risk",
    date: "Tue, Sep 30",
    title: "Wastage",
    subtitle: "Head Office",
    message: "Kitchen wastage trending +2.1% — ₹9,600 above weekly norm",
    status: "Needs Review",
    statusColor: T.warn,
    badgeBg: "#FF9B3E", // amber — mid risk
    badgeFg: "#2D1200",
  },
];

// ── Stat values per card ─────────────────────────────────────────────────────
type CardStat = { label: string; value: number };
const CARD_STATS: CardStat[][] = [
  [
    { label: "Food Cost %", value: 31 },
    { label: "Purchase Orders", value: 14 },
    { label: "Wastage Alerts", value: 3 },
  ],
  [
    { label: "Food Cost %", value: 28 },
    { label: "Purchase Orders", value: 9 },
    { label: "Wastage Alerts", value: 1 },
  ],
  [
    { label: "Food Cost %", value: 34 },
    { label: "Purchase Orders", value: 22 },
    { label: "Wastage Alerts", value: 5 },
  ],
];

// ── Scrolling source list ────────────────────────────────────────────────────
type IconKey = "file" | "pos" | "tag" | "zap";

const ICON_PATHS: Record<IconKey, string> = {
  file: "M3 2h7l4 4v11H3V2zm7 0v4h4",
  pos: "M2 3h12v2H2zM3 5l1 9h8l1-9",
  tag: "M2 2h6l6 6-6 6-6-6V2zm3.5 3.5a1 1 0 102 0 1 1 0 00-2 0",
  zap: "M11 1L7 9h5l-3 6",
};

const BASE_ITEMS: { name: string; sub: string; icon: IconKey }[] = [
  { name: "Invoice #INV-8821", sub: "Tally ERP", icon: "file" },
  { name: "Sale #POS-2249", sub: "Anna Nagar", icon: "pos" },
  { name: "Receipt #RCP-0344", sub: "Velachery", icon: "file" },
  { name: "Purchase #PO-1192", sub: "Head Office", icon: "tag" },
  { name: "Ledger #LED-7701", sub: "VAT Module", icon: "file" },
  { name: "Bill #BILL-4432", sub: "Nungambakkam", icon: "pos" },
  { name: "Journal #JV-5521", sub: "Accounts", icon: "tag" },
  { name: "Transfer #TRF-9901", sub: "Bank Sync", icon: "zap" },
  { name: "Sale #POS-3301", sub: "T. Nagar", icon: "pos" },
];

const SCROLL_ITEMS = [...BASE_ITEMS, ...BASE_ITEMS];
const ROW_H = 50;
const SCROLL_DISTANCE = BASE_ITEMS.length * ROW_H;

// ── AI ticker ────────────────────────────────────────────────────────────────
// 5 continuous paragraphs — each streams as one flowing block of text
const AI_LINE_SETS = [
  "Food cost trending 6.4% over target at Anna Nagar. Chicken and rice purchases up 12% week-on-week. Recommend renegotiating supplier rate before month-end.",
  "Inventory shrinkage gap of ₹18,400 detected at Velachery. Three SKUs affected over the past 7 days. Stock count reconciliation suggested.",
  "Food cost variance +3.2% above weekly threshold. Velachery branch exceeding budget on 4 items. Adjust procurement to recover margin gap.",
  "Wastage trending +2.1% this week — ₹9,600 above the norm. Prep portions on 3 dishes look oversized. Kitchen review recommended.",
  "14 purchase orders pending approval across outlets. 2 vendors flagged for price increases this month. Review before next delivery cycle.",
];

const SMALL_STATS = [
  { val: "₹8.6L", label: "Inventory Value", color: T.text, delay: "1.02s" },
  { val: "847", label: "Bills Today", color: T.text, delay: "1.07s" },
  { val: "12", label: "AI Insights", color: T.accent, delay: "1.12s" },
];

// ── Count-up component ───────────────────────────────────────────────────────
function CountUp({ target, trigger }: { target: number; trigger: number }) {
  const [val, setVal] = useState(0);

  useEffect(() => {
    const t0 = performance.now();
    const duration = 600;
    const tick = (now: number) => {
      const p = Math.min(1, (now - t0) / duration);
      const e = 1 - Math.pow(1 - p, 3); // ease-out cubic
      setVal(Math.round(target * e));
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [trigger, target]);

  if (target >= 1000) {
    const s = val >= 1000 ? `${(val / 1000).toFixed(1)}k` : String(val);
    return <>{s}</>;
  }
  return <>{val}</>;
}

// ── Streaming text component ─────────────────────────────────────────────────
function StreamingText({
  text,
  trigger,
  startDelay = 0,
  onComplete,
}: {
  text: string;
  trigger: number;
  startDelay?: number;
  onComplete?: () => void;
}) {
  const [displayed, setDisplayed] = useState("");

  useEffect(() => {
    setDisplayed("");
    let intervalId: ReturnType<typeof setInterval> | undefined;
    const timeoutId = setTimeout(() => {
      let i = 0;
      intervalId = setInterval(() => {
        i++;
        setDisplayed(text.slice(0, i));
        if (i >= text.length) {
          clearInterval(intervalId);
          onComplete?.();
        }
      }, 22); // 22ms/char — fast enough to finish before cycling
    }, startDelay);
    return () => {
      clearTimeout(timeoutId);
      if (intervalId) clearInterval(intervalId);
    };
  }, [trigger, text, startDelay]);

  return <>{displayed}</>;
}

// ── Animated dashboard mockup (shared between desktop scaled-stage and mobile
//    scaled-stage — both render this at the same HALF × STAGE_H design size) ──
function AnimatedDashboard({
  card,
  stats,
  cardIdx,
  aiIdx,
  onAiComplete,
}: {
  card: AlertCard;
  stats: CardStat[];
  cardIdx: number;
  aiIdx: number;
  onAiComplete: () => void;
}) {
  return (
    <div
      style={{
        position: "absolute",
        inset: 0,
        animation: "ag-float 3.5s 0.9s ease-in-out infinite alternate",
      }}
    >
      {/* Soft blurred glow behind the whole assembly — "green gradient
          glow behind the dashboard" ask; blur(70px) makes exact bounds
          forgiving. */}
      <div
        aria-hidden="true"
        style={{
          position: "absolute",
          left: 40,
          top: STAGE_H / 2 - 260,
          width: 520,
          height: 520,
          background: T.glowHero,
          filter: "blur(70px)",
          pointerEvents: "none",
        }}
      />
      {/* ── SCROLLING SOURCE LIST ── */}
      <div
        style={{
          position: "absolute",
          left: ANIM_INSET,
          top: LIST_TOP,
          width: LIST_W,
          height: LIST_H,
          overflow: "hidden",
          ...cardShell,
          borderRadius: 8,
        }}
      >
        {/* Active-row highlight */}
        <div
          style={{
            position: "absolute",
            left: 0,
            right: 0,
            top: LIST_H / 2 - ROW_H / 2,
            height: ROW_H,
            background: `linear-gradient(90deg,${T.accentSoft},rgba(34,197,94,0.04))`,
            borderTop: `1px solid ${T.accentBorder}`,
            borderBottom: `1px solid ${T.accentBorder}`,
            pointerEvents: "none",
            zIndex: 3,
          }}
        />
        <div
          style={{
            willChange: "transform",
            animation: "ag-scroll 22s linear infinite",
          }}
        >
          {SCROLL_ITEMS.map((item, idx) => (
            <div
              key={idx}
              style={{
                height: ROW_H,
                display: "flex",
                alignItems: "center",
                gap: 10,
                padding: "0 12px 0 13px",
                borderBottom: `1px solid ${T.border}`,
              }}
            >
              <span
                style={{
                  color: T.accent,
                  flexShrink: 0,
                  width: 18,
                  height: 18,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 16 16"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <path d={ICON_PATHS[item.icon]} />
                </svg>
              </span>
              <div style={{ minWidth: 0, flex: 1, overflow: "hidden" }}>
                <div
                  style={{
                    fontSize: 12.5,
                    fontWeight: 600,
                    color: T.soft,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                  }}
                >
                  {item.name}
                </div>
                <div
                  style={{
                    fontSize: 10.5,
                    color: T.faint,
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    marginTop: 1,
                  }}
                >
                  {item.sub}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* ── SVG CONNECTOR ── */}
      <svg
        viewBox={`0 0 ${LAYOUT.stage / 2} ${STAGE_H}`}
        width="100%"
        height={STAGE_H}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          overflow: "visible",
          pointerEvents: "none",
          zIndex: 1,
        }}
      >
        <path
          d={`M${LIST_RIGHT - HALF},${CONNECT_Y - 22} C${LIST_RIGHT - HALF + 12},${CONNECT_Y - 22} ${LIST_RIGHT - HALF + 22},${CONNECT_Y} ${SPINE_X - HALF},${CONNECT_Y}`}
          fill="none"
          stroke="rgba(34,197,94,0.22)"
          strokeWidth="1.3"
          strokeDasharray="3 5"
        />
        <path
          d={`M${LIST_RIGHT - HALF},${CONNECT_Y} L${SPINE_X - HALF},${CONNECT_Y}`}
          fill="none"
          stroke="rgba(34,197,94,0.35)"
          strokeWidth="1.3"
          strokeDasharray="3 5"
        />
        <path
          d={`M${LIST_RIGHT - HALF},${CONNECT_Y + 22} C${LIST_RIGHT - HALF + 12},${CONNECT_Y + 22} ${LIST_RIGHT - HALF + 22},${CONNECT_Y} ${SPINE_X - HALF},${CONNECT_Y}`}
          fill="none"
          stroke="rgba(34,197,94,0.22)"
          strokeWidth="1.3"
          strokeDasharray="3 5"
        />
        <path
          d={`M${SPINE_X - HALF},${DASH_TOP + 10} L${SPINE_X - HALF},${SPINE_BOTTOM}`}
          fill="none"
          stroke="rgba(21,32,25,.12)"
          strokeWidth="1.3"
          strokeDasharray="3 5"
        />
      </svg>

      {/* ── CONNECTOR NODE (centered on spine) ── */}
      {/* Thin mint-gradient ring behind the solid dot — a 2px sliver of
          T.gradientMint peeks out around the smaller solid circle on top. */}
      <div
        style={{
          position: "absolute",
          left: SPINE_X - HALF - 10,
          top: CONNECT_Y - 10,
          width: 20,
          height: 20,
          borderRadius: "50%",
          background: T.gradientMint,
          zIndex: 3,
        }}
      />
      <div
        style={{
          position: "absolute",
          left: SPINE_X - HALF - 8,
          top: CONNECT_Y - 8,
          width: 16,
          height: 16,
          borderRadius: "50%",
          background: T.accent,
          zIndex: 4,
          animation: "ag-node 2.8s ease-in-out infinite",
        }}
      />

      {/* ── DASHBOARD COLUMN ── */}
      <div
        style={{
          position: "absolute",
          left: DASH_LEFT - HALF,
          top: DASH_TOP,
          width: DASH_WIDTH,
          display: "flex",
          flexDirection: "column",
          gap: DASH_GAP,
          zIndex: 2,
        }}
      >
        {/* ── ANIMATION 1: ROTATING ALERT CARD ── */}
        {/* Fixed height + clip prevents layout jump during card swap */}
        <div style={{ position: "relative", height: 188, overflow: "hidden" }}>
          <AnimatePresence mode="wait">
            <motion.div
              key={cardIdx}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{
                opacity: 0,
                y: -30,
                transition: { duration: 0.3, ease: "easeIn" },
              }}
              transition={{ duration: 0.35, ease: "easeOut", delay: 0.05 }}
              style={{
                position: "absolute",
                width: "100%",
                borderRadius: 16,
                background: T.cardGlassBg,
                backdropFilter: "blur(10px) saturate(160%)",
                WebkitBackdropFilter: "blur(10px) saturate(160%)",
                border: "1px solid rgba(0,0,0,0.06)",
                boxShadow: "0 4px 20px rgba(7,26,20,0.08)",
                padding: "14px 16px",
                boxSizing: "border-box",
              }}
            >
              {/* Badge + Date */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: 8,
                  minHeight: 28,
                }}
              >
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 6,
                    fontSize: 11,
                    fontWeight: 700,
                    lineHeight: 1,
                    color: card.badgeFg,
                    background: card.badgeBg,
                    padding: "5px 9px",
                    borderRadius: 9999,
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 13, fontWeight: 800 }}>{card.score}</span>
                  {card.risk}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    fontSize: 11,
                    lineHeight: 1,
                    color: "#9CA3AF",
                    background: "rgba(0,0,0,0.04)",
                    border: "1px solid rgba(0,0,0,0.06)",
                    padding: "5px 8px",
                    borderRadius: 7,
                    whiteSpace: "nowrap",
                  }}
                >
                  {card.date}
                </span>
              </div>

              {/* Title + Bell */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 12,
                }}
              >
                <div>
                  <div style={{ fontSize: 15.5, fontWeight: 600, color: "#111827" }}>
                    {card.title}
                  </div>
                  <div style={{ fontSize: 12.5, color: "#6B7280", marginTop: 2 }}>
                    {card.subtitle}
                  </div>
                </div>
                <span
                  style={{
                    color: "#9CA3AF",
                    animation: "ag-bell 5s ease infinite",
                    transformOrigin: "top center",
                  }}
                >
                  <svg
                    width="17"
                    height="17"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.7"
                  >
                    <path d="M18 8a6 6 0 0 0-12 0c0 7-3 9-3 9h18s-3-2-3-9" />
                    <path d="M13.7 21a2 2 0 0 1-3.4 0" />
                  </svg>
                </span>
              </div>

              {/* Message */}
              <div
                style={{
                  fontSize: 12,
                  color: "#374151",
                  background: "rgba(0,0,0,0.03)",
                  border: "1px solid rgba(0,0,0,0.06)",
                  borderRadius: 8,
                  padding: "8px 11px",
                  marginTop: 11,
                }}
              >
                {card.message}
              </div>

              {/* Footer */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginTop: 10,
                }}
              >
                <span
                  style={{
                    fontSize: 12,
                    color: card.statusColor,
                    fontWeight: 600,
                    lineHeight: 1,
                  }}
                >
                  {card.status}
                </span>
                <span
                  style={{
                    display: "inline-flex",
                    alignItems: "center",
                    gap: 4,
                    fontSize: 12,
                    color: "#9CA3AF",
                    fontWeight: 500,
                    cursor: "pointer",
                    lineHeight: 1,
                  }}
                >
                  Review
                  <svg
                    width="12"
                    height="12"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17 17 7M9 7h8v8" />
                  </svg>
                </span>
              </div>
            </motion.div>
          </AnimatePresence>
        </div>

        {/* ── ANIMATION 3: COUNT-UP STAT GRID ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: DASH_GAP,
          }}
        >
          {stats.map((s) => (
            <div
              key={s.label}
              style={{
                ...cardShell,
                padding: "12px 13px",
                height: STAT_H,
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
              }}
            >
              <div style={{ fontSize: 11, color: T.faint, lineHeight: 1.2 }}>{s.label}</div>
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 700,
                  color: T.text,
                  lineHeight: 1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                <CountUp target={s.value} trigger={cardIdx} />
                {s.label === "Food Cost %" && "%"}
              </div>
            </div>
          ))}
        </div>

        {/* ── AI ANALYSIS CARD ── */}
        <div
          style={{
            ...cardShell,
            padding: "13px 14px",
            animation: "ag-pop .6s .93s both",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: 8,
              minHeight: 18,
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: 8, minWidth: 0 }}>
              <span
                style={{
                  color: T.purple,
                  display: "flex",
                  alignItems: "center",

                  flexShrink: 0,
                }}
              >
                <svg width="15" height="15" viewBox="0 0 16 16" fill="currentColor">
                  <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 14l-1.5-4.5L2 7l4.5-1.5z" />
                </svg>
              </span>
              <span style={{ fontSize: 13, fontWeight: 600, color: T.text, lineHeight: 1 }}>
                PlatePielet AI · Analysis
              </span>
            </div>
            <span
              style={{
                display: "inline-flex",
                alignItems: "center",
                gap: 3,
                flexShrink: 0,
              }}
            >
              {[0, 0.22, 0.44].map((d, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-block",
                    width: 3,
                    height: 3,
                    borderRadius: "50%",
                    background: T.faint,
                    animation: `ag-dots 1.4s ${d}s infinite`,
                  }}
                />
              ))}
            </span>
          </div>

          {/* Continuous paragraph streaming — wraps naturally into ~3 lines */}
          <div style={{ display: "flex", alignItems: "flex-start", gap: 6, marginTop: 10 }}>
            <div
              style={{
                flex: 1,
                fontSize: 12.5,
                color: T.muted,
                lineHeight: 1.6,
                wordBreak: "break-word",
                overflow: "hidden",
                height: 60,
              }}
            >
              <StreamingText text={AI_LINE_SETS[aiIdx]} trigger={aiIdx} onComplete={onAiComplete} />
              <span
                style={{
                  display: "inline-block",
                  width: 1.5,
                  height: 10,
                  background: T.accent,
                  marginLeft: 1,
                  verticalAlign: "middle",
                  animation: "ag-blink 1s steps(1) infinite",
                }}
              />
            </div>
          </div>
        </div>

        {/* ── SMALL STAT ROW ── */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
            gap: DASH_GAP,
          }}
        >
          {SMALL_STATS.map((s) => (
            <div
              key={s.label}
              style={{
                ...cardShell,
                padding: "11px 12px",
                minHeight: 58,
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                animation: `ag-pop .6s ${s.delay} both`,
              }}
            >
              <div
                style={{
                  fontSize: 18,
                  fontWeight: 700,
                  color: s.color,
                  letterSpacing: "-.01em",
                  lineHeight: 1.1,
                  fontVariantNumeric: "tabular-nums",
                }}
              >
                {s.val}
              </div>
              <div style={{ fontSize: 10.5, color: T.faint2, marginTop: 3, lineHeight: 1.2 }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── Component ────────────────────────────────────────────────────────────────
export function PlatePieletHero() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const mobileWrapRef = useRef<HTMLDivElement>(null);
  const mobileStageRef = useRef<HTMLDivElement>(null);
  const [aiIdx, setAiIdx] = useState(0);
  const [cardIdx, setCardIdx] = useState(0);
  const isMobile = useIsMobile();

  // Scale fixed-pixel stage(s) to viewport. Desktop scales the full 1225-wide
  // stage; mobile scales just the HALF-wide animated dashboard (copy renders
  // as plain responsive text instead, see below).
  useEffect(() => {
    const resize = () => {
      const wrap = wrapRef.current;
      const stage = stageRef.current;
      if (wrap && stage) {
        const ratio = Math.min(1, wrap.clientWidth / LAYOUT.stage);
        stage.style.transform = `scale(${ratio})`;
        wrap.style.height = `${STAGE_H * ratio}px`;
      }
      const mWrap = mobileWrapRef.current;
      const mStage = mobileStageRef.current;
      if (mWrap && mStage) {
        const ratio = Math.min(1, mWrap.clientWidth / HALF);
        mStage.style.transform = `scale(${ratio})`;
        mWrap.style.height = `${STAGE_H * ratio}px`;
      }
    };
    resize();
    // Observe the wrappers too: inside the Ionic shell the page can mount
    // before layout, so the initial measurement may be 0-width.
    const observer = new ResizeObserver(resize);
    if (wrapRef.current) observer.observe(wrapRef.current);
    if (mobileWrapRef.current) observer.observe(mobileWrapRef.current);
    window.addEventListener("resize", resize);
    return () => {
      observer.disconnect();
      window.removeEventListener("resize", resize);
    };
  }, [isMobile]);

  // AI cycle: advance only after streaming finishes + 800ms pause
  const aiPauseRef = useRef<ReturnType<typeof setTimeout>>(undefined);
  const handleAiComplete = () => {
    aiPauseRef.current = setTimeout(() => setAiIdx((i) => (i + 1) % AI_LINE_SETS.length), 800);
  };
  useEffect(() => () => clearTimeout(aiPauseRef.current), []);

  // Alert card auto-rotate
  useEffect(() => {
    const id = setInterval(() => setCardIdx((i) => (i + 1) % ALERT_CARDS.length), 3500);
    return () => clearInterval(id);
  }, []);

  const card = ALERT_CARDS[cardIdx];
  const stats = CARD_STATS[cardIdx];

  return (
    <section
      className="pp-hero"
      style={{
        position: "relative",
        width: "100%",
        overflow: "hidden",
        fontFamily: "'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif",
        color: T.text,
        background: `radial-gradient(900px 520px at 72% 28%, rgba(22,163,74,0.1), transparent 58%),
                     radial-gradient(700px 400px at 18% 80%, rgba(163,230,53,0.07), transparent 55%),
                     ${T.bg}`,
        borderBottom: `1px solid ${T.border}`,
        ["--hero-pad" as string]: `clamp(20px, 3vw, ${LAYOUT.pad}px)`,
      }}
    >
      <style>{`
        .pp-hero__inset {
          max-width: ${LAYOUT.max}px;
          margin-inline: auto;
          padding-inline: var(--hero-pad);
        }
        .pp-hero__stage {
          position: absolute; left: 0; top: 0;
          width: ${LAYOUT.stage}px; height: ${STAGE_H}px;
          transform-origin: top left;
        }
        .pp-hero__copy {
          position: absolute;
          left: ${COPY_LEFT}px; top: 88px;
          width: ${COPY_WIDTH}px;
          max-width: calc(50% - ${COPY_LEFT + 12}px);
        }
        .pp-hero__anim {
          position: absolute;
          left: 50%; top: 0; width: 50%; height: 100%;
        }
        .pp-btn-solid {
          background: ${T.gradientCTA};
          box-shadow: 0 4px 14px rgba(15,122,76,0.28);
          transition: box-shadow .2s ease, transform .15s ease;
        }
        .pp-btn-solid:hover {
          box-shadow: 0 10px 26px rgba(15,122,76,0.38), inset 0 1px 0 rgba(255,255,255,0.18);
          transform: translateY(-1px);
        }

        @keyframes ag-up      { from{opacity:0;transform:translateY(14px)} to{opacity:1;transform:none} }
        @keyframes ag-pop     { from{opacity:0;transform:translateY(10px) scale(.97)} to{opacity:1;transform:none} }
        @keyframes ag-fadein  { from{opacity:0;transform:translateY(20px)} to{opacity:1;transform:translateY(0)} }
        @keyframes ag-float   { from{transform:translateY(0)} to{transform:translateY(-8px)} }
        @keyframes ag-node    { 0%,100%{box-shadow:0 0 0 5px rgba(0,0,0,0),0 0 14px ${T.accentGlow}} 50%{box-shadow:0 0 0 9px rgba(34,197,94,.14),0 0 28px ${T.accentGlow}} }
        @keyframes ag-scroll { from{transform:translate3d(0,0,0)} to{transform:translate3d(0,-${SCROLL_DISTANCE}px,0)} }
        @keyframes ag-shimmer { 0%{background-position:-200px 0} 100%{background-position:220px 0} }
        @keyframes ag-dots    { 0%,20%{opacity:.2} 50%{opacity:1} 80%,100%{opacity:.2} }
        @keyframes ag-bell    { 0%,88%,100%{transform:rotate(0)} 90%{transform:rotate(12deg)} 92%{transform:rotate(-9deg)} 94%{transform:rotate(5deg)} }
        @keyframes ag-blink   { 0%,49%{opacity:1} 50%,100%{opacity:0} }

        @media (prefers-reduced-motion: reduce) {
          * { animation-duration:.001s!important; animation-iteration-count:1!important; }
        }
      `}</style>

      {/* Dot-grid overlay */}
      <div
        style={{
          position: "absolute",
          inset: 0,
          backgroundImage:
            "linear-gradient(rgba(21,32,25,.2) 1px,transparent 1px),linear-gradient(90deg,rgba(21,32,25,.2) 1px,transparent 1px)",
          backgroundSize: "60px 60px",
          opacity: 0.045,
          pointerEvents: "none",
        }}
      />

      {/* ── MOBILE: plain responsive copy, no scaled canvas, no decorative dashboard ── */}
      {isMobile && (
        <div className="pp-hero__inset" style={{ paddingTop: 24, paddingBottom: 56 }}>
          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(28px, 8vw, 40px)",
              lineHeight: 1.15,
              letterSpacing: "-.03em",
              margin: 0,
              color: T.text,
              animation: "ag-up .7s .1s both",
            }}
          >
            Control <span style={gradientClip(T.gradientA)}>Food Cost</span>, Inventory, Procurement
            &amp; <span style={gradientClip(T.gradientB)}>Wastage</span> — All in One Place.
          </h1>
          <p
            style={{
              fontSize: 15.5,
              lineHeight: 1.7,
              color: T.muted,
              margin: "16px 0 0",
              animation: "ag-up .7s .22s both",
            }}
          >
            PlatePielet unifies your POS sales, purchases, and stock into one live view — so you
            catch cost leakage before it eats your margin, with Pilot AI flagging what needs
            attention today.
          </p>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 12,
              marginTop: 24,
              flexWrap: "wrap",
              animation: "ag-up .7s .32s both",
            }}
          >
            <a href="/demo" className="pp-btn-solid" style={{ ...btnSolidLg, flex: "1 1 auto" }}>
              Book a Demo
            </a>
            <a href={SALES_PHONE_HREF} style={{ ...btnOutlineLg, flex: "1 1 auto" }}>
              Call {SALES_PHONE}
            </a>
          </div>
        </div>
      )}

      {/* ── MOBILE: animated dashboard mockup, scaled to fit width, below the copy ── */}
      {isMobile && (
        <div className="pp-hero__inset" style={{ paddingBottom: 40 }}>
          {/* Same unpadded measuring div as the desktop stage wrapper */}
          <div ref={mobileWrapRef} style={{ position: "relative", width: "100%", height: STAGE_H }}>
            <div
              ref={mobileStageRef}
              style={{
                position: "absolute",
                left: 0,
                top: 0,
                width: HALF,
                height: STAGE_H,
                transformOrigin: "top left",
              }}
            >
              {/* Fade-in lives on this inner element, not the scaled one above —
                a CSS animation's transform keyframes would otherwise clobber
                the JS-driven scale() on every frame. */}
              <div
                style={{
                  position: "absolute",
                  inset: 0,
                  animation: "ag-fadein 0.6s 0.2s ease-out both",
                }}
              >
                <AnimatedDashboard
                  card={card}
                  stats={stats}
                  cardIdx={cardIdx}
                  aiIdx={aiIdx}
                  onAiComplete={handleAiComplete}
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── STAGE WRAPPER (desktop/tablet only — fixed-pixel canvas scaled to fit) ── */}
      {!isMobile && (
        <div className="pp-hero__inset">
          {/* Unpadded measuring div: the abs-positioned stage anchors to it so
              it starts at the inset's content edge (abs children ignore the
              inset's padding), keeping the hero flush with the nav */}
          <div ref={wrapRef} style={{ position: "relative", width: "100%", height: STAGE_H }}>
            <div ref={stageRef} className="pp-hero__stage">
              {/* ── LEFT HALF: COPY ── */}
              <section className="pp-hero__copy">
                <h1
                  style={{
                    fontWeight: 800,
                    fontSize: 52,
                    lineHeight: 1.08,
                    letterSpacing: "-.04em",
                    margin: 0,
                    color: T.text,
                    animation: "ag-up .7s .1s both",
                  }}
                >
                  Control <span style={gradientClip(T.gradientA)}>Food Cost</span>, Inventory,
                  <br />
                  Procurement &amp; <span style={gradientClip(T.gradientB)}>Wastage</span>
                  <br />— All in One Place.
                </h1>
                <p
                  style={{
                    fontSize: 17,
                    lineHeight: 1.75,
                    color: T.muted,
                    margin: "20px 0 0",
                    maxWidth: 460,
                    animation: "ag-up .7s .22s both",
                  }}
                >
                  PlatePielet unifies your POS sales, purchases, and stock into one live view — so
                  you catch cost leakage before it eats your margin, with Pilot AI flagging what
                  needs attention today.
                </p>
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: 14,
                    marginTop: 32,
                    animation: "ag-up .7s .32s both",
                  }}
                >
                  <a href="/demo" className="pp-btn-solid" style={btnSolidLg}>
                    Book a Demo
                  </a>
                  <a href={SALES_PHONE_HREF} style={btnOutlineLg}>
                    Call {SALES_PHONE}
                  </a>
                </div>
              </section>

              {/* ── RIGHT HALF: ANIMATED DASHBOARD ── */}
              <div
                className="pp-hero__anim"
                style={{ animation: "ag-fadein 0.6s 0.2s ease-out both" }}
              >
                <AnimatedDashboard
                  card={card}
                  stats={stats}
                  cardIdx={cardIdx}
                  aiIdx={aiIdx}
                  onAiComplete={handleAiComplete}
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
