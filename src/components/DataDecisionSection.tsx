import { Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import {
  ArrowRight,
  Bell,
  FileText,
  LayoutDashboard,
  Package,
  Receipt,
  ShoppingCart,
  Sparkles,
  type LucideIcon,
} from "lucide-react";
import { T } from "@/components/PlatePieletHero";

const SOURCES: { Icon: LucideIcon; tint: string; color: string; label: string; desc: string }[] = [
  {
    Icon: FileText,
    tint: "#E8F7ED",
    color: "#15803D",
    label: "Tally ERP",
    desc: "Financial data, purchases, stock & accounting",
  },
  {
    Icon: Receipt,
    tint: "#EAF1FE",
    color: "#2563EB",
    label: "POS billing",
    desc: "Sales, items, payments across all branches",
  },
  {
    Icon: Package,
    tint: "#FDF1E3",
    color: "#C2760B",
    label: "Inventory",
    desc: "Stock levels, transfers and consumption",
  },
];

const OUTPUTS: { Icon: LucideIcon; tint: string; color: string; label: string; desc: string }[] = [
  {
    Icon: LayoutDashboard,
    tint: "#EEEDFD",
    color: "#5B4BD6",
    label: "Dashboards",
    desc: "Live insights across sales, costs, inventory & more",
  },
  {
    Icon: Bell,
    tint: "#FDECEF",
    color: "#DC2657",
    label: "Risk alerts",
    desc: "Get notified before it becomes a problem",
  },
  {
    Icon: ShoppingCart,
    tint: "#E8F7ED",
    color: "#15803D",
    label: "Purchase calls",
    desc: "AI recommends what to buy, how much and when",
  },
];

const WIRE_IN = ["#15803D", "#2563EB", "#C2760B"] as const;
const WIRE_OUT = ["#5B4BD6", "#DC2657", "#15803D"] as const;

type Pt = { x: number; y: number };

function wire(from: Pt, to: Pt) {
  const dx = to.x - from.x;
  return `M${from.x} ${from.y} C${from.x + dx * 0.5} ${from.y}, ${to.x - dx * 0.5} ${to.y}, ${to.x} ${to.y}`;
}

function edgePoint(center: Pt, toward: Pt, radius: number): Pt {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius };
}

function localPt(el: DOMRect, root: DOMRect, edge: "right" | "left" | "center"): Pt {
  const y = el.top + el.height / 2 - root.top;
  if (edge === "right") return { x: el.right - root.left, y };
  if (edge === "left") return { x: el.left - root.left, y };
  return { x: el.left + el.width / 2 - root.left, y };
}

