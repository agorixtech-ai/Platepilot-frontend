import type { ReactNode } from "react";
import { Link, useHistory } from "react-router-dom";
import { toast } from "sonner";
import {
  BarChart3,
  ChevronRight,
  CircleDollarSign,
  FileText,
  HelpCircle,
  Info,
  LogOut,
  Package,
  Pencil,
  Plug,
  Plus,
  Settings,
  Star,
  Truck,
  TrendingUp,
  Upload,
  User,
  Users,
  type LucideIcon,
} from "lucide-react";

import { CARD, SectionTitle } from "@/components/dashboard/MobileUI";
import { canOpenPage, clearTokens, getStoredUser, logout } from "@/lib/auth";
import { SALES_EMAIL } from "@/lib/contact";
import { cn } from "@/lib/utils";

type QuickAction = {
  icon: LucideIcon;
  title: string;
  sub: string;
  to?: string;
  page?: string;
  soon?: boolean;
  tone: string;
  iconTone: string;
  accent: string;
};

const QUICK_ACTIONS: QuickAction[] = [
  {
    icon: Upload,
    title: "Upload Data",
    sub: "Import sales and inventory files",
    soon: true,
    tone: "bg-success/10",
    iconTone: "bg-success/15 text-success",
    accent: "text-success",
  },
  {
    icon: Plug,
    title: "Integrations",
    sub: "POS, Tally and more",
    soon: true,
    tone: "bg-info/10",
    iconTone: "bg-info/15 text-info",
    accent: "text-info",
  },
  {
    icon: FileText,
    title: "Reports",
    sub: "Download and share reports",
    to: "/dashboard/reports",
    page: "reports",
    tone: "bg-warning/10",
    iconTone: "bg-warning/20 text-warning-dark",
    accent: "text-warning-dark",
  },
  {
    icon: Settings,
    title: "Settings",
    sub: "Restaurant, branches, preferences",
    to: "/dashboard/settings",
    page: "settings",
    tone: "bg-purple-500/10",
    iconTone: "bg-purple-500/15 text-purple-600",
    accent: "text-purple-600",
  },
];

/** Small up-trend motif — Tally / Accounting row. */
function TallyGraphic() {
  return (
    <div className="flex h-11 w-11 items-center justify-center rounded-xl bg-success/10">
      <TrendingUp className="h-5 w-5 text-success" />
    </div>
  );
}

/** Truck + package cluster — Suppliers row. */
function SuppliersGraphic() {
  return (
    <div className="flex -space-x-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-warning/20 text-warning-dark">
        <Package className="h-4 w-4" />
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-success/15 text-success">
        <Truck className="h-4 w-4" />
      </span>
    </div>
  );
}

/** Ingredient emoji cluster with an up-trend badge — Market Prices row. */
function MarketPricesGraphic() {
  return (
    <div className="relative flex -space-x-2">
      {["🍅", "🥬", "🥒"].map((e, i) => (
        <span
          key={i}
          className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-muted text-[13px]"
          style={{ zIndex: 3 - i }}
        >
          {e}
        </span>
      ))}
      <span className="absolute -right-0.5 -top-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-success text-success-foreground ring-2 ring-white">
        <TrendingUp className="h-2.5 w-2.5" />
      </span>
    </div>
  );
}

/** Star rating pill — Reviews row (no third-party logos, just the rating). */
function ReviewsGraphic() {
  return (
    <div className="flex items-center gap-0.5 rounded-full bg-warning/15 px-2 py-1">
      {[0, 1, 2, 3].map((i) => (
        <Star key={i} className="h-3 w-3 fill-warning text-warning" />
      ))}
      <Star className="h-3 w-3 text-warning/40" />
    </div>
  );
}

/** Two teammates + an add button — Team row. */
function TeamGraphic() {
  return (
    <div className="flex items-center -space-x-2">
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-muted text-muted-foreground">
        <User className="h-4 w-4" />
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-muted text-muted-foreground">
        <User className="h-4 w-4" />
      </span>
      <span className="flex h-8 w-8 items-center justify-center rounded-full border-2 border-white bg-success text-success-foreground">
        <Plus className="h-4 w-4" />
      </span>
    </div>
  );
}

type Row = {
  icon: LucideIcon;
  title: string;
  sub: string;
  to?: string;
  page?: string;
  onClick?: () => void;
  visual?: ReactNode;
  showChevron?: boolean;
};

function BusinessRow({ row }: { row: Row }) {
  const inner = (
    <>
      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-success/15 text-success">
        <row.icon className="h-5 w-5" />
      </span>
      <div className="min-w-0 flex-1">
        <p className="text-[15px] font-bold leading-tight text-foreground">{row.title}</p>
        {row.sub && <p className="truncate text-[12px] text-muted-foreground">{row.sub}</p>}
      </div>
      {row.showChevron !== false && (
        <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
      )}
      {row.visual && <div className="shrink-0">{row.visual}</div>}
    </>
  );
  const cls = cn(CARD, "flex items-center gap-3 p-3");
  return row.to ? (
    <Link to={row.to} className={cls}>
      {inner}
    </Link>
  ) : (
    <button type="button" onClick={row.onClick} className={cn(cls, "w-full text-left")}>
      {inner}
    </button>
  );
}

