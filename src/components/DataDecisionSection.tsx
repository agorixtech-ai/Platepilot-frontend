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

/** Design canvas size — entire composition scales from this 16:9 frame. */
const DW = 1600;
const DH = 900;

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

function curve(from: Pt, to: Pt, pullY: number) {
  const mx = (from.x + to.x) / 2;
  return `M${from.x} ${from.y} C${mx} ${from.y + pullY}, ${mx} ${to.y + pullY}, ${to.x} ${to.y}`;
}

function edgePoint(center: Pt, toward: Pt, radius: number): Pt {
  const dx = toward.x - center.x;
  const dy = toward.y - center.y;
  const len = Math.hypot(dx, dy) || 1;
  return { x: center.x + (dx / len) * radius, y: center.y + (dy / len) * radius };
}

/** Convert a visual rect into unscaled canvas coordinates. */
function localPt(el: DOMRect, root: DOMRect, scale: number, edge: "right" | "left" | "center"): Pt {
  const y = (el.top + el.height / 2 - root.top) / scale;
  if (edge === "right") return { x: (el.right - root.left) / scale, y };
  if (edge === "left") return { x: (el.left - root.left) / scale, y };
  return { x: (el.left + el.width / 2 - root.left) / scale, y };
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
  const frameRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLDivElement>(null);
  const bodyRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const inRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [scale, setScale] = useState(1);
  const [paths, setPaths] = useState<{ d: string; stroke: string }[]>([]);

  useLayoutEffect(() => {
    const frame = frameRef.current;
    if (!frame) return;

    const fit = () => {
      const w = frame.clientWidth;
      // Fit both width and viewport height so the full 16:9 composition
      // stays visible (accounts for sticky nav ~72px).
      const availH = Math.max(480, window.innerHeight - 72);
      setScale(Math.min(w / DW, availH / DH));
    };

    fit();
    const ro = new ResizeObserver(fit);
    ro.observe(frame);
    window.addEventListener("resize", fit);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", fit);
    };
  }, []);

  useLayoutEffect(() => {
    const body = bodyRef.current;
    const hub = hubRef.current;
    if (!body || !hub) return;

    const measure = () => {
      if (window.matchMedia("(max-width: 900px)").matches) {
        setPaths([]);
        return;
      }
      const br = body.getBoundingClientRect();
      const hr = hub.getBoundingClientRect();
      if (br.width < 20 || hr.width < 8 || scale <= 0) return;

      const hubCenter = localPt(hr, br, scale, "center");
      const hubR = hr.width / 2 / scale + 2;

      const next: { d: string; stroke: string }[] = [];
      inRefs.current.forEach((el, i) => {
        if (!el) return;
        const from = localPt(el.getBoundingClientRect(), br, scale, "right");
        const to = edgePoint(hubCenter, from, hubR);
        const pull = i === 1 ? 0 : i === 0 ? -28 : 28;
        next.push({ d: curve(from, to, pull), stroke: WIRE_IN[i] });
      });
      outRefs.current.forEach((el, i) => {
        if (!el) return;
        const to = localPt(el.getBoundingClientRect(), br, scale, "left");
        const from = edgePoint(hubCenter, to, hubR);
        const pull = i === 1 ? 0 : i === 0 ? -28 : 28;
        next.push({ d: curve(from, to, pull), stroke: WIRE_OUT[i] });
      });
      setPaths(next);
    };

    measure();
    const t1 = window.setTimeout(measure, 80);
    const t2 = window.setTimeout(measure, 320);
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t1);
      window.clearTimeout(t2);
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, [visible, scale]);

  return (
    <section className={`dd reveal${visible ? " show" : ""}`}>
      <style>{`
        .dd {
          position: relative;
          width: 100%;
          background: #FAFCFA;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }

        /* Outer frame: width-fluid, height locked to scaled 16:9 canvas */
        .dd__frame {
          position: relative;
          width: 100%;
          max-width: 100%;
          margin: 0 auto;
          height: calc(${DH}px * var(--dd-scale, 1));
          overflow: hidden;
          display: flex;
          justify-content: center;
        }

        /* Sized shell so transform scale doesn't blow the layout */
        .dd__scaler {
          position: relative;
          width: calc(${DW}px * var(--dd-scale, 1));
          height: calc(${DH}px * var(--dd-scale, 1));
          flex-shrink: 0;
          overflow: hidden;
        }

        /* Fixed design canvas — scales as one unit, never crops */
        .dd__canvas {
          position: absolute;
          top: 0;
          left: 0;
          width: ${DW}px;
          height: ${DH}px;
          transform: scale(var(--dd-scale, 1));
          transform-origin: top left;
          overflow: hidden;
          background: #FAFCFA;
        }

        .dd__blob {
          position: absolute;
          pointer-events: none;
          z-index: 0;
        }
        .dd__blob--l {
          left: -40px;
          top: 180px;
          width: 520px;
          height: 580px;
          background: #E7F3E9;
          border-radius: 46% 54% 48% 52% / 42% 48% 52% 58%;
          opacity: 0.85;
          filter: blur(2px);
        }
        .dd__blob--r {
          right: -60px;
          top: 150px;
          width: 540px;
          height: 600px;
          background: #EAF6ED;
          border-radius: 52% 48% 56% 44% / 48% 42% 58% 52%;
          opacity: 0.82;
          filter: blur(2px);
        }
        .dd__blob--c {
          left: 50%;
          top: 380px;
          transform: translateX(-50%);
          width: 340px;
          height: 340px;
          background: radial-gradient(circle, rgba(34,197,94,0.1) 0%, transparent 70%);
          border-radius: 50%;
        }

        .dd__inner {
          position: relative;
          z-index: 1;
          width: 100%;
          height: 100%;
          padding: 36px 56px 28px; /* ~3.5% horizontal on 1600 */
          box-sizing: border-box;
          display: grid;
          grid-template-rows: auto auto minmax(0, 1fr) auto;
          row-gap: 10px;
        }

        /* ── Head ── */
        .dd__head {
          text-align: center;
          max-width: 720px;
          margin: 0 auto;
        }
        .dd__h2 {
          margin: 0 0 8px;
          font-size: 40px;
          font-weight: 800;
          letter-spacing: -0.045em;
          line-height: 1.08;
          color: ${T.text};
        }
        .dd__h2 em {
          font-style: normal;
          color: ${T.accent};
        }
        .dd__lede {
          margin: 0 auto 4px;
          font-size: 14.5px;
          line-height: 1.45;
          color: ${T.muted};
          max-width: 520px;
        }
        .dd__lede2 {
          margin: 0 auto;
          font-size: 13px;
          line-height: 1.5;
          color: #8A968E;
          max-width: 640px;
        }

        /* ── Mantra ── */
        .dd__mantra {
          text-align: center;
          margin: 0 auto;
          font-family: 'Caveat', cursive;
          font-size: 26px;
          font-weight: 700;
          color: ${T.accentSolid};
          line-height: 1.2;
          white-space: nowrap;
        }
        .dd__mantra em {
          font-style: normal;
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 3px;
        }
        .dd__mantra-row {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        .dd__mantra-marks {
          flex-shrink: 0;
          color: ${T.accent};
        }

        /* ── Flow ── */
        .dd__flow {
          position: relative;
          min-height: 0;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 200px minmax(0, 1fr);
          column-gap: 36px;
          align-items: start;
        }
        .dd__col-label {
          font-family: 'Caveat', cursive;
          font-size: 22px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: ${T.accent};
          margin-bottom: 12px;
          display: flex;
          align-items: flex-start;
          gap: 4px;
          min-height: 28px;
          line-height: 1;
        }
        .dd__col--out .dd__col-label {
          justify-content: flex-end;
          flex-direction: row-reverse;
        }
        .dd__scribble {
          color: ${T.accent};
          margin-top: 1px;
          flex-shrink: 0;
        }
        .dd__scribble--flip { transform: scaleX(-1); }

        .dd__flow-body {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) 200px minmax(0, 1fr);
          column-gap: 36px;
          align-items: stretch;
          grid-column: 1 / -1;
          min-height: 0;
        }
        .dd__stack {
          display: flex;
          flex-direction: column;
          gap: 12px;
          position: relative;
          z-index: 2;
          justify-content: center;
        }

        .dd__tile {
          position: relative;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 10px;
          align-items: center;
          padding: 12px 16px;
          height: 78px;
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
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: stretch;
          width: 200px;
          position: relative;
          z-index: 2;
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
          top: 62%;
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
        .dd__mascot-wrap {
          position: relative;
          z-index: 2;
        }
        .dd__mascot-marks {
          position: absolute;
          left: 50%;
          top: 4%;
          transform: translateX(-50%);
          width: 120px;
          height: 48px;
          color: ${T.accent};
          pointer-events: none;
        }
        .dd__mascot {
          width: 138px;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.14));
          pointer-events: none;
        }
        .dd__mascot img {
          width: 100%;
          height: auto;
          display: block;
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
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          overflow: visible;
        }

        /* ── Bottom props ── */
        .dd__props {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: end;
          gap: 16px;
          padding: 0 4px;
        }
        .dd__prop-left {
          position: relative;
          justify-self: start;
          width: 196px;
        }
        .dd__prop-left img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.14));
        }
        .dd__note {
          position: absolute;
          left: 52%;
          bottom: 12%;
          background: #fff;
          border-radius: 9px;
          padding: 8px 10px;
          font-family: 'Caveat', cursive;
          font-size: 15px;
          font-weight: 700;
          line-height: 1.2;
          color: ${T.accentSolid};
          box-shadow: 0 6px 16px rgba(7,26,20,0.12);
          transform: rotate(-6deg);
          max-width: 110px;
        }

        .dd__prop-center {
          justify-self: center;
          align-self: center;
          padding-bottom: 28px;
        }
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

        .dd__prop-right {
          position: relative;
          justify-self: end;
          width: 200px;
          padding-top: 52px;
        }
        .dd__ai-rec {
          position: absolute;
          top: 0;
          right: 4%;
          z-index: 2;
          background: #fff;
          border-radius: 12px;
          padding: 10px 12px;
          box-shadow: 0 10px 24px rgba(7,26,20,0.12);
          border: 1px solid rgba(21,32,25,0.06);
          width: 188px;
        }
        .dd__ai-rec::after {
          content: '';
          position: absolute;
          left: 28%;
          bottom: -6px;
          width: 12px;
          height: 12px;
          background: #fff;
          border-right: 1px solid rgba(21,32,25,0.06);
          border-bottom: 1px solid rgba(21,32,25,0.06);
          transform: rotate(45deg);
        }
        .dd__ai-rec-tag {
          display: flex;
          align-items: center;
          gap: 4px;
          font-size: 10px;
          font-weight: 800;
          color: #2563EB;
          margin-bottom: 4px;
        }
        .dd__ai-rec p {
          margin: 0;
          font-size: 11.5px;
          line-height: 1.4;
          color: ${T.text};
          font-weight: 600;
        }
        .dd__bowl-arrow {
          position: absolute;
          left: 18%;
          top: 50px;
          z-index: 3;
          color: ${T.accent};
          pointer-events: none;
        }
        .dd__bowl img {
          width: 100%;
          height: auto;
          display: block;
          border-radius: 50%;
          filter: drop-shadow(0 10px 18px rgba(0,0,0,0.14));
        }

        /* Mobile: stack (canvas scale approach only for desktop) */
        @media (max-width: 900px) {
          .dd__frame {
            height: auto;
            max-width: none;
            overflow: visible;
            display: block;
          }
          .dd__scaler {
            width: 100%;
            height: auto;
            overflow: visible;
          }
          .dd__canvas {
            position: relative;
            width: 100%;
            height: auto;
            transform: none;
            overflow: visible;
          }
          .dd__inner {
            padding: 48px 20px 48px;
            display: flex;
            flex-direction: column;
            gap: 16px;
            height: auto;
          }
          .dd__blob { display: none; }
          .dd__h2 { font-size: clamp(28px, 7vw, 36px); }
          .dd__mantra {
            white-space: normal;
            font-size: 22px;
          }
          .dd__flow {
            grid-template-columns: 1fr;
            row-gap: 8px;
          }
          .dd__flow-body {
            grid-template-columns: 1fr;
            row-gap: 24px;
          }
          .dd__wires,
          .dd__orbits { display: none; }
          .dd__hub-col {
            width: auto;
            order: -1;
            padding: 4px 0;
          }
          .dd__col--out .dd__col-label {
            justify-content: flex-start;
            flex-direction: row;
          }
          .dd__tile--in::after,
          .dd__tile--out::after { display: none; }
          .dd__tile { height: auto; min-height: 76px; }
          .dd__props {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 24px;
          }
          .dd__prop-left,
          .dd__prop-right {
            justify-self: center;
            width: min(240px, 100%);
          }
          .dd__prop-center { padding-bottom: 0; order: 3; }
          .dd__prop-right { padding-top: 48px; }
          .dd__cta { width: 100%; justify-content: center; }
        }
      `}</style>

      <div
        className="dd__frame"
        ref={frameRef}
        style={{ ["--dd-scale" as string]: String(scale) }}
      >
        <div className="dd__scaler">
          <div className="dd__canvas" ref={canvasRef}>
            <div className="dd__blob dd__blob--l" aria-hidden />
            <div className="dd__blob dd__blob--r" aria-hidden />
            <div className="dd__blob dd__blob--c" aria-hidden />

            <div className="dd__inner">
              <div className="dd__head">
                <h2 className="dd__h2">
                  From data in <em>to decisions out.</em>
                </h2>
                <p className="dd__lede">Connect your Tally, POS, and inventory data in one place.</p>
                <p className="dd__lede2">
                  PlatePielet turns those numbers into live dashboards, risk alerts, and clear
                  recommendations for purchasing, stock control, costs, and daily operations.
                </p>
              </div>

              <div className="dd__mantra" aria-hidden>
                <span className="dd__mantra-row">
                  <svg className="dd__mantra-marks" width="36" height="16" viewBox="0 0 42 18" fill="none">
                    <path d="M3 11l2.5-6 2.5 5 2-4 1.5 3" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M18 10l2-5 2 4.5 1.6-3.2 1.2 2.4" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
                    <path d="M30 9l1.6-3.5 1.6 3 1.2-2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                  Connect your data. See what matters. <em>Act the same day.</em>
                </span>
              </div>

              <div className="dd__flow">
                <div className="dd__col">
                  <div className="dd__col-label">
                    DATA SOURCES
                    <ScribbleArrow />
                  </div>
                </div>
                <div aria-hidden />
                <div className="dd__col dd__col--out">
                  <div className="dd__col-label">
                    DECISIONS &amp; ACTIONS
                    <ScribbleArrow flip />
                  </div>
                </div>

                <div className="dd__flow-body" ref={bodyRef}>
                  <svg className="dd__wires" aria-hidden>
                    {paths.map((p) => (
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

                  <div className="dd__stack">
                    {SOURCES.map((s, i) => (
                      <div
                        key={s.label}
                        ref={(el) => {
                          inRefs.current[i] = el;
                        }}
                      >
                        <Tile {...s} side="in" />
                      </div>
                    ))}
                  </div>

                  <div className="dd__hub-col">
                    <div className="dd__hub-wrap">
                      <svg className="dd__orbits" viewBox="0 0 180 180" aria-hidden>
                        <circle cx="90" cy="90" r="50" />
                        <circle cx="90" cy="90" r="68" />
                        <circle cx="90" cy="90" r="86" />
                      </svg>
                      <div className="dd__mascot-wrap">
                        <svg className="dd__mascot-marks" viewBox="0 0 140 56" fill="none" aria-hidden>
                          <path d="M18 28c6-10 8-18 6-24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                          <path d="M34 22c4-8 4-14 1-20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M106 22c-4-8-4-14-1-20" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                          <path d="M122 28c-6-10-8-18-6-24" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                        </svg>
                        <div className="dd__mascot">
                          <img src="/hero/hero-mascot.png" alt="" />
                        </div>
                      </div>
                      <div className="dd__hub" ref={hubRef}>
                        <Sparkles size={18} strokeWidth={2} />
                        <b>Pilot AI</b>
                      </div>
                    </div>
                  </div>

                  <div className="dd__stack">
                    {OUTPUTS.map((s, i) => (
                      <div
                        key={s.label}
                        ref={(el) => {
                          outRefs.current[i] = el;
                        }}
                      >
                        <Tile {...s} side="out" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="dd__props">
                <div className="dd__prop-left">
                  <img src="/hero/why-crate.jpg" alt="" />
                  <div className="dd__note" aria-hidden>
                    Good ingredients
                    <br />
                    Better insights :)
                  </div>
                </div>

                <div className="dd__prop-center">
                  <Link to="/demo" className="dd__cta">
                    See it on your data <ArrowRight size={14} strokeWidth={2.4} />
                  </Link>
                </div>

                <div className="dd__prop-right">
                  <div className="dd__ai-rec">
                    <div className="dd__ai-rec-tag">
                      <Sparkles size={12} strokeWidth={2.2} />
                      AI Recommendation
                    </div>
                    <p>Increase purchase quantity of chicken by 20% next week.</p>
                  </div>
                  <svg className="dd__bowl-arrow" width="32" height="42" viewBox="0 0 36 48" fill="none" aria-hidden>
                    <path
                      d="M18 2c2 10-1 18 1 28"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                    />
                    <path
                      d="M10 24c4 4 7 8 9 14 3-5 8-8 13-10"
                      stroke="currentColor"
                      strokeWidth="2.4"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="dd__bowl">
                    <img src="/hero/why-bowl.jpg" alt="" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
