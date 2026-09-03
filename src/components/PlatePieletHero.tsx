import { useEffect, useState, type ReactNode } from "react";
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
  accentSolid: "#15803D",
  accentSoft: "rgba(22,163,74,0.12)",
  accentBorder: "rgba(22,163,74,0.28)",
  accentGlow: "rgba(22,163,74,0.4)",
  purple: "#D97706",
  warn: "#F59E0B",
  limeDark: "#0A1A10",
  gradient: "linear-gradient(90deg, #073B2A 0%, #0F7A4C 50%, #22C55E 100%)",
  gradientHover: "linear-gradient(90deg, #0A4A35 0%, #12965C 50%, #4ADE80 100%)",
  gradientA: "linear-gradient(90deg, #073B2A 0%, #0F7A4C 100%)",
  gradientB: "linear-gradient(90deg, #0F7A4C 0%, #16A34A 100%)",
  gradientCTA: "linear-gradient(135deg, #073B2A 0%, #0F7A4C 55%, #15803D 100%)",
  gradientMint: "linear-gradient(135deg, #16A34A 0%, #84CC16 55%, #ECFCCB 100%)",
  glowHero:
    "radial-gradient(closest-side, rgba(34,197,94,0.35) 0%, rgba(163,230,53,0.16) 40%, rgba(255,255,255,0) 70%)",
  cardGlassBg: "#FFFFFF",
} as const;

const gradientClip = (gradient: string) =>
  ({
    background: gradient,
    WebkitBackgroundClip: "text",
    WebkitTextFillColor: "transparent",
    backgroundClip: "text",
  }) as const;

const IMG = {
  chefs: ["/hero/hero-chef.jpg", "/hero/hero-chef-2.jpg", "/hero/hero-chef-3.jpg"] as const,
  mascot: "/hero/hero-mascot.png",
  tomatoes: "/hero/hero-tomatoes1.jpg",
  salad: "/hero/hero-salad.jpg",
  butter: "/hero/hero-butter-chicken.jpg",
  biryani: "/hero/hero-biryani.jpg",
  paneer: "/hero/hero-paneer.jpg",
} as const;

const TOP_SELLING = [
  { name: "Butter Chicken", pct: 62, img: IMG.butter },
  { name: "Biryani", pct: 48, img: IMG.biryani },
  { name: "Paneer Tikka", pct: 36, img: IMG.paneer },
] as const;

const FEATURES = [
  {
    title: "Smart Inventory",
    desc: "Live stock tracking with low stock alerts",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <path d="M3.3 7 12 12l8.7-5M12 22V12" />
      </svg>
    ),
  },
  {
    title: "Waste Detection",
    desc: "AI detects spoilage, over-prep & shrinkage",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
      </svg>
    ),
  },
  {
    title: "Purchase Optimization",
    desc: "Buy right, at the right time, at the best price",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <circle cx="9" cy="20" r="1.5" />
        <circle cx="18" cy="20" r="1.5" />
        <path d="M3 4h2l2.4 12h11.2l2-8H7" />
      </svg>
    ),
  },
  {
    title: "Automated Reports",
    desc: "Real-time insights and performance reports",
    icon: (
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8">
        <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z" />
        <path d="M14 2v6h6M8 13h8M8 17h5" />
      </svg>
    ),
  },
] as const;

