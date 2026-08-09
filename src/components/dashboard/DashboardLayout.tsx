import { useEffect, useRef, useState, type ReactNode } from "react";
import { Link, useHistory, useLocation } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { LogOut } from "lucide-react";
import LayoutDashboardIcon from "@/components/ui/icons/layout-dashboard-icon";
import ShoppingCartIcon from "@/components/ui/icons/shopping-cart-icon";
import FileDescriptionIcon from "@/components/ui/icons/file-description-icon";
import StackIcon from "@/components/ui/icons/stack-icon";
import BookIcon from "@/components/ui/icons/book-icon";
import SoupIcon from "@/components/ui/icons/soup-icon";
import TruckElectricIcon from "@/components/ui/icons/truck-electric-icon";
import CurrencyDollarIcon from "@/components/ui/icons/currency-dollar-icon";
import MapPinIcon from "@/components/ui/icons/map-pin-icon";
import StarIcon from "@/components/ui/icons/star-icon";
import BrandOpenaiIcon from "@/components/ui/icons/brand-openai-icon";
import ChartBarIcon from "@/components/ui/icons/chart-bar-icon";
import UserIcon from "@/components/ui/icons/user-icon";
import GearIcon from "@/components/ui/icons/gear-icon";
import type { AnimatedIconHandle } from "@/components/ui/icons/types";
import { AppLogo } from "@/components/AppLogo";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  getStoredUser,
  clearTokens,
  logout as apiLogout,
  getMe,
  updateStoredUser,
} from "@/lib/auth";
import { BranchFilterProvider } from "@/contexts/BranchFilterContext";
import { DateRangeProvider } from "@/contexts/DateRangeContext";
import { LocationSwitcher } from "@/components/dashboard/LocationSwitcher";
import { DateRangePicker } from "@/components/dashboard/DateRangePicker";
import { FloatingAiAssistant } from "@/components/ui/glowing-ai-chat-assistant";

export type NavItem = {
  icon: typeof LayoutDashboardIcon;
  label: string;
  to: string;
  count?: number;
  badge?: string;
};

const MAIN_ITEMS: NavItem[] = [
  { icon: LayoutDashboardIcon, label: "Overview", to: "/dashboard" },
  { icon: ShoppingCartIcon, label: "POS Sales", to: "/dashboard/pos" },
  { icon: FileDescriptionIcon, label: "Tally / Accounting", to: "/dashboard/tally" },
];

const OPS_ITEMS: NavItem[] = [
  { icon: StackIcon, label: "Inventory", to: "/dashboard/inventory" },
  { icon: BookIcon, label: "Menu", to: "/dashboard/menu" },
  { icon: SoupIcon, label: "Menu Engineering", to: "/dashboard/menu-engineering" },
  { icon: TruckElectricIcon, label: "Suppliers", to: "/dashboard/suppliers" },
  { icon: CurrencyDollarIcon, label: "Market Prices", to: "/dashboard/market-prices" },
  { icon: MapPinIcon, label: "Branches", to: "/dashboard/branches" },
  { icon: StarIcon, label: "Reviews", to: "/dashboard/reviews" },
];

const AI_ITEMS: NavItem[] = [
  { icon: BrandOpenaiIcon, label: "Pilot AI", to: "/dashboard/ai", badge: "AI" },
  { icon: ChartBarIcon, label: "Reports", to: "/dashboard/reports" },
];

const ADMIN_ITEMS: NavItem[] = [
  { icon: UserIcon, label: "Profile", to: "/dashboard/profile" },
  { icon: GearIcon, label: "Settings", to: "/dashboard/settings" },
];

export const NAV_ITEMS = [...MAIN_ITEMS, ...OPS_ITEMS, ...AI_ITEMS, ...ADMIN_ITEMS];

function NavSection({
  items,
  label,
  pathname,
}: {
  items: NavItem[];
  label: string;
  pathname: string;
}) {
  return (
    <SidebarGroup className="px-2 py-1">
      <SidebarGroupLabel className="px-2 pb-1.5 pt-2.5 text-[10.5px] font-semibold uppercase tracking-wider text-sidebar-foreground/50">
        {label}
      </SidebarGroupLabel>
      <SidebarGroupContent>
        <SidebarMenu className="gap-0.5">
          {items.map((item) => {
            // match on a segment boundary — a bare startsWith lit up both "Menu"
            // and "Menu Engineering" on /dashboard/menu-engineering
            const isActive =
              pathname === item.to ||
              (item.to !== "/dashboard" && pathname.startsWith(`${item.to}/`));
            return <NavRow key={item.to} item={item} isActive={isActive} />;
          })}
        </SidebarMenu>
      </SidebarGroupContent>
    </SidebarGroup>
  );
}

