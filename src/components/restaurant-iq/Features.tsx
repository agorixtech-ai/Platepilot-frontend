import {
  LineChart,
  ShieldAlert,
  Smartphone,
  Bell,
  BarChart3,
  ShoppingCart,
  MessageSquare,
  CloudSun,
  GitCompare,
  Activity,
  Boxes,
  Sparkles,
} from "lucide-react";

const features = [
  {
    icon: Activity,
    color: "text-white",
    bg: "bg-white/10",
    title: "Real-Time Sales Monitoring",
    desc: "Watch revenue, covers, and ticket sizes update live across every outlet — no end-of-day waiting.",
  },
  {
    icon: Boxes,
    color: "text-white/80",
    bg: "bg-white/8",
    title: "Inventory Visibility",
    desc: "One source of truth for stock across branches. Tally + POS reconciled automatically, every minute.",
  },
  {
    icon: ShieldAlert,
    color: "text-white/70",
    bg: "bg-white/6",
    title: "Predictive Stock Alerts",
    desc: "Get warned before you run out. AI forecasts par levels using sales velocity and lead times.",
  },
  {
    icon: ShoppingCart,
    color: "text-white/80",
    bg: "bg-white/8",
    title: "Purchase Recommendations",
    desc: "Auto-generated PO suggestions by supplier, optimised for demand, price, and shelf life.",
  },
  {
    icon: MessageSquare,
    color: "text-white/70",
    bg: "bg-white/6",
    title: "Natural-Language Queries",
    desc: "Ask “Which outlet had the best margin last week?” in plain English. Get sourced answers in seconds.",
  },
  {
    icon: CloudSun,
    color: "text-white/80",
    bg: "bg-white/8",
    title: "Weather & Event Alerts",
    desc: "Smart notifications for rain, match days, festivals, and local events that move demand.",
  },
  {
    icon: GitCompare,
    color: "text-white/70",
    bg: "bg-white/6",
    title: "Branch Performance Compare",
    desc: "Rank outlets by revenue, food cost %, and margin. Spot leaders and laggards instantly.",
  },
  {
    icon: Smartphone,
    color: "text-white",
    bg: "bg-white/10",
    title: "Mobile Dashboard",
    desc: "A clean, owner-friendly mobile app — run your restaurant from the palm of your hand.",
  },
  {
    icon: Sparkles,
    color: "text-white/80",
    bg: "bg-white/8",
    title: "Ask RestaurantIQ",
    desc: "Conversational AI built on Claude. Explains the “why” behind every number with full context.",
  },
];

export function Features() {
  return (
    <section id="features" className="bg-section-features py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-dark">
            <span className="h-px w-8 bg-primary" />
            What RestaurantIQ Does
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            One platform. Every operational lever.
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Nine intelligent modules that turn POS and Tally data into profit-protecting decisions.
          </p>
        </div>

        <div className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((f) => (
            <div
              key={f.title}
              className="group rounded-2xl border border-border bg-card p-7 transition hover:-translate-y-1 hover:border-primary/30 hover:shadow-[0_24px_50px_-20px_rgba(2,6,23,0.18)]"
            >
              <div className={`grid h-12 w-12 place-items-center rounded-xl ${f.bg} ${f.color}`}>
                <f.icon className="h-6 w-6" />
              </div>
              <h3 className="mt-5 font-display text-xl font-bold text-foreground">{f.title}</h3>
              <p className="mt-2.5 text-sm leading-relaxed text-muted-foreground">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
