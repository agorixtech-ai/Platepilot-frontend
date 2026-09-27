import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import {
  CARD,
  EmptyNote,
  ErrorStrip,
  SectionTitle,
  StatTile,
  SyncNote,
} from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

/** Waste = purchases (Tally) beyond what sold dishes' recipes needed (POS). */
export default function Waste() {
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);

  const {
    data: w,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "waste-composition", period, branch],
    queryFn: () => dashboardService.getWasteComposition(period, branch, 10),
    ...DASHBOARD_LIVE_QUERY,
  });

  return (
    <div className="mx-auto max-w-xl">
      {isError && (
        <div className="mb-3">
          <ErrorStrip onRetry={() => void refetch()} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Waste Cost"
          value={w ? fmtCurrency(w.total_cost, w.currency) : "…"}
          tone="critical"
        />
        <StatTile label="Ingredients Over Recipe" value={w?.over_count ?? "…"} />
      </div>

      {!!w?.totals.length && (
        <>
          <SectionTitle>Efficiency by unit</SectionTitle>
          <div className="grid grid-cols-2 gap-3">
            {w.totals.map((t) => (
              <StatTile
                key={t.unit}
                label={`${t.unit} · ${t.variance_qty.toFixed(1)} over`}
                value={`${t.efficiency_pct.toFixed(0)}%`}
                tone={t.efficiency_pct >= 90 ? "success" : "warning"}
                sub={fmtCurrency(t.cost, w.currency)}
              />
            ))}
          </div>
        </>
      )}

      <SectionTitle>Top Waste Items</SectionTitle>
      <div className="space-y-2.5">
        {isLoading && <Skeleton className="h-20 w-full rounded-2xl" />}
        {w?.items.map((i) => (
          <div key={i.name} className={`${CARD} p-3.5`}>
            <div className="flex items-center justify-between gap-3">
              <p className="min-w-0 truncate text-[14px] font-bold text-foreground">{i.name}</p>
              <p className="shrink-0 text-[13px] font-bold text-destructive">
                {fmtCurrency(i.cost, w.currency)}
              </p>
            </div>
            <p className="mt-0.5 text-[12px] text-muted-foreground">
              Bought {i.bought_qty.toFixed(1)} {i.unit} · needed {i.needed_qty.toFixed(1)} {i.unit}{" "}
              · {i.pct.toFixed(0)}% of waste
            </p>
          </div>
        ))}
        {!isLoading && !w?.items.length && (
          <EmptyNote>No waste detected — purchases match recipe usage.</EmptyNote>
        )}
      </div>

      <SyncNote lastSync={w?.last_sync} />
    </div>
  );
}