function NavRow({ item, isActive }: { item: NavItem; isActive: boolean }) {
  const { icon: Icon, label: itemLabel, to, count, badge } = item;
  // the icon is 16px inside a 40px row — drive its animation from the whole row
  const iconRef = useRef<AnimatedIconHandle>(null);
  return (
    <SidebarMenuItem
      onMouseEnter={() => iconRef.current?.startAnimation()}
      onMouseLeave={() => iconRef.current?.stopAnimation()}
    >
      <SidebarMenuButton
        asChild
        isActive={isActive}
        tooltip={itemLabel}
        className={cn(
          "group/nav h-10 rounded-xl text-[13px] font-medium text-sidebar-foreground",
          "transition-[background,color] duration-200 ease-out",
          "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground",
          "group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:rounded-lg",
          // must stay a data-[active] variant — a plain bg-* class loses on
          // specificity to the base data-[active=true]:bg-sidebar-accent
          "data-[active=true]:bg-sidebar-primary data-[active=true]:text-sidebar-primary-foreground",
          isActive && "hover:bg-sidebar-primary hover:text-sidebar-primary-foreground",
        )}
      >
        <Link
          to={to}
          className="flex items-center gap-2.5 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:gap-0"
        >
          <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg group-data-[collapsible=icon]:h-auto group-data-[collapsible=icon]:w-auto">
            <Icon ref={iconRef} className="h-4 w-4 shrink-0" />
          </span>
          <span className={cn("group-data-[collapsible=icon]:hidden", isActive && "font-semibold")}>
            {itemLabel}
          </span>
        </Link>
      </SidebarMenuButton>
      {badge && (
        <SidebarMenuBadge className="rounded bg-primary/15 px-1.5 text-[9px] font-bold tracking-wider text-primary">
          {badge}
        </SidebarMenuBadge>
      )}
      {count !== undefined && (
        <SidebarMenuBadge
          className={cn(
            "rounded-md bg-sidebar-border/60 text-[10px] font-semibold text-sidebar-foreground/60",
            isActive && "bg-white/20 text-sidebar-primary-foreground",
          )}
        >
          {count}
        </SidebarMenuBadge>
      )}
    </SidebarMenuItem>
  );
}

export function DashboardLayout({ children }: { children?: ReactNode }) {
  const history = useHistory();
  const { pathname } = useLocation();

  useEffect(() => {
    if (!getStoredUser()) history.replace("/login");
  }, [history]);

  const profileQuery = useQuery({
    queryKey: ["auth", "me"],
    queryFn: async () => {
      const fresh = await getMe();
      if (fresh) updateStoredUser(fresh);
      return fresh;
    },
    enabled: !!getStoredUser(),
    staleTime: 30_000,
  });

  const [storedUser, setStoredUser] = useState<ReturnType<typeof getStoredUser>>(null);
  useEffect(() => {
    setStoredUser(getStoredUser());
  }, []);
  const user = profileQuery.data ?? storedUser;

  const handleLogout = async () => {
    try {
      await apiLogout();
    } catch {
      clearTokens();
    }
    toast.success("Signed out successfully.");
    history.push("/login");
  };

  const initials = (user?.full_name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);

  const role = (user as any)?.role ?? "Owner";

  return (
    <BranchFilterProvider>
      <DateRangeProvider>
        <SidebarProvider className="dashboard-shell min-h-screen bg-background">
          <Sidebar collapsible="icon" className="border-r border-sidebar-border/80 bg-sidebar">
            {/* Logo Header */}
            <SidebarHeader className="!gap-0 !p-0 shrink-0 border-b border-sidebar-border/80">
              <div className="flex h-full w-full items-center justify-between gap-2 px-3 group-data-[collapsible=icon]:justify-center group-data-[collapsible=icon]:px-0">
                <AppLogo
                  to="/"
                  showText
                  subtitle="Restaurant OS"
                  className="flex-1 group-data-[collapsible=icon]:flex-none group-data-[collapsible=icon]:justify-center"
                  textWrapperClassName="group-data-[collapsible=icon]:hidden"
                  textClassName="text-sidebar-foreground"
                  subtitleClassName="text-sidebar-primary/80"
                />
                <SidebarTrigger
                  title="Collapse sidebar"
                  className="h-9 w-9 shrink-0 rounded-xl text-sidebar-foreground/50 transition-colors hover:bg-sidebar-accent hover:text-sidebar-foreground group-data-[collapsible=icon]:hidden"
                />
              </div>
            </SidebarHeader>

            {/* Navigation */}
            <SidebarContent className="py-2 overflow-x-hidden">
              <NavSection items={MAIN_ITEMS} label="Main" pathname={pathname} />
              <SidebarSeparator className="mx-3 my-1 bg-sidebar-border/60" />
              <NavSection items={OPS_ITEMS} label="Operations" pathname={pathname} />
              <SidebarSeparator className="mx-3 my-1 bg-sidebar-border/60" />
              <NavSection items={AI_ITEMS} label="Intelligence" pathname={pathname} />
              <SidebarSeparator className="mx-3 my-1 bg-sidebar-border/60" />
              <NavSection
                items={
                  user?.is_admin
                    ? [...ADMIN_ITEMS, { icon: StackIcon, label: "Admin Console", to: "/admin" }]
                    : ADMIN_ITEMS
                }
                label="Administration"
                pathname={pathname}
              />
            </SidebarContent>

            {/* Footer — Tenant + User */}
            <SidebarFooter className="border-t border-sidebar-border/80 p-3 gap-2">
              {/* User profile */}
              <Link
                to="/dashboard/profile"
                className="flex items-center gap-2.5 rounded-xl px-2 py-2 transition-all duration-200 hover:bg-sidebar-accent/80 group-data-[collapsible=icon]:justify-center"
              >
                <Avatar className="h-8 w-8 shrink-0 ring-2 ring-sidebar-border/60">
                  <AvatarFallback className="bg-primary/20 text-primary text-xs font-bold">
                    {initials}
                  </AvatarFallback>
                </Avatar>
                <div className="min-w-0 flex-1 group-data-[collapsible=icon]:hidden">
                  <p className="truncate text-[12px] font-semibold leading-tight text-sidebar-foreground">
                    {user?.full_name ?? "User"}
                  </p>
                  <p className="truncate text-[10px] text-sidebar-foreground/50">{role}</p>
                </div>
              </Link>

              {/* Actions row */}
              <div className="flex items-center gap-1 group-data-[collapsible=icon]:hidden">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="h-8 flex-1 justify-start gap-2 rounded-lg px-2 text-[11px] font-medium text-sidebar-foreground/60 hover:bg-sidebar-accent hover:text-destructive"
                >
                  <LogOut className="h-3.5 w-3.5" />
                  Sign out
                </Button>
              </div>
            </SidebarFooter>

            <SidebarRail />
          </Sidebar>

          <MainPanel onLogout={handleLogout} userName={user?.full_name ?? "there"}>
            {children}
          </MainPanel>
        </SidebarProvider>
      </DateRangeProvider>
    </BranchFilterProvider>
  );
}

