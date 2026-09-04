import { Link } from "react-router-dom";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import {
  ArrowRight,
  BarChart3,
  ChevronDown,
  ChevronRight,
  Megaphone,
  Sparkles,
  Star,
  Target,
  Trophy,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { T } from "@/components/PlatePieletHero";

const FEATURES: { Icon: LucideIcon; title: string; desc: string }[] = [
  {
    Icon: BarChart3,
    title: "Data that connects",
    desc: "POS sales, food cost, and stock usage in one intelligent view.",
  },
  {
    Icon: Sparkles,
    title: "AI that recommends",
    desc: "Get clear suggestions to promote, reprice, reduce, or reimagine.",
  },
  {
    Icon: Target,
    title: "Impact you can taste",
    desc: "Higher margins, happier guests, smarter kitchens.",
  },
];

const KPIS = [
  { label: "Total Revenue", value: "AED 24.8K", delta: "18.6%", trophy: false },
  { label: "Gross Profit", value: "AED 11.2K", delta: "21.3%", trophy: false },
  { label: "Avg. Profit Margin", value: "45.1%", delta: "2.8pp", trophy: false },
  { label: "Top Performer", value: "Mango Smoothie", delta: null, trophy: true },
] as const;

const QUADS: {
  key: string;
  area: string;
  title: string;
  blurb: string;
  items: string[];
  img: string;
  bg: string;
  accent: string;
  star?: boolean;
}[] = [
  {
    key: "gem",
    area: "tl",
    title: "Hidden Gem",
    blurb: "High profit, low sales. Promote these dishes.",
    items: ["Mutton Sukka", "Pesto Pasta"],
    img: "/hero/menu/pasta.jpg",
    bg: "#E8F6EC",
    accent: "#15803D",
  },
  {
    key: "best",
    area: "tr",
    title: "Best Seller",
    blurb: "High profit, high sales. Keep it front and center.",
    items: ["Mango Smoothie", "Paneer Wrap"],
    img: "/hero/menu/smoothie.jpg",
    bg: "#EAF7EE",
    accent: "#16A34A",
    star: true,
  },
  {
    key: "low",
    area: "bl",
    title: "Low Performer",
    blurb: "Low profit, low sales. Rework or consider removing.",
    items: ["Falafel Platter", "Iced Tea"],
    img: "/hero/menu/falafel.jpg",
    bg: "#FDECEC",
    accent: "#DC2626",
  },
  {
    key: "work",
    area: "br",
    title: "Workhorse",
    blurb: "Low profit, high sales. Optimise cost & portion.",
    items: ["Chicken Tikka Pizza", "French Fries"],
    img: "/hero/menu/pizza.jpg",
    bg: "#FFF4E8",
    accent: "#EA580C",
  },
];

const ACTIONS: { Icon: LucideIcon; label: string; count: string; tint: string; color: string }[] = [
  { Icon: Megaphone, label: "Promote", count: "3 dishes", tint: "#E8F7ED", color: "#15803D" },
  { Icon: BarChart3, label: "Reprice", count: "2 dishes", tint: "#EEF2FF", color: "#4F46E5" },
  { Icon: Sparkles, label: "Optimise", count: "4 ideas", tint: "#FEF3C7", color: "#D97706" },
  { Icon: Target, label: "Review", count: "2 dishes", tint: "#FEE2E2", color: "#DC2626" },
];

const OPPORTUNITIES = [
  { name: "Mango Smoothie", lift: "+AED 2.1K" },
  { name: "Paneer Wrap", lift: "+AED 1.6K" },
  { name: "Pesto Pasta", lift: "+AED 1.2K" },
];

function BasilLeaf({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden
      style={flip ? { transform: "scaleX(-1)" } : undefined}
    >
      <path
        d="M24 2C14 14 6 28 8 44c2 12 10 18 16 18s14-6 16-18C42 28 34 14 24 2Z"
        fill="#2F9E4A"
        opacity="0.92"
      />
      <path
        d="M24 8c0 14-1 28-1 42"
        stroke="#1B6B32"
        strokeWidth="1.4"
        strokeLinecap="round"
        opacity="0.55"
      />
      <path
        d="M24 22c-6 4-10 10-12 16M24 30c6 4 9 9 11 14"
        stroke="#1B6B32"
        strokeWidth="1.1"
        strokeLinecap="round"
        opacity="0.4"
      />
    </svg>
  );
}

export function MenuEngineeringSection({ visible }: { visible: boolean }) {
  return (
    <section className={`me reveal${visible ? " show" : ""}`}>
      <style>{`
        .me {
          position: relative;
          background: #F4F6F4;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
          overflow: visible;
        }
        .me__inner {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 40px 48px;
        }
        .me__grid {
          display: grid;
          grid-template-columns: minmax(280px, 0.88fr) minmax(0, 1.62fr);
          gap: clamp(24px, 3.5vw, 40px);
          align-items: start;
        }

        .me__logo {
          display: inline-flex;
          align-items: baseline;
          gap: 0;
          margin-bottom: 22px;
          font-size: 22px;
          font-weight: 800;
          letter-spacing: -0.04em;
          color: ${T.accent};
          line-height: 1;
          text-decoration: none;
        }
        .me__logo span {
          color: ${T.accent};
        }
        .me__logo em {
          font-style: normal;
          margin-left: 1px;
        }

        .me__tag {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.2em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 12px;
        }
        .me__tag::before {
          content: '';
          width: 2px;
          height: 12px;
          background: ${T.accent};
          flex-shrink: 0;
        }
        .me__h2 {
          font-size: clamp(30px, 3.8vw, 44px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.05;
          margin: 0 0 14px;
          color: ${T.text};
        }
        .me__lede {
          margin: 0 0 26px;
          font-size: 14.5px;
          line-height: 1.7;
          color: ${T.muted};
          max-width: 390px;
        }
        .me__feats {
          display: flex;
          flex-direction: column;
          gap: 18px;
          margin-bottom: 28px;
        }
        .me__feat {
          display: grid;
          grid-template-columns: 42px 1fr;
          gap: 14px;
          align-items: start;
        }
        .me__feat-ico {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: #E7F6EC;
          color: ${T.accentSolid};
          display: grid;
          place-items: center;
        }
        .me__feat strong {
          display: block;
          font-size: 15px;
          font-weight: 800;
          color: ${T.accentSolid};
          margin-bottom: 3px;
          letter-spacing: -0.01em;
        }
        .me__feat p {
          margin: 0;
          font-size: 13.5px;
          line-height: 1.5;
          color: ${T.muted};
        }

        .me__insight-row {
          display: flex;
          align-items: flex-end;
          gap: 8px;
          max-width: 420px;
        }
        .me__mascot {
          width: 78px;
          height: auto;
          flex-shrink: 0;
          filter: drop-shadow(0 10px 16px rgba(0,0,0,0.14));
          margin-bottom: -2px;
        }
        .me__insight {
          flex: 1;
          min-width: 0;
          padding: 14px 16px;
          border: 1.5px solid rgba(22,163,74,0.45);
          border-radius: 14px;
          background: #fff;
          box-shadow: 0 10px 24px rgba(7,26,20,0.07);
        }
        .me__insight-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.1em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 6px;
        }
        .me__insight p {
          margin: 0;
          font-size: 13px;
          line-height: 1.5;
          color: ${T.muted};
        }

        /* Dashboard stage */
        .me__dash-wrap {
          position: relative;
          min-width: 0;
          display: flex;
          flex-direction: column;
          padding: 0;
        }
        .me__dash {
          position: relative;
          z-index: 2;
          display: flex;
          flex-direction: column;
          gap: 12px;
          background: #fff;
          border: 1px solid rgba(21,32,25,0.07);
          border-radius: 24px;
          box-shadow:
            0 4px 8px rgba(7,26,20,0.03),
            0 24px 60px rgba(7,26,20,0.12);
          padding: 18px 16px 14px;
        }
        .me__dash-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 12px;
          padding: 0 2px;
        }
        .me__dash-head h3 {
          margin: 0;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.02em;
        }
        .me__filter {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          font-size: 12px;
          font-weight: 600;
          color: ${T.muted};
          background: #F6F8F7;
          border: 1px solid rgba(21,32,25,0.08);
          border-radius: 8px;
          padding: 6px 10px;
        }

        .me__kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 0;
        }
        .me__kpi {
          background: #F7FAF8;
          border: 1px solid rgba(21,32,25,0.06);
          border-radius: 12px;
          padding: 10px 11px;
          min-width: 0;
        }
        .me__kpi-lab {
          font-size: 9.5px;
          font-weight: 700;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          color: ${T.muted};
          margin-bottom: 4px;
        }
        .me__kpi-val {
          display: flex;
          align-items: center;
          gap: 5px;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: ${T.text};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .me__kpi-val svg {
          color: #CA8A04;
          flex-shrink: 0;
        }
        .me__kpi-delta {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          margin-top: 5px;
          font-size: 10.5px;
          font-weight: 700;
          color: ${T.accentSolid};
          background: rgba(22,163,74,0.12);
          border-radius: 999px;
          padding: 2px 7px;
        }

        .me__body {
          display: grid;
          grid-template-columns: minmax(0, 1.58fr) minmax(168px, 0.52fr);
          gap: 10px;
          align-items: stretch;
        }

        .me__matrix-wrap {
          display: grid;
          grid-template-columns: 18px minmax(0, 1fr);
          grid-template-rows: minmax(0, 1fr) auto;
          column-gap: 8px;
          row-gap: 6px;
          min-width: 0;
          min-height: 340px;
        }
        .me__axis-y {
          grid-column: 1;
          grid-row: 1;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: space-between;
          padding: 4px 0;
          pointer-events: none;
        }
        .me__axis-y-lab {
          writing-mode: vertical-rl;
          transform: rotate(180deg);
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: ${T.muted};
        }
        .me__axis-y-end {
          font-size: 8px;
          font-weight: 700;
          color: ${T.muted};
          letter-spacing: 0.02em;
          writing-mode: vertical-rl;
          transform: rotate(180deg);
        }
        .me__axis-x {
          grid-column: 2;
          grid-row: 2;
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 0 4px;
          font-size: 8.5px;
          font-weight: 800;
          letter-spacing: 0.12em;
          text-transform: uppercase;
          color: ${T.muted};
        }
        .me__matrix {
          grid-column: 2;
          grid-row: 1;
          display: grid;
          grid-template-columns: 1fr 1fr;
          grid-template-rows: 1fr 1fr;
          grid-template-areas: "tl tr" "bl br";
          gap: 8px;
          min-height: 0;
        }
        .me__quad {
          position: relative;
          border-radius: 14px;
          padding: 12px 12px 10px;
          display: flex;
          flex-direction: column;
          min-height: 0;
          overflow: hidden;
          border: 1px solid rgba(21,32,25,0.04);
        }
        .me__quad[data-area="tl"] { grid-area: tl; }
        .me__quad[data-area="tr"] { grid-area: tr; }
        .me__quad[data-area="bl"] { grid-area: bl; }
        .me__quad[data-area="br"] { grid-area: br; }
        .me__quad-title {
          font-size: 11.5px;
          font-weight: 800;
          letter-spacing: 0.05em;
          text-transform: uppercase;
          margin-bottom: 4px;
        }
        .me__quad-blurb {
          font-size: 11px;
          line-height: 1.4;
          color: ${T.muted};
          margin: 0 0 10px;
          max-width: 72%;
        }
        .me__quad-items {
          list-style: none;
          margin: 0;
          padding: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
          position: relative;
          z-index: 1;
        }
        .me__quad-items li {
          font-size: 12.5px;
          font-weight: 700;
          color: ${T.text};
        }
        .me__quad-img {
          position: absolute;
          right: 10px;
          bottom: 10px;
          width: 62px;
          height: 62px;
          border-radius: 50%;
          object-fit: cover;
          border: 2.5px solid #fff;
          box-shadow: 0 6px 14px rgba(0,0,0,0.14);
        }
        .me__quad-star {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 24px;
          height: 24px;
          border-radius: 50%;
          background: ${T.accent};
          color: #fff;
          display: grid;
          place-items: center;
          box-shadow: 0 4px 10px rgba(22,163,74,0.35);
          z-index: 2;
        }

        .me__side {
          display: flex;
          flex-direction: column;
          gap: 10px;
          min-width: 0;
        }
        .me__panel {
          background: #F7FAF8;
          border: 1px solid rgba(21,32,25,0.06);
          border-radius: 14px;
          padding: 12px;
        }
        .me__panel-h {
          font-size: 10.5px;
          font-weight: 800;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          color: ${T.text};
          margin-bottom: 10px;
        }
        .me__action {
          display: flex;
          align-items: center;
          gap: 8px;
          padding: 8px;
          border-radius: 10px;
          background: #fff;
          border: 1px solid rgba(21,32,25,0.06);
          margin-bottom: 6px;
          text-decoration: none;
          color: inherit;
        }
        .me__action:last-child { margin-bottom: 0; }
        .me__action-ico {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .me__action strong {
          display: block;
          font-size: 12px;
          font-weight: 800;
          line-height: 1.2;
        }
        .me__action span {
          font-size: 10.5px;
          color: ${T.muted};
        }
        .me__action svg:last-child {
          margin-left: auto;
          color: ${T.muted};
          flex-shrink: 0;
        }
        .me__opp {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 12px;
          padding: 7px 0;
          border-bottom: 1px solid rgba(21,32,25,0.06);
        }
        .me__opp:last-child { border-bottom: 0; padding-bottom: 0; }
        .me__opp b { color: ${T.accentSolid}; font-weight: 800; white-space: nowrap; }

        /* AI recommendation — full width inside dashboard */
        .me__footer {
          display: flex;
          align-items: center;
          gap: 12px;
          width: 100%;
          min-height: 52px;
          box-sizing: border-box;
          margin-top: 2px;
          padding: 12px 16px;
          background: #EEF9F1;
          border: 1px solid rgba(22,163,74,0.2);
          border-radius: 12px;
        }
        .me__footer-ai {
          width: 28px;
          height: 28px;
          border-radius: 8px;
          background: ${T.accent};
          color: #fff;
          display: grid;
          place-items: center;
          flex-shrink: 0;
          font-size: 10px;
          font-weight: 800;
        }
        .me__footer-copy {
          flex: 1;
          min-width: 0;
          font-size: 12.5px;
          line-height: 1.4;
          color: ${T.text};
        }
        .me__footer-copy strong {
          font-weight: 800;
        }
        .me__footer-link {
          display: inline-flex;
          align-items: center;
          gap: 4px;
          font-size: 12px;
          font-weight: 700;
          color: ${T.accentSolid};
          text-decoration: none;
          white-space: nowrap;
          flex-shrink: 0;
        }

        /* Decorative frame below dashboard — absolute only */
        .me__decor {
          position: relative;
          z-index: 4;
          height: clamp(148px, 16vw, 176px);
          margin-top: 10px;
          pointer-events: none;
        }
        .me__float {
          position: absolute;
          pointer-events: none;
          filter: drop-shadow(0 14px 24px rgba(0,0,0,0.16));
        }
        .me__float img {
          width: 100%;
          height: auto;
          display: block;
        }
        .me__float--plate img {
          border-radius: 50%;
        }
        .me__float--pasta {
          left: clamp(-28px, -2.5vw, -8px);
          bottom: 8px;
          width: clamp(112px, 13vw, 136px);
          z-index: 5;
        }
        .me__float--brownie {
          right: clamp(-24px, -2vw, -4px);
          bottom: 8px;
          width: clamp(112px, 13vw, 136px);
          z-index: 5;
        }
        .me__leaf {
          position: absolute;
          z-index: 6;
          pointer-events: none;
          filter: drop-shadow(0 4px 6px rgba(0,0,0,0.12));
        }
        .me__float--pasta .me__leaf,
        .me__float--brownie .me__leaf {
          position: absolute;
          width: 22px;
          z-index: 6;
        }
        .me__float--pasta .me__leaf {
          top: 8px;
          right: -4px;
          transform: rotate(-36deg);
        }
        .me__float--brownie .me__leaf {
          top: 10px;
          left: -4px;
          width: 20px;
          transform: rotate(48deg);
        }

        .me__hand {
          position: absolute;
          right: clamp(100px, 15vw, 156px);
          bottom: clamp(18px, 2.5vw, 36px);
          z-index: 6;
          font-family: 'Caveat', cursive;
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          color: ${T.accentSolid};
          transform: rotate(-6deg);
          pointer-events: none;
          line-height: 1.05;
          white-space: nowrap;
          text-align: left;
        }
        .me__hand small {
          display: block;
          position: relative;
        }
        .me__hand svg {
          display: block;
          width: 148px;
          height: 10px;
          margin-top: -2px;
          margin-left: 4px;
        }

        @media (max-width: 1280px) {
          .me__matrix-wrap { min-height: 320px; }
          .me__decor { height: clamp(140px, 15vw, 160px); }
        }
        @media (max-width: 1100px) {
          .me__kpis { grid-template-columns: 1fr 1fr; }
          .me__body { grid-template-columns: 1fr; }
          .me__side { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; }
          .me__float--pasta,
          .me__float--brownie { width: clamp(100px, 13vw, 118px); }
          .me__matrix-wrap { min-height: 280px; }
          .me__hand { font-size: 20px; right: clamp(88px, 13vw, 120px); }
          .me__decor { height: 140px; margin-top: 8px; }
        }
        @media (max-width: 1024px) {
          .me__inner { padding: 48px 28px 40px; }
          .me__float--pasta { left: -12px; width: 104px; }
          .me__float--brownie { right: -8px; width: 104px; }
          .me__hand { right: 84px; bottom: 20px; }
          .me__decor { height: 128px; }
        }
        @media (max-width: 900px) {
          .me__inner { padding: 48px 20px 72px; }
          .me__grid { grid-template-columns: 1fr; gap: 28px; }
          .me__dash-wrap { padding: 0; }
          .me__decor { display: none; }
          .me__side { grid-template-columns: 1fr; }
          .me__logo { font-size: 20px; }
        }
        @media (max-width: 560px) {
          .me__kpis { grid-template-columns: 1fr; }
          .me__matrix-wrap {
            grid-template-columns: 14px minmax(0, 1fr);
            min-height: 0;
          }
          .me__matrix {
            grid-template-columns: 1fr;
            grid-template-areas: "tl" "tr" "bl" "br";
          }
          .me__quad { min-height: 148px; }
          .me__footer {
            flex-wrap: wrap;
            row-gap: 8px;
          }
          .me__footer-link { width: 100%; justify-content: flex-end; }
          .me__insight-row { flex-direction: column; align-items: flex-start; }
          .me__h2 { font-size: 28px; }
        }
      `}</style>

      <div className="me__inner">
        <div className="me__grid">
          <div>
            <Link to="/" className="me__logo" aria-label="PlatePielet">
              plate pielet<em>.</em>
            </Link>
            <div className="me__tag">Menu Engineering</div>
            <h2 className="me__h2">
              See every dish.
              <br />
              Grow every profit.
            </h2>
            <p className="me__lede">
              PlatePielet&apos;s Menu Engineering shows you what&apos;s working, what&apos;s not, and
              where to focus next — so every menu decision drives more profit.
            </p>

            <div className="me__feats">
              {FEATURES.map(({ Icon, title, desc }) => (
                <div key={title} className="me__feat">
                  <div className="me__feat-ico">
                    <Icon size={18} strokeWidth={1.9} />
                  </div>
                  <div>
                    <strong>{title}</strong>
                    <p>{desc}</p>
                  </div>
                </div>
              ))}
            </div>

            <div className="me__insight-row">
              <img className="me__mascot" src="/hero/hero-mascot.png" alt="" />
              <div className="me__insight">
                <div className="me__insight-tag">
                  <Sparkles size={12} strokeWidth={2.2} />
                  AI Insight
                </div>
                <p>
                  Mango Smoothie is a top performer. Consider featuring it in summer specials.
                </p>
              </div>
            </div>
          </div>

          <div className="me__dash-wrap">
            <div className="me__dash">
              <div className="me__dash-head">
                <h3>Menu Engineering</h3>
                <div className="me__filter">
                  This Month <ChevronDown size={14} strokeWidth={2.2} />
                </div>
              </div>

              <div className="me__kpis">
                {KPIS.map((k) => (
                  <div key={k.label} className="me__kpi">
                    <div className="me__kpi-lab">{k.label}</div>
                    <div className="me__kpi-val">
                      {k.trophy && <Trophy size={14} strokeWidth={2.2} />}
                      {k.value}
                    </div>
                    {k.delta && (
                      <div className="me__kpi-delta">
                        <TrendingUp size={10} strokeWidth={2.6} />
                        {k.delta}
                      </div>
                    )}
                  </div>
                ))}
              </div>

              <div className="me__body">
                <div className="me__matrix-wrap">
                  <div className="me__axis-y" aria-hidden>
                    <span className="me__axis-y-end">High</span>
                    <span className="me__axis-y-lab">Profitability</span>
                    <span className="me__axis-y-end">Low</span>
                  </div>
                  <div className="me__matrix">
                    {QUADS.map((q) => (
                      <div
                        key={q.key}
                        className="me__quad"
                        data-area={q.area}
                        style={{ background: q.bg }}
                      >
                        <div className="me__quad-title" style={{ color: q.accent }}>
                          {q.title}
                        </div>
                        <p className="me__quad-blurb">{q.blurb}</p>
                        <ul className="me__quad-items">
                          {q.items.map((item) => (
                            <li key={item}>{item}</li>
                          ))}
                        </ul>
                        <img className="me__quad-img" src={q.img} alt="" />
                        {q.star && (
                          <div className="me__quad-star" aria-hidden>
                            <Star size={12} strokeWidth={2.4} fill="currentColor" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  <div className="me__axis-x" aria-hidden>
                    <span>Low</span>
                    <span>Menu Sales →</span>
                    <span>High</span>
                  </div>
                </div>

                <div className="me__side">
                  <div className="me__panel">
                    <div className="me__panel-h">Action Center</div>
                    {ACTIONS.map(({ Icon, label, count, tint, color }) => (
                      <Link key={label} to="/demo" className="me__action">
                        <div className="me__action-ico" style={{ background: tint, color }}>
                          <Icon size={14} strokeWidth={2} />
                        </div>
                        <div>
                          <strong>{label}</strong>
                          <span>{count}</span>
                        </div>
                        <ChevronRight size={14} strokeWidth={2.2} />
                      </Link>
                    ))}
                  </div>
                  <div className="me__panel">
                    <div className="me__panel-h">Top Opportunities</div>
                    {OPPORTUNITIES.map((o) => (
                      <div key={o.name} className="me__opp">
                        <span>{o.name}</span>
                        <b>{o.lift}</b>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="me__footer">
                <div className="me__footer-ai">AI</div>
                <div className="me__footer-copy">
                  <strong>Smart Recommendation:</strong> Consider bundling Paneer Wrap with a drink
                  to increase average order value.
                </div>
                <Link to="/demo" className="me__footer-link">
                  View All Recommendations <ArrowRight size={13} strokeWidth={2.4} />
                </Link>
              </div>
            </div>

            <div className="me__decor" aria-hidden>
              <div className="me__float me__float--plate me__float--pasta">
                <img src="/hero/menu/pasta.jpg" alt="" />
                <BasilLeaf className="me__leaf" />
              </div>
              <div className="me__float me__float--plate me__float--brownie">
                <img src="/hero/menu/brownie.jpg" alt="" />
                <BasilLeaf className="me__leaf" flip />
              </div>
              <div className="me__hand">
                Smart menu.
                <small>
                  Stronger margins.
                  <svg viewBox="0 0 148 10" fill="none">
                    <path
                      d="M2 6c18-4 40-5 70-3 28 2 52 3 74 1"
                      stroke="#15803D"
                      strokeWidth="2"
                      strokeLinecap="round"
                    />
                  </svg>
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
