import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertCircle, Lightbulb } from "lucide-react";

import { cn } from "@/lib/utils";
import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import {
  CARD,
  EmptyNote,
  ErrorStrip,
  ListGroup,
  SectionTitle,
  StatTile,
  SyncNote,
} from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";

// ponytail: fixed target; read from tenant_settings once it stores one.
const TARGET_PCT = 30;

export default function FoodCost() {
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);

  const metrics = useQuery({
    queryKey: ["dashboard", "metrics", period, branch],
    queryFn: () => dashboardService.getMetrics(period, branch),
    ...DASHBOARD_LIVE_QUERY,
  });
  const waste = useQuery({
    queryKey: ["dashboard", "waste-composition", period, branch],
    queryFn: () => dashboardService.getWasteComposition(period, branch, 10),
    ...DASHBOARD_LIVE_QUERY,
  });

  const m = metrics.data;
  const w = waste.data;
  const over = m ? m.food_cost_pct > TARGET_PCT : false;
  const top = w?.items[0];
  const delta = m?.food_cost_pp_delta;

  return (
    <div className="mx-auto max-w-xl">
      {metrics.isError && (
        <div className="mb-3">
          <ErrorStrip onRetry={() => void metrics.refetch()} />
        </div>
      )}

      <div className={cn(CARD, "p-4")}>
        <p className="text-[12px] text-muted-foreground">Food Cost</p>
        <div className="mt-1 flex items-center justify-between">
          {metrics.isLoading ? (
            <Skeleton className="h-10 w-28" />
          ) : (
            <p className="text-[38px] font-bold leading-none tracking-tight text-foreground">
              {m ? `${m.food_cost_pct.toFixed(1)}%` : "—"}
            </p>
          )}
          {delta != null && (
            <span
              className={cn(
                "rounded-lg px-2.5 py-1 text-[12px] font-bold",
                delta > 0 ? "bg-destructive-soft text-destructive" : "bg-success-soft text-success",
              )}
            >
              {delta > 0 ? "↑" : "↓"} {Math.abs(delta).toFixed(1)}%
            </span>
          )}
        </div>
        <p className="mt-1.5 text-[12px] text-muted-foreground">Target: {TARGET_PCT}%</p>
        {over && (
          <div className="mt-3 flex gap-2 rounded-xl bg-destructive-soft p-3 text-[12px] leading-snug text-destructive">
            <AlertCircle className="h-4 w-4 shrink-0" />
            <span>
              Food cost is above target.
              {top && ` ${top.name} contributed most to the increase.`}
            </span>
          </div>
        )}
      </div>

      <div className="mt-3 grid grid-cols-2 gap-3">
        <StatTile label="Gross Margin" value={m ? `${m.gross_margin_pct.toFixed(1)}%` : "—"} />
        <StatTile
          label="Variance Cost"
          value={w ? fmtCurrency(w.total_cost, w.currency) : "—"}
          tone="warning"
          sub={w ? `${w.over_count} ingredients over recipe` : undefined}
          to="/dashboard/waste"
        />
      </div>

      <SectionTitle>Main Contributors</SectionTitle>
      {waste.isLoading ? (
        <Skeleton className="h-40 w-full rounded-2xl" />
      ) : w && w.items.length === 0 ? (
        <EmptyNote>Purchases match recipe usage — no contributors.</EmptyNote>
      ) : (
        <ListGroup>
          {w?.items.slice(0, 6).map((i) => (
            <div key={i.name} className="flex items-center gap-3 px-3.5 py-3 text-[13px]">
              <span className="min-w-0 flex-1 truncate font-medium text-foreground">{i.name}</span>
              <span className="font-semibold text-foreground">
                +{fmtCurrency(i.cost, w.currency)}
              </span>
              <span className="w-12 rounded-md bg-destructive-soft py-0.5 text-center text-[11px] font-bold text-destructive">
                ↑ {i.pct.toFixed(0)}%
              </span>
            </div>
          ))}
        </ListGroup>
      )}

      {top && (
        <div className="mt-4 flex gap-3 rounded-2xl bg-success-soft p-4">
          <Lightbulb className="h-5 w-5 shrink-0 text-success" />
          <div className="text-[13px]">
            <p className="font-bold text-foreground">Recommended Action</p>
            <p className="mt-0.5 text-muted-foreground">
              Review {top.name} portioning and ordering — {top.bought_qty.toFixed(1)} {top.unit}{" "}
              bought vs {top.needed_qty.toFixed(1)} {top.unit} needed by recipes.
            </p>
            <Link
              to="/dashboard/ai"
              className="mt-2 inline-block text-[12px] font-semibold text-primary"
            >
              Ask AI why →
            </Link>
          </div>
        </div>
      )}

      <SyncNote lastSync={m?.last_sync ?? w?.last_sync} />
    </div>
  );
}