function Tile({
  Icon,
  tint,
  color,
  label,
  desc,
  side,
}: {
  Icon: LucideIcon;
  tint: string;
  color: string;
  label: string;
  desc: string;
  side: "in" | "out";
}) {
  return (
    <div className={`dd__tile dd__tile--${side}`} style={{ ["--dot" as string]: color }}>
      <div className="dd__tile-ico" style={{ background: tint, color }}>
        <Icon size={16} strokeWidth={1.9} />
      </div>
      <div className="dd__tile-copy">
        <strong>{label}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

function ScribbleArrow({ flip }: { flip?: boolean }) {
  return (
    <svg
      className={`dd__scribble${flip ? " dd__scribble--flip" : ""}`}
      width="22"
      height="28"
      viewBox="0 0 28 34"
      fill="none"
      aria-hidden
    >
      <path
        d="M14 2c1.2 7.5-1.8 14.2-1.2 21.5"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
      />
      <path
        d="M7.5 19.5c3.2 2.8 5.8 5.2 6.3 8.8 2.4-3.6 5.8-5.6 9.2-7"
        stroke="currentColor"
        strokeWidth="2.2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

export function DataDecisionSection({ visible }: { visible: boolean }) {
  const flowRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const inRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [wires, setWires] = useState<{
    w: number;
    h: number;
    paths: { d: string; stroke: string }[];
  }>({
    w: 0,
    h: 0,
    paths: [],
  });

  useLayoutEffect(() => {
    const flow = flowRef.current;
    const hub = hubRef.current;
    if (!flow || !hub) return;

    const measure = () => {
      const br = flow.getBoundingClientRect();
      if (window.matchMedia("(max-width: 900px)").matches) {
        setWires({ w: br.width, h: br.height, paths: [] });
        return;
      }
      const hr = hub.getBoundingClientRect();
      if (br.width < 20 || hr.width < 8) return;

      const hubCenter = localPt(hr, br, "center");
      const hubR = hr.width / 2 + 2;
      const next: { d: string; stroke: string }[] = [];

      inRefs.current.forEach((el, i) => {
        if (!el) return;
        const from = localPt(el.getBoundingClientRect(), br, "right");
        next.push({ d: wire(from, edgePoint(hubCenter, from, hubR)), stroke: WIRE_IN[i] });
      });
      outRefs.current.forEach((el, i) => {
        if (!el) return;
        const to = localPt(el.getBoundingClientRect(), br, "left");
        next.push({ d: wire(edgePoint(hubCenter, to, hubR), to), stroke: WIRE_OUT[i] });
      });
      setWires({ w: br.width, h: br.height, paths: next });
    };

    measure();
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 320);
    const ro = new ResizeObserver(measure);
    ro.observe(flow);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visible]);

  return (
    <section className={`dd reveal${visible ? " show" : ""}`}>
      <style>{`
        .dd {
          position: relative;
          overflow: hidden;
          background: #FAFCFA;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }
        .dd__blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .dd__blob--l {
          left: -40px;
          top: 120px;
          width: 480px;
          height: 520px;
          background: #E7F3E9;
          border-radius: 46% 54% 48% 52% / 42% 48% 52% 58%;
          opacity: 0.85;
          filter: blur(2px);
        }
        .dd__blob--r {
          right: -60px;
          top: 80px;
          width: 500px;
          height: 560px;
          background: #EAF6ED;
          border-radius: 52% 48% 56% 44% / 48% 42% 58% 52%;
          opacity: 0.82;
          filter: blur(2px);
        }

        .dd__inner {
          position: relative;
          z-index: 1;
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 48px;
        }

        .dd__copy {
          text-align: left;
          max-width: 640px;
          margin: 0 0 48px;
        }
        .dd__h2 {
          margin: 0 0 20px;
          font-size: var(--pp-h2);
          font-weight: 800;
          letter-spacing: var(--pp-h2-track);
          line-height: var(--pp-h2-leading);
          color: ${T.text};
          text-align: left;
        }
        .dd__h2 em {
          font-style: normal;
          color: ${T.accentSolid};
        }
        .dd__p {
          margin: 0 0 14px;
          font-size: var(--pp-lede);
          line-height: var(--pp-lede-leading);
          color: ${T.muted};
          max-width: var(--pp-copy-w);
          text-align: left;
        }
        .dd__p:last-of-type { margin-bottom: 28px; }
        .dd__cta {
          display: inline-flex;
          align-items: center;
          gap: 7px;
          padding: 12px 24px;
          border-radius: 999px;
          background: ${T.accentSolid};
          color: #fff !important;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 12px 24px rgba(21,128,61,0.28);
          transition: transform 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .dd__cta:hover {
          transform: translateY(-2px);
          background: #166534;
        }

        .dd__flow {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 5fr) minmax(160px, 2fr) minmax(0, 5fr);
          grid-template-rows: 28px repeat(3, 78px);
          grid-template-areas:
            "hin .    hout"
            "i0  hub  o0"
            "i1  hub  o1"
            "i2  hub  o2";
          column-gap: 36px;
          row-gap: 12px;
          align-items: stretch;
        }
        .dd__label {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: ${T.accent};
          display: flex;
          align-items: center;
          gap: 4px;
          height: 28px;
          line-height: 1;
          min-width: 0;
          white-space: nowrap;
        }
        .dd__label--in { grid-area: hin; }
        .dd__label--out {
          grid-area: hout;
          justify-content: flex-end;
          flex-direction: row-reverse;
        }
        .dd__scribble {
          color: ${T.accent};
          flex-shrink: 0;
        }
        .dd__scribble--flip { transform: scaleX(-1); }

        .dd__cell {
          min-width: 0;
          display: flex;
          z-index: 2;
        }
        .dd__cell--i0 { grid-area: i0; }
        .dd__cell--i1 { grid-area: i1; }
        .dd__cell--i2 { grid-area: i2; }
        .dd__cell--o0 { grid-area: o0; }
        .dd__cell--o1 { grid-area: o1; }
        .dd__cell--o2 { grid-area: o2; }

        .dd__tile {
          position: relative;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 12px 16px;
          width: 100%;
          height: 100%;
          min-height: 78px;
          background: #fff;
          border: 1px solid rgba(21,32,25,0.06);
          border-radius: 16px;
          box-shadow: 0 8px 22px rgba(7,26,20,0.06);
          box-sizing: border-box;
        }
        .dd__tile-ico {
          width: 40px;
          height: 40px;
          border-radius: 11px;
          display: grid;
          place-items: center;
          flex-shrink: 0;
        }
        .dd__tile-copy { min-width: 0; }
        .dd__tile strong {
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: ${T.text};
          display: block;
          line-height: 1.2;
          margin-bottom: 3px;
        }
        .dd__tile p {
          margin: 0;
          font-size: 11.5px;
          line-height: 1.35;
          color: ${T.muted};
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }
        .dd__tile::after {
          content: '';
          position: absolute;
          top: 50%;
          width: 10px;
          height: 10px;
          border-radius: 50%;
          background: var(--dot);
          transform: translateY(-50%);
          box-shadow: 0 0 0 3px #fff, 0 0 0 5px color-mix(in srgb, var(--dot) 22%, transparent);
          z-index: 2;
        }
        .dd__tile--in::after { right: -5px; }
        .dd__tile--out::after { left: -5px; }

        .dd__hub-col {
          grid-area: hub;
          display: flex;
          align-items: center;
          justify-content: center;
          position: relative;
          z-index: 2;
          min-width: 0;
        }
        .dd__hub-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          z-index: 2;
        }
        .dd__orbits {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 180px;
          height: 180px;
          pointer-events: none;
          z-index: 0;
        }
        .dd__orbits circle {
          fill: none;
          stroke: rgba(21,128,61,0.18);
          stroke-width: 1.3;
          stroke-dasharray: 2.5 7;
        }
        .dd__hub {
          position: relative;
          z-index: 2;
          width: 78px;
          height: 78px;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 28%, #22C55E, #15803D 72%);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 1px;
          border: 3px solid #fff;
          box-shadow:
            0 0 0 5px rgba(34,197,94,0.14),
            0 10px 24px rgba(7,59,42,0.22);
          flex-shrink: 0;
        }
        .dd__hub b {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.02em;
        }

        .dd__wires {
          position: absolute;
          top: 0;
          left: 0;
          pointer-events: none;
          z-index: 1;
          overflow: visible;
        }

        @media (max-width: 900px) {
          .dd__inner { padding: 48px 20px 40px; }
          .dd__copy { margin-bottom: 32px; }
          .dd__blob { display: none; }
          .dd__flow {
            grid-template-columns: 1fr;
            grid-template-rows: auto;
            grid-template-areas:
              "hin"
              "i0"
              "i1"
              "i2"
              "hub"
              "hout"
              "o0"
              "o1"
              "o2";
            column-gap: 0;
            row-gap: 12px;
          }
          .dd__wires,
          .dd__orbits { display: none; }
          .dd__hub-col { min-height: 120px; }
          .dd__label--out {
            justify-content: flex-start;
            flex-direction: row;
          }
          .dd__tile {
            height: auto;
          }
          .dd__tile--in::after,
          .dd__tile--out::after { display: none; }
          .dd__cta { width: 100%; justify-content: center; }
        }
        @media (prefers-reduced-motion: reduce) {
          .dd__cta:hover { transform: none; }
        }
      `}</style>

      <div className="dd__blob dd__blob--l" aria-hidden />
      <div className="dd__blob dd__blob--r" aria-hidden />

      <div className="dd__inner">
        <div className="dd__copy">
          <h2 className="dd__h2">
            From data in <em>to decisions out.</em>
          </h2>
          <p className="dd__p">Connect your Tally, POS, and inventory data in one place.</p>
          <p className="dd__p">
            PlatePielet turns those numbers into live dashboards, risk alerts, and clear
            recommendations for purchasing, stock control, costs, and daily operations.
          </p>
          <Link to="/demo" className="dd__cta">
            See it on your data <ArrowRight size={14} strokeWidth={2.4} />
          </Link>
        </div>

        <div className="dd__flow" ref={flowRef}>
          <svg
            className="dd__wires"
            width={wires.w}
            height={wires.h}
            viewBox={`0 0 ${Math.max(wires.w, 1)} ${Math.max(wires.h, 1)}`}
            aria-hidden
          >
            {wires.paths.map((p) => (
              <path
                key={p.d + p.stroke}
                d={p.d}
                fill="none"
                stroke={p.stroke}
                strokeWidth="2"
                strokeDasharray="3 6.5"
                strokeLinecap="round"
                opacity="0.88"
              />
            ))}
          </svg>

          <div className="dd__label dd__label--in">
            DATA SOURCES
            <ScribbleArrow />
          </div>
          <div className="dd__label dd__label--out">
            DECISIONS &amp; ACTIONS
            <ScribbleArrow flip />
          </div>

          {SOURCES.map((s, i) => (
            <div
              key={s.label}
              className={`dd__cell dd__cell--i${i}`}
              ref={(el) => {
                inRefs.current[i] = el;
              }}
            >
              <Tile {...s} side="in" />
            </div>
          ))}

          <div className="dd__hub-col">
            <div className="dd__hub-wrap">
              <svg className="dd__orbits" viewBox="0 0 180 180" aria-hidden>
                <circle cx="90" cy="90" r="50" />
                <circle cx="90" cy="90" r="68" />
                <circle cx="90" cy="90" r="86" />
              </svg>
              <div className="dd__hub" ref={hubRef}>
                <Sparkles size={18} strokeWidth={2} />
                <b>Pilot AI</b>
              </div>
            </div>
          </div>

          {OUTPUTS.map((s, i) => (
            <div
              key={s.label}
              className={`dd__cell dd__cell--o${i}`}
              ref={(el) => {
                outRefs.current[i] = el;
              }}
            >
              <Tile {...s} side="out" />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
