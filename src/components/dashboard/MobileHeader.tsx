import { Link, useHistory, useLocation } from "react-router-dom";
import { Bell, ChefHat, Check, ChevronDown, ChevronLeft } from "lucide-react";

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useAlerts } from "@/components/dashboard/useAlerts";
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

/** Bell with a red dot when there is anything open — only Home pays for the alert queries. */
function AlertBell() {
  const { alerts } = useAlerts();
  return (
    <Link
      to="/dashboard/alerts"
      aria-label="Alerts"
      className="relative flex h-9 w-9 items-center justify-center rounded-full text-foreground"
    >
      <Bell className="h-5 w-5" />
      {alerts.length > 0 && (
        <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-destructive" />
      )}
    </Link>
  );
}

export function MobileHeader({ firstName, initials }: { firstName: string; initials: string }) {
  const { pathname } = useLocation();
  const history = useHistory();
  const isRoot = TAB_ROOTS.includes(pathname);
  const scoped = BRANCH_SCOPED.has(pathname);

  const shell =
    "sticky top-0 z-[var(--z-sticky)] shrink-0 border-b border-border/60 bg-card pt-[env(safe-area-inset-top)]";

  // Tab roots (Home/Insights/Alerts/More): wordmark + tagline, bell + avatar on the
  // right — page titles, subtitles, and branch pickers live in the body.
  if (isRoot) {
    return (
      <header className={shell}>
        <div className="flex items-center gap-3 px-4 py-3">
          <div className="flex min-w-0 flex-1 items-center gap-2.5">
            <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-primary text-primary-foreground">
              <ChefHat className="h-5 w-5" />
            </span>
            <div className="min-w-0">
              <p className="truncate text-[16px] font-extrabold leading-tight tracking-tight">
                <span className="text-foreground">Plate</span>
                <span className="text-primary">Pilot</span>
              </p>
              <p className="truncate text-[10px] font-medium text-muted-foreground">
                Smarter Kitchen. Better Profits.
              </p>
            </div>
          </div>
          <AlertBell />
          <Link to="/dashboard/profile" aria-label="Profile" className="flex items-center gap-0.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-[12px] font-bold text-primary-foreground">
              {initials}
            </span>
            <ChevronDown className="h-4 w-4 text-muted-foreground" />
          </Link>
        </div>
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
    </header>
  );
}
