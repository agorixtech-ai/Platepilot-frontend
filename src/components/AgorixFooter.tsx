import { Link } from "react-router-dom";
import { useEffect, useRef, type ReactNode } from "react";
import { LOGO_SRC, LOGO_ALT } from "@/components/AppLogo";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Features", href: "#features" },
      { label: "How It Works", href: "#how-it-works" },
      { label: "Menu Engineering", href: "#menu-engineering" },
      { label: "Testimonials", href: "#testimonials" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "FAQ", href: "#faq" },
      { label: "Schedule a Demo", href: "/demo" },
      { label: "Contact Us", href: "#contact" },
    ],
  },
  {
    title: "Get Started",
    links: [
      { label: "Log In", href: "/login" },
      { label: "Sign Up", href: "/signup" },
    ],
  },
];

function FooterLinkItem({ href, children }: { href: string; children: ReactNode }) {
  if (href.startsWith("#")) {
    return (
      <a href={href} className="pp-footer-link">
        {children}
      </a>
    );
  }
  return (
    <Link to={href} className="pp-footer-link">
      {children}
    </Link>
  );
}

/**
 * "Curtain reveal" footer: the footer is `position: fixed` at the viewport
 * bottom for the entire page lifetime; the CTA band passed as `children`
 * (opaque, higher z-index, normal document flow) visually occludes it until
 * the band itself scrolls past. A spacer reserves the scroll distance that
 * takes — sized to the footer's real height via ResizeObserver.
 *
 * Note: this deliberately avoids `position: sticky` — inside this app's
 * Ionic shell (fixed body + contain:layout ancestors + a custom
 * .app-page-scroll container) sticky elements render permanently pinned
 * regardless of actual scroll offset. `position: fixed` doesn't hit that.
 */
export function AgorixFooter({ children }: { children: ReactNode }) {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const footer = footerRef.current;
    const spacer = spacerRef.current;
    if (!footer || !spacer) return;
    // The footer is fixed to the viewport, but the page content lives inside
    // .app-page-scroll — where a classic (Windows/Linux) scrollbar eats real
    // layout width. Without the inset the footer runs the full viewport width
    // and its right edge pokes out from under the opaque content column,
    // showing a dark sliver beside the scrollbar.
    const scroller = footer.closest<HTMLElement>(".app-page-scroll");
    const sync = () => {
      spacer.style.height = `${footer.offsetHeight}px`;
      if (scroller) footer.style.right = `${scroller.offsetWidth - scroller.clientWidth}px`;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(footer);
    if (scroller) observer.observe(scroller); // fires when the scrollbar appears/disappears
    return () => observer.disconnect();
  }, []);

  return (
    <>
      <div className="pp-footer-cover">{children}</div>
      <div ref={spacerRef} className="pp-footer-spacer" aria-hidden="true" />
      <footer ref={footerRef} className="pp-footer">
        <div className="pp-footer-inner">
          <div className="pp-footer-brand">
            <Link to="/" className="pp-footer-logo">
              <img src={LOGO_SRC} alt={LOGO_ALT} width={36} height={36} />
              <span>PlatePilot</span>
            </Link>
            <p className="pp-footer-tagline">
              Restaurant intelligence built from your Tally books, POS sales, and inventory — in one
              place.
            </p>
          </div>
          <div className="pp-footer-cols">
            {COLUMNS.map((col) => (
              <div key={col.title} className="pp-footer-col">
                <div className="pp-footer-col-title">{col.title}</div>
                {col.links.map((l) => (
                  <FooterLinkItem key={l.label} href={l.href}>
                    {l.label}
                  </FooterLinkItem>
                ))}
              </div>
            ))}
          </div>
        </div>
        <div className="pp-footer-bottom">© 2026 PlatePilot. All rights reserved.</div>
      </footer>
    </>
  );
}