function LiveFoodCost() {
  const [cost, setCost] = useState(0);
  const [delta, setDelta] = useState(2.1);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setCost(28.6);
      setDelta(2.1);
      return;
    }

    const base = 28.6;
    const t0 = performance.now();
    let raf = 0;
    let lastTick = 0;

    const tick = (now: number) => {
      const intro = Math.min(1, (now - t0) / 1100);
      if (intro < 1) {
        setCost(base * (1 - Math.pow(1 - intro, 3)));
      } else if (now - lastTick > 180) {
        lastTick = now;
        const wobble = Math.sin(now / 900) * 0.35 + Math.sin(now / 430) * 0.18;
        const noise = (Math.random() - 0.5) * 0.12;
        setCost(base + wobble + noise);
        setDelta(2.1 + Math.sin(now / 1100) * 0.22 + (Math.random() - 0.5) * 0.08);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  const down = delta >= 0;
  return (
    <>
      <div className="pp-hero__metric">
        {cost.toFixed(1)}%
      </div>
      <div className={`pp-hero__delta${down ? "" : " pp-hero__delta--up"}`}>
        {down ? "↓" : "↑"} {Math.abs(delta).toFixed(1)}% vs last week
      </div>
    </>
  );
}

function ProgressBar({ pct, delay }: { pct: number; delay: string }) {
  return (
    <div className="pp-hero__bar">
      <div className="pp-hero__bar-fill" style={{ width: `${pct}%`, animationDelay: delay }} />
    </div>
  );
}

function Float({
  className,
  delay,
  variant = "a",
  children,
}: {
  className?: string;
  delay: string;
  variant?: "a" | "b" | "c";
  children: ReactNode;
}) {
  return (
    <div
      className={`pp-hero__float pp-hero__float--${variant}${className ? ` ${className}` : ""}`}
      style={{ ["--d" as string]: delay }}
    >
      {children}
    </div>
  );
}

function FoodCostCard() {
  return (
    <div className="pp-hero__card">
      <div className="pp-hero__card-row">
        <div>
          <div className="pp-hero__label">Food Cost</div>
          <LiveFoodCost />
        </div>
        <div className="pp-hero__icon-pill" aria-hidden>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M3 17l6-6 4 4 7-7" />
            <path d="M14 8h6v6" />
          </svg>
        </div>
      </div>
      <svg className="pp-hero__spark" viewBox="0 0 180 30" aria-hidden>
        <path
          d="M2 22 C22 20, 32 8, 52 10 S80 24, 102 12 S138 4, 178 8"
          fill="none"
          stroke="#16A34A"
          strokeWidth="2.4"
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}

function WasteAlertCard() {
  return (
    <div className="pp-hero__card pp-hero__card--waste">
      <div className="pp-hero__waste">
        <span className="pp-hero__warn-icon" aria-hidden>
          <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M10.3 3.9 1.8 18.2A2 2 0 0 0 3.5 21h17a2 2 0 0 0 1.7-2.8L13.7 3.9a2 2 0 0 0-3.4 0z" />
            <path d="M12 9v5" />
            <circle cx="12" cy="17.2" r="0.9" fill="currentColor" stroke="none" />
          </svg>
        </span>
        <div className="pp-hero__waste-copy">
          <div className="pp-hero__title">Waste Alert</div>
          <div className="pp-hero__body">High wastage detected</div>
          <div className="pp-hero__warn-text">Tomatoes • 8.5 kg</div>
        </div>
      </div>
      <img className="pp-hero__waste-bowl" src={IMG.tomatoes} alt="" draggable={false} />
    </div>
  );
}

function TopSellingCard() {
  return (
    <div className="pp-hero__card">
      <div className="pp-hero__title" style={{ marginBottom: 12 }}>
        Top Selling Items
      </div>
      <div className="pp-hero__sell-list">
        {TOP_SELLING.map((item, i) => (
          <div key={item.name} className="pp-hero__sell-row">
            <img src={item.img} alt="" className="pp-hero__sell-img" draggable={false} />
            <div className="pp-hero__sell-meta">
              <div className="pp-hero__sell-name">{item.name}</div>
              <ProgressBar pct={item.pct} delay={`${0.5 + i * 0.1}s`} />
            </div>
            <div className="pp-hero__sell-pct">{item.pct}%</div>
          </div>
        ))}
      </div>
    </div>
  );
}

function AiCard() {
  return (
    <div className="pp-hero__card">
      <div className="pp-hero__card-row" style={{ alignItems: "center", marginBottom: 10, gap: 8 }}>
        <span className="pp-hero__sparkle" aria-hidden>
          <svg width="11" height="11" viewBox="0 0 16 16" fill="currentColor">
            <path d="M8 1l1.5 4.5L14 7l-4.5 1.5L8 14l-1.5-4.5L2 7l4.5-1.5z" />
          </svg>
        </span>
        <span className="pp-hero__title">AI Recommendation</span>
      </div>
      <div className="pp-hero__ai-row">
        <img src={IMG.paneer} alt="" className="pp-hero__ai-img" draggable={false} />
        <p className="pp-hero__body">Increase portion size of Paneer Tikka in Branch 2.</p>
      </div>
    </div>
  );
}

function PosCard() {
  return (
    <div className="pp-hero__card">
      <div className="pp-hero__sync-row">
        <span className="pp-hero__badge pp-hero__badge--tally">Tally</span>
        <span className="pp-hero__sync-arrows" aria-hidden>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M7 7h11l-3-3M17 17H6l3 3" />
          </svg>
        </span>
        <span className="pp-hero__badge pp-hero__badge--pos">POS</span>
        <span className="pp-hero__check" aria-hidden>
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4">
            <path d="M20 6 9 17l-5-5" />
          </svg>
        </span>
      </div>
      <div className="pp-hero__title" style={{ marginTop: 8 }}>
        POS &amp; Tally Synced
      </div>
      <p className="pp-hero__body" style={{ marginTop: 4 }}>
        All sales, purchases &amp; vouchers reconciled automatically.
      </p>
    </div>
  );
}

function ChefPhotoRotator() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % IMG.chefs.length);
    }, 3200);
    return () => window.clearInterval(id);
  }, []);

  return (
    <div className="pp-hero__chef-photo">
      {IMG.chefs.map((src, i) => (
        <img
          key={src}
          src={src}
          alt={i === 0 ? "Chef reviewing live kitchen insights on a tablet" : ""}
          draggable={false}
          className={i === index ? "is-active" : undefined}
          aria-hidden={i !== index}
        />
      ))}
    </div>
  );
}

