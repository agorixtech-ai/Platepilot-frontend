import "@fontsource/caveat/600.css";
import "@fontsource/caveat/700.css";
import { T } from "@/components/PlatePieletHero";

/** Section mascots + handwritten quotes from brand art. */
const MOMENTS = [
  {
    src: "/mascot/ai-insights-removebg-preview.png",
    title: "AI Insights",
    quote: "Good Food. Brighter Days.",
  },
  {
    src: "/mascot/dashboard-removebg-preview.png",
    title: "Live Dashboard",
    quote: "One glance. Every outlet.",
  },
  {
    src: "/mascot/cost-removebg-preview.png",
    title: "Cost Control",
    quote: "Cut cost, not quality!",
  },
  {
    src: "/mascot/menu-engineering-removebg-preview.png",
    title: "Menu Engineering",
    quote: "Push winners. Fix the rest!",
  },
  {
    src: "/mascot/purchase-suggestions-removebg-preview.png",
    title: "Purchase Calls",
    quote: "Buy right, right on time!",
  },
  {
    src: "/mascot/waste-analysis-removebg-preview.png",
    title: "Waste Analysis",
    quote: "Waste less. Earn more!",
  },
] as const;

export function MascotMomentsSection({ visible }: { visible: boolean }) {
  return (
    <section className={`mm reveal${visible ? " show" : ""}`}>
      <style>{`
        .mm {
          position: relative;
          overflow: hidden;
          background: #FAFCFA;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }
        .mm__blob {
          position: absolute;
          pointer-events: none;
          border-radius: 50%;
          filter: blur(2px);
          z-index: 0;
        }
        .mm__blob--l {
          left: -8%;
          top: 18%;
          width: min(480px, 42vw);
          height: min(480px, 42vw);
          background: radial-gradient(circle at 40% 40%, #E6F4EA 0%, rgba(230,244,234,0.4) 55%, transparent 72%);
        }
        .mm__blob--r {
          right: -10%;
          bottom: 8%;
          width: min(520px, 46vw);
          height: min(520px, 46vw);
          background: radial-gradient(circle at 55% 45%, #EAF6ED 0%, rgba(234,246,237,0.35) 55%, transparent 72%);
        }
        .mm__inner {
          position: relative;
          z-index: 1;
          max-width: 1180px;
          margin: 0 auto;
          padding: 72px 40px 80px;
        }
        .mm__head {
          text-align: center;
          max-width: 640px;
          margin: 0 auto 40px;
        }
        .mm__h2 {
          margin: 0 0 12px;
          font-size: clamp(28px, 3.6vw, 42px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.1;
          color: ${T.text};
        }
        .mm__h2 em {
          font-style: normal;
          color: ${T.accent};
        }
        .mm__lede {
          margin: 0;
          font-size: 15px;
          line-height: 1.6;
          color: ${T.muted};
        }
        .mm__grid {
          display: grid;
          grid-template-columns: repeat(3, minmax(0, 1fr));
          gap: 28px 24px;
        }
        .mm__item {
          display: flex;
          flex-direction: column;
          align-items: center;
          text-align: center;
          gap: 12px;
        }
        .mm__art {
          width: 100%;
          aspect-ratio: 5 / 4;
          display: grid;
          place-items: center;
          padding: 4px 8px;
          box-sizing: border-box;
        }
        .mm__art img {
          max-width: 100%;
          max-height: 100%;
          width: auto;
          height: auto;
          object-fit: contain;
          filter: drop-shadow(0 16px 28px rgba(7,26,20,0.12));
          transition: transform 0.35s ease;
        }
        .mm__item:hover .mm__art img {
          transform: translateY(-4px);
        }
        .mm__copy {
          padding: 0 8px;
          max-width: 280px;
        }
        .mm__copy strong {
          display: block;
          font-size: 14px;
          font-weight: 800;
          letter-spacing: -0.02em;
          color: ${T.text};
          margin-bottom: 6px;
        }
        .mm__quote {
          margin: 0;
          font-family: 'Caveat', cursive;
          font-size: clamp(20px, 2.2vw, 26px);
          font-weight: 700;
          line-height: 1.25;
          color: ${T.accentSolid};
        }

        @media (max-width: 960px) {
          .mm__inner { padding: 56px 28px 64px; }
          .mm__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); gap: 28px 16px; }
        }
        @media (max-width: 560px) {
          .mm__inner { padding: 48px 20px 56px; }
          .mm__grid { grid-template-columns: 1fr; gap: 32px; max-width: 340px; margin: 0 auto; }
          .mm__blob { display: none; }
          .mm__art { aspect-ratio: 4 / 3; }
        }
        @media (prefers-reduced-motion: reduce) {
          .mm__item:hover .mm__art img { transform: none; }
        }
      `}</style>

      <div className="mm__blob mm__blob--l" aria-hidden />
      <div className="mm__blob mm__blob--r" aria-hidden />

      <div className="mm__inner">
        <div className="mm__head">
          <h2 className="mm__h2">
            Pilot AI across <em>every kitchen decision.</em>
          </h2>
          <p className="mm__lede">
            From insights and dashboards to cost, menu, purchasing, and waste — one chef mascot,
            six moments that keep your restaurant sharper every day.
          </p>
        </div>

        <div className="mm__grid">
          {MOMENTS.map((m) => (
            <figure key={m.title} className="mm__item">
              <div className="mm__art">
                <img src={m.src} alt="" loading="lazy" decoding="async" />
              </div>
              <figcaption className="mm__copy">
                <strong>{m.title}</strong>
                <p className="mm__quote">{m.quote}</p>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
