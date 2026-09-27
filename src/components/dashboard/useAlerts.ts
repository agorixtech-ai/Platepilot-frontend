import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { useDateRange, rangeToPeriod } from "@/contexts/DateRangeContext";
import { DASHBOARD_LIVE_QUERY, fmtCurrency } from "@/components/dashboard/shared";
import { canOpenPage } from "@/lib/auth";

export type AlertSeverity = "critical" | "warning" | "opportunity";

export interface AppAlert {
  id: string;
  severity: AlertSeverity;
  kind: string;
  title: string;
  detail: string;
  to: string;
  /** Compact stat shown on the Alerts page (e.g. "Current Stock" → "0 units"). */
  stat: { label: string; value: string };
}

const RANK: Record<AlertSeverity, number> = { critical: 0, warning: 1, opportunity: 2 };

/** Actionable alerts derived client-side from the live dashboard endpoints
    (stock levels, food cost, waste variance, branch sales). Query keys match
    Overview/Inventory/Branches so the cache is shared. */
export function useAlerts() {
  const { branch } = useBranchFilter();
  const { range } = useDateRange();
  const period = rangeToPeriod(range);
  const can = (...keys: string[]) => keys.some((k) => canOpenPage(k));

  const stock = useQuery({
    queryKey: ["dashboard", "stock-items", branch],
    queryFn: () => dashboardService.getStockItems(branch, 50),
    enabled: can("overview", "inventory", "tally"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const metrics = useQuery({
    queryKey: ["dashboard", "metrics", period, branch],
    queryFn: () => dashboardService.getMetrics(period, branch),
    enabled: can("overview", "pos"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const waste = useQuery({
    queryKey: ["dashboard", "waste-composition", period, branch],
    queryFn: () => dashboardService.getWasteComposition(period, branch, 10),
    enabled: can("overview", "inventory", "menu"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const locations = useQuery({
    queryKey: ["dashboard", "location-snapshots", period],
    queryFn: () => dashboardService.getLocationSnapshots(period),
    enabled: can("overview", "branches"),
    ...DASHBOARD_LIVE_QUERY,
  });

  const alerts: AppAlert[] = [];

  for (const s of stock.data?.items ?? []) {
    if (s.status === "ok") continue;
    alerts.push({
      id: `stock:${s.item}:${s.status}`,
      severity: s.status === "critical" ? "critical" : "warning",
      kind: s.status === "critical" ? "Critical Stock" : "Low Stock",
      title: s.item,
      detail: s.current_stock <= 0 ? "Out of stock" : `${s.current_stock} units left`,
      to: "/dashboard/purchasing",
      stat: { label: "Current Stock", value: `${Math.max(0, s.current_stock)} units` },
    });
  }

  const m = metrics.data;
  if (m?.food_cost_pp_delta != null && m.food_cost_pp_delta >= 1) {
    alerts.push({
      id: `food-cost:${period}`,
      severity: "warning",
      kind: "Food Cost Alert",
      title: `Food cost up ${m.food_cost_pp_delta.toFixed(1)} pts to ${m.food_cost_pct.toFixed(1)}%`,
      detail: m.compare_label,
      to: "/dashboard/food-cost",
      stat: { label: "Food Cost", value: `${m.food_cost_pct.toFixed(1)}%` },
    });
  }
  if (m?.total_sales_delta_pct != null && m.total_sales_delta_pct >= 10) {
    alerts.push({
      id: `sales-up:${period}`,
      severity: "opportunity",
      kind: "Sales Opportunity",
      title: `Sales up ${m.total_sales_delta_pct.toFixed(0)}%`,
      detail: m.compare_label,
      to: "/dashboard/pos",
      stat: { label: "Sales Change", value: `↑${m.total_sales_delta_pct.toFixed(0)}%` },
    });
  }

  const topWaste = waste.data?.items[0];
  if (topWaste && topWaste.cost > 0) {
    alerts.push({
      id: `waste:${topWaste.name}:${period}`,
      severity: "warning",
      kind: "Waste Alert",
      title: `${topWaste.name} over-purchased by ${topWaste.qty.toFixed(1)} ${topWaste.unit}`,
      detail: `Impact: ${fmtCurrency(topWaste.cost, waste.data!.currency)}`,
      to: "/dashboard/waste",
      stat: { label: "Waste Impact", value: fmtCurrency(topWaste.cost, waste.data!.currency) },
    });
  }

  for (const l of locations.data?.items ?? []) {
    if (l.delta_pct == null || l.delta_pct > -10) continue;
    if (branch !== "all" && l.branch !== branch) continue;
    alerts.push({
      id: `branch:${l.branch}:${period}`,
      severity: "critical",
      kind: "Branch Alert",
      title: `${l.branch} sales down ${Math.abs(l.delta_pct).toFixed(0)}%`,
      detail: "vs previous period",
      to: "/dashboard/branches",
      stat: { label: "Sales Change", value: `↓${Math.abs(l.delta_pct).toFixed(0)}%` },
    });
  }

  alerts.sort((a, b) => RANK[a.severity] - RANK[b.severity]);

  return {
    alerts,
    metrics: m,
    isLoading: stock.isLoading || metrics.isLoading,
    isError: stock.isError || metrics.isError,
    refetch: () => {
      void stock.refetch();
      void metrics.refetch();
      void waste.refetch();
      void locations.refetch();
    },
  };
}
