const stats = [
  { v: "85%", l: "Average variance reduction" },
  { v: "3 hrs", l: "Setup time to go live" },
  { v: "$500+", l: "Monthly leakage recovered" },
  { v: "24/7", l: "Automated AI monitoring" },
];

export function StatsBar() {
  return (
    <section className="border-y border-border bg-secondary/50 py-16 text-foreground sm:py-20">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid grid-cols-2 gap-y-10 lg:grid-cols-4">
          {stats.map((s) => (
            <div
              key={s.l}
              className="text-center lg:border-r lg:border-border lg:last:border-r-0"
            >
              <div className="font-display text-4xl font-bold text-primary sm:text-5xl">{s.v}</div>
              <div className="mt-2 text-sm text-muted-foreground">{s.l}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
