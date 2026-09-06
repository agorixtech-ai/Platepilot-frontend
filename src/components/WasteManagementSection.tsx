import { Link } from "react-router-dom";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import {
  ArrowRight,
  BarChart3,
  CalendarDays,
  Leaf,
  Search,
  TrendingDown,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";
import { T } from "@/components/PlatePieletHero";

const INK = "#152019";
const MUTED = "#5C6B74";
const MINT = "#E8F6EC";
const BORDER = "#E8EEEA";

const PILLARS: { Icon: LucideIcon; title: string; desc: string }[] = [
  {
    Icon: BarChart3,
    title: "Track the true cost",
    desc: "By item, category, branch, and time period.",
  },
  {
    Icon: Search,
    title: "Identify waste patterns",
    desc: "Overproduction, spoilage, excess consumption, and slow-moving stock.",
  },
  {
    Icon: Leaf,
    title: "Actionable recommendations",
    desc: "Clear next steps to reduce waste and improve margins.",
  },
];

const KPIS = [
  { label: "Total Waste Cost", value: "₹12,480", delta: "+18%", up: true, warn: true },
  { label: "Waste % of Purchases", value: "6.8%", delta: "-2.1%", up: false, warn: false },
  { label: "Items at Risk", value: "8", delta: "+33%", up: true, warn: true },
  { label: "Potential Savings", value: "₹4,320", delta: "+28%", up: true, warn: false },
] as const;

const CATEGORIES = [
  { name: "Vegetables", pct: 32, color: "#2FA65A" },
  { name: "Meat & Poultry", pct: 24, color: "#E8483F" },
  { name: "Dairy", pct: 18, color: "#F5B942" },
  { name: "Grains", pct: 12, color: "#F0873F" },
  { name: "Sauces & Condiments", pct: 8, color: "#57C98A" },
  { name: "Other", pct: 6, color: "#7BA7E8" },
] as const;

const ITEMS = [
  { rank: 1, name: "Tomatoes", amount: "₹2,480", pct: 100 },
  { rank: 2, name: "Chicken", amount: "₹1,960", pct: 79 },
  { rank: 3, name: "Lettuce", amount: "₹1,250", pct: 50 },
  { rank: 4, name: "Paneer", amount: "₹980", pct: 40 },
  { rank: 5, name: "Bread", amount: "₹620", pct: 25 },
] as const;

const DONUT = (() => {
  let acc = 0;
  return CATEGORIES.map((c) => {
    const start = acc;
    acc += c.pct;
    return `${c.color} ${start}% ${acc}%`;
  }).join(",");
})();

function Spark({ up, warn }: { up: boolean; warn: boolean }) {
  const color = warn ? "#E8483F" : "#16833C";
  const d = up ? "M1 11 L5 7 L8 9 L13 3" : "M1 3 L5 7 L8 5 L13 11";
  return (
    <svg className="wm-spark" viewBox="0 0 14 14" aria-hidden>
      <path d={d} fill="none" stroke={color} strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export function WasteManagementSection({ visible }: { visible: boolean }) {
  return (
    <section id="waste-management" className={`wm reveal${visible ? " show" : ""}`}>
      <style>{`
        .wm {
          position: relative;
          isolation: isolate;
          z-index: 1;
          overflow: hidden;
          scroll-margin-top: 88px;
          background: linear-gradient(180deg, #F4FAF5 0%, #FFFFFF 72%, #FFFFFF 100%);
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${INK};
        }
        .wm__blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
        }
        .wm__blob--tr {
          right: -120px; top: -80px;
          width: 480px; height: 480px;
          background: #DFF3E4;
          filter: blur(40px);
          opacity: 0.9;
        }
        .wm__blob--mid {
          right: 18%; top: 28%;
          width: 260px; height: 260px;
          background: #DFF3E4;
          filter: blur(36px);
          opacity: 0.7;
        }
        .wm__blob--bl {
          left: -140px; bottom: -160px;
          width: 340px; height: 340px;
          background: #DFF3E4;
          opacity: 0.85;
        }
        .wm__dots {
          position: absolute;
          right: 6%;
          top: 14%;
          width: 168px;
          height: 96px;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(#9EC9A8 1.4px, transparent 1.5px);
          background-size: 14px 12px;
          opacity: 0.15;
        }
        .wm__inner {
          position: relative;
          z-index: 1;
          max-width: 1440px;
          margin: 0 auto;
          padding: 52px 48px 56px;
        }
        .wm__grid {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 460px) 260px;
          column-gap: 40px;
          align-items: start;
        }
        .wm__copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
        }
        .wm__eyebrow {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          margin: 0 0 14px;
          font-size: 12px;
          font-weight: 600;
          letter-spacing: 0.18em;
          text-transform: uppercase;
          color: ${MUTED};
        }
        .wm__eyebrow svg { color: ${T.accentSolid}; }
        .wm__h2 {
          margin: 0 0 18px;
          max-width: 100%;
          font-size: clamp(22px, 1.85vw, 28px);
          font-weight: 800;
          letter-spacing: -0.028em;
          line-height: 1.12;
          color: ${INK};
          white-space: nowrap;
        }
        .wm__lede {
          margin: 0 0 12px;
          max-width: 42ch;
          font-size: 15.5px;
          font-weight: 400;
          line-height: 1.65;
          color: ${MUTED};
        }
        .wm__lede:last-of-type { margin-bottom: 0; }
        .wm__pillars {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 24px;
          width: 100%;
          margin: 28px 0 28px;
        }
        .wm__pillar {
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          min-width: 0;
        }
        .wm__pillar-ico {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: ${MINT};
          color: ${T.accentSolid};
          display: grid;
          place-items: center;
          margin-bottom: 12px;
        }
        .wm__pillar strong {
          margin: 0 0 6px;
          font-size: 14px;
          font-weight: 700;
          color: ${INK};
          line-height: 1.3;
        }
        .wm__pillar span {
          font-size: 13px;
          line-height: 1.5;
          color: ${MUTED};
        }
        .wm__ctas {
          display: flex;
          flex-wrap: nowrap;
          align-items: center;
          gap: 14px;
        }
        .wm__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 12px 22px;
          border-radius: 10px;
          font-size: 14px;
          font-weight: 600;
          line-height: 1;
          white-space: nowrap;
          transition: transform 0.2s ease, background 0.2s ease;
        }
        .wm__cta--primary {
          background: ${T.accentSolid};
          color: #fff !important;
        }
        .wm__cta--primary:hover { background: #0A5428; }
        .wm__cta--ghost {
          background: transparent;
          color: ${T.accentSolid} !important;
          border: 1.5px solid ${T.accentSolid};
        }
        .wm__cta--ghost:hover { background: ${MINT}; }

        .wm__stage {
          position: relative;
          min-width: 0;
          display: flex;
          justify-content: center;
          padding-top: 30px;
        }
        .wm__dash {
          position: relative;
          z-index: 2;
          width: 100%;
          max-width: 460px;
          min-width: 0;
          background: #fff;
          border: 1px solid rgba(21,128,61,0.08);
          border-radius: 18px;
          box-shadow: 0 12px 40px rgba(16,60,35,0.08);
          padding: 12px;
        }
        .wm__dash-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 10px;
        }
        .wm__dash-head strong {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: ${INK};
        }
        .wm__dash-head strong svg { color: ${T.accentSolid}; flex-shrink: 0; }
        .wm__date {
          display: inline-flex;
          align-items: center;
          gap: 6px;
          flex-shrink: 0;
          font-size: 12px;
          font-weight: 500;
          color: ${MUTED};
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 999px;
          padding: 6px 10px;
          white-space: nowrap;
        }
        .wm__kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 8px;
          margin-bottom: 8px;
        }
        .wm__kpi {
          min-width: 0;
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 12px;
          padding: 8px 8px 7px;
        }
        .wm__kpi span {
          display: block;
          font-size: 10px;
          font-weight: 500;
          color: ${MUTED};
          line-height: 1.25;
        }
        .wm__kpi b {
          display: block;
          margin: 4px 0 2px;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: -0.03em;
          color: ${INK};
        }
        .wm__kpi-row {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 11px;
          font-weight: 600;
        }
        .wm__kpi-row[data-warn="true"] { color: #E8483F; }
        .wm__kpi-row[data-warn="false"] { color: #16833C; }
        .wm-spark { width: 28px; height: 14px; margin-left: auto; }
        .wm__split {
          display: grid;
          grid-template-columns: minmax(0, 1.05fr) minmax(0, 0.95fr);
          gap: 8px;
        }
        .wm__panel {
          min-width: 0;
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 14px;
          padding: 10px;
        }
        .wm__panel h3 {
          margin: 0 0 8px;
          font-size: 12px;
          font-weight: 700;
          color: ${INK};
        }
        .wm__donut-wrap {
          display: grid;
          grid-template-columns: 88px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
        }
        .wm__donut {
          position: relative;
          isolation: isolate;
          width: 88px;
          height: 88px;
          border-radius: 50%;
          background: conic-gradient(${DONUT});
        }
        .wm__donut::after {
          content: "";
          position: absolute;
          inset: 22px;
          z-index: 0;
          background: #fff;
          border-radius: 50%;
        }
        .wm__donut-lab {
          position: absolute;
          inset: 0;
          z-index: 1;
          display: grid;
          place-content: center;
          text-align: center;
          pointer-events: none;
        }
        .wm__donut-lab b { font-size: 11px; font-weight: 800; color: ${INK}; }
        .wm__donut-lab em {
          font-style: normal;
          font-size: 8px;
          font-weight: 500;
          color: ${MUTED};
        }
        .wm__legend {
          display: flex;
          flex-direction: column;
          gap: 5px;
          min-width: 0;
        }
        .wm__legend i {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          font-size: 11px;
          font-weight: 500;
          font-style: normal;
          color: ${MUTED};
        }
        .wm__legend i span:first-child {
          display: flex;
          align-items: center;
          gap: 6px;
          min-width: 0;
        }
        .wm__swatch {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .wm__item {
          display: grid;
          grid-template-columns: 14px minmax(0, 1fr) auto;
          align-items: center;
          column-gap: 8px;
          row-gap: 3px;
          margin-bottom: 6px;
          font-size: 11px;
        }
        .wm__item:last-child { margin-bottom: 0; }
        .wm__item b { font-weight: 600; color: ${MUTED}; }
        .wm__item em { font-style: normal; font-weight: 600; color: ${INK}; }
        .wm__bar {
          grid-column: 2 / 3;
          height: 3px;
          border-radius: 99px;
          background: #EDF2EF;
          overflow: hidden;
        }
        .wm__bar i {
          display: block;
          height: 100%;
          background: #E8483F;
          border-radius: 99px;
        }

        .wm__art {
          position: relative;
          z-index: 3;
          align-self: end;
          width: 260px;
          margin: 28px -12px -12px 8px;
          pointer-events: none;
        }
        .wm__art-img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 16px 24px rgba(15,42,28,0.14));
        }
        .wm__hand {
          position: absolute;
          left: 42%;
          top: -34px;
          z-index: 5;
          font-family: 'Caveat', cursive;
          font-size: 20px;
          font-weight: 700;
          color: ${T.accentSolid};
          transform: rotate(-8deg);
          line-height: 1.15;
          max-width: 148px;
        }
        .wm__hand svg {
          display: block;
          width: 72px;
          height: 16px;
          margin: 2px 0 0 42px;
        }

        @media (max-width: 1280px) {
          .wm__inner { padding: 48px 36px 48px; }
          .wm__grid { grid-template-columns: minmax(0, 1fr) minmax(0, 420px) 220px; column-gap: 28px; }
          .wm__art { width: 220px; }
          .wm__dash { max-width: 420px; }
          .wm__h2 { font-size: clamp(22px, 2.1vw, 26px); }
        }
        @media (max-width: 1024px) {
          .wm__grid { grid-template-columns: minmax(0, 0.95fr) minmax(0, 1.05fr); column-gap: 28px; }
          .wm__art { display: none; }
          .wm__stage { padding-top: 8px; }
        }
        @media (max-width: 900px) {
          .wm__inner { padding: 44px 24px 40px; }
          .wm__grid { grid-template-columns: 1fr; gap: 28px; }
          .wm__dash { max-width: none; }
        }
        @media (max-width: 720px) {
          .wm__pillars { grid-template-columns: 1fr; gap: 20px; }
          .wm__kpis, .wm__split { grid-template-columns: 1fr 1fr; }
          .wm__ctas { flex-wrap: wrap; }
          .wm__blob, .wm__dots { display: none; }
        }
        @media (max-width: 520px) {
          .wm__kpis, .wm__split { grid-template-columns: 1fr; }
          .wm__donut-wrap { grid-template-columns: 1fr; justify-items: center; }
        }
      `}</style>

      <div className="wm__blob wm__blob--tr" aria-hidden />
      <div className="wm__blob wm__blob--mid" aria-hidden />
      <div className="wm__blob wm__blob--bl" aria-hidden />
      <div className="wm__dots" aria-hidden />

      <div className="wm__inner">
        <div className="wm__grid">
          <div className="wm__copy">
            <div className="wm__eyebrow">
              <BarChart3 size={16} strokeWidth={2.3} />
              Waste Management
            </div>
            <h2 className="wm__h2">
              See Where Waste
              <br />
              Happens. Understand
              <br />
              Why. Reduce It.
            </h2>
            <p className="wm__lede">
              PlatePielet gives you a clear view of where food and inventory waste is happening,
              what it is costing your business, and how to reduce it.
            </p>
            <p className="wm__lede">
              By connecting stock movements, consumption, sales, and wastage data, PlatePielet helps
              you identify patterns, investigate unusual losses, and take action before waste
              impacts profitability.
            </p>
            <div className="wm__pillars">
              {PILLARS.map(({ Icon, title, desc }) => (
                <div key={title} className="wm__pillar">
                  <span className="wm__pillar-ico">
                    <Icon size={18} strokeWidth={2.1} />
                  </span>
                  <strong>{title}</strong>
                  <span>{desc}</span>
                </div>
              ))}
            </div>
            <div className="wm__ctas">
              <Link to="/demo" className="wm__cta wm__cta--primary">
                Book a Demo <ArrowRight size={15} strokeWidth={2.4} />
              </Link>
              <Link to="/product" className="wm__cta wm__cta--ghost">
                Explore All Features
              </Link>
            </div>
          </div>

          <div className="wm__stage">
            <div className="wm__dash">
              <div className="wm__dash-head">
                <strong>
                  <Leaf size={16} strokeWidth={2.3} />
                  Waste Overview
                </strong>
                <span className="wm__date">
                  <CalendarDays size={12} strokeWidth={2.2} />
                  1 Sep 2024 - 30 Sep 2024
                </span>
              </div>
              <div className="wm__kpis">
                {KPIS.map((k) => (
                  <div key={k.label} className="wm__kpi">
                    <span>{k.label}</span>
                    <b>{k.value}</b>
                    <div className="wm__kpi-row" data-warn={k.warn}>
                      {k.up ? (
                        <TrendingUp size={11} strokeWidth={2.6} />
                      ) : (
                        <TrendingDown size={11} strokeWidth={2.6} />
                      )}
                      {k.delta}
                      <Spark up={k.up} warn={k.warn} />
                    </div>
                  </div>
                ))}
              </div>
              <div className="wm__split">
                <div className="wm__panel">
                  <h3>Waste by Category</h3>
                  <div className="wm__donut-wrap">
                    <div className="wm__donut" aria-hidden>
                      <div className="wm__donut-lab">
                        <b>₹12,480</b>
                        <em>Total Waste</em>
                      </div>
                    </div>
                    <div className="wm__legend">
                      {CATEGORIES.map((c) => (
                        <i key={c.name}>
                          <span>
                            <span className="wm__swatch" style={{ background: c.color }} />
                            {c.name}
                          </span>
                          <b>{c.pct}%</b>
                        </i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="wm__panel">
                  <h3>Top Waste Items</h3>
                  {ITEMS.map((item) => (
                    <div key={item.name} className="wm__item">
                      <b>{item.rank}</b>
                      <span>{item.name}</span>
                      <em>{item.amount}</em>
                      <span className="wm__bar">
                        <i style={{ width: `${item.pct}%` }} />
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          <div className="wm__art" aria-hidden>
            <div className="wm__hand">
              Small changes make a big difference!
              <svg viewBox="0 0 72 16" fill="none">
                <path d="M2 10c14-8 32-10 56 1" stroke="#0E6B32" strokeWidth="1.7" strokeLinecap="round" />
                <path d="M50 4l16 7-12 3" stroke="#0E6B32" strokeWidth="1.7" strokeLinecap="round" />
              </svg>
            </div>
            <img
              className="wm__art-img"
              src="/mascot/waste-analysis-removebg-preview.png"
              alt=""
            />
          </div>
        </div>
      </div>
    </section>
  );
}
