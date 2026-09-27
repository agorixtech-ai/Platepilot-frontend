import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Crown, HelpCircle, Snail, Star, type LucideIcon } from "lucide-react";

import { cn } from "@/lib/utils";
import { dashboardService, type MenuEngineeringItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import {
  CARD,
  EmptyNote,
  ErrorStrip,
  ListGroup,
  Segments,
  SectionTitle,
} from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

type Quadrant = MenuEngineeringItem["quadrant"];
type Tab = "matrix" | "top" | "low";

const QUADRANTS: {
  key: Quadrant;
  title: string;
  label: string;
  icon: LucideIcon;
  cls: string;
  hint: string;
}[] = [
  {
    key: "star",
    title: "Stars",
    label: "Star",
    icon: Star,
    cls: "bg-success-soft text-success",
    hint: "High popularity\nHigh profitability",
  },
  {
    key: "puzzle",
    title: "Puzzles",
    label: "Puzzle",
    icon: HelpCircle,
    cls: "bg-warning-soft text-warning-dark",
    hint: "Low popularity\nHigh profitability",
  },
  {
    key: "plow_horse",
    title: "Plow Horses",
    label: "Plow Horse",
    icon: Crown,
    cls: "bg-info-soft text-info",
    hint: "High popularity\nLow profitability",
  },
  {
    key: "dog",
    title: "Dogs",
    label: "Dog",
    icon: Snail,
    cls: "bg-destructive-soft text-destructive",
    hint: "Low popularity\nLow profitability",
  },
];

/** Menu Performance — phone view of the menu-engineering quadrants (30-day). */
export default function MobileMenu() {
  const { branch } = useBranchFilter();
  const [tab, setTab] = useState<Tab>("matrix");

  const q = useQuery({
    queryKey: ["dashboard", "menu-engineering", "month", branch],
    queryFn: () => dashboardService.getMenuEngineering("month", branch),
    ...DASHBOARD_LIVE_QUERY,
  });

  const items = q.data?.items ?? [];
  const cur = q.data?.currency ?? "AED";
  const byRevenue = [...items].sort((a, b) => b.revenue - a.revenue);
  const best = byRevenue[0];
  const label = (k: Quadrant) => QUADRANTS.find((x) => x.key === k)?.label ?? k;
  const shown =
    tab === "top"
      ? byRevenue.slice(0, 10)
      : tab === "low"
        ? items.filter((i) => i.quadrant === "dog").reverse()
        : [];

  return (
    <div className="mx-auto max-w-xl">
      <Segments<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: "matrix", label: "Menu Matrix" },
          { value: "top", label: "Top Items" },
          { value: "low", label: "Low Performers" },
        ]}
      />

      {q.isError && (
        <div className="mt-3">
          <ErrorStrip onRetry={() => void q.refetch()} />
        </div>
      )}

      {q.isLoading ? (
        <Skeleton className="mt-3 h-64 w-full rounded-2xl" />
      ) : items.length === 0 ? (
        <div className="mt-3">
          <EmptyNote>Dishes appear here once recipes and POS sales are synced.</EmptyNote>
        </div>
      ) : tab === "matrix" ? (
        <>
          <div className="mt-3 grid grid-cols-2 gap-3">
            {QUADRANTS.map((x) => {
              const Icon = x.icon;
              const n = items.filter((i) => i.quadrant === x.key).length;
              return (
                <div key={x.key} className={cn("rounded-2xl p-3.5", x.cls)}>
                  <Icon className="h-5 w-5" />
                  <p className="mt-2 text-[14px] font-bold">{x.title}</p>
                  <p className="mt-0.5 whitespace-pre-line text-[11px] leading-snug opacity-80">
                    {x.hint}
                  </p>
                  <p className="mt-2 text-[12px] font-semibold">{n} items</p>
                </div>
              );
            })}
          </div>

          {best && (
            <>
              <SectionTitle>Top Performing Item</SectionTitle>
              <div className={cn(CARD, "flex items-center gap-3 p-3")}>
                <ItemAvatar name={best.dish} size="lg" />
                <div className="min-w-0">
                  <p className="truncate text-[14px] font-bold text-foreground">{best.dish}</p>
                  <p className="text-[12px] text-muted-foreground">
                    Sold: {best.sold.toLocaleString()} · Margin: {best.margin_pct.toFixed(0)}%
                  </p>
                  <p className="text-[12px] text-muted-foreground">
                    Classification:{" "}
                    <span className="font-semibold text-primary">{label(best.quadrant)}</span>
                  </p>
                </div>
              </div>
            </>
          )}
        </>
      ) : shown.length === 0 ? (
        <div className="mt-3">
          <EmptyNote>Nothing here — no dishes are low performers.</EmptyNote>
        </div>
      ) : (
        <div className="mt-3">
          <ListGroup>
            {shown.map((i) => (
              <div key={i.id} className="flex items-center gap-3 px-3.5 py-3">
                <ItemAvatar name={i.dish} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">{i.dish}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {i.sold.toLocaleString()} sold · {i.margin_pct.toFixed(0)}% margin
                  </p>
                </div>
                <div className="text-right">
                  <p className="text-[13px] font-semibold text-foreground">
                    {fmtCurrency(i.revenue, cur)}
                  </p>
                  <p className="text-[11px] text-muted-foreground">{label(i.quadrant)}</p>
                </div>
              </div>
            ))}
          </ListGroup>
        </div>
      )}
    </div>
  );
}
