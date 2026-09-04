import { Link } from "react-router-dom";
import {
  ArrowRight,
  Banknote,
  Package,
  ShoppingCart,
  Trash2,
  type LucideIcon,
} from "lucide-react";
import type { ReactNode } from "react";
import { T } from "@/components/PlatePieletHero";

type Overlay =
  | { kind: "waste" }
  | { kind: "purchase" }
  | null;

type SolutionCard = {
  title: string;
  description: string;
  href: string;
  image: string;
  icon: LucideIcon;
  featured?: boolean;
  overlay?: Overlay;
};

const CARDS: SolutionCard[] = [
  {
    title: "Smart Inventory Tracking",
    description:
      "Live stock counts built from your POS sales and purchase bills — with alerts before you run out or over-order.",
    href: "/product/inventory-intelligence",
    image: "/hero/solution/inventory.jpg",
    icon: Package,
  },
  {
    title: "Waste Detection",
    description:
      "Pilot AI flags spoilage, over-prep, and shrinkage patterns per outlet — before they hit your month-end P&L.",
    href: "#menu-engineering",
    image: "/hero/solution/waste.jpg",
    icon: Trash2,
    overlay: { kind: "waste" },
  },
  {
    title: "Purchase Optimization",
    description:
      "Market-price intelligence and demand forecasts tell you what to buy, how much, and when — so you stop overpaying.",
    href: "/product/purchase-suggestions",
    image: "/hero/solution/purchase.jpg",
    icon: ShoppingCart,
    overlay: { kind: "purchase" },
  },
  {
    title: "Tally & POS Sync",
    description:
      "Your books reconcile themselves — every sale, purchase, and voucher matched automatically between POS and Tally.",
    href: "/integrations",
    image: "/hero/solution/sync.jpg",
    icon: Banknote,
    featured: true,
  },
];

function CardOverlay({ overlay }: { overlay: Overlay }) {
  if (!overlay) return null;
  if (overlay.kind === "waste") {
    return (
      <div className="sol-overlay sol-overlay--waste" aria-hidden>
        <div className="sol-overlay-lab">Waste Detected</div>
        <div className="sol-overlay-val">2.4 kg</div>
        <div className="sol-overlay-pill">↓ 18% vs last month</div>
      </div>
    );
  }
  return (
    <div className="sol-overlay sol-overlay--purchase" aria-hidden>
      <div className="sol-overlay-lab">Suggested Purchase</div>
      <ul>
        <li>
          <span>Chicken</span>
          <b>15 kg</b>
        </li>
        <li>
          <span>Tomatoes</span>
          <b>20 kg</b>
        </li>
        <li>
          <span>Onions</span>
          <b>12 kg</b>
        </li>
      </ul>
      <div className="sol-overlay-btn">Approve Order</div>
    </div>
  );
}

function SolutionCardLink({
  card,
  children,
}: {
  card: SolutionCard;
  children: ReactNode;
}) {
  const className = `sol-card${card.featured ? " sol-card--featured" : ""}`;
  if (card.href.startsWith("#")) {
    return (
      <a href={card.href} className={className}>
        {children}
      </a>
    );
  }
  return (
    <Link to={card.href} className={className}>
      {children}
    </Link>
  );
}

