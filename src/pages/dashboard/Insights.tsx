import type { ReactNode } from "react";
import { Link } from "react-router-dom";
import {
  BookOpen,
  Check,
  ChevronRight,
  MapPin,
  Package,
  Percent,
  ShoppingCart,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { canOpenPage } from "@/lib/auth";
import { cn } from "@/lib/utils";

/** Ascending bar sparkline — Sales row. */
function SalesSpark() {
  const bars = [30, 45, 55, 70, 90];
  return (
    <div className="flex h-12 w-20 items-end justify-end gap-1">
      {bars.map((h, i) => (
        <div key={i} className="w-2.5 rounded-t-sm bg-success/70" style={{ height: `${h}%` }} />
      ))}
    </div>
  );
}

/** Four-segment donut + legend — Food Cost row. */
function FoodCostDonut() {
  const segs = [
    { pct: 45, cls: "stroke-orange-400", label: "Ingredients", dot: "bg-orange-400" },
    { pct: 25, cls: "stroke-emerald-400", label: "Packaging", dot: "bg-emerald-400" },
    { pct: 18, cls: "stroke-blue-400", label: "Utilities", dot: "bg-blue-400" },
    { pct: 12, cls: "stroke-purple-400", label: "Others", dot: "bg-purple-400" },
  ];
  const r = 16;
  const c = 2 * Math.PI * r;
  let offset = 0;
  return (
    <div className="flex items-center gap-2">
      <svg viewBox="0 0 40 40" className="h-11 w-11 -rotate-90 shrink-0">
        {segs.map((s) => {
          const dash = (s.pct / 100) * c;
          const el = (
            <circle
              key={s.label}
              cx="20"
              cy="20"
              r={r}
              fill="none"
              strokeWidth="6"
              strokeDasharray={`${dash} ${c - dash}`}
              strokeDashoffset={-offset}
              className={s.cls}
            />
          );
          offset += dash;
          return el;
        })}
      </svg>
      <div className="flex shrink-0 flex-col gap-0.5 text-[8px] leading-tight text-muted-foreground">
        {segs.map((s) => (
          <span key={s.label} className="flex items-center gap-1">
            <span className={cn("h-1.5 w-1.5 rounded-full", s.dot)} />
            {s.label}
          </span>
        ))}
      </div>
    </div>
  );
}

/** Downward-then-choppy trend line — Waste row. */
function WasteTrend() {
  return (
    <svg viewBox="0 0 80 40" className="h-11 w-20">
      <path
        d="M2,26 L14,14 L26,22 L38,10 L50,24 L62,16 L78,20"
        fill="none"
        strokeWidth="2.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="stroke-destructive/80"
      />
    </svg>
  );
}

/** Overlapping ingredient tiles — Inventory row. */
function InventoryPhotos() {
  return (
    <div className="flex -space-x-3">
      {["🍅", "🥬", "🧀"].map((e, i) => (
        <span
          key={i}
          className="flex h-9 w-9 items-center justify-center rounded-full border-2 border-white bg-muted text-base shadow-sm"
          style={{ zIndex: 3 - i }}
        >
          {e}
        </span>
      ))}
    </div>
  );
}

/** Dish rows with popularity bars — Menu row. */
function MenuList() {
  const dishes = [
    { emoji: "🍕", name: "Margherita Pizza", pct: 90 },
    { emoji: "🍝", name: "Pasta Alfredo", pct: 65 },
    { emoji: "🥗", name: "Caesar Salad", pct: 45 },
  ];
  return (
    <div className="flex flex-col gap-1">
      {dishes.map((d) => (
        <div key={d.name} className="flex items-center gap-1.5">
          <span className="text-[11px] leading-none">{d.emoji}</span>
          <div className="flex w-24 flex-col gap-0.5">
            <span className="truncate text-[9px] font-medium leading-none text-foreground">
              {d.name}
            </span>
            <span className="h-1 rounded-full bg-muted">
              <span className="block h-1 rounded-full bg-success" style={{ width: `${d.pct}%` }} />
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

/** Abstract branch map with pins + a floating callout — Branches row. */
function BranchesMap() {
  return (
    <div className="relative h-12 w-20 overflow-hidden rounded-xl bg-indigo-100">
      <span className="absolute left-[20%] top-[55%] h-2 w-2 rounded-full bg-success ring-2 ring-white" />
      <span className="absolute left-[55%] top-[30%] h-2 w-2 rounded-full bg-warning ring-2 ring-white" />
      <span className="absolute left-[75%] top-[65%] h-2 w-2 rounded-full bg-info ring-2 ring-white" />
      <span className="absolute left-1 top-1 rounded-md bg-white px-1 py-0.5 text-[7px] font-semibold leading-tight text-foreground shadow-sm">
        Main Branch
      </span>
    </div>
  );
}

/** Checklist of suggested items — Purchasing row. */
function PurchaseChecklist() {
  const items = ["Flour", "Cheese", "Tomatoes", "Olive Oil"];
  return (
    <div className="flex flex-col gap-0.5">
      {items.map((it) => (
        <span key={it} className="flex items-center gap-1 text-[9px] text-foreground">
          <span className="flex h-3 w-3 items-center justify-center rounded-sm bg-success/15 text-success">
            <Check className="h-2 w-2" strokeWidth={3} />
          </span>
          {it}
        </span>
      ))}
    </div>
  );
}

type InsightRow = {
  icon: LucideIcon;
  title: string;
  sub: string;
  to: string;
  page: string;
  tone: string;
  iconTone: string;
  stat: ReactNode;
  visual: ReactNode;
};

const INSIGHTS: InsightRow[] = [
  {
    icon: TrendingUp,
    title: "Sales",
    sub: "Trends, branches, products, channels",
    to: "/dashboard/pos",
    page: "pos",
    tone: "bg-success/10",
    iconTone: "bg-success/15 text-success",
    stat: (
      <>
        <span className="font-bold text-success">↑ 13%</span> vs last week
      </>
    ),
    visual: <SalesSpark />,
  },
  {
    icon: Percent,
    title: "Food Cost",
    sub: "Food cost and variance",
    to: "/dashboard/food-cost",
    page: "overview",
    tone: "bg-warning/10",
    iconTone: "bg-warning/20 text-warning-dark",
    stat: (
      <>
        <span className="font-bold text-destructive">↓ 2.4%</span> vs last week
      </>
    ),
    visual: <FoodCostDonut />,
  },
  {
    icon: Package,
    title: "Inventory",
    sub: "Stock status and movement",
    to: "/dashboard/inventory",
    page: "inventory",
    tone: "bg-info/10",
    iconTone: "bg-info/15 text-info",
    stat: (
      <>
        <span className="font-bold text-destructive">↓ 6</span> items low in stock
      </>
    ),
    visual: <InventoryPhotos />,
  },
  {
    icon: BookOpen,
    title: "Menu",
    sub: "Profitability and popularity",
    to: "/dashboard/menu-engineering",
    page: "menu-engineering",
    tone: "bg-success/10",
    iconTone: "bg-success/15 text-success",
    stat: (
      <>
        <span className="font-bold text-success">↑ 3</span> new top items
      </>
    ),
    visual: <MenuList />,
  },
  {
    icon: Trash2,
    title: "Waste",
    sub: "Waste trends and financial impact",
    to: "/dashboard/waste",
    page: "inventory",
    tone: "bg-destructive/10",
    iconTone: "bg-destructive/15 text-destructive",
    stat: (
      <>
        <span className="font-bold text-destructive">↑ 12%</span> vs last month
      </>
    ),
    visual: <WasteTrend />,
  },
  {
    icon: MapPin,
    title: "Branches",
    sub: "Compare your locations",
    to: "/dashboard/branches",
    page: "branches",
    tone: "bg-indigo-500/10",
    iconTone: "bg-indigo-500/15 text-indigo-600",
    stat: <span className="font-bold text-indigo-600">3 branches</span>,
    visual: <BranchesMap />,
  },
  {
    icon: ShoppingCart,
    title: "Purchasing",
    sub: "What to order and why",
    to: "/dashboard/purchasing",
    page: "inventory",
    tone: "bg-success/10",
    iconTone: "bg-success/15 text-success",
    stat: (
      <>
        <Check className="inline h-3 w-3 text-success" strokeWidth={3} /> Suggested orders available
      </>
    ),
    visual: <PurchaseChecklist />,
  },
];

export default function Insights() {
  return (
    <div className="mx-auto max-w-xl px-4 pb-4">
      {/* Header — title + subtitle with a faint decorative skyline. */}
      <div className="relative overflow-hidden pt-5 pb-4">
        <div className="pointer-events-none absolute -right-2 top-2 flex items-end gap-1.5 opacity-15">
          {[16, 28, 40, 52, 64].map((h, i) => (
            <div key={i} className="w-3 rounded-t-sm bg-success" style={{ height: h }} />
          ))}
        </div>
        <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Insights</h1>
        <p className="mt-1 max-w-[75%] text-[13px] text-muted-foreground">
          Get deeper insights to run your restaurant better.
        </p>
      </div>

      <div className="flex flex-col gap-3">
        {INSIGHTS.filter((i) => canOpenPage(i.page)).map((i) => (
          <Link
            key={i.to}
            to={i.to}
            className={cn("flex items-center gap-3 rounded-2xl p-4", i.tone)}
          >
            <span
              className={cn(
                "flex h-11 w-11 shrink-0 items-center justify-center rounded-xl",
                i.iconTone,
              )}
            >
              <i.icon className="h-5 w-5" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-[16px] font-bold leading-tight text-foreground">{i.title}</p>
              <p className="text-[12px] leading-snug text-muted-foreground">{i.sub}</p>
              <p className="mt-1 text-[12px] text-muted-foreground">{i.stat}</p>
            </div>
            <div className="flex shrink-0 items-center gap-1">
              {i.visual}
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
