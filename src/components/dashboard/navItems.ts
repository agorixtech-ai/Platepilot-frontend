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

export type NavItem = {
  icon: typeof LayoutDashboardIcon;
  label: string;
  to: string;
  count?: number;
  badge?: string;
};

export const MAIN_ITEMS: NavItem[] = [
  { icon: LayoutDashboardIcon, label: "Overview", to: "/dashboard" },
  { icon: ShoppingCartIcon, label: "POS Sales", to: "/dashboard/pos" },
  { icon: FileDescriptionIcon, label: "Tally / Accounting", to: "/dashboard/tally" },
];

export const OPS_ITEMS: NavItem[] = [
  { icon: StackIcon, label: "Inventory", to: "/dashboard/inventory" },
  { icon: BookIcon, label: "Menu", to: "/dashboard/menu" },
  { icon: SoupIcon, label: "Menu Engineering", to: "/dashboard/menu-engineering" },
  { icon: TruckElectricIcon, label: "Suppliers", to: "/dashboard/suppliers" },
  { icon: CurrencyDollarIcon, label: "Market Prices", to: "/dashboard/market-prices" },
  { icon: MapPinIcon, label: "Branches", to: "/dashboard/branches" },
  { icon: StarIcon, label: "Reviews", to: "/dashboard/reviews" },
];

export const AI_ITEMS: NavItem[] = [
  { icon: BrandOpenaiIcon, label: "Pilot AI", to: "/dashboard/ai", badge: "AI" },
  { icon: ChartBarIcon, label: "Reports", to: "/dashboard/reports" },
];

export const ADMIN_ITEMS: NavItem[] = [
  { icon: UserIcon, label: "Profile", to: "/dashboard/profile" },
  { icon: GearIcon, label: "Settings", to: "/dashboard/settings" },
];

export const NAV_ITEMS = [...MAIN_ITEMS, ...OPS_ITEMS, ...AI_ITEMS, ...ADMIN_ITEMS];

/** "/dashboard" → "overview", "/dashboard/pos" → "pos" — matches backend PAGES. */
export function pageKeyOf(to: string): string {
  return to === "/dashboard" ? "overview" : to.replace("/dashboard/", "");
}