export function SolutionSection({ visible }: { visible: boolean }) {
  return (
    <section className={`sol reveal${visible ? " show" : ""}`}>
      <style>{`
        .sol {
          max-width: 1280px;
          margin: 0 auto;
          padding: 72px 40px 88px;
          font-family: 'Plus Jakarta Sans Variable', 'Plus Jakarta Sans', system-ui, sans-serif;
          color: ${T.text};
        }
        .sol__head {
          display: grid;
          grid-template-columns: minmax(0, 1.35fr) minmax(0, 0.75fr);
          gap: 40px;
          align-items: end;
          margin-bottom: 40px;
        }
        .sol__tag {
          display: flex;
          align-items: center;
          gap: 10px;
          font-size: 11px;
          font-weight: 800;
          letter-spacing: 0.22em;
          text-transform: uppercase;
          color: ${T.accentSolid};
          margin-bottom: 16px;
        }
        .sol__tag::before {
          content: '';
          width: 2px;
          height: 12px;
          background: ${T.accent};
          flex-shrink: 0;
        }
        .sol__h2 {
          font-size: clamp(32px, 4.2vw, 48px);
          font-weight: 800;
          letter-spacing: -0.04em;
          line-height: 1.08;
          margin: 0;
          color: ${T.text};
          max-width: 640px;
        }
        .sol__h2 em {
          font-style: normal;
          color: ${T.accent};
        }
        .sol__body {
          font-size: 15px;
          line-height: 1.7;
          color: ${T.muted};
          margin: 0;
          max-width: 360px;
          justify-self: end;
          padding-bottom: 4px;
        }
        .sol__grid {
          display: grid;
          grid-template-columns: repeat(4, minmax(0, 1fr));
          gap: 18px;
          align-items: stretch;
        }
        .sol-card {
          display: flex;
          flex-direction: column;
          background: #fff;
          border: 1px solid rgba(21,32,25,0.08);
          border-radius: 20px;
          overflow: hidden;
          text-decoration: none;
          color: inherit;
          box-shadow: 0 2px 10px rgba(7,26,20,0.04);
          transition: transform 0.25s ease, box-shadow 0.25s ease, border-color 0.25s ease;
          min-height: 100%;
        }
        .sol-card:hover {
          transform: translateY(-3px);
          box-shadow: 0 16px 36px rgba(7,26,20,0.1);
          border-color: rgba(22,163,74,0.28);
        }
        .sol-card--featured {
          background: #E8F7ED;
          border-color: rgba(22,163,74,0.18);
        }
        .sol-card__media {
          position: relative;
          aspect-ratio: 4 / 3.1;
          background: #F3F7F4;
          overflow: hidden;
        }
        .sol-card__media img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
        }
        .sol-card__ico {
          position: absolute;
          left: 16px;
          bottom: -18px;
          width: 44px;
          height: 44px;
          border-radius: 50%;
          background: #E8F7ED;
          color: ${T.accentSolid};
          display: flex;
          align-items: center;
          justify-content: center;
          box-shadow: 0 4px 14px rgba(7,59,42,0.12);
          z-index: 2;
          border: 3px solid #fff;
        }
        .sol-card--featured .sol-card__ico {
          background: #fff;
          border-color: #E8F7ED;
        }
        .sol-card__body {
          padding: 30px 18px 20px;
          display: flex;
          flex-direction: column;
          flex: 1;
        }
        .sol-card__title {
          font-size: 17px;
          font-weight: 800;
          letter-spacing: -0.025em;
          line-height: 1.25;
          margin: 0 0 10px;
          color: ${T.text};
        }
        .sol-card__desc {
          font-size: 13px;
          line-height: 1.55;
          color: ${T.muted};
          margin: 0 0 18px;
          flex: 1;
        }
        .sol-card__arrow {
          display: inline-flex;
          color: ${T.accentSolid};
          margin-top: auto;
        }
        .sol-card:hover .sol-card__arrow {
          transform: translateX(3px);
          transition: transform 0.2s ease;
        }

        .sol-overlay {
          position: absolute;
          top: 12px;
          right: 12px;
          background: #fff;
          border-radius: 12px;
          padding: 10px 12px;
          box-shadow: 0 10px 24px rgba(7,26,20,0.16);
          z-index: 1;
          width: min(148px, 52%);
        }
        .sol-overlay-lab {
          font-size: 9px;
          font-weight: 700;
          letter-spacing: 0.04em;
          text-transform: uppercase;
          color: ${T.muted};
          margin-bottom: 4px;
        }
        .sol-overlay-val {
          font-size: 20px;
          font-weight: 800;
          letter-spacing: -0.03em;
          color: ${T.text};
          margin-bottom: 6px;
        }
        .sol-overlay-pill {
          display: inline-flex;
          font-size: 9px;
          font-weight: 700;
          color: ${T.accentSolid};
          background: rgba(22,163,74,0.12);
          border-radius: 999px;
          padding: 3px 8px;
        }
        .sol-overlay--purchase ul {
          list-style: none;
          margin: 0 0 8px;
          padding: 0;
        }
        .sol-overlay--purchase li {
          display: flex;
          justify-content: space-between;
          gap: 8px;
          font-size: 10px;
          color: ${T.muted};
          padding: 3px 0;
        }
        .sol-overlay--purchase li b {
          color: ${T.text};
          font-weight: 700;
        }
        .sol-overlay--purchase .sol-overlay-btn {
          width: 100%;
          border-radius: 8px;
          background: ${T.accent};
          color: #fff;
          font-size: 10px;
          font-weight: 700;
          padding: 7px 8px;
          text-align: center;
        }

        @media (max-width: 1100px) {
          .sol__grid { grid-template-columns: repeat(2, minmax(0, 1fr)); }
        }
        @media (max-width: 900px) {
          .sol { padding: 56px 20px 64px; }
          .sol__head { grid-template-columns: 1fr; gap: 16px; align-items: start; }
          .sol__body { justify-self: start; max-width: none; }
        }
        @media (max-width: 560px) {
          .sol__grid { grid-template-columns: 1fr; }
        }
      `}</style>

      <div className="sol__head">
        <div>
          <div className="sol__tag">The Solution</div>
          <h2 className="sol__h2">
            Stop guessing. Run your restaurant on <em>data.</em>
          </h2>
        </div>
        <p className="sol__body">
          PlatePielet connects the systems you already use and turns them into one intelligence
          layer for your entire operation.
        </p>
      </div>

      <div className="sol__grid">
        {CARDS.map((card) => {
          const Icon = card.icon;
          return (
            <SolutionCardLink key={card.title} card={card}>
              <div className="sol-card__media">
                <img src={card.image} alt="" />
                <CardOverlay overlay={card.overlay ?? null} />
                <div className="sol-card__ico">
                  <Icon size={18} strokeWidth={1.9} />
                </div>
              </div>
              <div className="sol-card__body">
                <h3 className="sol-card__title">{card.title}</h3>
                <p className="sol-card__desc">{card.description}</p>
                <span className="sol-card__arrow" aria-hidden>
                  <ArrowRight size={18} strokeWidth={2.2} />
                </span>
              </div>
            </SolutionCardLink>
          );
        })}
      </div>
    </section>
  );
}
