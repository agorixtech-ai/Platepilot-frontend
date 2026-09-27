import { useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { CARD, EmptyNote, ErrorStrip, Segments } from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

type Tab = "critical" | "low" | "ok";

/** Purchase suggestions from live Tally stock levels: critical → buy now,
    low → coming soon, ok → no action. Same query as Inventory/Overview. */
export default function Purchasing() {
  const { branch } = useBranchFilter();
  const [tab, setTab] = useState<Tab>("critical");

  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["dashboard", "stock-items", branch],
    queryFn: () => dashboardService.getStockItems(branch, 50),
    ...DASHBOARD_LIVE_QUERY,
  });

  const items = data?.items ?? [];
  const count = (s: Tab) => items.filter((i) => i.status === s).length;
  const list = items.filter((i) => i.status === tab);

  return (
    <div className="mx-auto max-w-xl">
      <Segments<Tab>
        value={tab}
        onChange={setTab}
        options={[
          { value: "critical", label: `Buy Now (${count("critical")})` },
          { value: "low", label: `Coming Soon (${count("low")})` },
          { value: "ok", label: "No Action" },
        ]}
      />

      {isError && (
        <div className="mt-3">
          <ErrorStrip onRetry={() => void refetch()} />
        </div>
      )}

      <div className="mt-3 space-y-2.5">
        {isLoading && <Skeleton className="h-24 w-full rounded-2xl" />}
        {list.map((i) => (
          <div key={i.item} className={cn(CARD, "flex items-center gap-3 p-3")}>
            <ItemAvatar name={i.item} size="lg" className="h-14 w-14 rounded-xl text-[15px]" />
            <div className="min-w-0 flex-1">
              <p className="truncate text-[14px] font-bold text-foreground">{i.item}</p>
              <p
                className={cn(
                  "text-[12px]",
                  i.status === "critical"
                    ? "text-destructive"
                    : i.status === "low"
                      ? "text-warning-dark"
                      : "text-muted-foreground",
                )}
              >
                {i.current_stock <= 0 ? "Out of stock" : `${i.current_stock} units in stock`}
              </p>
            </div>
            {i.status !== "ok" && (
              <Link
                to="/dashboard/inventory"
                className="shrink-0 rounded-lg border border-primary px-3.5 py-1.5 text-[12px] font-semibold text-primary"
              >
                Review
              </Link>
            )}
          </div>
        ))}
        {!isLoading && list.length === 0 && <EmptyNote>Nothing here.</EmptyNote>}
      </div>
    </div>
  );
}
