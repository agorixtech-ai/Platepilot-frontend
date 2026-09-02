import { useEffect } from "react";
import { Link, useParams, Redirect, useLocation } from "react-router-dom";
import { AppPage } from "@/components/ionic/AppPage";
import { MarketingHero, MarketingShell } from "@/components/marketing/MarketingShell";
import { BookOpen, Compass, HelpCircle, Plug, Sparkles, UtensilsCrossed } from "lucide-react";
import { Marquee } from "@/components/ui/marquee";
import { BentoGrid } from "@/components/ui/bento-grid";
import { MagicCard } from "@/components/ui/magic-card";
import { BlurFade } from "@/components/ui/blur-fade";
import { Terminal, AnimatedSpan, TypingAnimation } from "@/components/ui/terminal";
import { Particles } from "@/components/ui/particles";
import { OrbitingCircles } from "@/components/ui/orbiting-circles";
import { WordRotate } from "@/components/ui/word-rotate";
import { TextReveal } from "@/components/ui/text-reveal";
import { NumberTicker } from "@/components/ui/number-ticker";
import { AnimatedShinyText } from "@/components/ui/animated-shiny-text";
import { BorderBeam } from "@/components/ui/border-beam";
import {
  DATA_MARQUEE,
  getProductFeature,
  getSolutionSegment,
  INTEGRATION_SECTIONS,
  PRODUCT_FEATURES,
  SOLUTION_SEGMENTS,
  type FeatureCard,
  type FeaturePreview,
} from "./content";

const CARD_BORDER = "#DDE7E1";
const MUTED = "#66736B";
const INK = "#152019";

/** Pills in the last column of a table preview. Unknown values render as plain text. */
const STATUS_PILL: Record<string, { bg: string; fg: string }> = {
  Completed: { bg: "#E8F7ED", fg: "#15803D" },
  Pending: { bg: "#FEF3C7", fg: "#B45309" },
  Refunded: { bg: "#FEE2E2", fg: "#B91C1C" },
  Cancelled: { bg: "#FEE2E2", fg: "#B91C1C" },
  Owner: { bg: "#E8F7ED", fg: "#15803D" },
  Admin: { bg: "#E0EDFF", fg: "#1D4ED8" },
  Member: { bg: "#EEF2F0", fg: "#3D4A43" },
  Viewer: { bg: "#F3E8FF", fg: "#7E22CE" },
};

/**
 * Animates the numeric part of a preview value while keeping its formatting —
 * "₹4.82L" must land on "₹4.82L", not a bare 4.82. Mirrors the same split the
 * real KPI cards do in Overview.tsx.
 */
function TickerValue({ value }: { value: string }) {
  const match = value.match(/^(\D*)([\d,]+(?:\.\d+)?)(.*)$/);
  if (!match) return <>{value}</>;
  const [, prefix, num, suffix] = match;
  const decimals = num.includes(".") ? num.split(".")[1].length : 0;
  return (
    <>
      {prefix}
      <NumberTicker
        value={parseFloat(num.replace(/,/g, ""))}
        decimalPlaces={decimals}
        className="tracking-[-0.02em] text-[#152019] dark:text-[#152019]"
      />
      {suffix}
    </>
  );
}

function RoadmapBadge() {
  return (
    <span
      style={{
        display: "inline-flex",
        alignItems: "center",
        padding: "0.15rem 0.6rem",
        borderRadius: 999,
        border: `1px solid ${CARD_BORDER}`,
        background: "#fff",
        marginLeft: "0.6rem",
        verticalAlign: "middle",
      }}
    >
      <AnimatedShinyText className="mx-0 max-w-none text-[0.62rem] font-bold tracking-[0.12em] uppercase">
        On the roadmap
      </AnimatedShinyText>
    </span>
  );
}

