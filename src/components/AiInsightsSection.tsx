import { useLayoutEffect, useRef, useState, type ReactNode } from "react";
import { Link } from "react-router-dom";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import {
  ArrowRight,
  BarChart3,
  Bell,
  Check,
  ChevronDown,
  ChevronRight,
  Crown,
  Leaf,
  Lightbulb,
  PieChart,
  Sparkles,
  Target,
  TrendingDown,
  TrendingUp,
  UtensilsCrossed,
  type LucideIcon,
} from "lucide-react";
import { T } from "@/components/PlatePieletHero";

const NAVY = "#152019";
const BLUE_GRAY = "#5C6B74";
const MINT = "#E8F6EC";
const CARD_BORDER = "rgba(21,128,61,0.08)";
const CARD_SHADOW = "0 18px 44px rgba(15,42,28,0.08)";

const VALUES: { Icon: LucideIcon; label: string }[] = [
  { Icon: BarChart3, label: "Higher profits" },
  { Icon: Lightbulb, label: "Less food waste" },
  { Icon: Target, label: "Smarter menu decisions" },
];

const DISHES = [
  { rank: 1, name: "Chicken Biryani", amount: "₹48,320", img: "/hero/aii-biryani.png" },
  { rank: 2, name: "Alfredo Pasta", amount: "₹32,410", img: "/hero/aii-alfredo.png" },
  { rank: 3, name: "Paneer Tikka", amount: "₹28,190", img: "/hero/hero-paneer.jpg" },
  { rank: 4, name: "Caesar Salad", amount: "₹21,560", img: "/hero/aii-caesar.png" },
  { rank: 5, name: "Margherita Pizza", amount: "₹18,430", img: "/hero/menu/pizza.jpg" },
] as const;

const ALERTS = [
  { name: "Tomatoes", detail: "High waste (18%)", img: "/hero/hero-tomatoes1.jpg", tone: "warn" },
  { name: "Lettuce", detail: "Expiring in 2 days", img: "/hero/hero-salad.jpg", tone: "alert" },
  { name: "Paneer", detail: "Usage down 40%", img: "/hero/hero-paneer.jpg", tone: "info" },
] as const;

