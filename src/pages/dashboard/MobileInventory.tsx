import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { cn } from "@/lib/utils";
import { dashboardService, type StockItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";
import { ItemAvatar } from "@/components/dashboard/ItemAvatar";
import { EmptyNote, ErrorStrip, ListGroup, Segments } from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

type Filter = "all" | StockItem["status"];

const STATUS = {
  critical: { label: "Critical", chip: "bg-destructive-soft text-destructive" },
  low: { label: "Low", chip: "bg-warning-soft text-warning-dark" },
  ok: { label: "Healthy", chip: "bg-success-soft text-success" },
} as const;

/** Inventory — phone view: health tiles + filterable stock list (lowest first). */
export default function MobileInventory() {
  const { branch } = useBranchFilter();
  const [filter, setFilter] = useState<Filter>("all");

  const stock = useQuery({
    queryKey: ["dashboard", "stock-items", branch],
    queryFn: () => dashboardService.getStockItems(branch, 50),
    ...DASHBOARD_LIVE_QUERY,
  });
  const summary = useQuery({
    queryKey: ["dashboard", "stock-summary", branch],
    queryFn: () => dashboardService.getStockSummary(branch),
    ...DASHBOARD_LIVE_QUERY,
  });

  const items = stock.data?.items ?? [];
  const critical = items.filter((i) => i.status === "critical").length;
  const low = items.filter((i) => i.status === "low").length;
  const tracked = summary.data?.total_items ?? items.length;
  const healthy = Math.max(0, tracked - critical - low);
  const list = filter === "all" ? items : items.filter((i) => i.status === filter);

  const tiles = [
    { label: "Items Tracked", value: tracked, cls: "bg-success-soft text-success" },
    { label: "Critical", value: critical, cls: "bg-destructive-soft text-destructive" },
    { label: "Low", value: low, cls: "bg-warning-soft text-warning-dark" },
    { label: "Healthy", value: healthy, cls: "bg-success-soft text-success" },
  ];

  return (
    <div className="mx-auto max-w-xl">
      {stock.isError && (
        <div className="mb-3">
          <ErrorStrip onRetry={() => void stock.refetch()} />
        </div>
      )}

      <div className="grid grid-cols-4 gap-2">
        {tiles.map((t) => (
          <div key={t.label} className={cn("rounded-2xl px-2 py-3 text-center", t.cls)}>
            <p className="text-[22px] font-bold leading-none">{stock.isLoading ? "–" : t.value}</p>
            <p className="mt-1 text-[10px] font-medium">{t.label}</p>
          </div>
        ))}
      </div>

      <Segments<Filter>
        className="mt-4"
        value={filter}
        onChange={setFilter}
        options={[
          { value: "all", label: "All" },
          { value: "critical", label: "Critical" },
          { value: "low", label: "Low" },
          { value: "ok", label: "Healthy" },
        ]}
      />

      <div className="mt-3">
        {stock.isLoading ? (
          <Skeleton className="h-48 w-full rounded-2xl" />
        ) : list.length === 0 ? (
          <EmptyNote>No items here — stock appears once Tally vouchers are synced.</EmptyNote>
        ) : (
          <ListGroup>
            {list.map((i) => (
              <div key={i.item} className="flex items-center gap-3 px-3.5 py-3">
                <ItemAvatar name={i.item} size="lg" />
                <div className="min-w-0 flex-1">
                  <p className="truncate text-[13px] font-semibold text-foreground">{i.item}</p>
                  <p className="text-[11px] text-muted-foreground">
                    {i.current_stock <= 0 ? "Out of stock" : `${i.current_stock} in stock`}
                  </p>
                </div>
                <span
                  className={cn(
                    "rounded-full px-2.5 py-0.5 text-[10px] font-semibold",
                    STATUS[i.status].chip,
                  )}
                >
                  {STATUS[i.status].label}
                </span>
              </div>
            ))}
          </ListGroup>
        )}
      </div>
    </div>
  );
}