export default function More() {
  const history = useHistory();
  const user = getStoredUser();
  const initials = (user?.full_name ?? "U")
    .split(" ")
    .map((w) => w[0])
    .join("")
    .slice(0, 2)
    .toUpperCase();

  const signOut = async () => {
    try {
      await logout();
    } catch {
      clearTokens();
    }
    toast.success("Signed out successfully.");
    history.push("/login");
  };

  const businessRows: Row[] = [
    {
      icon: FileText,
      title: "Tally / Accounting",
      sub: "Vouchers and purchases",
      to: "/dashboard/tally",
      page: "tally",
      visual: <TallyGraphic />,
    },
    {
      icon: Truck,
      title: "Suppliers",
      sub: "Vendors and orders",
      to: "/dashboard/suppliers",
      page: "suppliers",
      visual: <SuppliersGraphic />,
    },
    {
      icon: CircleDollarSign,
      title: "Market Prices",
      sub: "Live ingredient prices",
      to: "/dashboard/market-prices",
      page: "market-prices",
      visual: <MarketPricesGraphic />,
    },
    {
      icon: Star,
      title: "Reviews",
      sub: "Guest ratings across platforms",
      to: "/dashboard/reviews",
      page: "reviews",
      visual: <ReviewsGraphic />,
    },
    {
      icon: Users,
      title: "Team",
      sub: "Members and roles",
      to: "/dashboard/team",
      page: "team",
      visual: <TeamGraphic />,
    },
  ].filter((r) => !r.page || canOpenPage(r.page, user));

  const supportRows: Row[] = [
    {
      icon: HelpCircle,
      title: "Help & Support",
      sub: "Guides, FAQs and contact support",
      onClick: () => (window.location.href = `mailto:${SALES_EMAIL}`),
    },
    { icon: Info, title: "About PlatePilot", sub: "Version 1.0.0", showChevron: false },
    { icon: LogOut, title: "Sign out", sub: "", onClick: signOut, showChevron: false },
  ];

  const visibleActions = QUICK_ACTIONS.filter((a) => !a.page || canOpenPage(a.page, user));

  return (
    <div className="mx-auto max-w-xl px-4 pb-4">
      <div className="pt-5 pb-4">
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">More</h1>
        <p className="mt-1 text-[13px] text-muted-foreground">
          Manage your restaurant, integrations and settings.
        </p>
      </div>

      <Link
        to="/dashboard/profile"
        className="flex items-center gap-3 rounded-2xl bg-success/10 p-4"
      >
        <span className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-primary text-[17px] font-bold text-primary-foreground">
          {initials}
        </span>
        <span className="min-w-0 flex-1">
          <span className="block truncate text-[16px] font-bold text-foreground">
            {user?.full_name}
          </span>
          <span className="block text-[12px] text-muted-foreground">
            {user?.role_name ?? (user?.is_admin ? "Admin" : "Member")}
          </span>
          <span className="block truncate text-[12px] text-muted-foreground">{user?.email}</span>
        </span>
        <span className="flex shrink-0 items-center gap-2">
          <span className="flex items-center gap-1.5 rounded-full bg-card px-3 py-2 text-[12px] font-semibold text-foreground shadow-sm">
            <Pencil className="h-3.5 w-3.5" /> Edit Profile
          </span>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </span>
      </Link>

      <SectionTitle
        right={
          <Link to="/dashboard/settings" className="text-[12px] font-semibold text-primary">
            Manage all →
          </Link>
        }
      >
        Quick Actions
      </SectionTitle>
      <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
        {visibleActions.map((a) => (
          <div key={a.title} className={cn("flex flex-col gap-2 rounded-2xl p-3", a.tone)}>
            <span className={cn("flex h-9 w-9 items-center justify-center rounded-xl", a.iconTone)}>
              <a.icon className="h-4.5 w-4.5" />
            </span>
            <div>
              <p className="text-[13px] font-bold leading-tight text-foreground">{a.title}</p>
              <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">{a.sub}</p>
            </div>
            <div className="mt-1">
              {a.soon ? (
                <span className="inline-block rounded-full bg-muted px-2 py-1 text-[9px] font-semibold text-muted-foreground">
                  Soon
                </span>
              ) : (
                <Link
                  to={a.to!}
                  className="flex h-7 w-7 items-center justify-center rounded-full bg-card shadow-sm"
                >
                  <ChevronRight className={cn("h-3.5 w-3.5", a.accent)} />
                </Link>
              )}
            </div>
          </div>
        ))}
      </div>

      {businessRows.length > 0 && (
        <>
          <SectionTitle>Business Management</SectionTitle>
          <div className="flex flex-col gap-3">
            {businessRows.map((r) => (
              <BusinessRow key={r.title} row={r} />
            ))}
          </div>
        </>
      )}

      <SectionTitle>Support & Legal</SectionTitle>
      <div className="flex flex-col gap-3">
        {supportRows.map((r) => (
          <BusinessRow key={r.title} row={r} />
        ))}
      </div>
    </div>
  );
}
