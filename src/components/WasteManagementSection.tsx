import { Link } from "react-router-dom";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import { BarChart3, CalendarDays, ChevronDown, Leaf, Search, type LucideIcon } from "lucide-react";
import { LiveNumber } from "@/components/ui/live-number";
const INK = "#152019";
const MUTED = "#66736B";
const MINT = "#E8F6EC";
const BORDER = "#E8EEEA";
const RED = "#E02424";
const GREEN = "#15803D";

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
  {
    label: "Total Waste Cost",
    live: { value: 12480, commas: true, prefix: "₹" },
    delta: 18,
    deltaDecimals: 0,
    up: true,
    warn: true,
  },
  {
    label: "Waste % of Purchases",
    live: { value: 6.8, decimals: 1, suffix: "%" },
    delta: 2.1,
    deltaDecimals: 1,
    up: false,
    warn: false,
  },
  {
    label: "Items at Risk",
    live: { value: 8 },
    delta: 33,
    deltaDecimals: 0,
    up: true,
    warn: true,
  },
  {
    label: "Potential Savings",
    live: { value: 4320, commas: true, prefix: "₹" },
    delta: 28,
    deltaDecimals: 0,
    up: true,
    warn: false,
  },
] as const;

const CATEGORIES = [
  { name: "Vegetables", pct: 32, color: "#22C55E" },
  { name: "Meat & Poultry", pct: 24, color: "#E56B6B" },
  { name: "Dairy", pct: 18, color: "#F5B942" },
  { name: "Grains", pct: 12, color: "#F0873F" },
  { name: "Sauces & Condiments", pct: 8, color: "#2DD4BF" },
  { name: "Other", pct: 6, color: "#94A3B8" },
] as const;

