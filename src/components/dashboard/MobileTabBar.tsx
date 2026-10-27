import { useEffect, useRef, type ComponentType, type Ref } from "react";
import { Link, useLocation } from "react-router-dom";
import ChartBarIcon from "@/components/ui/icons/chart-bar-icon";
import FilledBellIcon from "@/components/ui/icons/filled-bell-icon";
import HomeIcon from "@/components/ui/icons/home-icon";
import BrandOpenaiIcon from "@/components/ui/icons/brand-openai-icon";
import UnorderedListIcon from "@/components/ui/icons/unordered-list-icon";
import type { AnimatedIconHandle } from "@/components/ui/icons/types";
import { cn } from "@/lib/utils";

/* Animated icons expose startAnimation(). There is
   no hover on a phone, so we fire it on tap and when the tab becomes active. */
type TabIcon = ComponentType<{ ref?: Ref<AnimatedIconHandle>; className?: string; strokeWidth?: number }>;
type Tab = { label: string; to: string; icon: TabIcon; paths: string[] };

/* Phone IA (per the mobile design): Home · Insights · Alerts · More.
   PlatePielet AI is the green floating button. Each tab owns the routes that
   open from it, so it stays lit on drill-down screens (Insights → Food Cost …). */
const TABS: Tab[] = [
  { label: "Home", to: "/dashboard", icon: HomeIcon, paths: ["/dashboard"] },
  {
    label: "Insights",
    to: "/dashboard/insights",
    icon: ChartBarIcon,
    paths: [
      "/dashboard/insights",
      "/dashboard/pos",
      "/dashboard/food-cost",
      "/dashboard/inventory",
      "/dashboard/menu-engineering",
      "/dashboard/waste",
      "/dashboard/branches",
      "/dashboard/purchasing",
    ],
  },
  { label: "Alerts", to: "/dashboard/alerts", icon: FilledBellIcon, paths: ["/dashboard/alerts"] },
  { label: "More", to: "/dashboard/more", icon: UnorderedListIcon, paths: [] }, // everything else
];

function TabLink({ tab, active }: { tab: Tab; active: boolean }) {
  const Icon = tab.icon;
  const ref = useRef<AnimatedIconHandle>(null);
  useEffect(() => {
    if (active) ref.current?.startAnimation?.();
  }, [active]);
  return (
    <Link
      to={tab.to}
      className={cn("mobile-tab", active && "is-active")}
      aria-current={active ? "page" : undefined}
      aria-label={tab.label}
      onPointerDown={() => ref.current?.startAnimation?.()}
    >
      <Icon ref={ref} className="mobile-tab-icon" strokeWidth={active ? 2.5 : 2} />
    </Link>
  );
}

export function MobileTabBar() {
  const { pathname } = useLocation();
  const aiRef = useRef<AnimatedIconHandle>(null);
  const owner = TABS.find((t) => t.paths.includes(pathname)) ?? TABS[TABS.length - 1];

  return (
    <div className="mobile-dock">
      <nav className="mobile-tabbar" aria-label="Primary">
        {TABS.map((tab) => (
          <TabLink key={tab.to} tab={tab} active={tab === owner} />
        ))}
      </nav>

      {/* Chat has its own full-screen layout (and the AI entry point is this button). */}
      <Link
        to="/dashboard/ai"
        aria-label="Ask PlatePielet AI"
        className="mobile-ai-fab"
        onPointerDown={() => aiRef.current?.startAnimation()}
      >
        <BrandOpenaiIcon ref={aiRef} size={24} />
      </Link>
    </div>
  );
}