function MainPanel({
  onLogout,
  children,
  userName,
}: {
  onLogout: () => void;
  children?: ReactNode;
  userName: string;
}) {
  const { state, isMobile } = useSidebar();
  const { pathname } = useLocation();
  const firstName = userName.split(" ")[0] ?? userName;
  const hour = new Date().getHours();
  const greeting = hour < 12 ? "Good morning" : hour < 17 ? "Good afternoon" : "Good evening";

  return (
    <SidebarInset className="flex flex-col overflow-hidden bg-background dashboard-canvas">
      <header className="sticky top-0 z-[var(--z-sticky)] shrink-0 border-b border-border bg-white">
        <div className="dashboard-topbar-inner flex w-full items-center gap-3 px-4 sm:px-6 md:px-8">
          {(state === "collapsed" || isMobile) && (
            <SidebarTrigger className="h-9 w-9 shrink-0 rounded-xl text-muted-foreground transition-colors hover:bg-secondary hover:text-foreground [&_svg]:size-4" />
          )}

          <div className="min-w-0 flex-1">
            <h1 className="truncate text-lg font-bold tracking-tight text-foreground sm:text-xl">
              {greeting}, {firstName}!
            </h1>
            <p className="hidden text-[12px] text-muted-foreground sm:block">
              Here&apos;s what&apos;s happening at your restaurant today.
            </p>
          </div>

          <div className="ml-auto flex shrink-0 items-center gap-2 sm:gap-2.5">
            <div
              className="hidden h-9 shrink-0 items-center rounded-full border border-border/60 bg-muted/50 px-3 text-[12px] font-medium text-muted-foreground sm:flex"
              suppressHydrationWarning
            >
              {new Date().toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </div>

            <Button
              variant="ghost"
              size="sm"
              onClick={onLogout}
              className="hidden h-9 gap-1.5 rounded-xl text-[12px] font-medium text-muted-foreground hover:text-destructive xl:flex"
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
          </div>
        </div>
      </header>

      {/* Location switcher + date range — the owner's first touch every visit.
          Hidden on Market Prices (external gov data, not branch/period scoped),
          Pilot AI (chat scopes itself; questions carry their own timeframe),
          and Menu Engineering (fixed 30-day, whole-menu view). */}
      <div
        className="shrink-0 border-b border-border/60 bg-background/60 backdrop-blur-xl"
        hidden={
          pathname === "/dashboard/market-prices" ||
          pathname === "/dashboard/ai" ||
          pathname === "/dashboard/menu-engineering"
        }
      >
        <div className="flex w-full flex-col items-stretch gap-2 px-4 py-2.5 sm:flex-row sm:items-center sm:gap-3 sm:px-6 md:px-8">
          <div className="min-w-0 flex-1">
            <LocationSwitcher />
          </div>
          <div className="self-start sm:self-auto">
            <DateRangePicker />
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto px-4 py-5 sm:px-6 md:px-8 md:py-6">
        <div className="w-full">{children}</div>
      </div>

      {/* Pilot AI chat widget on every page; the AI page IS the chat already. */}
      {pathname !== "/dashboard/ai" && <FloatingAiAssistant />}
    </SidebarInset>
  );
}