const ITEMS = [
  { rank: 1, name: "Tomatoes", amount: 2480, pct: 100, img: "/hero/hero-tomatoes2.jpg" },
  { rank: 2, name: "Chicken", amount: 1960, pct: 79, img: "/hero/waste/chicken.jpg" },
  { rank: 3, name: "Lettuce", amount: 1250, pct: 50, img: "/hero/hero-salad.jpg" },
  { rank: 4, name: "Paneer", amount: 980, pct: 40, img: "/hero/hero-paneer.jpg" },
  { rank: 5, name: "Bread", amount: 620, pct: 25, img: "/hero/waste/bread.jpg" },
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
  const color = warn ? RED : GREEN;
  const fill = warn ? "rgba(224,36,36,0.16)" : "rgba(21,128,61,0.16)";
  const line = up
    ? "M0 16 C7 14 11 11 16 8 C22 4.5 28 7 40 2"
    : "M0 3.5 C8 5 12 9 18 11 C25 14 30 9 40 16";
  return (
    <svg className="wm-spark" viewBox="0 0 40 18" aria-hidden>
      <path d={`${line} L40 18 L0 18 Z`} fill={fill} />
      <path d={line} fill="none" stroke={color} strokeWidth="1.7" strokeLinecap="round" />
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
          overflow: hidden;
          scroll-margin-top: 88px;
          background: #FFFFFF;
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
          right: -90px; top: -110px;
          width: 420px; height: 420px;
          background: #DFF3E4;
          opacity: 0.72;
        }
        .wm__blob--tr2 {
          right: 70px; top: -40px;
          width: 260px; height: 260px;
          background: #E7F6EC;
          opacity: 0.85;
        }
        .wm__dots {
          position: absolute;
          right: 28px;
          top: 28px;
          width: 132px;
          height: 88px;
          z-index: 0;
          pointer-events: none;
          background-image: radial-gradient(#B7D4BF 1.35px, transparent 1.45px);
          background-size: 12px 12px;
          opacity: 0.55;
        }
        .wm__inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 56px 40px 52px;
        }
        .wm__grid {
          display: grid;
          grid-template-columns: minmax(0, 0.9fr) minmax(0, 1.2fr);
          column-gap: 12px;
          align-items: start;
        }
        .wm__copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          align-items: flex-start;
          padding-right: 8px;
        }
        .wm__eyebrow {
          display: flex;
          align-items: center;
          gap: 10px;
          margin: 0 0 16px;
          font-size: var(--pp-eyebrow);
          font-weight: 800;
          letter-spacing: var(--pp-eyebrow-track);
          text-transform: uppercase;
          color: ${GREEN};
        }
        .wm__eyebrow::before {
          content: '';
          width: 2px;
          height: 12px;
          background: ${GREEN};
          flex-shrink: 0;
        }
        .wm__h2 {
          margin: 0 0 18px;
          font-size: var(--pp-h2);
          font-weight: 800;
          letter-spacing: var(--pp-h2-track);
          line-height: var(--pp-h2-leading);
          color: ${INK};
        }
        .wm__h2 em {
          font-style: normal;
          color: ${GREEN};
        }
        .wm__lede {
          margin: 0 0 12px;
          max-width: var(--pp-copy-w);
          font-size: var(--pp-lede);
          font-weight: 400;
          line-height: var(--pp-lede-leading);
          color: ${MUTED};
        }
        .wm__lede:last-of-type { margin-bottom: 0; }
        .wm__pillars {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 22px;
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
          border-radius: 10px;
          background: ${MINT};
          color: ${GREEN};
          display: grid;
          place-items: center;
          margin-bottom: 12px;
        }
        .wm__pillar strong {
          margin: 0 0 6px;
          font-size: 14.5px;
          font-weight: 700;
          color: ${INK};
          line-height: 1.3;
        }
        .wm__pillar span {
          font-size: 13px;
          line-height: 1.5;
          color: ${MUTED};
        }
        .wm__stage {
          position: relative;
          min-width: 0;
          min-height: 580px;
          display: flex;
          align-items: center;
          justify-content: flex-start;
          padding: 28px 200px 12px 0;
        }
        .wm__dash {
          position: relative;
          z-index: 3;
          background: #fff;
          border: 1px solid rgba(21,128,61,0.07);
          border-radius: 18px;
          box-shadow:
            0 4px 10px rgba(16,60,35,0.04),
            0 22px 48px rgba(16,60,35,0.12);
          padding: 14px 14px 12px;
          transform: rotate(-4deg);
          transform-origin: 70% 80%;
        }
        .wm__dash-head {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 10px;
          margin-bottom: 12px;
          padding: 0 2px;
        }
        .wm__dash-head strong {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          font-size: 15px;
          font-weight: 700;
          color: ${INK};
        }
        .wm__dash-head strong svg { color: ${GREEN}; flex-shrink: 0; }
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
          margin-bottom: 10px;
        }
        .wm__kpi {
          min-width: 0;
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 12px;
          padding: 9px 9px 7px;
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
          margin: 4px 0 3px;
          font-size: 16px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: ${INK};
        }
        .wm__kpi-row {
          display: flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 600;
        }
        .wm__kpi-row[data-warn="true"] { color: ${RED}; }
        .wm__kpi-row[data-warn="false"] { color: ${GREEN}; }
        .wm-spark { width: 100%; height: 18px; margin-top: 4px; display: block; }
        .wm__split {
          display: grid;
          grid-template-columns: minmax(0, 1.08fr) minmax(0, 0.92fr);
          gap: 8px;
        }
        .wm__panel {
          min-width: 0;
          background: #fff;
          border: 1px solid ${BORDER};
          border-radius: 14px;
          padding: 11px 11px 10px;
        }
        .wm__panel-h {
          display: flex;
          align-items: center;
          justify-content: space-between;
          gap: 8px;
          margin-bottom: 10px;
        }
        .wm__panel h3 {
          margin: 0;
          font-size: 12.5px;
          font-weight: 700;
          color: ${INK};
        }
        .wm__more {
          font-size: 11px;
          font-weight: 600;
          color: ${GREEN} !important;
          white-space: nowrap;
        }
        .wm__donut-wrap {
          display: grid;
          grid-template-columns: 100px minmax(0, 1fr);
          gap: 8px;
          align-items: center;
        }
        .wm__donut {
          position: relative;
          isolation: isolate;
          width: 100px;
          height: 100px;
          border-radius: 50%;
          background: conic-gradient(${DONUT});
          flex-shrink: 0;
        }
        .wm__donut::after {
          content: "";
          position: absolute;
          inset: 24px;
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
        .wm__donut-lab b { font-size: 12px; font-weight: 800; color: ${INK}; letter-spacing: -0.02em; }
        .wm__donut-lab em {
          font-style: normal;
          font-size: 8.5px;
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
          overflow: hidden;
        }
        .wm__legend b { font-weight: 600; color: ${INK}; flex-shrink: 0; }
        .wm__swatch {
          width: 7px; height: 7px;
          border-radius: 50%;
          flex-shrink: 0;
        }
        .wm__item {
          display: grid;
          grid-template-columns: 12px 22px 52px minmax(0, 1fr) auto;
          align-items: center;
          column-gap: 7px;
          margin-bottom: 8px;
          font-size: 11.5px;
        }
        .wm__item:last-child { margin-bottom: 0; }
        .wm__item b { font-weight: 600; color: #8A968F; }
        .wm__item img {
          width: 22px; height: 22px;
          border-radius: 50%;
          object-fit: cover;
          display: block;
        }
        .wm__item em {
          font-style: normal;
          font-weight: 600;
          color: ${INK};
          white-space: nowrap;
        }
        .wm__item-name {
          font-weight: 600;
          color: ${INK};
          overflow: hidden;
          text-overflow: ellipsis;
          white-space: nowrap;
        }
        .wm__bar {
          height: 5px;
          border-radius: 99px;
          background: #F1F5F3;
          overflow: hidden;
        }
        .wm__bar i {
          display: block;
          height: 100%;
          border-radius: 99px;
          background: linear-gradient(90deg, #E02424 0%, #F87171 100%);
        }

        .wm__art {
          position: absolute;
          right: -72px;
          bottom: -28px;
          z-index: 2;
          width: 260px;
          pointer-events: none;
        }
        .wm__art-img {
          width: 100%;
          height: auto;
          display: block;
        }
        .wm__hand {
          position: absolute;
          right: 18px;
          top: 18px;
          bottom: auto;
          z-index: 4;
          width: 188px;
          pointer-events: none;
          font-family: 'Caveat', cursive;
          font-size: 21px;
          font-weight: 700;
          color: ${GREEN};
          transform: rotate(-8deg);
          line-height: 1.12;
        }
        .wm__hand-spark {
          position: absolute;
          left: -20px;
          top: 0;
        }
        .wm__hand-arrow {
          display: block;
          width: 78px;
          height: 30px;
          margin: 0 0 0 auto;
        }

        @media (max-width: 1180px) {
          .wm__inner { padding: 48px 32px 44px; }
          .wm__stage { padding-right: 180px; min-height: 500px; }
          .wm__art { width: 300px; right: -36px; }
        }
        @media (max-width: 1024px) {
          .wm__grid { grid-template-columns: 1fr; gap: 12px; }
          .wm__stage { padding: 12px 0 0; min-height: 0; justify-content: center; }
          .wm__dash { transform: none; max-width: none; }
          .wm__art, .wm__hand { display: none; }
        }
        @media (max-width: 900px) {
          .wm__inner { padding: 44px 24px 40px; }
        }
        @media (max-width: 720px) {
          .wm__pillars { grid-template-columns: 1fr; gap: 18px; }
          .wm__kpis, .wm__split { grid-template-columns: 1fr 1fr; }
          .wm__blob, .wm__dots { display: none; }
          .wm__h2 { font-size: 32px; }
        }
        @media (max-width: 520px) {
          .wm__kpis, .wm__split { grid-template-columns: 1fr; }
          .wm__donut-wrap { grid-template-columns: 1fr; justify-items: center; }
        }
      `}</style>

      <div className="wm__blob wm__blob--tr" aria-hidden />
      <div className="wm__blob wm__blob--tr2" aria-hidden />
      <div className="wm__dots" aria-hidden />

      <div className="wm__inner">
        <div className="wm__grid">
          <div className="wm__copy">
            <div className="wm__eyebrow">Waste Management</div>
            <h2 className="wm__h2">
              See Where Waste
              <br />
              Happens. Understand
              <br />
              Why. <em>Reduce It.</em>
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
                  <ChevronDown size={12} strokeWidth={2.2} />
                </span>
              </div>
              <div className="wm__kpis">
                {KPIS.map((k) => (
                  <div key={k.label} className="wm__kpi">
                    <span>{k.label}</span>
                    <b>
                      <LiveNumber {...k.live} />
                    </b>
                    <div className="wm__kpi-row" data-warn={k.warn}>
                      {k.up ? "↑" : "↓"}{" "}
                      <LiveNumber value={k.delta} decimals={k.deltaDecimals} suffix="%" />
                    </div>
                    <Spark up={k.up} warn={k.warn} />
                  </div>
                ))}
              </div>
              <div className="wm__split">
                <div className="wm__panel">
                  <div className="wm__panel-h">
                    <h3>Waste by Category</h3>
                    <Link to="/product" className="wm__more">
                      View Details →
                    </Link>
                  </div>
                  <div className="wm__donut-wrap">
                    <div className="wm__donut" aria-hidden>
                      <div className="wm__donut-lab">
                        <b>
                          <LiveNumber value={12480} commas prefix="₹" />
                        </b>
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
                          <b>
                            <LiveNumber value={c.pct} suffix="%" />
                          </b>
                        </i>
                      ))}
                    </div>
                  </div>
                </div>
                <div className="wm__panel">
                  <div className="wm__panel-h">
                    <h3>Top Waste Items</h3>
                    <Link to="/product" className="wm__more">
                      View All →
                    </Link>
                  </div>
                  {ITEMS.map((item) => (
                    <div key={item.name} className="wm__item">
                      <b>{item.rank}</b>
                      <img src={item.img} alt="" />
                      <span className="wm__item-name">{item.name}</span>
                      <span className="wm__bar">
                        <i style={{ width: `${item.pct}%` }} />
                      </span>
                      <em>
                        <LiveNumber value={item.amount} commas prefix="₹" />
                      </em>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="wm__hand" aria-hidden>
              <svg
                className="wm__hand-spark"
                width="22"
                height="22"
                viewBox="0 0 22 22"
                fill="none"
              >
                <path d="M3 7 L12 3" stroke={GREEN} strokeWidth="1.7" strokeLinecap="round" />
                <path d="M2 12 L12 12" stroke={GREEN} strokeWidth="1.7" strokeLinecap="round" />
                <path d="M4 17 L12 20" stroke={GREEN} strokeWidth="1.7" strokeLinecap="round" />
              </svg>
              Small changes make a big difference!
              <svg className="wm__hand-arrow" viewBox="0 0 86 34" fill="none">
                <path
                  d="M4 6 C28 2 58 4 78 22"
                  stroke={GREEN}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                />
                <path
                  d="M68 16 l12 8 -14 4"
                  stroke={GREEN}
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </div>
            <div className="wm__art" aria-hidden>
              <img
                className="wm__art-img"
                src="/mascot/WhatsApp_Image_2026-09-05_at_12.04.58-removebg-preview.png"
                alt=""
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
