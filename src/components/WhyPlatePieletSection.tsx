import { useEffect, useState } from "react";
import {
  BarChart3,
  Bell,
  Box,
  Brain,
  LayoutDashboard,
  Lightbulb,
  Package,
  Settings,
  ShoppingCart,
  Target,
  Trash2,
  TrendingUp,
  FileText,
} from "lucide-react";
import { T } from "@/components/PlatePieletHero";

const NAV = [
  { icon: LayoutDashboard, label: "Dashboard", active: true },
  { icon: BarChart3, label: "Sales" },
  { icon: Package, label: "Inventory" },
  { icon: ShoppingCart, label: "Purchase" },
  { icon: FileText, label: "Menu Engineering" },
  { icon: Trash2, label: "Waste Management" },
  { icon: BarChart3, label: "Reports" },
  { icon: Bell, label: "Alerts" },
  { icon: Settings, label: "Settings" },
] as const;

const FEATURES = [
  { icon: BarChart3, label: "Real-time Insights" },
  { icon: Brain, label: "AI-Powered Analysis" },
  { icon: Bell, label: "Smart Alerts" },
  { icon: Target, label: "Better Decisions" },
] as const;

const SELLING = [
  { name: "Butter Chicken", pct: 62, img: "/hero/hero-butter-chicken.jpg" },
  { name: "Chicken Biryani", pct: 48, img: "/hero/hero-biryani.jpg" },
  { name: "Paneer Tikka", pct: 36, img: "/hero/hero-paneer.jpg" },
] as const;

const ALERTS = [
  {
    icon: Lightbulb,
    tag: "AI Recommendation",
    text: "Promote high margin items this week to lift contribution.",
  },
  {
    icon: Box,
    tag: "Inventory Alert",
    text: "Tomatoes stock is below reorder level.",
  },
  {
    icon: Trash2,
    tag: "Waste Alert",
    text: "High waste detected in Veg Prep.",
  },
  {
    icon: TrendingUp,
    tag: "Price Alert",
    text: "Chicken price increased by 8% this week.",
  },
] as const;

