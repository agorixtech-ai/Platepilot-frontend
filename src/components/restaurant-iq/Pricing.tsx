import { Check } from "lucide-react";

const tiers = [
  {
    name: "Starter",
    price: "$0",
    period: "/ free trial",
    desc: "For single-outlet kitchens piloting RestaurantIQ.",
    features: [
      "1 outlet · 1 POS connection",
      "Real-time dashboard",
      "Daily WhatsApp report",
      "7-day data history",
    ],
    cta: "Start Free Trial",
    highlight: false,
  },
  {
    name: "Growth",
    price: "$149",
    period: "/ outlet / month",
    desc: "Built for restaurant groups scaling 2-10 outlets.",
    features: [
      "Unlimited POS + Tally sync",
      "Leakage & variance detection",
      "Menu engineering module",
      "Predictive calendar",
      "Ask RestaurantIQ (Claude AI)",
      "Priority WhatsApp support",
    ],
    cta: "Get Early Access",
    highlight: true,
  },
  {
    name: "Enterprise",
    price: "Custom",
    period: "",
    desc: "For chains, cloud kitchens, and multi-brand groups.",
    features: [
      "Unlimited outlets",
      "Custom integrations & SSO",
      "Dedicated success manager",
      "On-prem deployment option",
      "Custom AI workflows",
    ],
    cta: "Talk to Sales",
    highlight: false,
  },
];

export function Pricing() {
  return (
    <section id="pricing" className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-dark">
            <span className="h-px w-8 bg-primary" />
            Pricing
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Simple pricing. Real savings.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Most kitchens recover the subscription in the first month from variance alone.
          </p>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-3">
          {tiers.map((t) => (
            <div
              key={t.name}
              className={`relative flex flex-col rounded-2xl border p-8 transition ${
                t.highlight
                  ? "border-primary bg-card shadow-[0_30px_70px_-25px_rgba(255,255,255,0.08)]"
                  : "border-border bg-card hover:-translate-y-1 hover:shadow-[0_24px_50px_-20px_rgba(2,6,23,0.15)]"
              }`}
            >
              {t.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-1 text-[10px] font-bold uppercase tracking-widest text-primary-foreground">
                  Most popular
                </div>
              )}
              <div className="font-display text-lg font-bold text-foreground">{t.name}</div>
              <div className="mt-4 flex items-baseline gap-1">
                <span className="font-display text-4xl font-bold text-foreground">{t.price}</span>
                <span className="text-sm text-muted-foreground">{t.period}</span>
              </div>
              <p className="mt-2 text-sm text-muted-foreground">{t.desc}</p>
              <ul className="mt-6 space-y-3 border-t border-border pt-6">
                {t.features.map((f) => (
                  <li key={f} className="flex items-start gap-2.5 text-sm text-foreground/80">
                    <Check className="mt-0.5 h-4 w-4 flex-none text-primary" />
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href="#cta"
                className={`mt-8 inline-flex items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition ${
                  t.highlight
                    ? "bg-primary text-primary-foreground"
                    : "border border-border bg-background text-foreground hover:bg-secondary"
                }`}
              >
                {t.cta}
              </a>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