function BasilLeaf({ className, flip }: { className: string; flip?: boolean }) {
  return (
    <svg
      className={className}
      viewBox="0 0 48 64"
      fill="none"
      aria-hidden
      style={flip ? { transform: "scaleX(-1) rotate(-12deg)" } : undefined}
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

function CardHead({ Icon, title, extra }: { Icon: LucideIcon; title: string; extra?: ReactNode }) {
  return (
    <div className="aii-head">
      <span className="aii-head-ico">
        <Icon size={14} strokeWidth={2.2} />
      </span>
      <strong>{title}</strong>
      {extra}
    </div>
  );
}

function FoodCutout({
  src,
  className,
  crop,
  children,
}: {
  src: string;
  className: string;
  crop?: string;
  children?: ReactNode;
}) {
  return (
    <div className={`aii-food ${className}`}>
      {children}
      <svg className="aii-food-svg" viewBox={crop ?? "0 0 1 1"} preserveAspectRatio="xMidYMid slice">
        <image
          href={src}
          x="0"
          y="0"
          width="1"
          height="1"
          preserveAspectRatio="xMidYMid meet"
          filter="url(#aiiKnockWhite)"
        />
      </svg>
    </div>
  );
}

function ConnectorLines() {
  const ref = useRef<SVGSVGElement>(null);
  const [box, setBox] = useState({ w: 0, h: 0, paths: [] as string[] });

  useLayoutEffect(() => {
    const svg = ref.current;
    if (!svg) return;
    const scene = svg.closest(".aii__scene");
    const root = svg.closest(".aii");
    if (!scene || !root) return;

    const update = () => {
      const s = scene.getBoundingClientRect();
      const w = s.width;
      const h = s.height;
      const boxOf = (sel: string) => {
        const el = root.querySelector(sel);
        if (!el) return null;
        const r = el.getBoundingClientRect();
        return {
          l: r.left - s.left,
          t: r.top - s.top,
          r: r.right - s.left,
          b: r.bottom - s.top,
          cx: r.left - s.left + r.width / 2,
          cy: r.top - s.top + r.height / 2,
          w: r.width,
          h: r.height,
        };
      };

      const dishes = boxOf(".aii__card--dishes");
      const recs = boxOf(".aii__card--recs");
      const biryani = boxOf(".aii-food--biryani");
      const pasta = boxOf(".aii-food--pasta");
      const salad = boxOf(".aii-food--salad");
      const mascot = boxOf(".aii-mascot");
      const quote = boxOf(".aii-hand");
      if (!dishes || !recs || !biryani || !pasta || !salad || !mascot) return;

      const pt = (x: number, y: number) => `${x.toFixed(1)} ${y.toFixed(1)}`;
      const cubic = (
        a: { x: number; y: number },
        b: { x: number; y: number },
        drop: number,
      ) => {
        const dx = b.x - a.x;
        return `M${pt(a.x, a.y)} C${pt(a.x + dx * 0.28, a.y + drop)} ${pt(b.x - dx * 0.22, b.y + drop * 0.35)} ${pt(b.x, b.y)}`;
      };

      const s1 = { x: dishes.l + 22, y: dishes.b + 5 };
      const e1 = { x: biryani.r - 4, y: biryani.t + 10 };
      const d1 = cubic(s1, e1, 14);

      const s2 = { x: recs.l - 8, y: recs.b + 6 };
      const e2 = { x: salad.l + salad.w * 0.22, y: salad.t + 4 };
      const d2 = cubic(s2, e2, 42);

      const s3 = { x: salad.r + 10, y: salad.cy };
      const e3 = { x: mascot.l + mascot.w * 0.1, y: mascot.t + mascot.h * 0.48 };
      const quoteFloor = quote ? quote.b + 12 : s3.y;
      const c3y = Math.max(s3.y, e3.y, quoteFloor) + 24;
      const d3 = `M${pt(s3.x, s3.y)} C${pt(s3.x + (e3.x - s3.x) * 0.32, c3y)} ${pt(s3.x + (e3.x - s3.x) * 0.7, c3y - 6)} ${pt(e3.x, e3.y)}`;

      setBox({ w, h, paths: [d1, d2, d3] });
    };

    update();
    requestAnimationFrame(update);
    const ro = new ResizeObserver(update);
    ro.observe(scene);
    ro.observe(root);
    const mo = new MutationObserver(update);
    mo.observe(root, { attributes: true, attributeFilter: ["class"] });
    window.addEventListener("resize", update);
    return () => {
      ro.disconnect();
      mo.disconnect();
      window.removeEventListener("resize", update);
    };
  }, []);

  return (
    <svg
      ref={ref}
      className="aii__wires"
      viewBox={`0 0 ${Math.max(box.w, 1)} ${Math.max(box.h, 1)}`}
      preserveAspectRatio="none"
      aria-hidden
    >
      {box.paths.map((d) => (
        <path
          key={d}
          d={d}
          fill="none"
          stroke="#86EFAC"
          strokeWidth="1.4"
          strokeDasharray="5 7"
          strokeLinecap="round"
          opacity="0.88"
        />
      ))}
    </svg>
  );
}

function FilterChip({ label }: { label: string }) {
  return (
    <span className="aii-chip">
      {label} <ChevronDown size={11} strokeWidth={2.4} />
    </span>
  );
}

function SalesChart() {
  const y = (k: number) => 132 - (k / 20) * 112;
  const x = (day: number) => 46 + ((day - 1) / 29) * 300;
  const pts = [
    [1, 6.2],
    [5, 7.4],
    [8, 9.1],
    [12, 8.2],
    [15, 12.45],
    [19, 9.6],
    [22, 11.2],
    [26, 13.4],
    [30, 15.8],
  ] as const;
  const d = pts
    .map(([day, k], i) => `${i === 0 ? "M" : "L"}${x(day).toFixed(1)} ${y(k).toFixed(1)}`)
    .join(" ");
  const fill = `${d} L${x(30).toFixed(1)} 132 L${x(1).toFixed(1)} 132 Z`;
  const peakX = x(15);
  const peakY = y(12.45);

  return (
    <div className="aii-chart">
      <svg
        viewBox="0 0 360 148"
        role="img"
        aria-label="Sales trend from 1 Sep to 30 Sep, peaking at ₹12,450 on 15 Sep"
      >
        <defs>
          <linearGradient id="aiiSalesFill" x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#16A34A" stopOpacity="0.22" />
            <stop offset="100%" stopColor="#16A34A" stopOpacity="0" />
          </linearGradient>
        </defs>
        {[0, 5, 10, 15, 20].map((k) => (
          <g key={k}>
            <path d={`M46 ${y(k)} H346`} stroke="#E8EEEA" strokeWidth="1" />
            <text
              x="40"
              y={y(k) + 3}
              textAnchor="end"
              fontSize="8.5"
              fill="#8A968F"
              fontWeight="600"
            >
              ₹{k === 0 ? "0" : `${k}K`}
            </text>
          </g>
        ))}
        <path d={fill} fill="url(#aiiSalesFill)" />
        <path
          d={d}
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.4"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d={`M${peakX} ${peakY} V132`}
          stroke="#86EFAC"
          strokeWidth="1.2"
          strokeDasharray="2 4"
        />
        <circle cx={peakX} cy={peakY} r="5" fill="#16A34A" stroke="#fff" strokeWidth="2.4" />
        {[
          [1, "1 Sep"],
          [8, "8 Sep"],
          [15, "15 Sep"],
          [22, "22 Sep"],
          [30, "30 Sep"],
        ].map(([day, label]) => (
          <text
            key={label}
            x={x(Number(day))}
            y="145"
            textAnchor={label === "1 Sep" ? "start" : label === "30 Sep" ? "end" : "middle"}
            fontSize="8.5"
            fill="#8A968F"
            fontWeight="600"
          >
            {label}
          </text>
        ))}
      </svg>
      <div className="aii-peak" style={{ left: `${(peakX / 360) * 100}%` }} aria-hidden>
        <b>Peak Sale</b>
        <span>₹12,450</span>
      </div>
    </div>
  );
}

export function AiInsightsSection({ visible }: { visible: boolean }) {
  return (
    <section id="ai-insights" className={`aii reveal${visible ? " show" : ""}`}>
      <style>{`
        .aii {
          position: relative;
          overflow: hidden;
          background: #FFFFFF;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${NAVY};
        }
        .aii__blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
          border-radius: 50%;
        }
        .aii__blob--tl {
          left: -120px; top: -80px;
          width: 520px; height: 520px;
          background: radial-gradient(circle at 42% 40%, #E7F5EB 0%, rgba(231,245,235,0.35) 48%, transparent 72%);
        }
        .aii__blob--tr {
          right: -140px; top: 20px;
          width: 620px; height: 620px;
          background: radial-gradient(circle at 55% 42%, #EAF7EE 0%, rgba(234,247,238,0.4) 50%, transparent 72%);
        }
        .aii__blob--c {
          left: 42%; bottom: 4%;
          width: 380px; height: 380px;
          background: radial-gradient(circle, rgba(34,197,94,0.12) 0%, transparent 70%);
        }
        .aii__inner {
          position: relative;
          z-index: 1;
          max-width: 1536px;
          margin: 0 auto;
          padding: 56px 48px 312px;
        }
        @media (min-width: 1280px) {
          .aii__inner {
            padding: 56px 56px 324px;
          }
        }
        .aii__grid {
          display: grid;
          grid-template-columns: minmax(300px, 0.78fr) minmax(0, 1.22fr);
          gap: 40px;
          align-items: start;
          width: 100%;
        }
        .aii__copy { position: relative; z-index: 5; padding-top: 8px; max-width: 480px; }
        .aii__eyebrow {
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 16px;
        }
        .aii__h2 {
          margin: 0 0 14px;
          font-size: clamp(34px, 3.6vw, 52px);
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.08;
          color: ${NAVY};
        }
        .aii__lede {
          margin: 0 0 20px;
          font-size: 16px;
          line-height: 1.7;
          color: ${BLUE_GRAY};
          max-width: 42ch;
        }
        .aii__ctas {
          display: flex;
          flex-wrap: wrap;
          gap: 12px;
          margin-bottom: 22px;
        }
        .aii__cta {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          min-height: 48px;
          padding: 12px 22px;
          border-radius: 999px;
          font-size: 14px;
          font-weight: 700;
          line-height: 1;
          white-space: nowrap;
          transition: transform 0.2s ease, background 0.2s ease, border-color 0.2s ease;
        }
        .aii__cta--primary {
          background: ${T.accentSolid};
          color: #fff !important;
          box-shadow: 0 12px 24px rgba(21,128,61,0.26);
        }
        .aii__cta--primary:hover { background: #166534; transform: translateY(-2px); }
        .aii__cta--ghost {
          background: #fff;
          color: ${T.accentSolid} !important;
          border: 1.5px solid ${T.accent};
        }
        .aii__cta--ghost:hover { background: ${MINT}; transform: translateY(-2px); }
        .aii__values {
          display: flex;
          flex-wrap: wrap;
          gap: 18px 22px;
        }
        .aii__value {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 13px;
          font-weight: 600;
          color: ${BLUE_GRAY};
        }
        .aii__value-ico {
          width: 36px; height: 36px;
          border-radius: 50%;
          background: ${MINT};
          color: ${T.accentSolid};
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }

        .aii__stage { position: relative; min-height: 0; z-index: 3; }
        .aii__cards {
          display: grid;
          grid-template-columns: minmax(0, 1.15fr) minmax(240px, 0.85fr);
          grid-template-areas:
            "sales cost"
            "dishes waste"
            "dishes recs";
          gap: 14px;
          padding-bottom: 0;
        }
        .aii__card {
          position: relative;
          z-index: 3;
          background: rgba(255,255,255,0.92);
          backdrop-filter: blur(16px);
          border: 1px solid ${CARD_BORDER};
          border-radius: 20px;
          box-shadow: ${CARD_SHADOW};
          padding: 16px 18px 18px;
          min-width: 0;
        }
        .aii__card--sales { grid-area: sales; }
        .aii__card--cost { grid-area: cost; }
        .aii__card--dishes { grid-area: dishes; }
        .aii__card--waste { grid-area: waste; }
        .aii__card--recs { grid-area: recs; }

        .aii-head {
          display: flex;
          align-items: center;
          gap: 8px;
          margin-bottom: 12px;
        }
        .aii-head-ico {
          width: 26px; height: 26px;
          border-radius: 8px;
          display: grid;
          place-items: center;
          background: ${MINT};
          color: ${T.accentSolid};
          flex-shrink: 0;
        }
        .aii-head strong {
          font-size: 13.5px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: ${NAVY};
        }
        .aii-chip {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 10.5px;
          font-weight: 700;
          color: ${BLUE_GRAY};
          background: #F4F7F5;
          border: 1px solid rgba(21,32,25,0.08);
          border-radius: 999px;
          padding: 5px 9px;
          white-space: nowrap;
          flex-shrink: 0;
        }
        .aii-head-link {
          margin-left: auto;
          display: inline-flex;
          align-items: center;
          gap: 2px;
          font-size: 11.5px;
          font-weight: 700;
          color: ${T.accentSolid};
          white-space: nowrap;
          flex-shrink: 0;
        }

        .aii-metric {
          display: flex;
          align-items: center;
          gap: 10px;
          flex-wrap: wrap;
        }
        .aii-metric b {
          font-size: 28px;
          font-weight: 800;
          letter-spacing: -0.045em;
          font-variant-numeric: tabular-nums;
          line-height: 1;
          color: ${NAVY};
        }
        .aii-metric-lab {
          margin-top: 6px;
          font-size: 12px;
          font-weight: 600;
          color: ${BLUE_GRAY};
        }
        .aii-delta {
          display: inline-flex;
          align-items: center;
          gap: 3px;
          font-size: 11px;
          font-weight: 800;
          color: ${T.accentSolid};
          background: ${MINT};
          border-radius: 999px;
          padding: 4px 8px;
          font-variant-numeric: tabular-nums;
        }

        .aii-chart { position: relative; margin-top: 10px; }
        .aii-chart svg { width: 100%; height: 152px; display: block; overflow: visible; }
        .aii-chart svg text { font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif; }
        .aii-peak {
          position: absolute;
          top: 4px;
          transform: translateX(-42%);
          background: #fff;
          border: 1px solid rgba(21,32,25,0.08);
          border-radius: 10px;
          box-shadow: 0 8px 18px rgba(7,26,20,0.1);
          padding: 6px 10px;
          line-height: 1.15;
          pointer-events: none;
          white-space: nowrap;
        }
        .aii-peak b { display: block; font-size: 9px; font-weight: 700; color: ${BLUE_GRAY}; }
        .aii-peak span { font-size: 12px; font-weight: 800; color: ${NAVY}; font-variant-numeric: tabular-nums; }

        .aii-bar {
          height: 8px;
          border-radius: 999px;
          background: #E8F0EB;
          overflow: hidden;
          margin: 14px 0 14px;
        }
        .aii-bar i {
          display: block;
          width: 72%;
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg, #22C55E, #15803D);
        }
        .aii-note {
          display: grid;
          grid-template-columns: 20px minmax(0, 1fr);
          gap: 8px;
          align-items: start;
          background: ${MINT};
          border-radius: 12px;
          padding: 10px 12px;
        }
        .aii-note-ico {
          width: 20px; height: 20px;
          border-radius: 50%;
          background: ${T.accentSolid};
          color: #fff;
          display: grid;
          place-items: center;
          margin-top: 1px;
        }
        .aii-note strong {
          display: block;
          font-size: 12.5px;
          font-weight: 800;
          color: #166534;
          line-height: 1.2;
        }
        .aii-note span {
          display: block;
          margin-top: 3px;
          font-size: 11.5px;
          line-height: 1.4;
          color: #3F6B4C;
          font-weight: 600;
        }

        .aii-dish {
          display: grid;
          grid-template-columns: 22px 34px minmax(0, 1fr) auto;
          gap: 10px;
          align-items: center;
          padding: 8px 0;
        }
        .aii-dish + .aii-dish { border-top: 1px solid rgba(21,32,25,0.05); }
        .aii-dish-rank {
          width: 22px; height: 22px;
          border-radius: 50%;
          display: grid;
          place-items: center;
          font-size: 10px;
          font-weight: 800;
          color: ${BLUE_GRAY};
          background: #F3F6F4;
          font-variant-numeric: tabular-nums;
        }
        .aii-dish:first-child .aii-dish-rank {
          background: ${MINT};
          color: ${T.accentSolid};
        }
        .aii-dish img {
          width: 34px; height: 34px;
          border-radius: 50%;
          object-fit: cover;
          background: #F3F6F4;
        }
        .aii-dish strong {
          font-size: 13px;
          font-weight: 700;
          color: ${NAVY};
          display: block;
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
        }
        .aii-dish em {
          font-style: normal;
          font-size: 12.5px;
          font-weight: 800;
          color: ${NAVY};
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }

        .aii-alert {
          display: grid;
          grid-template-columns: 34px minmax(0, 1fr) 16px;
          gap: 8px;
          align-items: center;
          padding: 8px 0;
        }
        .aii-alert + .aii-alert { border-top: 1px solid rgba(21,32,25,0.05); }
        .aii-alert img {
          width: 34px; height: 34px;
          border-radius: 50%;
          object-fit: cover;
        }
        .aii-alert strong {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: ${NAVY};
          line-height: 1.2;
        }
        .aii-alert span {
          font-size: 11.5px;
          font-weight: 600;
          color: ${BLUE_GRAY};
        }
        .aii-alert[data-tone="warn"] span { color: #C2410C; }
        .aii-alert[data-tone="alert"] span { color: #B45309; }
        .aii-alert[data-tone="info"] span { color: #1D4ED8; }
        .aii-alert-chev { color: #A8B5AE; }

        .aii-rec {
          display: grid;
          grid-template-columns: 30px minmax(0, 1fr);
          gap: 10px;
          align-items: flex-start;
          padding: 9px 0;
        }
        .aii-rec + .aii-rec { border-top: 1px solid rgba(21,32,25,0.05); }
        .aii-rec-ico {
          width: 30px; height: 30px;
          border-radius: 10px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .aii-rec-ico--up { background: ${MINT}; color: ${T.accentSolid}; }
        .aii-rec-ico--leaf { background: #ECFDF3; color: #15803D; }
        .aii-rec strong {
          display: block;
          font-size: 13px;
          font-weight: 800;
          color: ${NAVY};
          line-height: 1.25;
        }
        .aii-rec span {
          display: block;
          margin-top: 3px;
          font-size: 11.5px;
          line-height: 1.4;
          color: ${BLUE_GRAY};
          font-weight: 600;
        }

        .aii__scene {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          height: 580px;
          z-index: 4;
          pointer-events: none;
        }
        .aii__wires {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          overflow: visible;
          z-index: 1;
          pointer-events: none;
        }
        .aii-food {
          position: absolute;
          z-index: 2;
          background: transparent;
        }
        .aii-food-svg {
          display: block;
          width: 100%;
          height: auto;
          aspect-ratio: 1;
          overflow: visible;
          filter: drop-shadow(0 24px 28px rgba(20, 40, 28, 0.18));
        }
        .aii-food--biryani { left: 7%; bottom: 92px; width: 232px; }
        .aii-food--pasta { left: 21%; bottom: 18px; width: 244px; z-index: 3; }
        .aii-food--salad { left: 39%; bottom: 42px; width: 148px; z-index: 2; }
        .aii-best {
          position: absolute;
          top: 18px;
          right: 8px;
          z-index: 4;
          display: inline-flex;
          align-items: center;
          gap: 4px;
          background: ${T.accentSolid};
          color: #fff;
          font-size: 12px;
          font-weight: 800;
          padding: 6px 11px;
          border-radius: 999px;
          box-shadow: 0 8px 16px rgba(21,128,61,0.28);
          white-space: nowrap;
        }
        .aii-leaf {
          position: absolute;
          width: 34px;
          height: 46px;
          z-index: 3;
          filter: drop-shadow(0 4px 6px rgba(21,128,61,0.18));
        }
        .aii-leaf--1 { left: 20%; bottom: 268px; transform: rotate(-28deg); }
        .aii-leaf--2 { left: 36%; bottom: 292px; transform: rotate(18deg); }
        .aii-leaf--3 { left: 50%; bottom: 168px; transform: rotate(-12deg); width: 26px; height: 36px; }
        .aii-mascot {
          position: absolute;
          right: 1%;
          bottom: 8px;
          width: clamp(168px, 14vw, 220px);
          z-index: 6;
          filter: drop-shadow(0 16px 24px rgba(15,122,76,0.2));
        }
        .aii-hand {
          position: absolute;
          right: clamp(184px, 16vw, 240px);
          bottom: 148px;
          z-index: 7;
          font-family: 'Caveat', cursive;
          font-size: clamp(24px, 2.3vw, 32px);
          font-weight: 700;
          color: #0F766E;
          transform: rotate(-6deg);
          line-height: 1.05;
          white-space: nowrap;
          text-align: left;
        }
        .aii-hand svg {
          display: block;
          width: 168px;
          height: 10px;
          margin-top: -2px;
          margin-left: 8px;
        }

        @media (max-width: 1100px) {
          .aii__inner { min-height: 0; display: block; padding: 64px 28px 260px; }
          .aii__grid { grid-template-columns: 1fr; gap: 28px; }
          .aii__copy { padding-top: 0; max-width: none; }
          .aii__stage { min-height: 0; }
          .aii__scene { height: 420px; }
          .aii-mascot { width: 156px; right: 2%; }
          .aii-hand { right: 168px; bottom: 108px; font-size: 22px; }
          .aii-food--biryani { width: 188px; left: 4%; bottom: 64px; }
          .aii-food--pasta { width: 200px; left: 24%; bottom: 8px; }
          .aii-food--salad { width: 128px; left: 48%; }
        }
        @media (max-width: 760px) {
          .aii__inner { padding: 56px 20px 220px; }
          .aii__blob { display: none; }
          .aii__cards {
            grid-template-columns: 1fr;
            grid-template-areas: "sales" "cost" "dishes" "waste" "recs";
          }
          .aii__ctas { flex-direction: column; }
          .aii__cta { width: 100%; }
          .aii__scene { height: 280px; }
          .aii-food--biryani { left: 2%; width: 156px; bottom: 28px; }
          .aii-food--pasta { left: 30%; width: 164px; }
          .aii-food--salad { left: 56%; width: 108px; }
          .aii-mascot { width: 128px; }
          .aii__wires, .aii-leaf { display: none; }
          .aii-hand { font-size: 18px; right: 160px; bottom: 74px; }
        }
        @media (prefers-reduced-motion: reduce) {
          .aii__cta:hover { transform: none; }
        }
      `}</style>

      <div className="aii__blob aii__blob--tl" aria-hidden />
      <div className="aii__blob aii__blob--tr" aria-hidden />
      <div className="aii__blob aii__blob--c" aria-hidden />

      <div className="aii__inner">
        <div className="aii__grid">
          <div className="aii__copy">
            <div className="aii__eyebrow">AI-Powered Insights</div>
            <h2 className="aii__h2">Turn Your Restaurant Data Into Real Growth.</h2>
            <p className="aii__lede">
              See what&apos;s selling, control costs, reduce waste, and get AI-powered
              recommendations — all in one place.
            </p>
            <div className="aii__ctas">
              <Link to="/demo" className="aii__cta aii__cta--primary">
                Book a Demo <ArrowRight size={15} strokeWidth={2.4} />
              </Link>
              <Link to="/product" className="aii__cta aii__cta--ghost">
                Explore Features
              </Link>
            </div>
            <div className="aii__values">
              {VALUES.map(({ Icon, label }) => (
                <div key={label} className="aii__value">
                  <span className="aii__value-ico">
                    <Icon size={16} strokeWidth={2} />
                  </span>
                  {label}
                </div>
              ))}
            </div>
          </div>

          <div className="aii__stage">
            <div className="aii__cards">
              <article className="aii__card aii__card--sales">
                <CardHead
                  Icon={BarChart3}
                  title="Sales Trend"
                  extra={<FilterChip label="Last 30 Days" />}
                />
                <div className="aii-metric">
                  <b>₹2,48,320</b>
                  <span className="aii-delta">
                    <TrendingUp size={11} strokeWidth={2.6} />
                    +12.6%
                  </span>
                </div>
                <div className="aii-metric-lab">Total Sales</div>
                <SalesChart />
              </article>

              <article className="aii__card aii__card--cost">
                <CardHead Icon={PieChart} title="Food Cost" />
                <div className="aii-metric">
                  <b>28.4%</b>
                  <span className="aii-delta">
                    <TrendingDown size={11} strokeWidth={2.6} />
                    -2.3%
                  </span>
                </div>
                <div className="aii-metric-lab">of total sales</div>
                <div className="aii-bar" aria-hidden>
                  <i />
                </div>
                <div className="aii-note">
                  <span className="aii-note-ico">
                    <Check size={11} strokeWidth={3} />
                  </span>
                  <div>
                    <strong>Good control!</strong>
                    <span>Your food cost is 2.3% lower than last month.</span>
                  </div>
                </div>
              </article>

              <article className="aii__card aii__card--dishes">
                <CardHead
                  Icon={UtensilsCrossed}
                  title="Top Dishes"
                  extra={<FilterChip label="By Sales" />}
                />
                {DISHES.map((d) => (
                  <div key={d.name} className="aii-dish">
                    <span className="aii-dish-rank">{d.rank}</span>
                    <img src={d.img} alt="" />
                    <strong>{d.name}</strong>
                    <em>{d.amount}</em>
                  </div>
                ))}
              </article>

              <article className="aii__card aii__card--waste">
                <CardHead
                  Icon={Bell}
                  title="Waste Alerts"
                  extra={
                    <a href="#waste-management" className="aii-head-link">
                      View All <ArrowRight size={12} strokeWidth={2.4} />
                    </a>
                  }
                />
                {ALERTS.map((a) => (
                  <div key={a.name} className="aii-alert" data-tone={a.tone}>
                    <img src={a.img} alt="" />
                    <div>
                      <strong>{a.name}</strong>
                      <span>{a.detail}</span>
                    </div>
                    <ChevronRight className="aii-alert-chev" size={16} strokeWidth={2.2} />
                  </div>
                ))}
              </article>

              <article className="aii__card aii__card--recs">
                <CardHead Icon={Sparkles} title="AI Recommendations" />
                <div className="aii-rec">
                  <span className="aii-rec-ico aii-rec-ico--up">
                    <TrendingUp size={14} strokeWidth={2.3} />
                  </span>
                  <div>
                    <strong>Promote Chicken Biryani</strong>
                    <span>Sales are 32% higher on weekends.</span>
                  </div>
                </div>
                <div className="aii-rec">
                  <span className="aii-rec-ico aii-rec-ico--leaf">
                    <Leaf size={14} strokeWidth={2.3} />
                  </span>
                  <div>
                    <strong>Reduce prep for Caesar Salad</strong>
                    <span>Lower demand predicted next week.</span>
                  </div>
                </div>
              </article>
            </div>
          </div>
        </div>

        <div className="aii__scene" aria-hidden>
          <svg
            aria-hidden
            style={{
              position: "absolute",
              width: 1,
              height: 1,
              overflow: "hidden",
              opacity: 0,
              pointerEvents: "none",
            }}
          >
            <defs>
              <filter
                id="aiiKnockWhite"
                x="-20%"
                y="-20%"
                width="140%"
                height="140%"
                colorInterpolationFilters="sRGB"
              >
                <feColorMatrix
                  type="matrix"
                  values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  -1.1 -1.1 -1.1 2.85 0"
                />
              </filter>
            </defs>
          </svg>
          <ConnectorLines />
          <BasilLeaf className="aii-leaf aii-leaf--1" />
          <BasilLeaf className="aii-leaf aii-leaf--2" flip />
          <BasilLeaf className="aii-leaf aii-leaf--3" />
          <FoodCutout className="aii-food--biryani" src="/hero/aii-biryani.png" />
          <FoodCutout className="aii-food--pasta" src="/hero/aii-alfredo.png">
            <span className="aii-best">
              <Crown size={11} strokeWidth={2.4} /> Bestseller!
            </span>
          </FoodCutout>
          <FoodCutout className="aii-food--salad" src="/hero/aii-caesar.png" />
          <img className="aii-mascot" src="/hero/hero-mascot.png" alt="" />
          <div className="aii-hand">
            Insights plated fresh!
            <svg viewBox="0 0 156 10" fill="none">
              <path
                d="M2 6c20-4 44-5 78-3 30 2 54 3 74 1"
                stroke="#15803D"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </div>
        </div>
      </div>
    </section>
  );
}
