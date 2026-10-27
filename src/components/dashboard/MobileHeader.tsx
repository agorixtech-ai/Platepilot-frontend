import { useEffect } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { Bell, Check, ChevronDown, ChevronLeft } from "lucide-react";
import MapPinIcon from "@/components/ui/icons/map-pin-icon";

import { LOGO_ALT, LOGO_SRC } from "@/components/AppLogo";
import { setStatusBarTone } from "@/lib/nativeShell";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { StaleBanner } from "@/components/dashboard/MobileUI";
import { useAlerts } from "@/components/dashboard/useAlerts";
import { canOpenPage } from "@/lib/auth";
import { dashboardService } from "@/services/dashboardService";
import { cn } from "@/lib/utils";

/** Title shown centred on drill-down screens. */
const TITLES: Record<string, string> = {
  "/dashboard/pos": "Sales Insights",
  "/dashboard/inventory": "Inventory",
  "/dashboard/food-cost": "Food Cost",
  "/dashboard/purchasing": "Purchase Suggestions",
  "/dashboard/menu-engineering": "Menu Performance",
  "/dashboard/waste": "Waste Intelligence",
  "/dashboard/branches": "Branches",
  "/dashboard/reports": "Reports",
  "/dashboard/settings": "Settings",
  "/dashboard/profile": "Profile",
  "/dashboard/team": "Team",
  "/dashboard/tally": "Tally / Accounting",
  "/dashboard/suppliers": "Suppliers",
  "/dashboard/market-prices": "Market Prices",
  "/dashboard/reviews": "Reviews",
  "/dashboard/menu": "Menu",
};

/** Drill-down screens whose data is scoped by branch get the "All Branches ▾" picker
    under the back-arrow title. Tab roots (Home/Insights/Alerts/More) put their own
    branch picker in the page body instead — see BranchPicker usage there. */
const BRANCH_SCOPED = new Set([
  "/dashboard/pos",
  "/dashboard/inventory",
  "/dashboard/food-cost",
  "/dashboard/purchasing",
  "/dashboard/menu-engineering",
  "/dashboard/waste",
  "/dashboard/tally",
  "/dashboard/reports",
]);

/** Screens fed by the daily POS/Tally sync. Market prices (government data), reviews
    (Google) and the account/settings screens are not, so a "data is old" warning there
    would be wrong. */
const SYNC_BACKED = new Set([
  "/dashboard",
  "/dashboard/insights",
  "/dashboard/alerts",
  "/dashboard/pos",
  "/dashboard/inventory",
  "/dashboard/food-cost",
  "/dashboard/purchasing",
  "/dashboard/waste",
  "/dashboard/menu",
  "/dashboard/menu-engineering",
  "/dashboard/branches",
  "/dashboard/tally",
  "/dashboard/reports",
]);

const TAB_ROOTS = ["/dashboard", "/dashboard/insights", "/dashboard/alerts", "/dashboard/more"];

