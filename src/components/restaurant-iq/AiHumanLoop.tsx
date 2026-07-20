import { Radio, Brain, Zap, UserCheck, Target, RefreshCw } from "lucide-react";

const steps = [
  {
    icon: Radio,
    title: "Ingest",
    desc: "Live streams, sensors, APIs, and unstructured feeds unified in realtime",
    label: "01",
  },
  {
    icon: Brain,
    title: "Analyze",
    desc: "Multi-model inference fuses data into a ranked, explainable intelligence layer",
    label: "02",
  },
  {
    icon: Zap,
    title: "Recommend",
    desc: "The AI surfaces prioritized actions with calibrated confidence and rationale",
    label: "03",
  },
  {
    icon: UserCheck,
    title: "Human Review",
    desc: "Operators inspect, approve, modify, or override every AI recommendation",
    label: "04",
    hero: true,
  },
  {
    icon: Target,
    title: "Act",
    desc: "Approved decisions execute instantly across connected systems and workflows",
    label: "05",
  },
  {
    icon: RefreshCw,
    title: "Learn",
    desc: "Every human correction feeds back, continuously improving model accuracy",
    label: "06",
  },
];

function LoopBackArrow() {
  return (
    <svg
      className="mx-auto mt-8 h-8 w-32 text-border"
      viewBox="0 0 128 32"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M2 30 C 30 30, 30 2, 64 2 C 98 2, 98 30, 126 30" />
      <path d="M118 22 L 126 30 L 118 38" />
    </svg>
  );
}

export function AiHumanLoop() {
  return (
    <section className="relative overflow-hidden bg-background py-24 sm:py-32">
      <div className="pointer-events-none absolute inset-0 -z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(22,163,74,0.06),transparent_70%)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-border bg-secondary/60 px-4 py-1.5 text-xs font-medium uppercase tracking-widest text-muted-foreground backdrop-blur">
            <span className="inline-flex h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />
            AI + Human Loop
          </div>
          <h2 className="mt-6 text-4xl font-bold tracking-tight text-foreground sm:text-5xl">
            AI+Human loop decision making
          </h2>
          <p className="mx-auto mt-4 max-w-xl leading-relaxed text-muted-foreground">
            The loop never closes without a human checkpoint. Every AI recommendation is
            inspectable, overrideable, and teaches the system to be better next time.
          </p>
        </div>

        <div className="relative mt-20">
          <div className="absolute left-8 right-8 top-10 hidden border-t border-dashed border-border lg:block" />

          <div className="relative grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {steps.map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.title} className="group relative">
                  <div
                    className={`relative flex flex-col items-center text-center rounded-2xl p-8 transition-all duration-500 ${
                      s.hero
                        ? "border-2 border-primary/30 bg-primary/[0.04] shadow-[0_0_60px_-20px_rgba(34,197,94,0.15)] hover:border-primary/50 hover:shadow-[0_0_80px_-20px_rgba(34,197,94,0.25)]"
                        : "border border-border bg-card hover:border-primary/20 hover:bg-secondary/40 hover:shadow-sm"
                    }`}
                  >
                    <div
                      className={`absolute left-4 top-4 text-[10px] font-mono font-semibold tracking-wider ${
                        s.hero ? "text-primary/60" : "text-muted-foreground/40"
                      }`}
                    >
                      {s.label}/{steps.length}
                    </div>

                    <div
                      className={`flex h-20 w-20 items-center justify-center rounded-full ring-1 backdrop-blur-sm transition-all duration-500 group-hover:scale-110 ${
                        s.hero
                          ? "bg-primary/10 ring-primary/30 shadow-[0_0_30px_-8px_rgba(34,197,94,0.2)]"
                          : "bg-secondary ring-border group-hover:bg-primary-soft group-hover:ring-primary/20"
                      }`}
                    >
                      <Icon
                        size={24}
                        className={
                          s.hero
                            ? "text-primary"
                            : "text-muted-foreground group-hover:text-foreground"
                        }
                      />
                    </div>

                    <h3
                      className={`mt-6 text-lg font-bold tracking-tight ${
                        s.hero ? "text-foreground" : "text-foreground/90"
                      }`}
                    >
                      {s.title}
                    </h3>
                    <p className="mt-2.5 max-w-sm text-sm leading-relaxed text-muted-foreground">
                      {s.desc}
                    </p>

                    {s.hero && (
                      <div className="mt-5 inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-[10px] font-semibold uppercase tracking-widest text-primary">
                        <span className="inline-flex h-1.5 w-1.5 animate-ping rounded-full bg-primary" />
                        Human in the loop
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        <div className="mt-10 flex justify-center">
          <LoopBackArrow />
        </div>

        <div className="mt-6 flex justify-center">
          <div className="inline-flex items-center gap-3 rounded-full border border-border bg-card px-5 py-2.5 text-sm text-muted-foreground backdrop-blur">
            <svg
              className="h-4 w-4 animate-[spin_8s_linear_infinite] text-primary/60"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <path d="M21 12a9 9 0 11-6.219-8.56" />
            </svg>
            Every loop closes with a human signature
          </div>
        </div>
      </div>
    </section>
  );
}
