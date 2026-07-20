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
    <footer className="border-t border-border bg-background text-foreground">
      <div className="mx-auto max-w-7xl px-5 py-16 lg:px-8">
        <div className="grid gap-10 lg:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div>
            <div className="[&_a]:text-foreground">
              <Logo />
            </div>
            <p className="mt-4 max-w-xs text-sm leading-relaxed text-muted-foreground">
              The AI operating system for modern restaurants. Real-time food cost intelligence,
              built on Tally, POS, and Claude AI.
            </p>
          </div>
          {cols.map((c) => (
            <div key={c.title}>
              <div className="text-xs font-bold uppercase tracking-widest text-muted-foreground">
                {c.title}
              </div>
              <ul className="mt-4 space-y-3">
                {c.links.map((l) => (
                  <li key={l}>
                    <a
                      href="#"
                      className="text-sm text-foreground/80 transition hover:text-primary"
                    >
                      {l}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="mt-14 flex flex-col items-center justify-between gap-4 border-t border-border pt-8 text-xs text-muted-foreground sm:flex-row">
          <div>© 2026 RestaurantIQ. All rights reserved.</div>
          <div>Built with Claude AI · Tally Integration Docs</div>
        </div>
      </div>
    </footer>
  );
}
