import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

export function CtaBottom() {
  return (
    <section
      id="cta"
      className="relative overflow-hidden py-24 text-white sm:py-32"
      style={{ background: "var(--gradient-brand)" }}
    >
      <div className="relative mx-auto max-w-4xl px-5 text-center lg:px-8">
        <h2 className="font-display text-4xl font-bold tracking-tight sm:text-6xl">
          Stop guessing. Start <span className="text-[#A3E635]">knowing.</span>
        </h2>
        <p className="mx-auto mt-5 max-w-2xl text-lg leading-relaxed text-white/80">
          Join restaurants already using RestaurantIQ to eliminate variance, reduce waste, and make
          data-driven decisions every day.
        </p>
        <div className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/login"
            className="group inline-flex items-center gap-2 rounded-lg bg-white px-6 py-3.5 text-sm font-semibold text-primary transition duration-200 hover:bg-white/90"
          >
            Get Early Access — It's Free
            <ArrowRight className="h-4 w-4 transition group-hover:translate-x-0.5" />
          </Link>
          <a
            href="#features"
            className="inline-flex items-center gap-2 rounded-lg border border-white/40 bg-white/10 px-6 py-3.5 text-sm font-semibold text-white backdrop-blur transition duration-200 hover:bg-white/15"
          >
            Explore Features
          </a>
        </div>
        <p className="mt-6 text-xs text-white/70">
          No credit card required · Tally &amp; POS integration included · Setup in under 3 hours
        </p>
      </div>
    </section>
  );
}
