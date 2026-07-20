const steps = [
  {
    n: "1",
    title: "Install the local agent",
    desc: "Run a one-line Python script on the PC where your Tally ERP lives. It securely streams stock movements to RestaurantIQ.",
  },
  {
    n: "2",
    title: "Connect your POS",
    desc: "Paste a webhook URL into Petpooja, Toast, or your POS of choice. Sales sync in real time — no exports.",
  },
  {
    n: "3",
    title: "Get AI-powered clarity",
    desc: "Your dashboard populates within hours. Daily WhatsApp briefings and live alerts begin immediately.",
  },
];

export function HowItWorks() {
  return (
    <section id="how" className="bg-section-how py-24 sm:py-32">
      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-2xl text-center">
          <div className="inline-flex items-center gap-3 text-xs font-bold uppercase tracking-widest text-primary-dark">
            <span className="h-px w-8 bg-primary" />
            How It Works
            <span className="h-px w-8 bg-primary" />
          </div>
          <h2 className="mt-5 font-display text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            From installation to insights in 3 steps
          </h2>
        </div>

        <div className="relative mt-16">
          <div className="absolute left-0 right-0 top-10 hidden border-t-2 border-dashed border-primary/30 lg:block" />
          <div className="relative grid gap-10 lg:grid-cols-3 lg:gap-8">
            {steps.map((s) => (
              <div key={s.n} className="relative flex flex-col items-center text-center">
                <div className="grid h-20 w-20 place-items-center rounded-full bg-primary font-display text-2xl font-bold text-primary-foreground shadow-[0_15px_40px_-12px_rgba(7,59,42,0.35)] ring-8 ring-secondary/60">
                  {s.n}
                </div>
                <h3 className="mt-6 font-display text-xl font-bold text-foreground">{s.title}</h3>
                <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
