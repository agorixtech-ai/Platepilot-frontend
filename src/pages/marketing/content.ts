import type { LucideIcon } from "lucide-react";
import {
  BarChart3,
  Bell,
  BookOpen,
  Boxes,
  Building2,
  Calculator,
  ChefHat,
  Coffee,
  CreditCard,
  FileSpreadsheet,
  LayoutDashboard,
  PieChart,
  Plug,
  ShoppingCart,
  Sparkles,
  Store,
  Table2,
  TrendingUp,
  Upload,
  Users,
  UtensilsCrossed,
} from "lucide-react";

export type FeatureCard = {
  slug: string;
  label: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  bullets: string[];
};

export const PRODUCT_FEATURES: FeatureCard[] = [
  {
    slug: "dashboard",
    label: "Dashboard",
    title: "One live view of every outlet",
    desc: "Sales, bills, food cost, and margin in a single overview — drill from the group down to a branch in two taps.",
    icon: LayoutDashboard,
    bullets: [
      "Group and branch KPIs on one screen",
      "Day, week, and month comparisons",
      "Honest data freshness from daily sync",
    ],
  },
  {
    slug: "sales-analytics",
    label: "Sales Analytics",
    title: "Every bill, as it prints",
    desc: "POS sales stream across outlets so you see what’s moving — and what isn’t — without waiting for month-end.",
    icon: TrendingUp,
    bullets: [
      "Bill-level detail from your POS",
      "Outlet and item trends",
      "Ready for Tally reconciliation",
    ],
  },
  {
    slug: "branch-performance",
    label: "Branch Performance",
    title: "Compare outlets side by side",
    desc: "Spot which branches lead on sales, margin, and waste — and which need attention before the week ends.",
    icon: BarChart3,
    bullets: [
      "Rank branches by sales and margin",
      "Variance and wastage signals",
      "Built for multi-outlet operators",
    ],
  },
  {
    slug: "alerts-insights",
    label: "Alerts & Insights",
    title: "Risks before they hit the P&L",
    desc: "Low stock, GST mismatches, and margin dips surface as clear alerts — not buried in spreadsheets.",
    icon: Bell,
    bullets: [
      "Stock and variance alerts",
      "Reconciliation and GST flags",
      "Actionable, plain-language insights",
    ],
  },
  {
    slug: "data-upload",
    label: "Data Upload",
    title: "Bring your data in cleanly",
    desc: "CSV and Excel imports cover POS and books when a live connector isn’t ready — without a migration project.",
    icon: Upload,
    bullets: [
      "CSV and Excel import flows",
      "Mapped fields for sales and vouchers",
      "Safe for historical backfill",
    ],
  },
  {
    slug: "inventory-intelligence",
    label: "Inventory Intelligence",
    title: "Know what’s on the shelf",
    desc: "Stock built from POS sales and purchase bills — with alerts before you run out or over-order.",
    icon: Boxes,
    bullets: [
      "Live stock from sales and purchases",
      "Low-stock and overstock signals",
      "Outlet-level inventory views",
    ],
  },
  {
    slug: "food-cost-analysis",
    label: "Food Cost Analysis",
    title: "Food cost on one page",
    desc: "Track food cost and margin from the purchases and sales PlatePielet already syncs — no separate spreadsheet.",
    icon: PieChart,
    bullets: [
      "Food cost % by outlet and period",
      "Purchase vs sales linkage",
      "Month-end ready summaries",
    ],
  },
  {
    slug: "menu-performance",
    label: "Menu Performance",
    title: "Every dish gets a report card",
    desc: "Sell rate plus profit per plate — promote, re-price, push, or remove without consultants or spreadsheets.",
    icon: UtensilsCrossed,
    bullets: [
      "Best sellers, hidden gems, dead weight",
      "Profit per plate from recipe cost",
      "Clear promote / re-price / remove calls",
    ],
  },
  {
    slug: "purchase-suggestions",
    label: "Purchase Suggestions",
    title: "What to buy, and when",
    desc: "Market prices and demand signals tell you what to order so you stop overpaying vendors and overstocking.",
    icon: ShoppingCart,
    bullets: [
      "Purchase calls from live demand",
      "Market price context",
      "Less waste from over-ordering",
    ],
  },
  {
    slug: "ai",
    label: "PlatePielet AI",
    title: "Ask your books anything",
    desc: "Pilot AI reads bills, vouchers, and stock movements — then answers in plain language where money is leaking.",
    icon: Sparkles,
    bullets: [
      "Natural-language questions on your data",
      "Daily anomaly digests",
      "GST and reconciliation risk flags",
    ],
  },
];