function LiveFoodCost() {
  const [cost, setCost] = useState(28.6);
  const [delta, setDelta] = useState(2.1);
  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let last = 0;
    const tick = (now: number) => {
      if (now - last > 220) {
        last = now;
        setCost(28.6 + Math.sin(now / 900) * 0.32 + (Math.random() - 0.5) * 0.1);
        setDelta(2.1 + Math.sin(now / 1100) * 0.2 + (Math.random() - 0.5) * 0.06);
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);
  return (
    <>
      <div className="why-kpi-val why-kpi-val--cost">{cost.toFixed(1)}%</div>
      <div className="why-kpi-delta">↓ {Math.abs(delta).toFixed(1)}% vs yesterday</div>
    </>
  );
}

function DashboardMock() {
  return (
    <div className="why-dash">
      <aside className="why-side">
        <div className="why-side-logo">
          plate
          <br />
          pielet<span>.</span>
        </div>
        <nav>
          {NAV.map(({ icon: Icon, label, active }) => (
            <div key={label} className={`why-nav${active ? " is-active" : ""}`}>
              <Icon size={13} strokeWidth={2} />
              <span>{label}</span>
            </div>
          ))}
        </nav>
      </aside>
      <div className="why-main">
        <div className="why-head">
          <strong>Dashboard Overview</strong>
          <span>Today ▾</span>
        </div>
        <div className="why-kpis">
          <div className="why-kpi">
            <div className="why-kpi-lab">Total Sales</div>
            <div className="why-kpi-val">AED 45,231</div>
            <div className="why-kpi-delta">↑ 12.5% vs yesterday</div>
          </div>
          <div className="why-kpi">
            <div className="why-kpi-lab">Gross Profit</div>
            <div className="why-kpi-val">AED 15,620</div>
            <div className="why-kpi-delta">↑ 8.3% vs yesterday</div>
          </div>
          <div className="why-kpi">
            <div className="why-kpi-lab">Food Cost %</div>
            <LiveFoodCost />
          </div>
          <div className="why-kpi">
            <div className="why-kpi-lab">Waste %</div>
            <div className="why-kpi-val">4.2%</div>
            <div className="why-kpi-delta why-kpi-delta--warn">↑ 0.6% vs yesterday</div>
          </div>
        </div>
        <div className="why-charts">
          <div className="why-panel">
            <div className="why-panel-h">Sales Trend</div>
            <svg viewBox="0 0 160 56" className="why-spark" aria-hidden>
              <path
                d="M2 42 C18 40, 28 22, 44 26 S70 48, 88 28 S120 10, 158 16"
                fill="none"
                stroke="#16A34A"
                strokeWidth="2.2"
                strokeLinecap="round"
              />
            </svg>
          </div>
          <div className="why-panel">
            <div className="why-panel-h">Top Selling Items</div>
            {SELLING.map((item) => (
              <div key={item.name} className="why-sell">
                <img src={item.img} alt="" />
                <div>
                  <div>{item.name}</div>
                  <div className="why-bar">
                    <i style={{ width: `${item.pct}%` }} />
                  </div>
                </div>
                <span>{item.pct}%</span>
              </div>
            ))}
          </div>
          <div className="why-panel">
            <div className="why-panel-h">Branch Performance</div>
            <div className="why-bars">
              {[72, 54, 88, 41].map((h, i) => (
                <span key={i} style={{ height: `${h}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export function WhyPlatePieletSection({ visible }: { visible: boolean }) {
  return (
    <section className={`why-pp reveal${visible ? " show" : ""}`}>
      <style>{`
        .why-pp {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 80px;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }
        .why-pp__grid {
          display: grid;
          grid-template-columns: minmax(0, 0.92fr) minmax(0, 1.18fr);
          gap: 40px;
          align-items: center;
        }
        .why-pp__eyebrow {
          display: flex;
          align-items: center;
          gap: 12px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 18px;
        }
        .why-pp__eyebrow::before {
          content: '';
          width: 28px;
          height: 2px;
          background: ${T.accent};
          flex-shrink: 0;
        }
        .why-pp__h2 {
          font-size: clamp(28px, 3.2vw, 42px);
          font-weight: 800;
          letter-spacing: -0.038em;
          line-height: 1.12;
          margin: 0 0 20px;
          color: ${T.text};
        }
        .why-pp__h2 em {
          font-style: normal;
          color: ${T.accentSolid};
        }
        .why-pp__p {
          font-size: 15.5px;
          line-height: 1.75;
          color: ${T.muted};
          margin: 0 0 14px;
          max-width: 460px;
        }
        .why-pp__feats {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 12px;
          margin-top: 32px;
        }
        .why-pp__feat {
          text-align: center;
        }
        .why-pp__feat-ico {
          width: auto;
          height: auto;
          margin: 0 auto 10px;
          border-radius: 0;
          background: transparent;
          color: ${T.accentSolid};
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .why-pp__feat span {
          font-size: 11px;
          font-weight: 600;
          color: ${T.muted};
          line-height: 1.3;
          display: block;
        }

        .why-pp__visual {
          position: relative;
          min-height: 640px;
          padding: 8px 172px 200px 0;
        }
        .why-pp__glow {
          position: absolute;
          left: 18%;
          bottom: 6%;
          width: 300px;
          height: 300px;
          border-radius: 50%;
          background: radial-gradient(circle, rgba(34,197,94,0.48) 0%, rgba(34,197,94,0.14) 40%, transparent 72%);
          filter: blur(24px);
          pointer-events: none;
          z-index: 1;
        }
        .why-ai {
          position: absolute;
          left: 30%;
          bottom: 26%;
          width: 88px;
          height: 88px;
          z-index: 6;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          background: radial-gradient(circle at 38% 28%, #86EFAC 0%, #22C55E 38%, #15803D 100%);
          color: #fff;
          box-shadow:
            0 0 0 6px rgba(34,197,94,0.22),
            0 0 0 16px rgba(34,197,94,0.1),
            0 0 48px rgba(34,197,94,0.5),
            0 16px 36px rgba(7,59,42,0.28);
        }
        .why-ai b { font-size: 13px; letter-spacing: 0.12em; margin-top: 2px; font-weight: 800; }
        .why-ai-svg {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          z-index: 4;
          pointer-events: none;
          overflow: visible;
        }
        .why-ai-line { display: none; }

        .why-dash {
          position: relative;
          z-index: 5;
          display: grid;
          grid-template-columns: 118px 1fr;
          background: #fff;
          border-radius: 16px;
          overflow: hidden;
          box-shadow: 0 18px 50px rgba(7,26,20,0.14);
          border: 1px solid rgba(21,32,25,0.08);
          max-width: 560px;
        }
        .why-side {
          background: #0B3B28;
          color: #E8F7ED;
          padding: 12px 8px;
        }
        .why-side-logo {
          font-size: 11px;
          font-weight: 800;
          line-height: 1.05;
          letter-spacing: -0.03em;
          padding: 4px 8px 12px;
          color: #fff;
        }
        .why-side-logo span { color: #86EFAC; }
        .why-nav {
          display: flex;
          align-items: center;
          gap: 7px;
          font-size: 9px;
          font-weight: 600;
          padding: 6px 8px;
          border-radius: 7px;
          color: rgba(255,255,255,0.72);
          white-space: nowrap;
        }
        .why-nav.is-active {
          background: rgba(34,197,94,0.28);
          color: #fff;
        }
        .why-main { padding: 10px 12px 12px; background: #F7FAF8; }
        .why-head {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 8px;
          font-size: 11px;
        }
        .why-head span {
          font-size: 9px;
          color: ${T.muted};
          background: #fff;
          border: 1px solid rgba(21,32,25,0.08);
          padding: 3px 8px;
          border-radius: 6px;
        }
        .why-kpis {
          display: grid;
          grid-template-columns: repeat(4, minmax(0,1fr));
          gap: 6px;
          margin-bottom: 8px;
        }
        .why-kpi {
          background: #fff;
          border-radius: 8px;
          padding: 7px 8px;
          box-shadow: 0 1px 3px rgba(7,26,20,0.05);
        }
        .why-kpi-lab {
          font-size: 7.5px;
          font-weight: 700;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: ${T.muted};
        }
        .why-kpi-val {
          font-size: 12px;
          font-weight: 800;
          margin-top: 2px;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .why-kpi-val--cost { color: #C2410C; }
        .why-kpi-delta {
          font-size: 8px;
          font-weight: 700;
          color: ${T.accentSolid};
          margin-top: 2px;
          font-variant-numeric: tabular-nums;
          white-space: nowrap;
        }
        .why-kpi-delta--warn { color: #C2410C; }
        .why-charts {
          display: grid;
          grid-template-columns: 1.1fr 1.2fr 0.8fr;
          gap: 6px;
        }
        .why-panel {
          background: #fff;
          border-radius: 8px;
          padding: 7px 8px;
        }
        .why-panel-h {
          font-size: 8.5px;
          font-weight: 700;
          margin-bottom: 6px;
          color: ${T.text};
        }
        .why-spark { width: 100%; height: 42px; display: block; }
        .why-sell {
          display: grid;
          grid-template-columns: 14px 1fr 22px;
          gap: 5px;
          align-items: center;
          margin-bottom: 4px;
          font-size: 8px;
          font-weight: 600;
        }
        .why-sell img {
          width: 14px; height: 14px; border-radius: 50%; object-fit: cover;
        }
        .why-sell span { text-align: right; color: ${T.muted}; font-variant-numeric: tabular-nums; }
        .why-bar {
          height: 4px;
          background: rgba(22,163,74,0.12);
          border-radius: 99px;
          overflow: hidden;
          margin-top: 2px;
        }
        .why-bar i {
          display: block;
          height: 100%;
          background: #16A34A;
          border-radius: 99px;
        }
        .why-bars {
          height: 48px;
          display: flex;
          align-items: flex-end;
          gap: 6px;
          padding-top: 4px;
        }
        .why-bars span {
          flex: 1;
          background: linear-gradient(180deg, #22C55E, #15803D);
          border-radius: 3px 3px 0 0;
        }

        .why-alerts {
          position: absolute;
          right: 0;
          top: 18px;
          width: 168px;
          display: flex;
          flex-direction: column;
          gap: 8px;
          z-index: 6;
        }
        .why-alert {
          background: #fff;
          border-radius: 12px;
          padding: 10px 11px;
          box-shadow: 0 8px 22px rgba(7,26,20,0.1);
          border: 1px solid rgba(21,32,25,0.06);
        }
        .why-alert-tag {
          display: flex;
          align-items: center;
          gap: 6px;
          font-size: 9px;
          font-weight: 800;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 4px;
        }
        .why-alert p {
          font-size: 10.5px;
          line-height: 1.4;
          color: ${T.muted};
          margin: 0;
        }

        .why-food-crate {
          position: absolute;
          left: -2%;
          bottom: 0;
          width: 50%;
          z-index: 2;
          pointer-events: none;
        }
        .why-food-bowl {
          position: absolute;
          left: 40%;
          bottom: -10px;
          width: 42%;
          z-index: 3;
          pointer-events: none;
        }
        .why-food-salmon {
          position: absolute;
          right: -4%;
          bottom: 28%;
          width: 30%;
          z-index: 2;
          pointer-events: none;
        }
        .why-food-crate img,
        .why-food-bowl img,
        .why-food-salmon img {
          width: 100%;
          height: auto;
          display: block;
          mix-blend-mode: multiply;
          filter: drop-shadow(0 14px 24px rgba(0,0,0,0.16));
        }

        @media (max-width: 1100px) {
          .why-alerts { display: none; }
          .why-food-salmon { display: none; }
          .why-dash { max-width: 100%; }
        }
        @media (max-width: 900px) {
          .why-pp { padding: 48px 20px 56px; }
          .why-pp__grid { grid-template-columns: 1fr; gap: 32px; }
          .why-pp__feats { grid-template-columns: repeat(2, 1fr); }
          .why-pp__visual { min-height: 0; }
          .why-food-crate, .why-food-bowl, .why-food-salmon, .why-ai, .why-ai-svg, .why-pp__glow { display: none; }
        }
        @media (max-width: 560px) {
          .why-dash { grid-template-columns: 1fr; }
          .why-side { display: none; }
          .why-kpis { grid-template-columns: 1fr 1fr; }
          .why-charts { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="why-pp__grid">
        <div>
          <div className="why-pp__eyebrow">Why PlatePielet</div>
          <h2 className="why-pp__h2">
            Restaurant intelligence powered by <em>realtime AI-driven</em> analysis
          </h2>
          <p className="why-pp__p">
            PlatePielet transforms your restaurant data into clear, actionable insights in real
            time. Monitor performance, identify trends, detect issues, and uncover opportunities
            across sales, inventory, costs, and operations, all from one intelligent platform.
          </p>
          <p className="why-pp__p">
            Make faster, data-driven decisions with the information that matters most to your
            restaurant.
          </p>
          <div className="why-pp__feats">
            {FEATURES.map(({ icon: Icon, label }) => (
              <div key={label} className="why-pp__feat">
                <div className="why-pp__feat-ico">
                  <Icon size={22} strokeWidth={1.85} />
                </div>
                <span>{label}</span>
              </div>
            ))}
          </div>
        </div>

        <div className="why-pp__visual">
          <div className="why-pp__glow" aria-hidden />
          {/* Flow lines: dashboard → AI hub → food photos */}
          <svg className="why-ai-svg" viewBox="0 0 660 640" preserveAspectRatio="xMidYMid meet" aria-hidden>
            {/* Main stem: dashboard → AI hub */}
            <path
              d="M240 255 C238 310, 242 355, 248 395"
              fill="none"
              stroke="#22C55E"
              strokeWidth="2.4"
              strokeLinecap="round"
              opacity="0.95"
            />
            {/* Left tendril → crate */}
            <path
              d="M248 395 C200 450, 140 510, 90 575"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Soft left secondary */}
            <path
              d="M248 395 C215 470, 185 530, 170 590"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="1.3"
              strokeLinecap="round"
              opacity="0.35"
            />
            {/* Right tendril → bowl */}
            <path
              d="M248 395 C300 455, 370 520, 440 585"
              fill="none"
              stroke="#22C55E"
              strokeWidth="1.8"
              strokeLinecap="round"
              opacity="0.6"
            />
            {/* Far-right → salmon */}
            <path
              d="M248 395 C330 420, 460 435, 580 410"
              fill="none"
              stroke="#4ADE80"
              strokeWidth="1.6"
              strokeLinecap="round"
              opacity="0.55"
            />
            {/* Center downward glow stem */}
            <path
              d="M248 395 C255 455, 265 510, 275 565"
              fill="none"
              stroke="#86EFAC"
              strokeWidth="1.4"
              strokeLinecap="round"
              opacity="0.45"
            />
          </svg>
          <div className="why-food-crate">
            <img src="/hero/why-crate.jpg" alt="" />
          </div>
          <div className="why-food-bowl">
            <img src="/hero/why-bowl.jpg" alt="" />
          </div>
          <div className="why-food-salmon">
            <img src="/hero/why-salmon.jpg" alt="" />
          </div>
          <DashboardMock />
          <div className="why-ai" aria-hidden>
            <Brain size={26} strokeWidth={1.75} />
            <b>AI</b>
          </div>
          <div className="why-alerts">
            {ALERTS.map(({ icon: Icon, tag, text }) => (
              <div key={tag} className="why-alert">
                <div className="why-alert-tag">
                  <Icon size={12} strokeWidth={2.2} />
                  {tag}
                </div>
                <p>{text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}