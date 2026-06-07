import { Link } from "@tanstack/react-router";
import { ArrowRight } from "lucide-react";

export function CtaBottom() {
  return (
    <section id="cta" className="relative overflow-hidden bg-section-cta py-24 text-white sm:py-32">
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_60%_50%_at_50%_0%,rgba(20,184,166,0.12),transparent_70%)]" />
      <div className="absolute inset-0 -z-0 bg-[radial-gradient(ellipse_40%_40%_at_80%_100%,rgba(20,184,166,0.06),transparent_70%)]" />

      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Stop guessing. Start{" "}
          <span className="bg-gradient-to-r from-teal-300 via-emerald-300 to-cyan-300 bg-clip-text text-transparent">
            knowing.
          </span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/70">
          Join restaurants already using RestaurantIQ to eliminate variance, reduce waste, and make
          data-driven decisions every day.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground shadow-[0_12px_30px_-10px_rgba(20,184,166,0.35)] transition hover:bg-primary-dark"
          >
            Get Early Access — It's Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-full border border-primary/40 bg-primary/5 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition hover:bg-primary/10"
          >
            Explore Features
          </a>
        </div>
        <p className="mt-6 text-xs text-white/50">
          No credit card required · Tally &amp; POS integration included · Setup in under 3 hours
        </p>
      </div>
    </section>
  );
}