export function BranchPicker({ className }: { className?: string }) {
  const { branch, setBranch, branches } = useBranchFilter();
  return (
    <DropdownMenu>
      <DropdownMenuTrigger
        className={cn(
          "inline-flex items-center gap-0.5 text-[12px] text-muted-foreground outline-none",
          className,
        )}
      >
        {branch === "all" ? "All Branches" : branch}
        <ChevronDown className="h-3 w-3" />
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="min-w-44">
        {["all", ...branches].map((b) => (
          <DropdownMenuItem key={b} onSelect={() => setBranch(b)} className="justify-between">
            {b === "all" ? "All Branches" : b}
            {branch === b && <Check className="h-4 w-4 text-primary" />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

/** Bordered "📍 All Branches ▾" pill for page bodies (tab roots have no back-arrow header). */
export function BranchPill({ className }: { className?: string }) {
  return (
    <div
      className={cn(
        "flex shrink-0 items-center gap-1 rounded-full border border-border/70 bg-card px-3 py-2",
        className,
      )}
    >
      <MapPinIcon className="h-3.5 w-3.5 text-muted-foreground" />
      <BranchPicker className="text-foreground" />
    </div>
  );
}

/** Bell with a red dot when any alert is still open (unacknowledged). */
function AlertBell({ className }: { className?: string }) {
  const { openAlerts } = useAlerts();
  return (
    <Link
      to="/dashboard/alerts"
      aria-label="Alerts"
      className={cn(
        "relative flex h-9 w-9 items-center justify-center rounded-full text-foreground",
        className,
      )}
    >
      <Bell className="h-5 w-5" />
      {openAlerts.length > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
      )}
    </Link>
  );
}

/** Warns on every phone screen when the synced data is older than a day. Same query
    key as Home/Sales/Food Cost, so it costs no extra request. */
function DataFreshness() {
  const { pathname } = useLocation();
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);
  const relevant = SYNC_BACKED.has(pathname);
  const { data } = useQuery({
    queryKey: ["dashboard", "metrics", period, branch],
    queryFn: () => dashboardService.getMetrics(period, branch),
    enabled: relevant && (canOpenPage("overview") || canOpenPage("pos")),
    ...DASHBOARD_LIVE_QUERY,
  });
  return relevant ? <StaleBanner lastSync={data?.last_sync} status={data?.sync_status} /> : null;
}

export function MobileHeader({ firstName, initials }: { firstName: string; initials: string }) {
  const { pathname } = useLocation();
  const history = useHistory();
  const isRoot = TAB_ROOTS.includes(pathname);
  const scoped = BRANCH_SCOPED.has(pathname);

  // Native app: keep the OS status bar the same colour as the header underneath it.
  useEffect(() => {
    void setStatusBarTone(isRoot ? "forest" : "white");
    return () => void setStatusBarTone("white");
  }, [isRoot]);

  const shell =
    "sticky top-0 z-[var(--z-sticky)] shrink-0 border-b border-border/60 bg-card pt-[env(safe-area-inset-top)]";

  // Tab roots (Home/Insights/Alerts/More): wordmark + tagline, bell + avatar on the
  // right — page titles, subtitles, and branch pickers live in the body.
  if (isRoot) {
    // The web dashboard's logo (/logo.png) is a white wordmark made for the dark brand
    // bar (its sidebar), so the phone's brand header uses the same forest background.
    return (
      <header className={cn(shell, "border-white/10 bg-brand-forest")}>
        <div className="flex items-center gap-3 px-4 py-2">
          <Link
            to="/dashboard"
            aria-label={LOGO_ALT}
            className="flex min-w-0 flex-1 items-center gap-3"
          >
            <img
              src={LOGO_SRC}
              alt={LOGO_ALT}
              width={539}
              height={337}
              className="h-10 w-auto shrink-0 object-contain mix-blend-lighten"
            />
            <p className="truncate text-[10px] font-medium text-white/60">
              Smarter Kitchen. Better Profits.
            </p>
          </Link>
          <AlertBell className="text-white" />
          <Link to="/dashboard/profile" aria-label="Profile" className="flex items-center gap-0.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
              {initials}
            </span>
            <ChevronDown className="h-4 w-4 text-white/60" />
          </Link>
        </div>
        <DataFreshness />
      </header>
    );
  }

  const title = TITLES[pathname] ?? "PlatePielet";

  // Drill-down screens: back arrow + centred title, branch picker underneath.
  return (
    <header className={shell}>
      <div className="grid grid-cols-[2.25rem_1fr_2.25rem] items-center gap-2 px-3 py-2.5">
        <button
          type="button"
          onClick={() => history.goBack()}
          aria-label="Back"
          className="flex h-9 w-9 items-center justify-center rounded-full text-foreground active:bg-muted"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
        <div className="min-w-0 text-center">
          <h1 className="truncate text-[16px] font-bold leading-tight text-foreground">{title}</h1>
          {scoped && <BranchPicker />}
        </div>
        <span />
      </div>
      <DataFreshness />
    </header>
  );
}
