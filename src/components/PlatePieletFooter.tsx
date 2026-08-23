import { Link } from "react-router-dom";
import { useEffect, useRef, type ReactNode } from "react";
import { LOGO_SRC, LOGO_ALT } from "@/components/AppLogo";

type FooterLink = { label: string; href: string };
type FooterColumn = { title: string; links: FooterLink[] };

const COLUMNS: FooterColumn[] = [
  {
    title: "Product",
    links: [
      { label: "Overview", href: "/product" },
      { label: "PlatePielet AI", href: "/product/ai" },
      { label: "Menu Performance", href: "/product/menu-performance" },
      { label: "Pricing", href: "/pricing" },
    ],
  },
  {
    title: "Solutions",
    links: [
      { label: "Multi-Branch", href: "/solutions/multi-branch" },
      { label: "Independent", href: "/solutions/independent" },
      { label: "Cloud Kitchens", href: "/solutions/cloud-kitchens" },
      { label: "Restaurant Groups", href: "/solutions/restaurant-groups" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "/company" },
      { label: "Integrations", href: "/integrations" },
      { label: "Resources", href: "/resources" },
      { label: "Book a Demo", href: "/demo" },
      { label: "Log In", href: "/login" },
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

type PlatePieletFooterProps = {
  children?: ReactNode;
  /**
   * `reveal` — fixed curtain footer for the long landing page.
   * `static` — normal document-flow footer for short marketing pages
   * (avoids the fixed bar overlapping hero content).
   */
  mode?: "reveal" | "static";
};

/**
 * Footer styles live here (not only on Index) so marketing routes still
 * look correct when Index is unmounted / not yet visited.
 */
export function PlatePieletFooter({ children, mode = "reveal" }: PlatePieletFooterProps) {
  const footerRef = useRef<HTMLElement>(null);
  const spacerRef = useRef<HTMLDivElement>(null);
  const reveal = mode === "reveal";

  useEffect(() => {
    if (!reveal) return;
    const footer = footerRef.current;
    const spacer = spacerRef.current;
    if (!footer || !spacer) return;
    const scroller = footer.closest<HTMLElement>(".app-page-scroll");
    const sync = () => {
      spacer.style.height = `${footer.offsetHeight}px`;
      if (scroller) footer.style.right = `${scroller.offsetWidth - scroller.clientWidth}px`;
    };
    sync();
    const observer = new ResizeObserver(sync);
    observer.observe(footer);
    if (scroller) observer.observe(scroller);
    return () => observer.disconnect();
  }, [reveal]);

  /* Ionic keeps previous pages mounted. A position:fixed reveal footer would
     otherwise stay pinned over Product/Solutions/etc. Hide it whenever its
     owning IonPage is not the active view. */
  useEffect(() => {
    if (!reveal) return;
    const footer = footerRef.current;
    if (!footer) return;
    const page = footer.closest(".ion-page, .app-ion-page");
    if (!page) return;
    const apply = () => {
      const hidden = page.classList.contains("ion-page-hidden");
      footer.style.visibility = hidden ? "hidden" : "";
      footer.style.pointerEvents = hidden ? "none" : "";
    };
    apply();
    const mo = new MutationObserver(apply);
    mo.observe(page, { attributes: true, attributeFilter: ["class"] });
    return () => mo.disconnect();
  }, [reveal]);

  return (
    <>
      <style>{`
        .pp-footer-cover {
          position: relative;
          z-index: 1;
          background: #FFFFFF;
        }
        .pp-footer-spacer {
          pointer-events: none;
        }
        .pp-footer {
          background:
            radial-gradient(700px 360px at 80% 0%, rgba(34,197,94,0.16), transparent 60%),
            #0A1A10;
          border-radius: 28px 28px 0 0;
          overflow: hidden;
        }
        .pp-footer--reveal {
          position: fixed;
          bottom: 0;
          left: 0;
          right: 0;
          z-index: 0;
        }
        /* Belt-and-suspenders: Ionic keeps prior pages mounted; a fixed
           reveal footer must not paint over the active marketing route. */
        .ion-page-hidden .pp-footer--reveal,
        .ion-page[aria-hidden="true"] .pp-footer--reveal {
          visibility: hidden !important;
          pointer-events: none !important;
        }
        .pp-footer--static {
          position: relative;
          z-index: 1;
          margin-top: 2rem;
        }
        .pp-footer-inner {
          max-width: 1280px;
          margin: 0 auto;
          padding: 4rem 2.5rem 2.5rem;
          display: flex;
          justify-content: space-between;
          gap: 3rem;
          flex-wrap: wrap;
        }
        .pp-footer-brand { max-width: 300px; }
        .pp-footer-logo {
          display: inline-flex;
          align-items: center;
          gap: 10px;
          font-size: 1.1rem;
          font-weight: 700;
          letter-spacing: 0.02em;
          color: #FFFFFF;
          text-decoration: none;
        }
        .pp-footer-logo img { border-radius: 10px; object-fit: cover; }
        .pp-footer-tagline {
          margin-top: 1rem;
          font-size: 0.85rem;
          line-height: 1.7;
          color: rgba(246,250,247,0.55);
        }
        .pp-footer-cols {
          display: flex;
          gap: 3.5rem;
          flex-wrap: wrap;
        }
        .pp-footer-col { display: flex; flex-direction: column; gap: 0.85rem; min-width: 130px; }
        .pp-footer-col-title {
          font-size: 0.65rem;
          font-weight: 700;
          letter-spacing: 0.16em;
          text-transform: uppercase;
          color: rgba(246,250,247,0.4);
          margin-bottom: 0.35rem;
        }
        .pp-footer-link {
          font-size: 0.85rem;
          color: rgba(246,250,247,0.72);
          transition: color 0.2s;
          width: fit-content;
          text-decoration: none;
        }
        .pp-footer-link:hover { color: #4ADE80; }
        .pp-footer-bottom {
          max-width: 1280px;
          margin: 0 auto;
          padding: 1.5rem 2.5rem 2rem;
          border-top: 1px solid rgba(246,250,247,0.1);
          font-size: 0.68rem;
          font-weight: 600;
          letter-spacing: 0.1em;
          color: rgba(246,250,247,0.4);
        }
        @media (max-width: 640px) {
          .pp-footer-inner { padding: 3rem 1.25rem 2rem; gap: 2.5rem; }
          .pp-footer-bottom { padding: 1.25rem 1.25rem 1.5rem; }
          .pp-footer-cols { gap: 2rem 2.5rem; }
        }
      `}</style>

      {children != null ? <div className="pp-footer-cover">{children}</div> : null}
      {reveal ? <div ref={spacerRef} className="pp-footer-spacer" aria-hidden="true" /> : null}
      <footer ref={footerRef} className={`pp-footer pp-footer--${reveal ? "reveal" : "static"}`}>
        <div className="pp-footer-inner">
          <div className="pp-footer-brand">
            <Link to="/" className="pp-footer-logo">
              <img src={LOGO_SRC} alt={LOGO_ALT} width={36} height={36} />
              <span>PlatePielet</span>
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
        <div className="pp-footer-bottom">© 2026 PlatePielet. All rights reserved.</div>
      </footer>
    </>
  );
}
