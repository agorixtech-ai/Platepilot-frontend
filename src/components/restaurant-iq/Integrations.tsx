import { IntegrationsTimeline } from "./IntegrationsTimeline";

const items = ["Recipes", "Tally", "Suppliers", "Weather", "CSV", "POS"];

export function Integrations() {
  return (
    <section id="integrations" className="bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 lg:px-8 pt-20">
        <div className="text-center">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-dark">
            <span className="h-px w-8 bg-primary/50" />
            Integrations
            <span className="h-px w-8 bg-primary/50" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Connects with your existing stack
          </h2>
          <p className="mt-3 text-sm text-muted-foreground">
            No rip-and-replace. Plug RestaurantIQ on top of the tools your team already uses.
          </p>
        </div>
      </div>
      <IntegrationsTimeline />
    </section>
  );
}
