import { Link } from "react-router-dom";

import { AppPage } from "@/components/ionic/AppPage";

/** Phone welcome screen (design screen 1) — the native app's first stop when signed out. */
export default function Welcome() {
  return (
    <AppPage title="Welcome — PlatePielet">
      <div className="flex min-h-full flex-col items-center justify-between bg-[image:var(--gradient-brand-soft)] bg-background px-6 pb-[calc(2rem+env(safe-area-inset-bottom))] pt-[calc(2.5rem+env(safe-area-inset-top))]">
        <div className="text-center">
          <div className="flex items-center justify-center gap-2">
            <img src="/favicon.png" alt="" className="h-9 w-9" />
            <span className="text-[28px] font-bold tracking-tight text-primary-dark">
              platepielet
            </span>
          </div>
          <p className="mt-1 text-[12px] font-medium text-primary">
            Smarter Restaurants. Happier Tomorrows.
          </p>
        </div>

        <div className="flex flex-col items-center text-center">
          <img
            src="/hero/hero-mascot.png"
            alt="Piel, your AI restaurant assistant"
            className="h-64 w-64 object-contain"
          />
          <h1 className="mt-4 text-[24px] font-bold leading-tight tracking-tight text-foreground">
            Your Restaurant
            <br />
            Intelligence Partner
          </h1>
          <p className="mt-2 max-w-[16rem] text-[14px] text-muted-foreground">
            Turn your restaurant data into better decisions.
          </p>
        </div>

        <div className="w-full max-w-sm space-y-3">
          <Link
            to="/signup"
            className="flex h-12 w-full items-center justify-center rounded-xl bg-primary text-[15px] font-semibold text-primary-foreground shadow-card"
          >
            Get Started
          </Link>
          <Link
            to="/login"
            className="flex h-12 w-full items-center justify-center rounded-xl border border-border bg-card text-[15px] font-semibold text-foreground"
          >
            Sign In
          </Link>
        </div>
      </div>
    </AppPage>
  );
}
