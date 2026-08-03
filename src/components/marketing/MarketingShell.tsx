import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import { PlatePieletNav } from "@/components/PlatePieletNav";
import { PlatePieletFooter } from "@/components/PlatePieletFooter";

const PAGE_BG = "#F6FAF7";
const INK = "#152019";

export function MarketingShell({
  children,
  ctaHeading = "See PlatePielet on your own numbers.",
}: {
  children: ReactNode;
  ctaHeading?: string;
}) {
  return (
    <div
      className="marketing-shell"
      style={{
        background: PAGE_BG,
        color: INK,
        fontFamily: "'Inter Variable', 'Inter', system-ui, sans-serif",
        minHeight: "100%",
      }}
    >
      <style>{`
        .marketing-shell a { text-decoration: none; }
        .mkt-wrap {
          max-width: 1120px;
          margin: 0 auto;
          padding: 1.5rem clamp(1.25rem, 3vw, 2.5rem) 5rem;
        }
        .mkt-hero {
          padding: 2.5rem 0 3.25rem;
          border-bottom: 1px solid rgba(21,32,25,0.08);
          margin-bottom: 3rem;
        }
        .mkt-eyebrow {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: #16A34A;
          margin-bottom: 0.85rem;
        }
        .mkt-h1 {
          font-size: clamp(2rem, 4vw, 2.85rem);
          font-weight: 800;
          letter-spacing: -0.03em;
          line-height: 1.15;
          color: ${INK};
          max-width: 18ch;
        }
        .mkt-lead {
          margin-top: 1rem;
          font-size: 1.05rem;
          line-height: 1.65;
          color: #66736B;
          max-width: 42rem;
        }
        .mkt-actions {
          display: flex;
          flex-wrap: wrap;
          gap: 0.75rem;
          margin-top: 1.75rem;
        }
        .mkt-btn-primary {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 1.35rem;
          border-radius: 12px;
          background: #16A34A;
          color: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
          box-shadow: 0 4px 12px rgba(22,163,74,0.22);
        }
        .mkt-btn-primary:hover { background: #15803D; }
        .mkt-btn-ghost {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          height: 44px;
          padding: 0 1.35rem;
          border-radius: 12px;
          border: 1px solid #16A34A;
          color: #16A34A;
          background: #fff;
          font-size: 0.8rem;
          font-weight: 700;
          letter-spacing: 0.06em;
        }
        .mkt-section { margin-bottom: 3.5rem; }
        .mkt-section-tag {
          font-size: 0.7rem;
          font-weight: 700;
          letter-spacing: 0.14em;
          text-transform: uppercase;
          color: #66736B;
          margin-bottom: 0.65rem;
        }
        .mkt-h2 {
          font-size: clamp(1.45rem, 2.5vw, 1.85rem);
          font-weight: 800;
          letter-spacing: -0.02em;
          line-height: 1.25;
          margin-bottom: 0.75rem;
        }
        .mkt-body {
          font-size: 1rem;
          line-height: 1.65;
          color: #66736B;
          max-width: 40rem;
        }
        .mkt-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
          gap: 1rem;
          margin-top: 1.75rem;
        }
        .mkt-card {
          display: flex;
          flex-direction: column;
          gap: 0.65rem;
          padding: 1.35rem 1.25rem;
          border-radius: 16px;
          border: 1px solid #DDE7E1;
          background: #fff;
          transition: border-color 0.15s ease, box-shadow 0.15s ease;
          color: inherit;
        }
        .mkt-card:hover {
          border-color: rgba(22,163,74,0.45);
          box-shadow: 0 10px 28px rgba(7,26,20,0.06);
        }
        .mkt-card-icon {
          display: grid;
          place-items: center;
          width: 36px;
          height: 36px;
          border-radius: 10px;
          background: #E8F7ED;
          color: #16A34A;
        }
        .mkt-card-title {
          font-size: 1rem;
          font-weight: 700;
          color: ${INK};
        }
        .mkt-card-desc {
          font-size: 0.9rem;
          line-height: 1.5;
          color: #66736B;
        }
        .mkt-card-link {
          margin-top: auto;
          padding-top: 0.5rem;
          font-size: 0.8rem;
          font-weight: 700;
          color: #16A34A;
        }
        .mkt-bullets {
          margin-top: 1.25rem;
          display: grid;
          gap: 0.65rem;
          max-width: 36rem;
        }
        .mkt-bullets li {
          display: flex;
          gap: 0.65rem;
          font-size: 0.95rem;
          line-height: 1.5;
          color: #3D4A43;
        }
        .mkt-bullets li::before {
          content: "";
          flex-shrink: 0;
          width: 7px;
          height: 7px;
          margin-top: 0.45rem;
          border-radius: 50%;
          background: #16A34A;
        }
        .mkt-anchor {
          scroll-margin-top: 110px;
          padding: 2rem 0;
          border-top: 1px solid rgba(21,32,25,0.08);
        }
        .mkt-anchor:first-of-type { border-top: none; padding-top: 0; }
        .mkt-pricing-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(240px, 1fr));
          gap: 1rem;
          margin-top: 1.75rem;
        }
        .mkt-price-card {
          padding: 1.75rem 1.5rem;
          border-radius: 18px;
          border: 1px solid #DDE7E1;
          background: #fff;
        }
        .mkt-price-card.featured {
          border-color: #16A34A;
          box-shadow: 0 12px 32px rgba(22,163,74,0.12);
        }
        .mkt-price-name { font-size: 0.75rem; font-weight: 700; letter-spacing: 0.12em; text-transform: uppercase; color: #16A34A; }
        .mkt-price-amt { font-size: 2rem; font-weight: 800; letter-spacing: -0.03em; margin: 0.5rem 0 0.25rem; }
        .mkt-price-amt span { font-size: 0.95rem; font-weight: 600; color: #66736B; }
        .mkt-price-desc { font-size: 0.9rem; color: #66736B; line-height: 1.5; margin-bottom: 1.25rem; }
      `}</style>

      <PlatePieletNav variant="light" sticky />
      <main className="mkt-wrap">{children}</main>
      <PlatePieletFooter mode="static">
        <div className="mkt-wrap" style={{ paddingBottom: "3.5rem" }} id="contact">
          <div
            style={{
              textAlign: "center",
              padding: "3.5rem 1.5rem",
              borderRadius: 24,
              background: "linear-gradient(160deg, #0F7A4C 0%, #16A34A 55%, #22C55E 100%)",
              color: "#fff",
            }}
          >
            <h2
              style={{
                fontSize: "clamp(1.5rem, 3vw, 2rem)",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                marginBottom: "1.25rem",
              }}
            >
              {ctaHeading}
            </h2>
            <div style={{ display: "flex", flexWrap: "wrap", gap: 12, justifyContent: "center" }}>
              <Link
                to="/demo"
                style={{
                  height: 44,
                  padding: "0 1.4rem",
                  borderRadius: 12,
                  background: "#fff",
                  color: "#15803D",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                BOOK A DEMO
              </Link>
              <Link
                to="/signup"
                style={{
                  height: 44,
                  padding: "0 1.4rem",
                  borderRadius: 12,
                  border: "1px solid rgba(255,255,255,0.55)",
                  color: "#fff",
                  fontSize: "0.8rem",
                  fontWeight: 700,
                  letterSpacing: "0.06em",
                  display: "inline-flex",
                  alignItems: "center",
                }}
              >
                START FREE TRIAL
              </Link>
            </div>
          </div>
        </div>
      </PlatePieletFooter>
    </div>
  );
}

export function MarketingHero({
  eyebrow,
  title,
  lead,
}: {
  eyebrow: string;
  title: string;
  lead: string;
}) {
  return (
    <header className="mkt-hero">
      <div className="mkt-eyebrow">{eyebrow}</div>
      <h1 className="mkt-h1">{title}</h1>
      <p className="mkt-lead">{lead}</p>
      <div className="mkt-actions">
        <Link to="/demo" className="mkt-btn-primary">
          BOOK A DEMO
        </Link>
        <Link to="/signup" className="mkt-btn-ghost">
          START FREE TRIAL
        </Link>
      </div>
    </header>
  );
}
