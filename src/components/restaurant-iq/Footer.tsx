import { Logo } from "./Logo";

const cols = [
  {
    title: "Product",
    links: ["Dashboard", "Leakage", "Menu Engineering", "AI Reports"],
  },
  {
    title: "Company",
    links: ["About", "Blog", "Careers", "Contact"],
  },
  {
    title: "Legal",
    links: ["Privacy", "Terms", "Security"],
  },
];

export function Footer() {
  return (
    <footer className="bg-section-footer text-white">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_a]:text-white">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-white/60">
              The AI operating system for modern restaurants. Real-time food cost intelligence,
              built on Tally, POS, and Claude AI.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-bold uppercase tracking-widest text-white/50">
                {c.title}
              </div>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a href="#" className="text-sm text-white/80 transition hover:text-primary">
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-white/10 pt-8 text-xs text-white/50 sm:flex-row">
          <div>© 2026 RestaurantIQ. All rights reserved.</div>
          <div>Built with Claude AI · Tally Integration Docs</div>
        </div>
      </div>
    </footer>
  );
}
