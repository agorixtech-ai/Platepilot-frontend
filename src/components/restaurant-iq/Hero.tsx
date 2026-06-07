import { ArrowRight, Play } from "lucide-react";
import { MockDashboard } from "./MockDashboard";

export function Hero() {
  return (
    <section className="relative overflow-hidden bg-section-hero pt-32 pb-20 lg:pt-40 lg:pb-28">
      {/* Radial gradient bg */}
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_80%_60%_at_50%_0%,oklch(0.85_0.12_175/0.25),transparent_70%)]" />
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_50%_40%_at_80%_20%,oklch(0.75_0.10_165/0.15),transparent_60%)]" />

      <div className="mx-auto max-w-7xl px-5 lg:px-8">
        <div className="grid items-center gap-14 lg:grid-cols-[1.05fr_1fr]">
          <div className="animate-fade-up">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-primary-soft/60 px-3.5 py-1.5 text-xs font-semibold text-primary-dark backdrop-blur">
              <span className="relative flex h-2 w-2">
                <span className="absolute inline-flex h-full w-full animate-pulse-dot rounded-full bg-primary" />
                <span className="relative inline-flex h-2 w-2 rounded-full bg-primary" />
              </span>
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                Now with AI-powered variance detection
              </span>
            </div>

            <h1 className="mt-6 font-display text-5xl font-bold leading-[1.05] tracking-tight text-foreground sm:text-6xl lg:text-7xl">
              <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
                The AI Brain for Your Restaurant
              </span>
            </h1>

            <p className="mt-3 text-sm text-white/60">
              Our software powers realtime AI‑driven analysis and decision
            </p>

            <p className="mt-6 max-w-xl text-lg leading-relaxed text-muted-foreground">
              Connect your Tally ERP and POS in minutes. Get real-time food cost analysis, leakage
              detection, and AI-generated daily reports — all without spreadsheets.
            </p>

            <div className="mt-8 flex flex-wrap items-center gap-3">
              <a
                href="/demo"
                className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_rgba(20,184,166,0.35)] transition hover:bg-primary-dark"
              >
                Schedule a Demo
                <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
              </a>
              <a
                href="#how"
                className="inline-flex items-center gap-2 rounded-full border border-border bg-background/60 px-6 py-3.5 text-sm font-semibold text-foreground backdrop-blur transition hover:bg-secondary"
              >
                <Play className="h-4 w-4 fill-current" />
                Watch Demo
              </a>
            </div>

            <div className="mt-8 flex items-center gap-6 text-xs text-muted-foreground">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                No credit card required
              </div>
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 rounded-full bg-primary" />
                3-hour setup
              </div>
            </div>
          </div>

          <div className="animate-fade-up [animation-delay:150ms]">
            <MockDashboard />
          </div>
        </div>
      </div>
    </section>
  );
}
