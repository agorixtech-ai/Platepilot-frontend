import { useHistory } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight, Crown } from "lucide-react";

import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import {
  CARD,
  Delta,
  EmptyNote,
  ErrorStrip,
  SectionTitle,
  StatTile,
} from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";
import { Spark } from "./Branches";

/** Branches — phone view: network totals + one ranked card per location.
    Tapping a branch scopes the app to it and opens its Sales. Desktop keeps
    the leaderboard table, charts and map (Branches.tsx). */
export default function MobileBranches() {
  const history = useHistory();
  const { locations, setBranch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);

  // Same key as Branches/useAlerts/MobileSales — shared cache.
  const snaps = useQuery({
    queryKey: ["dashboard", "location-snapshots", period],
    queryFn: () => dashboardService.getLocationSnapshots(period),
    ...DASHBOARD_LIVE_QUERY,
  });

  const cur = snaps.data?.currency ?? "AED";
  const rows = [...(snaps.data?.items ?? [])].sort((a, b) => b.revenue - a.revenue);
  const total = rows.reduce((s, r) => s + r.revenue, 0);
  const orders = rows.reduce((s, r) => s + r.orders, 0);
  const colorOf = (name: string) =>
    locations.find((l) => l.name === name)?.color ?? "var(--color-primary)";

  const open = (name: string) => {
    setBranch(name);
    history.push("/dashboard/pos");
  };

  return (
    <div className="mx-auto max-w-xl">
      {snaps.isError && <ErrorStrip onRetry={() => void snaps.refetch()} />}

      <div className="grid grid-cols-2 gap-3">
        <StatTile label="Network revenue" value={fmtCurrency(total, cur)} />
        <StatTile
          label="Orders"
          value={orders.toLocaleString()}
          sub={orders ? `${fmtCurrency(total / orders, cur)} avg` : undefined}
        />
      </div>

      <SectionTitle>Ranked by revenue</SectionTitle>
      <div className="space-y-2.5">
        {snaps.isLoading &&
          [0, 1, 2].map((i) => <Skeleton key={i} className="h-[92px] w-full rounded-2xl" />)}

        {rows.map((r, i) => {
          const share = total ? (r.revenue / total) * 100 : 0;
          const color = colorOf(r.branch);
          return (
            <button
              key={r.branch}
              type="button"
              onClick={() => open(r.branch)}
              className={cn(CARD, "block w-full p-3.5 text-left active:scale-[0.99]")}
            >
              <div className="flex items-center gap-2.5">
                <span
                  className={cn(
                    "flex h-7 w-7 shrink-0 items-center justify-center rounded-full text-[12px] font-bold",
                    i === 0 ? "bg-brand-amber text-white" : "bg-muted text-muted-foreground",
                  )}
                >
                  {i === 0 ? <Crown className="h-3.5 w-3.5" /> : i + 1}
                </span>
                <span className="min-w-0 flex-1">
                  <span className="flex items-center gap-1.5">
                    <span
                      className="h-2 w-2 shrink-0 rounded-full"
                      style={{ backgroundColor: color }}
                    />
                    <span className="truncate text-[14px] font-semibold text-foreground">
                      {r.branch}
                    </span>
                  </span>
                  <span className="block text-[11px] text-muted-foreground">
                    {r.orders} orders · {fmtCurrency(r.avg_order, cur)} avg
                  </span>
                </span>
                <span className="text-right">
                  <span className="block text-[14px] font-bold tabular-nums text-foreground">
                    {fmtCurrency(r.revenue, cur)}
                  </span>
                  <Delta value={r.delta_pct} />
                </span>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
              </div>

              <div className="mt-3 flex items-center gap-3">
                <div className="min-w-0 flex-1">
                  <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full"
                      style={{ width: `${share}%`, backgroundColor: color }}
                    />
                  </div>
                  <p className="mt-1 flex items-center gap-2 text-[10px] text-muted-foreground">
                    {share.toFixed(0)}% of network
                    {r.pending_issues > 0 && (
                      <span className="inline-flex items-center gap-0.5 font-semibold text-destructive">
                        <AlertTriangle className="h-3 w-3" />
                        {r.pending_issues} issue{r.pending_issues !== 1 ? "s" : ""}
                      </span>
                    )}
                  </p>
                </div>
                <Spark values={r.sparkline} color={color} />
              </div>
            </button>
          );
        })}

        {!snaps.isLoading && rows.length === 0 && (
          <EmptyNote>Locations will appear here once POS sales are synced.</EmptyNote>
        )}
      </div>
    </div>
  );
}
