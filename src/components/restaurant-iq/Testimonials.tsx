const quotes = [
  {
    quote:
      "Within the first month, RestaurantIQ flagged a $600 cheese variance we'd been bleeding for over a year. The leakage module paid for the platform 10x over.",
    name: "Rajesh Kumar",
    role: "Owner, The Ramen Collective — Bengaluru",
    initials: "RK",
  },
  {
    quote:
      "The predictive calendar nailed our potato stocks during the IPL finals. No 86s, no panic runs to the market. It just… knew.",
    name: "Priya Menon",
    role: "F&B Director, Coastal Kitchen — Chennai",
    initials: "PM",
  },
];

export function Testimonials() {
  return (
    <section className="bg-background py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <h2 className="font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            Built for kitchens, loved by owners
          </h2>
        </div>

        <div className="mt-14 grid gap-6 lg:grid-cols-2">
          {quotes.map((q) => (
            <figure
              key={q.name}
              className="relative overflow-hidden rounded-2xl border border-border bg-card p-8 transition hover:shadow-[0_24px_60px_-20px_rgba(2,6,23,0.18)] sm:p-10"
            >
              <div className="pointer-events-none absolute -top-6 left-6 font-display text-[140px] leading-none text-primary/15">
                &ldquo;
              </div>
              <blockquote className="relative">
                <p className="text-lg leading-relaxed text-foreground sm:text-xl">{q.quote}</p>
              </blockquote>
              <figcaption className="mt-8 flex items-center gap-4">
                <div className="grid h-12 w-12 place-items-center rounded-full bg-primary-soft font-display font-bold text-primary-dark">
                  {q.initials}
                </div>
                <div>
                  <div className="font-display text-base font-bold text-foreground">{q.name}</div>
                  <div className="text-sm text-muted-foreground">{q.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}