const PREVIEW_COPY: Record<FeaturePreview["kind"], { heading: string; caption: string }> = {
  kpi: {
    heading: "The numbers you land on",
    caption: "Sample values. Your dashboard renders live numbers from your own POS and Tally sync.",
  },
  table: {
    heading: "The log you work in",
    caption: "Sample rows. Your sales log lists the real bills your POS printed.",
  },
  bars: {
    heading: "The leaderboard you open first",
    caption: "Sample ranking. Your leaderboard ranks live branch revenue for the period you pick.",
  },
  alerts: {
    heading: "The feed that interrupts you",
    caption:
      "Sample alerts. Your feed is raised from live Tally stock levels for your own outlets.",
  },
  steps: {
    heading: "How your data gets in",
    caption: "Steps marked “on the roadmap” are not built yet — everything else runs today.",
  },
};

/** Severity rails in the alert-feed preview — mirrors SEVERITY in InventoryAlertsCard. */
const ALERT_SEVERITY = {
  critical: { rail: "#DC2626", chipBg: "#FEE2E2", chipFg: "#B91C1C", label: "Critical" },
  low: { rail: "#D97706", chipBg: "#FEF3C7", chipFg: "#B45309", label: "Low" },
} as const;

function PreviewBody({ preview }: { preview: FeaturePreview }) {
  if (preview.kind === "kpi") {
    return (
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(auto-fit, minmax(168px, 1fr))",
          gap: 12,
        }}
      >
        {preview.items.map((k) => (
          <div
            key={k.label}
            style={{
              padding: "1.1rem 1.15rem",
              borderRadius: 14,
              border: `1px solid ${CARD_BORDER}`,
              background: "#fff",
            }}
          >
            <div
              style={{
                fontSize: "0.68rem",
                fontWeight: 700,
                letterSpacing: "0.1em",
                textTransform: "uppercase",
                color: MUTED,
              }}
            >
              {k.label}
            </div>
            <div
              style={{
                fontSize: "1.5rem",
                fontWeight: 800,
                letterSpacing: "-0.02em",
                margin: "0.35rem 0 0.2rem",
                color: INK,
              }}
            >
              <TickerValue value={k.value} />
            </div>
            <div style={{ fontSize: "0.78rem", lineHeight: 1.4, color: MUTED }}>{k.note}</div>
          </div>
        ))}
      </div>
    );
  }

  if (preview.kind === "table") {
    return (
      <div
        style={{
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          background: "#fff",
          overflowX: "auto",
        }}
      >
        <table style={{ width: "100%", borderCollapse: "collapse", fontSize: "0.85rem" }}>
          <thead>
            <tr style={{ background: "#F1F6F3" }}>
              {preview.columns.map((c) => (
                <th
                  key={c}
                  style={{
                    padding: "0.7rem 0.9rem",
                    textAlign: "left",
                    fontSize: "0.65rem",
                    fontWeight: 700,
                    letterSpacing: "0.1em",
                    textTransform: "uppercase",
                    color: MUTED,
                    whiteSpace: "nowrap",
                  }}
                >
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {preview.rows.map((row) => (
              <tr key={row[0]} style={{ borderTop: `1px solid ${CARD_BORDER}` }}>
                {row.map((cell, i) => {
                  const pill = i === row.length - 1 ? STATUS_PILL[cell] : undefined;
                  return (
                    <td
                      key={`${row[0]}-${i}`}
                      style={{
                        padding: "0.7rem 0.9rem",
                        whiteSpace: "nowrap",
                        fontWeight: i === 0 ? 700 : 500,
                        color: i === 0 ? "#152019" : "#3D4A43",
                      }}
                    >
                      {pill ? (
                        <span
                          style={{
                            display: "inline-block",
                            padding: "0.2rem 0.6rem",
                            borderRadius: 999,
                            background: pill.bg,
                            color: pill.fg,
                            fontSize: "0.72rem",
                            fontWeight: 700,
                          }}
                        >
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  );
                })}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  }

  if (preview.kind === "steps") {
    return (
      <ol style={{ display: "grid", gap: 0 }}>
        {preview.items.map((st, i) => {
          const planned = st.status === "roadmap";
          return (
            <li
              key={st.title}
              style={{ display: "flex", gap: "1rem", alignItems: "stretch", minHeight: 78 }}
            >
              <div
                style={{
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  width: 34,
                }}
              >
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: 34,
                    height: 34,
                    borderRadius: 999,
                    flexShrink: 0,
                    fontSize: "0.85rem",
                    fontWeight: 800,
                    background: planned ? "#fff" : "#16A34A",
                    color: planned ? MUTED : "#fff",
                    border: planned ? `1px dashed ${MUTED}` : "1px solid #16A34A",
                  }}
                >
                  {i + 1}
                </span>
                {i < preview.items.length - 1 ? (
                  <span
                    style={{
                      flex: 1,
                      width: 2,
                      marginTop: 4,
                      marginBottom: 4,
                      background: planned ? CARD_BORDER : "#BFE3CD",
                    }}
                  />
                ) : null}
              </div>
              <div style={{ paddingBottom: "1.4rem", minWidth: 0 }}>
                <div style={{ fontSize: "1rem", fontWeight: 700, color: INK }}>
                  {st.title}
                  {planned ? <RoadmapBadge /> : null}
                </div>
                <p
                  style={{ fontSize: "0.9rem", lineHeight: 1.5, color: MUTED, marginTop: "0.2rem" }}
                >
                  {st.detail}
                </p>
              </div>
            </li>
          );
        })}
      </ol>
    );
  }

  if (preview.kind === "alerts") {
    return (
      <div
        style={{
          border: `1px solid ${CARD_BORDER}`,
          borderRadius: 14,
          background: "#fff",
          overflow: "hidden",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: "0.55rem",
            padding: "0.85rem 1.1rem",
            borderBottom: `1px solid ${CARD_BORDER}`,
            background: "#F1F6F3",
          }}
        >
          <span
            style={{
              width: 8,
              height: 8,
              borderRadius: 999,
              background: ALERT_SEVERITY.critical.rail,
              flexShrink: 0,
            }}
          />
          <span
            style={{
              fontSize: "0.68rem",
              fontWeight: 700,
              letterSpacing: "0.14em",
              textTransform: "uppercase",
              color: MUTED,
            }}
          >
            Live
          </span>
          <span style={{ fontSize: "0.82rem", fontWeight: 700, color: "#152019" }}>
            Inventory Alerts
          </span>
          <span style={{ marginLeft: "auto", fontSize: "0.75rem", color: MUTED }}>
            {preview.summary}
          </span>
        </div>
        <ul>
          {preview.items.map((a) => {
            const sev = ALERT_SEVERITY[a.severity];
            return (
              <li
                key={a.title}
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "0.8rem",
                  padding: "0.8rem 1.1rem",
                  borderTop: `1px solid ${CARD_BORDER}`,
                  borderLeft: `3px solid ${sev.rail}`,
                }}
              >
                <div style={{ minWidth: 0, flex: 1 }}>
                  <div
                    style={{
                      display: "flex",
                      alignItems: "center",
                      gap: "0.5rem",
                      flexWrap: "wrap",
                    }}
                  >
                    <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#152019" }}>
                      {a.title}
                    </span>
                    <span
                      style={{
                        padding: "0.1rem 0.5rem",
                        borderRadius: 999,
                        background: sev.chipBg,
                        color: sev.chipFg,
                        fontSize: "0.68rem",
                        fontWeight: 700,
                      }}
                    >
                      {sev.label}
                    </span>
                    {a.isNew ? (
                      <span
                        style={{
                          padding: "0.1rem 0.5rem",
                          borderRadius: 999,
                          border: "1px solid #16A34A",
                          color: "#15803D",
                          fontSize: "0.65rem",
                          fontWeight: 700,
                          letterSpacing: "0.06em",
                        }}
                      >
                        NEW
                      </span>
                    ) : null}
                  </div>
                  <div style={{ fontSize: "0.8rem", color: MUTED, marginTop: "0.15rem" }}>
                    {a.detail}
                  </div>
                </div>
                <span style={{ fontSize: "0.75rem", color: MUTED, whiteSpace: "nowrap" }}>
                  {a.time}
                </span>
              </li>
            );
          })}
        </ul>
      </div>
    );
  }

  return (
    <div
      style={{
        border: `1px solid ${CARD_BORDER}`,
        borderRadius: 14,
        background: "#fff",
        padding: "1.35rem 1.4rem",
        display: "grid",
        gap: "1.05rem",
      }}
    >
      {preview.items.map((b, i) => (
        <div key={b.label}>
          <div
            style={{
              display: "flex",
              alignItems: "baseline",
              justifyContent: "space-between",
              gap: 12,
              marginBottom: "0.4rem",
            }}
          >
            <span style={{ fontSize: "0.88rem", fontWeight: 700, color: "#152019" }}>
              <span style={{ color: MUTED, fontWeight: 800, marginRight: "0.5rem" }}>{i + 1}</span>
              {b.label}
            </span>
            <span style={{ fontSize: "0.88rem", fontWeight: 800, color: "#152019" }}>
              {b.value}
            </span>
          </div>
          <div style={{ height: 8, borderRadius: 999, background: "#EEF3F0", overflow: "hidden" }}>
            <div
              style={{
                width: `${b.pct}%`,
                height: "100%",
                borderRadius: 999,
                background: i === 0 ? "#16A34A" : "#86D0A5",
              }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function FeaturePreviewSection({
  preview,
  caption,
}: {
  preview: FeaturePreview;
  caption?: string;
}) {
  const copy = PREVIEW_COPY[preview.kind];
  return (
    <section className="mkt-section">
      <div className="mkt-section-tag">↳ On screen</div>
      <h2 className="mkt-h2">{copy.heading}</h2>
      <div style={{ marginTop: "1.5rem", position: "relative", borderRadius: 14 }}>
        <PreviewBody preview={preview} />
        {/* ponytail: beam is decoration — the steps timeline has no card edge to trace. */}
        {preview.kind === "steps" ? null : (
          <BorderBeam size={110} duration={9} colorFrom="#16A34A" colorTo="#86D0A5" />
        )}
      </div>
      <p style={{ fontSize: "0.8rem", color: MUTED, marginTop: "0.9rem" }}>
        {caption ?? copy.caption}
      </p>
    </section>
  );
}

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
      {item.preview ? (
        <FeaturePreviewSection preview={item.preview} caption={item.previewCaption} />
      ) : null}

      {item.sections ? (
        item.sections.map((s) => (
          <section key={s.tag} className="mkt-section">
            <div className="mkt-section-tag">↳ {s.tag}</div>
            <h2 className="mkt-h2">
              {s.title}
              {s.roadmap ? <RoadmapBadge /> : null}
            </h2>
            {s.body ? <p className="mkt-body">{s.body}</p> : null}
            <ul className="mkt-bullets">
              {s.bullets.map((b) => (
                <li key={b}>{b}</li>
              ))}
            </ul>
          </section>
        ))
      ) : (
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
      )}
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
          lead="No new hardware at the outlet. PlatePielet reads the systems you already run — and fills the gaps with CSV, Excel, and APIs."
        />

        <div
          style={{
            position: "relative",
            marginBottom: "3.5rem",
            padding: "1.4rem 0",
            border: `1px solid ${CARD_BORDER}`,
            borderRadius: 16,
            background: "#fff",
            overflow: "hidden",
          }}
        >
          <div
            className="mkt-section-tag"
            style={{ marginBottom: "0.9rem", paddingLeft: "1.4rem" }}
          >
            ↳ What PlatePielet reads today
          </div>
          <Marquee pauseOnHover className="[--duration:32s] [--gap:1rem]">
            {DATA_MARQUEE.map((d) => (
              <span
                key={d}
                style={{
                  padding: "0.5rem 1.05rem",
                  borderRadius: 999,
                  border: `1px solid ${CARD_BORDER}`,
                  background: "#F1F6F3",
                  color: INK,
                  fontSize: "0.85rem",
                  fontWeight: 600,
                  whiteSpace: "nowrap",
                }}
              >
                {d}
              </span>
            ))}
          </Marquee>
        </div>

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
              {s.roadmap?.length ? (
                <div style={{ marginTop: "1.5rem" }}>
                  <div
                    style={{
                      fontSize: "0.7rem",
                      fontWeight: 700,
                      letterSpacing: "0.14em",
                      textTransform: "uppercase",
                      color: MUTED,
                    }}
                  >
                    <AnimatedShinyText className="mx-0 max-w-none">
                      On the roadmap
                    </AnimatedShinyText>
                  </div>
                  <ul className="mkt-bullets mkt-bullets-planned">
                    {s.roadmap.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                </div>
              ) : null}
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

const RESOURCE_TILES = [
  {
    icon: Compass,
    title: "Product tour",
    desc: "See the dashboard, your Tally books, and Pilot AI in a guided walkthrough on your own numbers.",
    href: "/demo",
    cta: "Book a walkthrough",
  },
  {
    icon: BookOpen,
    title: "How it works",
    desc: "Data in from POS and Tally — decisions out as KPIs, alerts, and purchase calls.",
    href: "/#how-it-works",
    cta: "Read the flow",
  },
  {
    icon: UtensilsCrossed,
    title: "Menu engineering",
    desc: "How every dish gets graded from its sell rate and profit per plate.",
    href: "/product/menu-performance",
    cta: "See the grading",
  },
  {
    icon: Plug,
    title: "Integrations & data",
    desc: "What PlatePielet reads today, what is on the roadmap, and how your first load works.",
    href: "/integrations",
    cta: "Browse integrations",
  },
  {
    icon: Sparkles,
    title: "Pilot AI",
    desc: "Ask questions about your bills and books in plain language, answered from your own data.",
    href: "/product/ai",
    cta: "Meet Pilot AI",
  },
  {
    icon: HelpCircle,
    title: "Common questions",
    desc: "Hardware, setup time, POS support, data isolation, and export — answered below.",
    href: "#faq",
    cta: "Jump to FAQ",
  },
];

/** Every formula here is the one the backend actually computes. */
const METRIC_GLOSSARY = [
  {
    term: "Orders",
    def: "Distinct invoice numbers — not line items. A five-item bill counts once.",
  },
  {
    term: "Net cost",
    def: "Purchase vouchers plus purchase returns, since returns carry a negative amount and reduce cost.",
  },
  {
    term: "Food cost %",
    def: "Net cost divided by POS revenue for the same period, times one hundred.",
  },
  {
    term: "Gross margin",
    def: "POS revenue minus net cost. Margin % is that figure over revenue.",
  },
  {
    term: "Waste %",
    def: "Ingredient variance measured against revenue for the period.",
  },
  {
    term: "Open issues",
    def: "Every order whose status is not Completed — pending, cancelled, or refunded.",
  },
];

const FAQS = [
  {
    q: "Do I need new hardware at the outlet?",
    a: "No. PlatePielet reads the exports your existing POS and Tally already produce. Nothing is installed at the till and your staff keep billing exactly as they do now.",
  },
  {
    q: "Which POS systems do you support?",
    a: "Today we load your POS history from the export your system produces, and we run that first load for you during onboarding. Direct connectors to specific POS vendors are on the roadmap — ask us about yours and we will tell you honestly where it stands.",
  },
  {
    q: "How does Tally connect?",
    a: "Your Tally voucher export drives every cost and margin number we show — purchase, purchase return, and sales return vouchers. Your Tally server address and your sales, tax, and cash ledger names are configured per tenant. Scheduled two-way sync is on the roadmap, not shipped.",
  },
  {
    q: "How fresh is the data?",
    a: "The dashboard polls every sixty seconds and again whenever you return to the tab, and every card states its own period and comparison label. The underlying records are as fresh as your last load — we would rather show you the timestamp than imply real time we cannot deliver.",
  },
  {
    q: "Is my group's data isolated from other customers?",
    a: "Yes. Every record is scoped to your tenant, and access is controlled by four roles — owner, admin, member, and viewer. Authentication uses JWTs with refresh, token blacklisting on logout, and lockout after repeated failed logins.",
  },
  {
    q: "Can I get my data back out?",
    a: "Yes. Period summaries download as CSV, and every number on every screen is backed by a JSON endpoint you can call yourself.",
  },
];

export function ResourcesPage() {
  return (
    <AppPage title="Resources — PlatePielet">
      <MarketingShell>
        <MarketingHero
          eyebrow="Resources"
          title="Learn how PlatePielet runs a kitchen"
          lead="Guides, product walkthroughs, metric definitions, and straight answers for owners evaluating restaurant intelligence software."
        />

        <BlurFade inView delay={0.05}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ Guides</div>
            <h2 className="mkt-h2">Start anywhere</h2>
            <BentoGrid className="mt-7 auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {RESOURCE_TILES.map(({ icon: Icon, title, desc, href, cta }) => (
                <MagicCard
                  key={title}
                  className="rounded-2xl [--color-background:#ffffff] [--color-border:#DDE7E1]"
                  gradientColor="#DCF5E6"
                  gradientFrom="#16A34A"
                  gradientTo="#86D0A5"
                  gradientOpacity={0.5}
                  gradientSize={190}
                >
                  <Link
                    to={href}
                    style={{
                      display: "flex",
                      flexDirection: "column",
                      gap: "0.6rem",
                      padding: "1.4rem 1.35rem",
                      height: "100%",
                    }}
                  >
                    <span className="mkt-card-icon">
                      <Icon size={18} strokeWidth={2} />
                    </span>
                    <span style={{ fontSize: "1rem", fontWeight: 700, color: INK }}>{title}</span>
                    <span style={{ fontSize: "0.9rem", lineHeight: 1.5, color: MUTED }}>
                      {desc}
                    </span>
                    <span
                      style={{
                        marginTop: "auto",
                        paddingTop: "0.6rem",
                        fontSize: "0.8rem",
                        fontWeight: 700,
                        color: "#15803D",
                      }}
                    >
                      {cta} →
                    </span>
                  </Link>
                </MagicCard>
              ))}
            </BentoGrid>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ For developers</div>
            <h2 className="mkt-h2">Every number has an endpoint</h2>
            <p className="mkt-body">
              Nothing on the dashboard is computed in the browser and hidden from you. Point your
              own tooling at the same API the product uses.
            </p>
            <div style={{ marginTop: "1.75rem" }}>
              <Terminal className="max-w-none [--color-background:#ffffff] [--color-border:#DDE7E1]">
                <TypingAnimation className="text-[#3D4A43]">
                  &gt; curl "$PLATEPIELET_API/api/dashboard/metrics?period=month"
                </TypingAnimation>
                <AnimatedSpan className="text-[#15803D]">
                  ✔ 200 — total_sales, orders, food_cost_pct, margin_pct
                </AnimatedSpan>
                <TypingAnimation className="text-[#3D4A43]">
                  &gt; curl "$PLATEPIELET_API/api/dashboard/branch-summary?period=month"
                </TypingAnimation>
                <AnimatedSpan className="text-[#15803D]">
                  ✔ items[] — every outlet, ranked by sales
                </AnimatedSpan>
                <TypingAnimation className="text-[#3D4A43]">
                  &gt; curl "$PLATEPIELET_API/api/reports/summary/csv" -o summary.csv
                </TypingAnimation>
                <AnimatedSpan className="text-[#15803D]">
                  ✔ period summary, ready for your accountant
                </AnimatedSpan>
                <TypingAnimation className="text-[#3D4A43]">
                  &gt; curl -X POST "$PLATEPIELET_API/api/agent/query" -H "Authorization: Bearer
                  $TOKEN"
                </TypingAnimation>
                <AnimatedSpan className="text-[#15803D]">
                  ✔ Pilot AI, answering from your own records
                </AnimatedSpan>
              </Terminal>
            </div>
            <p style={{ fontSize: "0.8rem", color: MUTED, marginTop: "0.9rem" }}>
              Set <code>$PLATEPIELET_API</code> to your instance. The AI endpoint requires a bearer
              token scoped to your tenant.
            </p>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ Glossary</div>
            <h2 className="mkt-h2">What each number actually means</h2>
            <p className="mkt-body">
              Two restaurants rarely define food cost the same way. These are the definitions
              PlatePielet computes — so you can check them against your own.
            </p>
            <div
              style={{
                marginTop: "1.75rem",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(260px, 1fr))",
                gap: 12,
              }}
            >
              {METRIC_GLOSSARY.map((m) => (
                <div
                  key={m.term}
                  style={{
                    padding: "1.15rem 1.2rem",
                    borderRadius: 14,
                    border: `1px solid ${CARD_BORDER}`,
                    background: "#fff",
                  }}
                >
                  <div style={{ fontSize: "0.95rem", fontWeight: 700, color: INK }}>{m.term}</div>
                  <p
                    style={{
                      fontSize: "0.88rem",
                      lineHeight: 1.55,
                      color: MUTED,
                      marginTop: "0.3rem",
                    }}
                  >
                    {m.def}
                  </p>
                </div>
              ))}
            </div>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.1}>
          <section id="faq" className="mkt-section" style={{ scrollMarginTop: 110 }}>
            <div className="mkt-section-tag">↳ FAQ</div>
            <h2 className="mkt-h2">Straight answers</h2>
            <div style={{ marginTop: "1.75rem" }}>
              {FAQS.map((f) => (
                <details key={f.q} className="mkt-faq">
                  <summary>{f.q}</summary>
                  <p className="mkt-faq-body">{f.a}</p>
                </details>
              ))}
            </div>
          </section>
        </BlurFade>
      </MarketingShell>
    </AppPage>
  );
}

/** Each principle is a decision you can find in the codebase, not a slogan. */
const PRINCIPLES = [
  {
    title: "Missing is not zero",
    body: "When no purchase vouchers exist for a period, margin and food cost stay blank. A dashboard that shows a confident 100% margin has taught you to distrust it.",
  },
  {
    title: "Show the timestamp",
    body: "Every card states its own period and comparison label, and the alert feed ticks “updated 12s ago” every second. You should never have to guess how old a number is.",
  },
  {
    title: "Worst news first",
    body: "The branch insights are ordered by severity, so the outlet that slipped is the first thing you read — not something you find by scrolling.",
  },
  {
    title: "Nothing at the till",
    body: "No new hardware, no new terminal, no retraining. Your staff keep billing exactly as they do now, and we read what your systems already produce.",
  },
  {
    title: "Every number has an endpoint",
    body: "Nothing is computed in the browser and hidden from you. Each metric on each screen is backed by a JSON API you can call yourself.",
  },
  {
    title: "Say what isn't built",
    body: "Features on the roadmap are labelled as roadmap, here and across this site. We would rather lose a deal than win one on a capability we cannot demo.",
  },
];

const ORBIT_INNER = ["POS bills", "Tally vouchers", "Stock levels"];
const ORBIT_OUTER = ["Market prices", "Menu grades", "Reconciliation", "Team roles"];

function OrbitChip({ label }: { label: string }) {
  return (
    <span
      style={{
        padding: "0.4rem 0.8rem",
        borderRadius: 999,
        border: `1px solid ${CARD_BORDER}`,
        background: "#fff",
        color: INK,
        fontSize: "0.78rem",
        fontWeight: 600,
        whiteSpace: "nowrap",
        boxShadow: "0 2px 10px rgba(7,26,20,0.05)",
      }}
    >
      {label}
    </span>
  );
}

export function CompanyPage() {
  return (
    <AppPage title="Company — PlatePielet">
      <MarketingShell>
        <header className="mkt-hero" style={{ position: "relative", overflow: "hidden" }}>
          <Particles
            className="pointer-events-none absolute inset-0"
            quantity={70}
            size={0.5}
            staticity={40}
            ease={60}
            color="#16A34A"
          />
          <div style={{ position: "relative", zIndex: 1 }}>
            <div className="mkt-eyebrow">Company</div>
            <h1 className="mkt-h1">Restaurant intelligence, built for Indian operators</h1>
            <p className="mkt-lead">
              PlatePielet exists so owners stop reconciling Sundays away and start running every
              outlet on live numbers.
            </p>
            <div className="mkt-actions">
              <Link to="/demo" className="mkt-btn-primary">
                BOOK A DEMO
              </Link>
              <Link to="/signup" className="mkt-btn-ghost">
                START FREE TRIAL
              </Link>
            </div>
          </div>
        </header>

        <BlurFade inView delay={0.05}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ About</div>
            <h2 className="mkt-h2">Why we built this</h2>
            <p className="mkt-body">
              Most restaurant groups already pay for POS and Tally — but still run on WhatsApp and
              gut feel. We connect those systems into one intelligence layer: sales, stock, books,
              and Pilot AI in one place.
            </p>
            <div
              style={{
                marginTop: "1.75rem",
                display: "flex",
                alignItems: "center",
                gap: "0.75rem",
                flexWrap: "wrap",
                fontSize: "1.05rem",
                fontWeight: 700,
                color: INK,
              }}
            >
              <span>What we replace:</span>
              <WordRotate
                className="text-[1.05rem] font-extrabold text-[#16A34A]"
                words={[
                  "spreadsheets",
                  "Sunday reconciliation",
                  "gut feel",
                  "five phone calls",
                  "month-end surprises",
                ]}
              />
            </div>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.05}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ One layer</div>
            <h2 className="mkt-h2">Everything your outlets already produce</h2>
            <p className="mkt-body">
              We did not add another system for your team to keep updated. PlatePielet sits on top
              of the ones you already run.
            </p>
            <div
              style={{
                position: "relative",
                display: "flex",
                height: 520,
                width: "100%",
                alignItems: "center",
                justifyContent: "center",
                overflow: "hidden",
                marginTop: "1.25rem",
                color: INK,
              }}
            >
              <span
                style={{
                  fontSize: "clamp(1.25rem, 3vw, 1.8rem)",
                  fontWeight: 800,
                  letterSpacing: "-0.02em",
                  background: "linear-gradient(160deg, #0F7A4C, #22C55E)",
                  WebkitBackgroundClip: "text",
                  WebkitTextFillColor: "transparent",
                }}
              >
                PlatePielet
              </span>
              <OrbitingCircles radius={132} duration={26} iconSize={40}>
                {ORBIT_INNER.map((l) => (
                  <OrbitChip key={l} label={l} />
                ))}
              </OrbitingCircles>
              <OrbitingCircles radius={228} duration={34} iconSize={40} reverse>
                {ORBIT_OUTER.map((l) => (
                  <OrbitChip key={l} label={l} />
                ))}
              </OrbitingCircles>
            </div>
          </section>
        </BlurFade>

        <section className="mkt-section" style={{ marginBottom: 0 }}>
          <div className="mkt-section-tag">↳ Our bias</div>
          <TextReveal className="h-[140vh] text-[#152019]">
            We would rather show you an honest gap than a confident number that turns out to be
            wrong.
          </TextReveal>
        </section>

        <BlurFade inView delay={0.05}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ How we build</div>
            <h2 className="mkt-h2">Six decisions you can check</h2>
            <p className="mkt-body">
              Principles are cheap. Each of these is a choice already made in the product — open a
              screen and hold us to it.
            </p>
            <BentoGrid className="mt-7 auto-rows-auto grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
              {PRINCIPLES.map((pr) => (
                <MagicCard
                  key={pr.title}
                  className="rounded-2xl [--color-background:#ffffff] [--color-border:#DDE7E1]"
                  gradientColor="#DCF5E6"
                  gradientFrom="#16A34A"
                  gradientTo="#86D0A5"
                  gradientOpacity={0.5}
                  gradientSize={190}
                >
                  <div style={{ padding: "1.4rem 1.35rem" }}>
                    <div style={{ fontSize: "1rem", fontWeight: 700, color: INK }}>{pr.title}</div>
                    <p
                      style={{
                        fontSize: "0.9rem",
                        lineHeight: 1.55,
                        color: MUTED,
                        marginTop: "0.45rem",
                      }}
                    >
                      {pr.body}
                    </p>
                  </div>
                </MagicCard>
              ))}
            </BentoGrid>
          </section>
        </BlurFade>

        <BlurFade inView delay={0.05}>
          <section className="mkt-section">
            <div className="mkt-section-tag">↳ Contact</div>
            <h2 className="mkt-h2">Talk to the team</h2>
            <p className="mkt-body">
              Book a demo or start a trial — we'll help you connect your first outlet.
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
        </BlurFade>
      </MarketingShell>
    </AppPage>
  );
}
