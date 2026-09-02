import { useMemo, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import {
  LayoutDashboard,
  MoreHorizontal,
  ShoppingCart,
  Sparkles,
  User,
  X,
  type LucideIcon,
} from "lucide-react";
import { cn } from "@/lib/utils";
import {
  ADMIN_ITEMS,
  AI_ITEMS,
  MAIN_ITEMS,
  OPS_ITEMS,
  pageKeyOf,
  type NavItem,
} from "@/components/dashboard/navItems";
import { canOpenPage, getStoredUser } from "@/lib/auth";

type Tab = {
  key: string;
  label: string;
  to?: string;
  icon: LucideIcon;
  match: (pathname: string) => boolean;
  action?: "more";
};

const PRIMARY_TABS: Tab[] = [
  {
    key: "home",
    label: "Home",
    to: "/dashboard",
    icon: LayoutDashboard,
    match: (p) => p === "/dashboard",
  },
  {
    key: "sales",
    label: "Sales",
    to: "/dashboard/pos",
    icon: ShoppingCart,
    match: (p) => p === "/dashboard/pos" || p.startsWith("/dashboard/pos/"),
  },
  {
    key: "more",
    label: "More",
    icon: MoreHorizontal,
    action: "more",
    match: (p) => {
      if (
        p === "/dashboard" ||
        p === "/dashboard/pos" ||
        p === "/dashboard/ai" ||
        p === "/dashboard/profile" ||
        p.startsWith("/dashboard/pos/") ||
        p.startsWith("/dashboard/ai/")
      ) {
        return false;
      }
      return p.startsWith("/dashboard");
    },
  },
  {
    key: "pilot",
    label: "Pilot",
    to: "/dashboard/ai",
    icon: Sparkles,
    match: (p) => p === "/dashboard/ai" || p.startsWith("/dashboard/ai/"),
  },
  {
    key: "me",
    label: "Me",
    to: "/dashboard/profile",
    icon: User,
    match: (p) => p === "/dashboard/profile",
  },
];

function allowed(items: NavItem[]): NavItem[] {
  const user = getStoredUser();
  return items.filter((item) => {
    if (item.to === "/dashboard/profile") return true;
    return canOpenPage(pageKeyOf(item.to), user);
  });
}

export function MobileTabBar() {
  const { pathname } = useLocation();
  const [moreOpen, setMoreOpen] = useState(false);

  const moreSections = useMemo(
    () =>
      [
        { label: "Main", items: allowed(MAIN_ITEMS.filter((i) => i.to !== "/dashboard" && i.to !== "/dashboard/pos")) },
        { label: "Operations", items: allowed(OPS_ITEMS) },
        {
          label: "Intelligence",
          items: allowed(AI_ITEMS.filter((i) => i.to !== "/dashboard/ai")),
        },
        { label: "Account", items: allowed(ADMIN_ITEMS.filter((i) => i.to !== "/dashboard/profile")) },
      ].filter((s) => s.items.length > 0),
    // eslint-disable-next-line react-hooks/exhaustive-deps -- role changes via storage refresh
    [pathname],
  );

  return (
    <>
      {moreOpen && (
        <div className="mobile-more" role="dialog" aria-modal="true" aria-label="More pages">
          <button
            type="button"
            className="mobile-more-backdrop"
            aria-label="Close"
            onClick={() => setMoreOpen(false)}
          />
          <div className="mobile-more-sheet">
            <div className="mobile-more-handle" aria-hidden />
            <div className="mobile-more-head">
              <div>
                <p className="mobile-more-kicker">PlatePielet</p>
                <h2 className="mobile-more-title">Restaurant OS</h2>
              </div>
              <button
                type="button"
                className="mobile-more-close"
                onClick={() => setMoreOpen(false)}
                aria-label="Close menu"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
            <div className="mobile-more-body">
              {moreSections.map((section) => (
                <div key={section.label} className="mobile-more-section">
                  <p className="mobile-more-label">{section.label}</p>
                  <ul className="mobile-more-grid">
                    {section.items.map((item) => {
                      const Icon = item.icon;
                      const active =
                        pathname === item.to ||
                        (item.to !== "/dashboard" && pathname.startsWith(`${item.to}/`));
                      return (
                        <li key={item.to}>
                          <Link
                            to={item.to}
                            className={cn("mobile-more-item", active && "is-active")}
                            onClick={() => setMoreOpen(false)}
                          >
                            <span className="mobile-more-icon">
                              <Icon className="h-4 w-4" />
                            </span>
                            <span className="mobile-more-item-label">{item.label}</span>
                            {item.badge && <span className="mobile-more-badge">{item.badge}</span>}
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      <nav className="mobile-tabbar" aria-label="Primary">
        {PRIMARY_TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab.match(pathname) || (tab.action === "more" && moreOpen);
          const gated =
            tab.to &&
            tab.to !== "/dashboard/profile" &&
            !canOpenPage(pageKeyOf(tab.to), getStoredUser());

          if (gated) return null;

          if (tab.action === "more") {
            return (
              <button
                key={tab.key}
                type="button"
                className={cn("mobile-tab", active && "is-active")}
                onClick={() => setMoreOpen((o) => !o)}
                aria-expanded={moreOpen}
              >
                <Icon className="mobile-tab-icon" strokeWidth={active ? 2.4 : 2} />
                <span>{tab.label}</span>
              </button>
            );
          }

          return (
            <Link
              key={tab.key}
              to={tab.to!}
              className={cn("mobile-tab", active && "is-active")}
              onClick={() => setMoreOpen(false)}
            >
              <Icon className="mobile-tab-icon" strokeWidth={active ? 2.4 : 2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
