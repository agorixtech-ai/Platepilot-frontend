import { useEffect } from "react";
import { Link, useParams, Redirect, useLocation } from "react-router-dom";
import { AppPage } from "@/components/ionic/AppPage";
import { MarketingHero, MarketingShell } from "@/components/marketing/MarketingShell";
import {
  getProductFeature,
  getSolutionSegment,
  INTEGRATION_SECTIONS,
  PRODUCT_FEATURES,
  SOLUTION_SEGMENTS,
  type FeatureCard,
} from "./content";

function FeatureGrid({ items, basePath }: { items: FeatureCard[]; basePath: string }) {
  return (
    <div className="mkt-grid">
      {items.map(({ slug, label, desc, icon: Icon }) => (
        <Link key={slug} to={`${basePath}/${slug}`} className="mkt-card">
          <span className="mkt-card-icon">
            <Icon size={18} strokeWidth={2} />
          </span>
          <div className="mkt-card-title">{label}</div>
          <p className="mkt-card-desc">{desc}</p>
          <span className="mkt-card-link">Learn more →</span>
        </Link>
      ))}
    </div>
  );
}

function FeatureDetail({
  item,
  parentHref,
  parentLabel,
}: {
  item: FeatureCard;
  parentHref: string;
  parentLabel: string;
}) {
  const Icon = item.icon;
  return (
    <>
      <p style={{ fontSize: "0.85rem", color: "#66736B", marginBottom: "1.25rem" }}>
        <Link to={parentHref} style={{ color: "#16A34A", fontWeight: 600 }}>
          {parentLabel}
        </Link>
        <span aria-hidden> / </span>
        {item.label}
      </p>
      <header
        className="mkt-hero"
        style={{ borderBottom: "none", marginBottom: "2rem", paddingBottom: 0 }}
      >
        <div className="mkt-eyebrow">{item.label}</div>
        <h1 className="mkt-h1">{item.title}</h1>
        <p className="mkt-lead">{item.desc}</p>
        <div className="mkt-actions">
          <Link to="/demo" className="mkt-btn-primary">
            BOOK A DEMO
          </Link>
          <Link to={parentHref} className="mkt-btn-ghost">
            ALL {parentLabel.toUpperCase()}
          </Link>
        </div>
      </header>
      <section className="mkt-section">
        <div className="mkt-section-tag">↳ What you get</div>
        <h2 className="mkt-h2">Built into PlatePielet</h2>
        <div style={{ display: "flex", gap: 14, alignItems: "flex-start", marginTop: 8 }}>
          <span className="mkt-card-icon" style={{ marginTop: 4 }}>
            <Icon size={18} />
          </span>
          <ul className="mkt-bullets" style={{ marginTop: 0 }}>
            {item.bullets.map((b) => (
              <li key={b}>{b}</li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}

export function ProductHub() {
  return (
    <AppPage title="Product — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Product"
          title="Restaurant intelligence from the systems you already run"
          lead="Dashboards, sales analytics, inventory, menu performance, and PlatePielet AI — one product for every outlet."
        />
        <section className="mkt-section">
          <div className="mkt-section-tag">↳ Capabilities</div>
          <h2 className="mkt-h2">Explore the product</h2>
          <p className="mkt-body">
            Every module below maps to a surface your team can open in PlatePielet.
          </p>
          <FeatureGrid items={PRODUCT_FEATURES} basePath="/product" />
        </section>
      </MarketingShell>
    </AppPage>
  );
}

export function ProductFeaturePage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getProductFeature(slug) : undefined;
  if (!item) {
    return <Redirect to="/product" />;
  }
  return (
    <AppPage title={`${item.label} — PlatePielet`}>
      <MarketingShell>
        <FeatureDetail item={item} parentHref="/product" parentLabel="Product" />
      </MarketingShell>
    </AppPage>
  );
}

export function SolutionsHub() {
  return (
    <AppPage title="Solutions — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Solutions"
          title="Built for how restaurants actually operate"
          lead="Whether you run one cafe or a multi-city group, PlatePielet fits the way you buy, bill, and book."
        />
        <section className="mkt-section">
          <div className="mkt-section-tag">↳ By business type</div>
          <h2 className="mkt-h2">Pick your path</h2>
          <FeatureGrid items={SOLUTION_SEGMENTS} basePath="/solutions" />
        </section>
      </MarketingShell>
    </AppPage>
  );
}

export function SolutionSegmentPage() {
  const { slug } = useParams<{ slug: string }>();
  const item = slug ? getSolutionSegment(slug) : undefined;
  if (!item) {
    return <Redirect to="/solutions" />;
  }
  return (
    <AppPage title={`${item.label} — PlatePielet`}>
      <MarketingShell>
        <FeatureDetail item={item} parentHref="/solutions" parentLabel="Solutions" />
      </MarketingShell>
    </AppPage>
  );
}

export function IntegrationsPage() {
  const { hash } = useLocation();

  useEffect(() => {
    const id = hash.replace(/^#/, "");
    if (!id) return;
    const t = window.setTimeout(() => {
      document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
    }, 80);
    return () => window.clearTimeout(t);
  }, [hash]);

  return (
    <AppPage title="Integrations — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Integrations"
          title="Connect POS, Tally, and the files you already use"
          lead="No new hardware at the outlet. PlatePielet syncs the systems you run — and fills gaps with CSV, Excel, and APIs."
        />
        {INTEGRATION_SECTIONS.map((s) => {
          const Icon = s.icon;
          return (
            <section key={s.id} id={s.id} className="mkt-anchor mkt-section">
              <div className="mkt-section-tag">↳ {s.label}</div>
              <div style={{ display: "flex", gap: 12, alignItems: "center", marginBottom: 8 }}>
                <span className="mkt-card-icon">
                  <Icon size={18} />
                </span>
                <h2 className="mkt-h2" style={{ marginBottom: 0 }}>
                  {s.title}
                </h2>
              </div>
              <p className="mkt-body">{s.desc}</p>
              <ul className="mkt-bullets">
                {s.bullets.map((b) => (
                  <li key={b}>{b}</li>
                ))}
              </ul>
            </section>
          );
        })}
      </MarketingShell>
    </AppPage>
  );
}

export function PricingPage() {
  const plans = [
    {
      name: "Starter",
      price: "₹4,999",
      period: "/ month",
      desc: "Single outlet. POS + Tally sync, dashboards, and Pilot AI essentials.",
      featured: false,
    },
    {
      name: "Growth",
      price: "₹12,999",
      period: "/ month",
      desc: "Multi-branch. Inventory, menu engineering, alerts, and priority onboarding.",
      featured: true,
    },
    {
      name: "Group",
      price: "Custom",
      period: "",
      desc: "Restaurant groups and cloud kitchens. Dedicated success and API access.",
      featured: false,
    },
  ];

  return (
    <AppPage title="Pricing — PlatePielet">
      <MarketingShell ctaHeading="Not sure which plan fits? Book a walkthrough.">
        <MarketingHero
          eyebrow="Pricing"
          title="Simple plans for serious operators"
          lead="Start with a free trial. No credit card required. Upgrade when every outlet is live."
        />
        <div className="mkt-pricing-grid">
          {plans.map((p) => (
            <div key={p.name} className={`mkt-price-card${p.featured ? " featured" : ""}`}>
              <div className="mkt-price-name">{p.name}</div>
              <div className="mkt-price-amt">
                {p.price}
                {p.period ? <span>{p.period}</span> : null}
              </div>
              <p className="mkt-price-desc">{p.desc}</p>
              <Link to="/demo" className="mkt-btn-primary" style={{ width: "100%" }}>
                BOOK A DEMO
              </Link>
            </div>
          ))}
        </div>
        <p className="mkt-body" style={{ marginTop: "1.75rem" }}>
          Pricing is indicative for India launches and may vary by outlet count and connectors. Talk
          to us for a quote.
        </p>
      </MarketingShell>
    </AppPage>
  );
}

export function ResourcesPage() {
  const resources = [
    {
      title: "Product tour",
      desc: "See dashboards, Tally sync, and Pilot AI in a guided walkthrough.",
      href: "/demo",
    },
    {
      title: "How it works",
      desc: "Data in from POS and Tally — decisions out as alerts and purchase calls.",
      href: "/#how-it-works",
    },
    {
      title: "Menu engineering",
      desc: "How PlatePielet grades every dish from sell rate and profit per plate.",
      href: "/#menu-engineering",
    },
    {
      title: "FAQ",
      desc: "Hardware, setup time, POS support, and data safety — answered.",
      href: "/#faq",
    },
  ];

  return (
    <AppPage title="Resources — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Resources"
          title="Learn how PlatePielet runs a kitchen"
          lead="Guides, product walkthroughs, and answers for owners evaluating restaurant intelligence software."
        />
        <div className="mkt-grid">
          {resources.map((r) => (
            <Link key={r.title} to={r.href} className="mkt-card">
              <div className="mkt-card-title">{r.title}</div>
              <p className="mkt-card-desc">{r.desc}</p>
              <span className="mkt-card-link">Open →</span>
            </Link>
          ))}
        </div>
      </MarketingShell>
    </AppPage>
  );
}

export function CompanyPage() {
  return (
    <AppPage title="Company — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Company"
          title="Restaurant intelligence, built for Indian operators"
          lead="PlatePielet exists so owners stop reconciling Sundays away and start running every outlet on live numbers."
        />
        <section className="mkt-section">
          <div className="mkt-section-tag">↳ About</div>
          <h2 className="mkt-h2">Why we built this</h2>
          <p className="mkt-body">
            Most restaurant groups already pay for POS and Tally — but still run on WhatsApp and gut
            feel. We connect those systems into one intelligence layer: sales, stock, books, and
            Pilot AI in one place.
          </p>
          <ul className="mkt-bullets">
            <li>Multi-tenant SaaS for outlets and groups</li>
            <li>India-first workflows: Tally, GST, rupee KPIs</li>
            <li>Honest about data freshness — daily sync, clear UI</li>
          </ul>
        </section>
        <section className="mkt-section">
          <div className="mkt-section-tag">↳ Contact</div>
          <h2 className="mkt-h2">Talk to the team</h2>
          <p className="mkt-body">
            Book a demo or start a trial — we’ll help you connect your first outlet.
          </p>
          <div className="mkt-actions">
            <Link to="/demo" className="mkt-btn-primary">
              BOOK A DEMO
            </Link>
            <Link to="/signup" className="mkt-btn-ghost">
              START FREE TRIAL
            </Link>
          </div>
        </section>
      </MarketingShell>
    </AppPage>
  );
}
