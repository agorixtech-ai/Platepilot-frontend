import { useQuery } from "@tanstack/react-query";

import { dashboardService, type WasteManagementItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
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

const qty = (n: number, unit: string) =>
  `${n.toLocaleString(undefined, { maximumFractionDigits: 1 })} ${unit}`;

/** Bought → used (bought − remaining) → should have used (recipes) → waste. */
function Row({ i, currency }: { i: WasteManagementItem; currency: string }) {
  const flagged = i.status === "over";
  const tracked = i.status === "over" || i.status === "ok";
  const cell = (label: string, value: string, strong = false) => (
    <div className="min-w-0">
      <p className="text-[10px] uppercase tracking-wide text-muted-foreground">{label}</p>
      <p className={`truncate text-[13px] ${strong ? "font-bold" : "font-medium"} text-foreground`}>
        {value}
      </p>
    </div>
  );
  return (
    <div className={`${CARD} p-3.5`}>
      <div className="flex items-center justify-between gap-3">
        <p className="min-w-0 truncate text-[14px] font-bold text-foreground">{i.name}</p>
        {tracked ? (
          <p
            className={`shrink-0 text-[13px] font-bold ${flagged ? "text-destructive" : "text-emerald-600"}`}
          >
            {flagged ? `${fmtCurrency(i.waste_cost, currency)} · ` : ""}
            {i.waste_pct.toFixed(0)}% waste
          </p>
        ) : (
          <p className="shrink-0 text-[12px] font-medium text-muted-foreground">
            {i.status === "no_recipe" ? "No recipe match" : "Stock doesn't tie out"}
          </p>
        )}
      </div>
      <div className="mt-2 grid grid-cols-4 gap-2">
        {cell("Bought", qty(i.bought, i.unit))}
        {cell("Remaining", qty(i.remaining, i.unit))}
        {cell("Used", qty(i.used, i.unit))}
        {cell("Should use", qty(i.should_use, i.unit), true)}
      </div>
      {tracked && i.waste > 0 && (
        <p className="mt-2 text-[12px] text-muted-foreground">
          Used {qty(i.waste, i.unit)} more than recipes needed.
        </p>
      )}
    </div>
  );
}

export default function Waste() {
  const { branch } = useBranchFilter();
  const {
    data: w,
    isLoading,
    isError,
    refetch,
  } = useQuery({
    queryKey: ["dashboard", "waste-management", branch],
    queryFn: () => dashboardService.getWasteManagement(branch),
    ...DASHBOARD_LIVE_QUERY,
  });

  const tracked = w?.items.filter((i) => i.status === "over" || i.status === "ok") ?? [];
  const unclear =
    w?.items.filter((i) => i.status === "unreconciled" || i.status === "no_recipe") ?? [];

  return (
    <div className="mx-auto max-w-xl">
      {isError && (
        <div className="mb-3">
          <ErrorStrip onRetry={() => void refetch()} />
        </div>
      )}

      <div className="grid grid-cols-2 gap-3">
        <StatTile
          label="Waste cost"
          value={w ? fmtCurrency(w.total_waste_cost, w.currency) : "…"}
          tone="critical"
          sub="last 30 days · beyond recipes"
        />
        <StatTile
          label="Ingredients flagged"
          value={w?.flagged_count ?? "…"}
          sub={w ? `over ${w.tolerance_pct}% waste` : undefined}
          tone={w && w.flagged_count > 0 ? "warning" : "success"}
        />
      </div>

      <p className="mt-3 text-[12px] text-muted-foreground">
        Last 30 days. Used = bought − remaining stock. Should use = dishes sold × recipe quantity.
        Waste is the difference.
      </p>

      <SectionTitle>Bought vs used vs recipe</SectionTitle>
      <div className="space-y-2.5">
        {isLoading && <Skeleton className="h-24 w-full rounded-2xl" />}
        {w && tracked.map((i) => <Row key={i.name} i={i} currency={w.currency} />)}
        {w && !isLoading && !tracked.length && (
          <EmptyNote>No ingredient could be reconciled against recipes yet.</EmptyNote>
        )}
      </div>

      {!!unclear.length && w && (
        <>
          <SectionTitle>Needs checking</SectionTitle>
          <p className="mb-2 text-[12px] text-muted-foreground">
            Stock taken out exceeds stock received, or the item isn&apos;t in a sold recipe, so
            waste can&apos;t be worked out reliably.
          </p>
          <div className="space-y-2.5">
            {unclear.map((i) => (
              <Row key={i.name} i={i} currency={w.currency} />
            ))}
          </div>
        </>
      )}

      <SyncNote lastSync={w?.as_of} />
    </div>
  );
}
