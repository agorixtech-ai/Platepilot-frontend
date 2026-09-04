import { Link } from "react-router-dom";
import { useLayoutEffect, useRef, useState } from "react";
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

function curve(from: Pt, to: Pt, pullY: number) {
  const mx = (from.x + to.x) / 2;
  return `M${from.x} ${from.y} C${mx} ${from.y + pullY}, ${mx} ${to.y + pullY}, ${to.x} ${to.y}`;
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
        <Icon size={18} strokeWidth={1.9} />
      </div>
      <div className="dd__tile-copy">
        <strong>{label}</strong>
        <p>{desc}</p>
      </div>
    </div>
  );
}

export function DataDecisionSection({ visible }: { visible: boolean }) {
  const bodyRef = useRef<HTMLDivElement>(null);
  const hubRef = useRef<HTMLDivElement>(null);
  const inRefs = useRef<(HTMLDivElement | null)[]>([]);
  const outRefs = useRef<(HTMLDivElement | null)[]>([]);
  const [paths, setPaths] = useState<{ d: string; stroke: string }[]>([]);

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
      const hubPt: Pt = {
        x: hr.left + hr.width / 2 - br.left,
        y: hr.top + hr.height / 2 - br.top,
      };

      const next: { d: string; stroke: string }[] = [];
      inRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const from: Pt = { x: r.right - br.left, y: r.top + r.height / 2 - br.top };
        const pull = i === 1 ? 0 : i === 0 ? -18 : 18;
        next.push({ d: curve(from, hubPt, pull), stroke: WIRE_IN[i] });
      });
      outRefs.current.forEach((el, i) => {
        if (!el) return;
        const r = el.getBoundingClientRect();
        const to: Pt = { x: r.left - br.left, y: r.top + r.height / 2 - br.top };
        const pull = i === 1 ? 0 : i === 0 ? -18 : 18;
        next.push({ d: curve(hubPt, to, pull), stroke: WIRE_OUT[i] });
      });
      setPaths(next);
    };

    measure();
    const ro = new ResizeObserver(measure);
    ro.observe(body);
    window.addEventListener("resize", measure);
    return () => {
      ro.disconnect();
      window.removeEventListener("resize", measure);
    };
  }, []);

  return (
    <section className={`dd reveal${visible ? " show" : ""}`}>
      <style>{`
        .dd {
          position: relative;
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 80px;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }
        .dd__bg {
          position: absolute;
          inset: 40px 12px 12px;
          border-radius: 40px;
          background: #FFFFFF;
          z-index: 0;
          pointer-events: none;
        }
        .dd__head {
          position: relative;
          z-index: 1;
          display: grid;
          grid-template-columns: minmax(0, 1.25fr) minmax(0, 0.85fr);
          gap: 36px;
          align-items: end;
          margin-bottom: 28px;
        }
        .dd__tag {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 14px;
        }
        .dd__tag::before {
          content: '';
          width: 2px;
          height: 12px;
          background: ${T.accent};
          flex-shrink: 0;
        }
        .dd__h2 {
          font-size: clamp(30px, 4vw, 46px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0;
          color: ${T.text};
          max-width: 560px;
        }
        .dd__h2 em {
          font-style: normal;
          color: ${T.accentSolid};
        }
        .dd__body {
          margin: 0;
          font-size: 15px;
          line-height: 1.7;
          color: ${T.muted};
          max-width: 380px;
          justify-self: end;
        }
        .dd__mantra {
          margin-top: 14px;
          font-size: 14px;
          font-weight: 700;
          color: ${T.text};
          display: inline-block;
        }
        .dd__mantra span {
          color: ${T.accentSolid};
          text-decoration: underline;
          text-decoration-thickness: 2px;
          text-underline-offset: 4px;
        }

        .dd__stage {
          position: relative;
          z-index: 1;
          padding: 12px 4px 8px;
        }
        .dd__flow {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          column-gap: clamp(20px, 3.5vw, 40px);
          align-items: start;
        }
        .dd__col {
          display: flex;
          flex-direction: column;
          min-width: 0;
        }
        .dd__col-label {
          font-size: 12px;
          font-weight: 800;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #4ADE80;
          margin-bottom: 14px;
          display: flex;
          align-items: center;
          gap: 8px;
          min-height: 20px;
        }
        .dd__col--out .dd__col-label { justify-content: flex-end; }

        .dd__flow-body {
          position: relative;
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          column-gap: clamp(20px, 3.5vw, 40px);
          align-items: stretch;
          grid-column: 1 / -1;
        }
        .dd__stack {
          display: flex;
          flex-direction: column;
          gap: 14px;
          position: relative;
          z-index: 2;
        }

        .dd__tile {
          position: relative;
          display: grid;
          grid-template-columns: 40px minmax(0, 1fr);
          gap: 10px 12px;
          align-items: start;
          padding: 14px 16px;
          min-height: 88px;
          background: #fff;
          border: 1px solid rgba(21,32,25,0.07);
          border-radius: 16px;
          box-shadow: 0 8px 22px rgba(7,26,20,0.06);
          box-sizing: border-box;
        }
        .dd__tile-ico {
          width: 40px;
          height: 40px;
          border-radius: 12px;
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
          margin-bottom: 4px;
        }
        .dd__tile p {
          margin: 0;
          font-size: 12px;
          line-height: 1.45;
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
          box-shadow: 0 0 0 3px #fff;
          z-index: 2;
        }
        .dd__tile--in::after { right: -5px; }
        .dd__tile--out::after { left: -5px; }

        .dd__hub-col {
          display: flex;
          align-items: center;
          justify-content: center;
          align-self: stretch;
          width: clamp(140px, 16vw, 172px);
          position: relative;
          z-index: 2;
        }
        .dd__hub-wrap {
          position: relative;
          display: flex;
          flex-direction: column;
          align-items: center;
          z-index: 2;
        }
        .dd__glow {
          position: absolute;
          left: 50%;
          top: 50%;
          transform: translate(-50%, -50%);
          width: 220px;
          height: 220px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.3) 0%, rgba(34,197,94,0.08) 45%, transparent 70%);
          filter: blur(8px);
          z-index: 0;
          pointer-events: none;
        }
        .dd__mascot {
          position: absolute;
          left: 50%;
          bottom: calc(100% + 10px);
          transform: translateX(-50%);
          z-index: 2;
          width: clamp(100px, 12vw, 132px);
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.12));
          pointer-events: none;
        }
        .dd__mascot img { width: 100%; height: auto; display: block; }
        .dd__hub {
          position: relative;
          z-index: 2;
          width: 96px;
          height: 96px;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 28%, #22C55E, #0F7A4C 72%);
          color: #fff;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          gap: 3px;
          border: 3px solid #fff;
          box-shadow:
            0 0 0 8px rgba(34,197,94,0.14),
            0 0 0 18px rgba(34,197,94,0.07),
            0 14px 32px rgba(7,59,42,0.22);
          flex-shrink: 0;
        }
        .dd__hub b {
          font-size: 11px;
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

        .dd__props {
          display: grid;
          grid-template-columns: minmax(0, 1fr) auto minmax(0, 1fr);
          align-items: end;
          gap: 16px;
          margin-top: 28px;
          padding: 0 4px 8px;
        }
        .dd__prop-left {
          position: relative;
          justify-self: start;
          width: min(220px, 100%);
        }
        .dd__prop-left img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.12));
        }
        .dd__note {
          position: absolute;
          left: 52%;
          bottom: 18%;
          background: #fff;
          border-radius: 10px;
          padding: 10px 12px;
          font-size: 12px;
          font-weight: 700;
          line-height: 1.35;
          color: ${T.text};
          box-shadow: 0 8px 20px rgba(7,26,20,0.1);
          transform: rotate(-4deg);
          max-width: 120px;
        }
        .dd__note em {
          font-style: normal;
          color: ${T.accentSolid};
        }
        .dd__prop-center {
          justify-self: center;
          align-self: center;
          padding-bottom: 12px;
        }
        .dd__cta {
          display: inline-flex;
          align-items: center;
          gap: 8px;
          padding: 12px 22px;
          border-radius: 999px;
          background: #0B3B28;
          color: #fff !important;
          font-size: 14px;
          font-weight: 700;
          text-decoration: none;
          box-shadow: 0 14px 28px rgba(7,26,20,0.22);
          transition: transform 0.2s ease, background 0.2s ease;
          white-space: nowrap;
        }
        .dd__cta:hover {
          transform: translateY(-2px);
          background: #0F4A32;
        }
        .dd__prop-right {
          justify-self: end;
          display: flex;
          flex-direction: column;
          align-items: flex-end;
          gap: 12px;
          width: min(240px, 100%);
        }
        .dd__ai-rec {
          background: #fff;
          border-radius: 14px;
          padding: 12px 14px;
          box-shadow: 0 10px 26px rgba(7,26,20,0.1);
          border: 1px solid rgba(21,32,25,0.06);
          width: 100%;
          max-width: 220px;
        }
        .dd__ai-rec-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 11px;
          font-weight: 800;
          color: #2563EB;
          margin-bottom: 6px;
        }
        .dd__ai-rec p {
          margin: 0;
          font-size: 12.5px;
          line-height: 1.45;
          color: ${T.muted};
        }
        .dd__ai-rec p b { color: ${T.text}; font-weight: 700; }
        .dd__bowl { width: min(180px, 90%); }
        .dd__bowl img {
          width: 100%;
          height: auto;
          display: block;
          filter: drop-shadow(0 12px 20px rgba(0,0,0,0.12));
        }

        @media (max-width: 1100px) {
          .dd { padding: 56px 24px 64px; }
          .dd__tile { min-height: 84px; padding: 12px 14px; }
          .dd__tile strong { font-size: 13px; }
          .dd__tile p { font-size: 11.5px; }
        }

        @media (max-width: 900px) {
          .dd { padding: 48px 20px 56px; }
          .dd__bg { inset: 0; border-radius: 24px; }
          .dd__head {
            grid-template-columns: 1fr;
            gap: 14px;
            align-items: start;
          }
          .dd__body { justify-self: start; max-width: none; }
          .dd__flow {
            grid-template-columns: 1fr;
            row-gap: 24px;
          }
          .dd__flow-body {
            grid-template-columns: 1fr;
            row-gap: 20px;
          }
          .dd__wires { display: none; }
          .dd__hub-col {
            width: auto;
            align-self: center;
            min-height: 200px;
            order: -1;
          }
          .dd__hub-wrap { gap: 10px; }
          .dd__mascot {
            position: relative;
            left: auto;
            bottom: auto;
            transform: none;
          }
          .dd__col--out .dd__col-label { justify-content: flex-start; }
          .dd__tile--in::after,
          .dd__tile--out::after { display: none; }
          .dd__props {
            grid-template-columns: 1fr;
            justify-items: center;
            gap: 20px;
          }
          .dd__prop-left,
          .dd__prop-right {
            justify-self: center;
            align-items: center;
            width: min(260px, 100%);
          }
        }
      `}</style>

      <div className="dd__bg" aria-hidden />

      <div className="dd__head">
        <div>
          <div className="dd__tag">How It Works</div>
          <h2 className="dd__h2">
            From data in <em>to decisions out.</em>
          </h2>
        </div>
        <div>
          <p className="dd__body">
            Connect your Tally, POS, and inventory data in one place. PlatePielet turns those numbers
            into live dashboards, risk alerts, and clear recommendations for purchasing, stock
            control, costs, and daily operations.
          </p>
          <div className="dd__mantra">
            Connect your data. See what matters. <span>Act the same day.</span>
          </div>
        </div>
      </div>

      <div className="dd__stage">
        <div className="dd__flow">
          <div className="dd__col">
            <div className="dd__col-label">
              Data Sources
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
                <path d="M7 1v14M7 15l-4-4M7 15l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
            </div>
          </div>
          <div aria-hidden />
          <div className="dd__col dd__col--out">
            <div className="dd__col-label">
              Decisions & Actions
              <svg width="14" height="18" viewBox="0 0 14 18" fill="none" aria-hidden>
                <path d="M7 1v14M7 15l-4-4M7 15l4-4" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
              </svg>
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
                  strokeDasharray="3.5 6"
                  strokeLinecap="round"
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
                <div className="dd__glow" aria-hidden />
                <div className="dd__mascot">
                  <img src="/hero/hero-mascot.png" alt="" />
                </div>
                <div className="dd__hub" ref={hubRef}>
                  <Sparkles size={22} strokeWidth={2} />
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
              <em>Better insights :)</em>
            </div>
          </div>

          <div className="dd__prop-center">
            <Link to="/demo" className="dd__cta">
              See it on your data <ArrowRight size={15} strokeWidth={2.4} />
            </Link>
          </div>

          <div className="dd__prop-right">
            <div className="dd__ai-rec">
              <div className="dd__ai-rec-tag">
                <Sparkles size={13} strokeWidth={2.2} />
                AI Recommendation
              </div>
              <p>
                <b>Increase purchase quantity of chicken by 20%</b> next week.
              </p>
            </div>
            <div className="dd__bowl">
              <img src="/hero/why-bowl.jpg" alt="" />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