export const SOLUTION_SEGMENTS: FeatureCard[] = [
  {
    slug: "multi-branch",
    label: "Multi-Branch Restaurants",
    title: "One brain for every outlet",
    desc: "Compare branches, catch variance early, and give owners a morning view without calling five managers.",
    icon: Building2,
    bullets: [
      "Cross-outlet sales and margin",
      "Branch ranking and alerts",
      "Shared Tally and POS sync",
    ],
  },
  {
    slug: "independent",
    label: "Independent Restaurants",
    title: "Back-office clarity without a big team",
    desc: "Connect the POS and Tally you already use — get food cost, waste, and menu calls without hiring an analyst.",
    icon: Store,
    bullets: [
      "Fast afternoon setup",
      "No new hardware at the outlet",
      "Pilot AI instead of extra reports",
    ],
  },
  {
    slug: "cafes",
    label: "Cafes",
    title: "High-velocity menus, tight margins",
    desc: "Track what sells by the hour, keep perishables in check, and protect margin on high-turn items.",
    icon: Coffee,
    bullets: [
      "Item-level sales trends",
      "Perishable stock alerts",
      "Menu engineering for short lists",
    ],
  },
  {
    slug: "cloud-kitchens",
    label: "Cloud Kitchens",
    title: "Multi-brand kitchens, one ledger",
    desc: "See sales and food cost across brands and dark kitchens — reconcile POS and books without chaos.",
    icon: ChefHat,
    bullets: [
      "Brand and kitchen rollups",
      "POS-to-Tally matching",
      "Purchase suggestions at scale",
    ],
  },
  {
    slug: "restaurant-groups",
    label: "Restaurant Groups",
    title: "Group control with outlet truth",
    desc: "Head office gets consolidated intelligence; outlet managers get the alerts that matter locally.",
    icon: Users,
    bullets: [
      "Tenant-scoped multi-outlet data",
      "Group dashboards and reports",
      "Role-ready for ops and finance",
    ],
  },
];

export type IntegrationSection = {
  id: string;
  label: string;
  title: string;
  desc: string;
  icon: LucideIcon;
  bullets: string[];
};

export const INTEGRATION_SECTIONS: IntegrationSection[] = [
  {
    id: "pos-systems",
    label: "POS Systems",
    title: "POS Systems",
    desc: "Import bills from the billing systems you already run — live where supported, file-based everywhere else.",
    icon: CreditCard,
    bullets: [
      "Common POS billing imports",
      "Outlet-scoped sales streams",
      "Ready for Tally reconciliation",
    ],
  },
  {
    id: "tally",
    label: "Tally",
    title: "Tally ERP",
    desc: "Two-way sync for vouchers, ledgers, and GST — so your books stay the source of truth.",
    icon: BookOpen,
    bullets: ["Voucher and ledger sync", "GST-aware matching", "Mismatch alerts before filing"],
  },
  {
    id: "csv-upload",
    label: "CSV Upload",
    title: "CSV Upload",
    desc: "Bring historical or niche-system data in via CSV when a connector isn’t available yet.",
    icon: FileSpreadsheet,
    bullets: [
      "Mapped column import",
      "Sales and voucher templates",
      "Safe backfill for new tenants",
    ],
  },
  {
    id: "excel-upload",
    label: "Excel Upload",
    title: "Excel Upload",
    desc: "Upload Excel workbooks from accounts or outlet managers without rebuilding your process.",
    icon: Table2,
    bullets: [
      "Spreadsheet-friendly flows",
      "Works alongside live sync",
      "No outlet hardware change",
    ],
  },
  {
    id: "accounting-systems",
    label: "Accounting Systems",
    title: "Accounting Systems",
    desc: "Keep finance and ops aligned — PlatePielet reconciles POS reality against your accounting books.",
    icon: Calculator,
    bullets: [
      "POS-to-books reconciliation",
      "Clear matched / pending states",
      "Export when you need it",
    ],
  },
  {
    id: "api-integrations",
    label: "API Integrations",
    title: "API Integrations",
    desc: "Extend PlatePielet with secure APIs for custom pipelines, partners, and internal tools.",
    icon: Plug,
    bullets: ["HTTPS JSON APIs", "Auth-scoped access", "Built for partners and power users"],
  },
];

export function getProductFeature(slug: string) {
  return PRODUCT_FEATURES.find((f) => f.slug === slug);
}

export function getSolutionSegment(slug: string) {
  return SOLUTION_SEGMENTS.find((s) => s.slug === slug);
}