/** Full reference illustration — chef hub + orbiting cards + props + feature arc */
function HeroComposition() {
  return (
    <div className="pp-hero__art" aria-label="PlatePielet product overview">
      {/* Glow + pale disc */}
      <div className="pp-hero__glow" aria-hidden />
      <div className="pp-hero__pale" aria-hidden />

      {/* Concentric dashed orbits + flow connectors */}
      <svg className="pp-hero__orbit" viewBox="0 0 1080 720" preserveAspectRatio="xMidYMid meet" aria-hidden>
        <defs>
          <marker id="pp-arrow" markerWidth="6" markerHeight="6" refX="5" refY="3" orient="auto">
            <path d="M0,0 L6,3 L0,6 Z" fill="rgba(22,163,74,0.45)" />
          </marker>
        </defs>
        <circle className="pp-hero__ring-a" cx="540" cy="330" r="270" />
        <circle className="pp-hero__ring-b" cx="540" cy="330" r="220" />
        <circle className="pp-hero__ring-c" cx="540" cy="330" r="170" />
        <path className="pp-hero__flow" d="M220 120 C300 180, 360 240, 430 280" markerEnd="url(#pp-arrow)" />
        <path className="pp-hero__flow" d="M860 110 C780 170, 720 230, 650 275" markerEnd="url(#pp-arrow)" />
        <path className="pp-hero__flow" d="M210 380 C290 360, 360 345, 430 340" markerEnd="url(#pp-arrow)" />
        <path className="pp-hero__flow" d="M870 360 C790 345, 720 335, 650 330" markerEnd="url(#pp-arrow)" />
        <path className="pp-hero__flow" d="M850 500 C760 450, 680 400, 620 370" markerEnd="url(#pp-arrow)" />
        <path className="pp-hero__feat-arc" d="M100 640 Q540 580 980 640" />
      </svg>

      {/* Top analytics badge */}
      <Float className="pp-hero__analytics" delay="0.08s" variant="a">
        <div className="pp-hero__analytics-badge" aria-hidden>
          <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2">
            <path d="M4 19V9M10 19V5M16 19v-7M20 19V8" />
            <path d="M3 19h18" />
          </svg>
        </div>
      </Float>

      {/* Chef hub */}
      <div className="pp-hero__chef">
        <div className="pp-hero__chef-halo">
          <div className="pp-hero__chef-ring">
            <ChefPhotoRotator />
          </div>
        </div>
      </div>

      {/* Cards */}
      <Float className="pp-hero__slot pp-hero__slot--food" delay="0.15s" variant="a">
        <FoodCostCard />
      </Float>
      <Float className="pp-hero__slot pp-hero__slot--waste" delay="0.22s" variant="b">
        <WasteAlertCard />
      </Float>
      <Float className="pp-hero__slot pp-hero__slot--selling" delay="0.3s" variant="b">
        <TopSellingCard />
      </Float>
      <Float className="pp-hero__slot pp-hero__slot--ai" delay="0.38s" variant="a">
        <AiCard />
      </Float>
      <Float className="pp-hero__slot pp-hero__slot--pos" delay="0.46s" variant="c">
        <PosCard />
      </Float>

      {/* Props from reference */}
      <Float className="pp-hero__prop pp-hero__prop--mascot" delay="0.55s" variant="b">
        <img src={IMG.mascot} alt="" draggable={false} />
      </Float>
      <Float className="pp-hero__prop pp-hero__prop--salad" delay="0.6s" variant="a">
        <img src={IMG.salad} alt="" draggable={false} />
      </Float>

      {/* Feature icons sitting on the bottom dashed arc */}
      <div className="pp-hero__arc-features">
        {FEATURES.map((f) => (
          <div key={f.title} className="pp-hero__arc-feature">
            <div className="pp-hero__arc-icon">{f.icon}</div>
            <div className="pp-hero__arc-title">{f.title}</div>
            <div className="pp-hero__arc-desc">{f.desc}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function PlatePieletHero() {
  return (
    <section className="pp-hero">
      <style>{`
        .pp-hero {
          --pp-max: 1280px;
          --pp-pad: clamp(20px, 4vw, 40px);
          --pp-chef: clamp(170px, 22vw, 260px);
          position: relative;
          width: 100%;
          overflow-x: clip;
          overflow-y: visible;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
          background:
            radial-gradient(900px 560px at 50% 48%, rgba(22,163,74,0.1), transparent 62%),
            ${T.bg};
          border-bottom: 1px solid ${T.border};
        }
        .pp-hero__bg {
          position: absolute;
          inset: 0;
          background-image:
            linear-gradient(rgba(21,32,25,.16) 1px, transparent 1px),
            linear-gradient(90deg, rgba(21,32,25,.16) 1px, transparent 1px);
          background-size: 56px 56px;
          opacity: 0.04;
          pointer-events: none;
        }
        .pp-hero__inner {
          position: relative;
          z-index: 1;
          max-width: var(--pp-max);
          margin-inline: auto;
          padding: clamp(28px, 4vw, 48px) var(--pp-pad) clamp(40px, 5vw, 56px);
          box-sizing: border-box;
        }

        /* Half / half: copy | illustration */
        .pp-hero__main {
          display: grid;
          grid-template-columns: minmax(0, 1fr) minmax(0, 1.08fr);
          gap: clamp(20px, 3vw, 40px);
          align-items: center;
          min-width: 0;
        }

        .pp-hero__copy {
          min-width: 0;
          max-width: 520px;
          text-align: left;
          animation: pp-up .7s .05s both;
        }
        .pp-hero__copy h1 {
          font-weight: 800;
          font-size: clamp(30px, 3.2vw, 48px);
          line-height: 1.12;
          letter-spacing: -0.035em;
          margin: 0;
        }
        .pp-hero__copy p {
          font-size: clamp(14.5px, 1.1vw, 16.5px);
          line-height: 1.7;
          color: ${T.muted};
          margin: 16px 0 0;
          max-width: 460px;
        }
        .pp-hero__ctas {
          display: flex;
          flex-wrap: wrap;
          justify-content: flex-start;
          gap: 12px;
          margin-top: 28px;
        }
        .pp-btn {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          box-sizing: border-box;
          font-family: inherit;
          text-decoration: none;
          line-height: 1;
          white-space: nowrap;
          font-size: 15px;
          font-weight: 700;
          letter-spacing: 0.04em;
          height: 48px;
          padding: 0 22px;
          border-radius: 12px;
          transition: box-shadow .2s ease, transform .15s ease;
        }
        .pp-btn--solid {
          color: ${T.ink};
          border: none;
          background: ${T.gradientCTA};
          box-shadow: 0 4px 14px rgba(15,122,76,0.28);
        }
        .pp-btn--solid:hover {
          box-shadow: 0 10px 26px rgba(15,122,76,0.38);
          transform: translateY(-1px);
        }
        .pp-btn--outline {
          color: ${T.accentSolid};
          border: 1px solid ${T.accent};
          background: #fff;
        }

        /* ══════════════════════════════════════════
           THE ILLUSTRATION (matches reference image)
           ══════════════════════════════════════════ */
        .pp-hero__art {
          position: relative;
          width: 100%;
          max-width: none;
          margin-inline: 0;
          aspect-ratio: 1 / 1.05;
          max-height: 580px;
          overflow: visible;
          animation: pp-fade .7s .12s both;
          min-width: 0;
        }

        .pp-hero__glow {
          position: absolute;
          left: 50%;
          top: 44%;
          width: 58%;
          height: 70%;
          transform: translate(-50%, -50%);
          background: ${T.glowHero};
          filter: blur(28px);
          pointer-events: none;
          z-index: 0;
        }
        .pp-hero__pale {
          position: absolute;
          left: 50%;
          top: 44%;
          width: calc(var(--pp-chef) * 1.28);
          height: calc(var(--pp-chef) * 1.28);
          transform: translate(-50%, -50%);
          border-radius: 50%;
          background: rgba(210, 242, 222, 0.55);
          pointer-events: none;
          z-index: 1;
        }

        .pp-hero__orbit {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 2;
          overflow: visible;
        }
        .pp-hero__ring-a,
        .pp-hero__ring-b,
        .pp-hero__ring-c {
          fill: none;
          stroke: rgba(22,163,74,0.32);
          stroke-width: 1.4;
          stroke-dasharray: 5 7;
        }
        .pp-hero__ring-a { animation: pp-dash 34s linear infinite; }
        .pp-hero__ring-b {
          stroke: rgba(22,163,74,0.2);
          stroke-dasharray: 3 9;
          animation: pp-dash 46s linear infinite reverse;
        }
        .pp-hero__ring-c {
          stroke: rgba(22,163,74,0.12);
          stroke-dasharray: 2 11;
          animation: pp-dash 58s linear infinite;
        }
        .pp-hero__flow {
          fill: none;
          stroke: rgba(22,163,74,0.35);
          stroke-width: 1.3;
          stroke-dasharray: 4 6;
          animation: pp-dash 22s linear infinite;
        }
        .pp-hero__feat-arc {
          fill: none;
          stroke: rgba(22,163,74,0.28);
          stroke-width: 1.4;
          stroke-dasharray: 4 7;
        }

        /* Analytics badge */
        .pp-hero__analytics {
          position: absolute;
          left: calc(50% - 20px);
          top: 1%;
          z-index: 8;
        }
        .pp-hero__analytics-badge {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background: linear-gradient(145deg, #22C55E, #0F7A4C);
          color: #fff;
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 8px 18px rgba(22,163,74,0.35);
        }
        .pp-hero__analytics-badge svg { width: 18px; height: 18px; }

        /* Chef */
        .pp-hero__chef {
          position: absolute;
          left: 50%;
          top: 44%;
          transform: translate(-50%, -50%);
          width: var(--pp-chef);
          height: var(--pp-chef);
          z-index: 4;
          animation: pp-pop .75s .05s both;
        }
        .pp-hero__chef-halo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 9px;
          box-sizing: border-box;
          background: rgba(34,197,94,0.14);
          box-shadow: 0 0 0 12px rgba(34,197,94,0.07);
        }
        .pp-hero__chef-ring {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          padding: 6px;
          box-sizing: border-box;
          background: linear-gradient(145deg, #22C55E 0%, #16A34A 45%, #0F7A4C 100%);
          box-shadow: 0 16px 40px rgba(7,59,42,0.18);
          animation: pp-ring 4s 1s ease-in-out infinite;
        }
        .pp-hero__chef-photo {
          position: relative;
          width: 100%;
          height: 100%;
          border-radius: 50%;
          overflow: hidden;
          border: 4px solid #fff;
          background: ${T.inset};
          box-sizing: border-box;
        }
        .pp-hero__chef-photo img {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          object-fit: cover;
          object-position: center 16%;
          display: block;
          opacity: 0;
          transition: opacity 0.7s ease;
        }
        .pp-hero__chef-photo img.is-active {
          opacity: 1;
          z-index: 1;
        }

        /* Card slots — scaled for half-width column */
        .pp-hero__slot { position: absolute; z-index: 6; }
        .pp-hero__slot--food {
          left: 0;
          top: 4%;
          width: min(190px, 40%);
        }
        .pp-hero__slot--waste {
          right: 0;
          top: 3%;
          width: min(220px, 44%);
          overflow: visible;
          z-index: 8;
        }
        .pp-hero__slot--selling {
          left: 0;
          top: 38%;
          width: min(200px, 42%);
        }
        .pp-hero__slot--ai {
          right: 0;
          top: 32%;
          width: min(200px, 42%);
        }
        .pp-hero__slot--pos {
          right: 1%;
          bottom: 16%;
          top: auto;
          width: min(210px, 44%);
        }

        /* Decorative props */
        .pp-hero__prop {
          position: absolute;
          z-index: 5;
          pointer-events: none;
        }
        .pp-hero__prop img {
          width: 100%;
          height: 100%;
          object-fit: contain;
          display: block;
          filter: drop-shadow(0 8px 16px rgba(0,0,0,0.12));
        }
        .pp-hero__prop--mascot {
          left: 0;
          bottom: 18%;
          width: clamp(64px, 9vw, 88px);
          height: clamp(64px, 9vw, 88px);
          z-index: 7;
        }
        .pp-hero__prop--salad {
          right: 0;
          bottom: 16%;
          width: clamp(90px, 12vw, 130px);
          height: clamp(68px, 9vw, 95px);
        }

        .pp-hero__arc-features {
          position: absolute;
          left: 0;
          right: 0;
          bottom: 0;
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 4px;
          z-index: 6;
          animation: pp-up .7s .4s both;
        }
        .pp-hero__arc-icon {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          margin: 0 auto 6px;
          background: #fff;
          border: 1.5px solid ${T.accentBorder};
          box-shadow: 0 3px 10px rgba(22,163,74,0.12);
          color: ${T.accentSolid};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .pp-hero__arc-icon svg { width: 14px; height: 14px; }
        .pp-hero__arc-title {
          font-size: 10.5px;
          font-weight: 700;
          color: ${T.text};
          line-height: 1.2;
        }
        .pp-hero__arc-desc {
          font-size: 9.5px;
          color: ${T.faint};
          line-height: 1.3;
          margin-top: 2px;
          max-width: 120px;
          margin-inline: auto;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        /* Float — entrance only (no bobbing) */
        .pp-hero__float {
          animation: pp-fade .65s var(--d, 0s) both;
        }
        .pp-hero__float--b,
        .pp-hero__float--c {
          animation: pp-fade .65s var(--d, 0s) both;
        }

        /* Cards */
        .pp-hero__card {
          background: ${T.cardGlassBg};
          border: 1px solid rgba(21,32,25,0.07);
          border-radius: 14px;
          box-shadow: 0 8px 22px rgba(7,26,20,0.08);
          padding: 11px 12px;
          box-sizing: border-box;
          width: 100%;
        }
        .pp-hero__card-row {
          display: flex;
          align-items: flex-start;
          justify-content: space-between;
          gap: 8px;
        }
        .pp-hero__label {
          font-size: 11.5px;
          font-weight: 600;
          color: ${T.muted};
        }
        .pp-hero__title {
          font-size: 12.5px;
          font-weight: 700;
          color: ${T.text};
          line-height: 1.25;
        }
        .pp-hero__metric {
          font-size: clamp(22px, 2.4vw, 30px);
          font-weight: 800;
          color: ${T.text};
          letter-spacing: -0.03em;
          line-height: 1.05;
          margin-top: 2px;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .pp-hero__delta {
          font-size: 11px;
          font-weight: 600;
          color: ${T.accentSolid};
          margin-top: 4px;
          white-space: nowrap;
          font-variant-numeric: tabular-nums;
        }
        .pp-hero__delta--up { color: #C2410C; }
        .pp-hero__body {
          font-size: 11.5px;
          color: ${T.soft};
          line-height: 1.45;
          margin: 0;
        }
        .pp-hero__icon-pill {
          width: 30px;
          height: 30px;
          border-radius: 50%;
          background: ${T.accentSoft};
          color: ${T.accentSolid};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pp-hero__sell-img { width: 24px; height: 24px; }
        .pp-hero__ai-img { width: 34px; height: 34px; }
        .pp-hero__arc-feature {
          text-align: center;
          min-width: 0;
          padding: 0 2px;
        }
        .pp-hero__spark {
          display: block;
          width: 100%;
          height: 26px;
          margin-top: 8px;
        }
        .pp-hero__spark path {
          stroke-dasharray: 240;
          animation: pp-draw 1.3s .45s ease both;
        }
        .pp-hero__card--waste {
          position: relative;
          overflow: visible;
          padding-right: 52px;
        }
        .pp-hero__waste {
          display: grid;
          grid-template-columns: 26px 1fr;
          column-gap: 10px;
          align-items: start;
        }
        .pp-hero__waste-copy {
          min-width: 0;
          display: flex;
          flex-direction: column;
          gap: 4px;
        }
        .pp-hero__waste-copy .pp-hero__title {
          line-height: 26px;
        }
        .pp-hero__warn-icon {
          width: 26px;
          height: 26px;
          border-radius: 8px;
          background: #FDE8D8;
          color: #C2410C;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }
        .pp-hero__warn-text {
          font-size: 13px;
          font-weight: 700;
          color: #C2410C;
          white-space: nowrap;
        }
        .pp-hero__waste-bowl {
          position: absolute;
          right: -10px;
          bottom: -18px;
          width: 64px;
          height: 64px;
          object-fit: contain;
          pointer-events: none;
          filter: drop-shadow(0 6px 12px rgba(0,0,0,0.14));
        }
        .pp-hero__sell-list { display: flex; flex-direction: column; gap: 10px; }
        .pp-hero__sell-row {
          display: flex;
          align-items: center;
          gap: 8px;
          min-width: 0;
        }
        .pp-hero__sell-img {
          width: 28px;
          height: 28px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 1.5px solid rgba(22,163,74,0.2);
        }
        .pp-hero__sell-meta { flex: 1; min-width: 0; }
        .pp-hero__sell-name {
          font-size: 11.5px;
          font-weight: 600;
          color: ${T.soft};
          white-space: nowrap;
          overflow: hidden;
          text-overflow: ellipsis;
          margin-bottom: 3px;
        }
        .pp-hero__sell-pct {
          font-size: 12px;
          font-weight: 700;
          color: ${T.muted};
          font-variant-numeric: tabular-nums;
          width: 30px;
          text-align: right;
          flex-shrink: 0;
          white-space: nowrap;
        }
        .pp-hero__bar {
          height: 5px;
          border-radius: 999px;
          background: rgba(22,163,74,0.12);
          overflow: hidden;
        }
        .pp-hero__bar-fill {
          height: 100%;
          border-radius: 999px;
          background: linear-gradient(90deg,#16A34A,#22C55E);
          transform-origin: left center;
          animation: pp-bar .85s cubic-bezier(.22,1,.36,1) both;
        }
        .pp-hero__sparkle {
          width: 22px;
          height: 22px;
          border-radius: 50%;
          background: ${T.accentSoft};
          color: ${T.accentSolid};
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          animation: pp-sparkle 2.4s ease-in-out infinite;
        }
        .pp-hero__ai-row {
          display: flex;
          gap: 10px;
          align-items: flex-start;
        }
        .pp-hero__ai-img {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          object-fit: cover;
          flex-shrink: 0;
          border: 2px solid rgba(22,163,74,0.22);
        }
        .pp-hero__sync-row {
          display: flex;
          align-items: center;
          gap: 7px;
        }
        .pp-hero__badge {
          font-size: 10px;
          font-weight: 800;
          letter-spacing: 0.04em;
          border-radius: 6px;
          padding: 3px 7px;
          line-height: 1;
        }
        .pp-hero__badge--tally {
          color: #1e3a8a;
          background: #EEF2FF;
          border: 1px solid #C7D2FE;
        }
        .pp-hero__badge--pos {
          color: ${T.accentSolid};
          background: ${T.accentSoft};
          border: 1px solid ${T.accentBorder};
        }
        .pp-hero__sync-arrows {
          color: ${T.accent};
          display: flex;
          animation: pp-sync 1.8s ease-in-out infinite;
        }
        .pp-hero__check {
          margin-left: auto;
          color: ${T.accentSolid};
          display: flex;
        }

        @keyframes pp-up {
          from { opacity: 0; transform: translateY(14px); }
          to   { opacity: 1; transform: none; }
        }
        @keyframes pp-fade {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes pp-pop {
          from { opacity: 0; transform: translate(-50%, -50%) scale(.9); }
          to   { opacity: 1; transform: translate(-50%, -50%) scale(1); }
        }
        @keyframes pp-dash { to { stroke-dashoffset: -80; } }
        @keyframes pp-bar {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes pp-draw {
          from { stroke-dashoffset: 240; }
          to   { stroke-dashoffset: 0; }
        }
        @keyframes pp-ring {
          0%,100% { box-shadow: 0 16px 40px rgba(7,59,42,0.18); }
          50% { box-shadow: 0 18px 48px rgba(7,59,42,0.24), 0 0 0 6px rgba(34,197,94,0.1); }
        }
        @keyframes pp-sparkle {
          0%,100% { transform: scale(1) rotate(0); }
          50% { transform: scale(1.1) rotate(10deg); }
        }
        @keyframes pp-sync {
          0%,100% { transform: translateX(0); opacity: 1; }
          50% { transform: translateX(2px); opacity: .7; }
        }

        /* Tablet */
        @media (max-width: 1024px) {
          .pp-hero { --pp-chef: clamp(150px, 20vw, 220px); }
          .pp-hero__main { gap: 16px; }
          .pp-hero__art { max-height: 500px; }
          .pp-hero__slot--food,
          .pp-hero__slot--waste { width: min(160px, 42%); }
          .pp-hero__slot--selling,
          .pp-hero__slot--ai { width: min(170px, 44%); }
          .pp-hero__slot--pos { width: min(180px, 46%); }
          .pp-hero__prop--salad { width: 90px; height: 68px; }
          .pp-hero__prop--mascot { width: 60px; height: 60px; }
          .pp-hero__arc-desc { display: none; }
        }

        /* Stack below 900 */
        @media (max-width: 900px) {
          .pp-hero { --pp-chef: min(200px, 48vw); }
          .pp-hero__main {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .pp-hero__copy { max-width: none; }
          .pp-hero__art {
            aspect-ratio: auto;
            max-height: none;
            height: auto;
            display: grid;
            grid-template-columns: 1fr 1fr;
            gap: 12px;
            align-items: start;
          }
          .pp-hero__glow,
          .pp-hero__pale,
          .pp-hero__orbit,
          .pp-hero__analytics,
          .pp-hero__prop { display: none; }
          .pp-hero__chef {
            position: relative;
            left: auto;
            top: auto;
            transform: none;
            grid-column: 1 / -1;
            justify-self: center;
            margin: 4px 0 12px;
            animation: pp-up .7s .1s both;
          }
          .pp-hero__chef-ring { animation: none; }
          .pp-hero__slot,
          .pp-hero__slot--food,
          .pp-hero__slot--waste,
          .pp-hero__slot--selling,
          .pp-hero__slot--ai,
          .pp-hero__slot--pos {
            position: relative;
            left: auto;
            right: auto;
            top: auto;
            bottom: auto;
            width: 100%;
          }
          .pp-hero__slot--pos {
            grid-column: 1 / -1;
            max-width: 400px;
            justify-self: center;
          }
          .pp-hero__float,
          .pp-hero__float--a,
          .pp-hero__float--b,
          .pp-hero__float--c {
            animation: pp-up .65s .2s both;
          }
          .pp-hero__arc-features {
            position: relative;
            left: auto;
            right: auto;
            bottom: auto;
            grid-column: 1 / -1;
            margin-top: 12px;
            grid-template-columns: 1fr 1fr;
            gap: 16px 12px;
          }
          .pp-hero__arc-desc { display: block; }
        }

        @media (max-width: 480px) {
          .pp-hero__ctas { flex-direction: column; align-items: stretch; }
          .pp-btn { width: 100%; }
          .pp-hero__art { grid-template-columns: 1fr; }
          .pp-hero__slot--pos { grid-column: auto; max-width: none; }
          .pp-hero__arc-features { grid-template-columns: 1fr; gap: 14px; }
          .pp-hero__arc-feature {
            display: grid;
            grid-template-columns: 32px 1fr;
            column-gap: 12px;
            text-align: left;
          }
          .pp-hero__arc-icon { grid-row: 1 / 3; margin: 0; }
          .pp-hero__arc-desc { margin-inline: 0; max-width: none; -webkit-line-clamp: unset; }
        }

        @media (prefers-reduced-motion: reduce) {
          .pp-hero *, .pp-hero *::before, .pp-hero *::after {
            animation-duration: 0.001s !important;
            animation-iteration-count: 1 !important;
          }
        }
      `}</style>

      <div className="pp-hero__bg" aria-hidden />

      <div className="pp-hero__inner">
        <div className="pp-hero__main">
          <div className="pp-hero__copy">
            <h1>
              Control <span style={gradientClip(T.gradientA)}>Food Cost</span>, Inventory,
              Procurement &amp; <span style={gradientClip(T.gradientB)}>Wastage</span> — All in One
              Place.
            </h1>
            <p>
              PlatePielet unifies your POS sales, purchases, and stock into one live view — so you
              catch cost leakage before it eats your margin, with Pilot AI flagging what needs
              attention today.
            </p>
            <div className="pp-hero__ctas">
              <a href="/demo" className="pp-btn pp-btn--solid">
                Book a Demo
              </a>
              <a href={SALES_PHONE_HREF} className="pp-btn pp-btn--outline">
                Call {SALES_PHONE}
              </a>
            </div>
          </div>

          <HeroComposition />
        </div>
      </div>
    </section>
  );
}
