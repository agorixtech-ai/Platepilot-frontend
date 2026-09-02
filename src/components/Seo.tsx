import { useEffect } from "react";
import { useLocation } from "react-router-dom";

const SITE = "https://platepilotsystems.com";

/**
 * Per-route head tags for the SPA.
 *
 * `index.html` ships one hardcoded canonical pointing at `/`, which told Google
 * every marketing route was a duplicate of the homepage. This rewrites it on
 * navigation. Canonical is derived from the router, so mounting <Seo /> with no
 * props at all still fixes the de-indexing.
 *
 * Deliberately does NOT set `document.title` — `usePageTitle` in AppPage.tsx
 * already owns it and re-applies on every Ionic view activation, which a plain
 * effect here cannot. Two writers would race, and the parent (AppPage) wins
 * anyway because child effects run first. Pass the *same* string to both
 * `<AppPage title>` and `<Seo title>`; this one only feeds og/twitter.
 *
 * ponytail: client-side only. Googlebot runs JS and picks this up; Bing,
 * LinkedIn and LLM crawlers do not. Prerender or move to SSR when non-Google
 * traffic starts mattering.
 */
export function Seo({ title, description }: { title?: string; description?: string } = {}) {
  const { pathname } = useLocation();

  useEffect(() => {
    // Trailing slash on anything but root splits the canonical from the real URL.
    const path = pathname !== "/" && pathname.endsWith("/") ? pathname.slice(0, -1) : pathname;
    const url = SITE + path;

    const set = (selector: string, attr: string, value: string) => {
      document.head.querySelector(selector)?.setAttribute(attr, value);
    };

    set('link[rel="canonical"]', "href", url);
    set('meta[property="og:url"]', "content", url);

    if (title) {
      set('meta[property="og:title"]', "content", title);
      set('meta[name="twitter:title"]', "content", title);
    }
    if (description) {
      set('meta[name="description"]', "content", description);
      set('meta[property="og:description"]', "content", description);
      set('meta[name="twitter:description"]', "content", description);
    }
  }, [pathname, title, description]);

  return null;
}
