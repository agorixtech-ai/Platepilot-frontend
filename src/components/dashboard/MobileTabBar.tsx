import { Link, useLocation } from "react-router-dom";
import { Bell, ChartColumn, House, Menu, Sparkles, type LucideIcon } from "lucide-react";
import { cn } from "@/lib/utils";

type Tab = { label: string; to: string; icon: LucideIcon; paths: string[] };

/* Phone IA (per the mobile design): Home · Insights · Alerts · More.
   PlatePielet AI is the green floating button. Each tab owns the routes that
   open from it, so it stays lit on drill-down screens (Insights → Food Cost …). */
const TABS: Tab[] = [
  { label: "Home", to: "/dashboard", icon: House, paths: ["/dashboard"] },
  {
    label: "Insights",
    to: "/dashboard/insights",
    icon: ChartColumn,
    paths: [
      "/dashboard/insights",
      "/dashboard/pos",
      "/dashboard/food-cost",
      "/dashboard/inventory",
      "/dashboard/menu",
      "/dashboard/menu-engineering",
      "/dashboard/waste",
      "/dashboard/branches",
      "/dashboard/purchasing",
    ],
  },
  { label: "Alerts", to: "/dashboard/alerts", icon: Bell, paths: ["/dashboard/alerts"] },
  { label: "More", to: "/dashboard/more", icon: Menu, paths: [] }, // everything else
];

export function MobileTabBar() {
  const { pathname } = useLocation();
  const owner = TABS.find((t) => t.paths.includes(pathname)) ?? TABS[TABS.length - 1];

  return (
    <>
      {/* Chat has its own full-screen layout (and the AI entry point is this button). */}
      <Link to="/dashboard/ai" aria-label="Ask PlatePielet AI" className="mobile-ai-fab">
        <Sparkles className="h-5 w-5" />
      </Link>

      <nav className="mobile-tabbar" aria-label="Primary">
        {TABS.map((tab) => {
          const Icon = tab.icon;
          const active = tab === owner;
          return (
            <Link
              key={tab.to}
              to={tab.to}
              className={cn("mobile-tab", active && "is-active")}
              aria-current={active ? "page" : undefined}
            >
              <Icon className="mobile-tab-icon" strokeWidth={active ? 2.5 : 2} />
              <span>{tab.label}</span>
            </Link>
          );
        })}
      </nav>
    </>
  );
}
