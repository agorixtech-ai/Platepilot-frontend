import { useMemo, useSyncExternalStore } from "react";
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

// ── Acknowledged alerts ─────────────────────────────────────────────────────
// ponytail: acknowledgements live in this device's localStorage; move to a
// backend table when acks must sync across devices/team members.
// One shared store so the bell, Home card and Alerts tab always agree.
const ACK_KEY = "platepielet_acked_alerts";
const ACK_EVENT = "platepielet:acks";
let memAcks: string | null = null; // used only if localStorage is blocked

const readRaw = () => {
  if (memAcks !== null) return memAcks;
  try {
    return localStorage.getItem(ACK_KEY) ?? "[]";
  } catch {
    return "[]";
  }
};
const subscribe = (cb: () => void) => {
  window.addEventListener(ACK_EVENT, cb);
  window.addEventListener("storage", cb);
  return () => {
    window.removeEventListener(ACK_EVENT, cb);
    window.removeEventListener("storage", cb);
  };
};

function toggleAck(id: string) {
  let ids: string[];
  try {
    ids = JSON.parse(readRaw());
  } catch {
    ids = [];
  }
  const next = ids.includes(id) ? ids.filter((x) => x !== id) : [...ids, id];
  const raw = JSON.stringify(next);
  try {
    localStorage.setItem(ACK_KEY, raw);
    memAcks = null;
  } catch {
    memAcks = raw;
  }
  window.dispatchEvent(new Event(ACK_EVENT));
}

/** Actionable alerts derived client-side from the live dashboard endpoints
    (stock levels, food cost, waste variance, branch sales). Query keys match
    Overview/Inventory/Branches so the cache is shared.

    Trend-type alerts (food cost, sales, waste, branch sales) compare stable
    windows — week / month — never the selected day, because a single day of
    purchases vs sales swings wildly and would flood the feed with noise. */
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
  // Headline metrics for the selected period (Home hero).
  const metrics = useQuery({
    queryKey: ["dashboard", "metrics", period, branch],
    queryFn: () => dashboardService.getMetrics(period, branch),
    enabled: can("overview", "pos"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const week = useQuery({
    queryKey: ["dashboard", "metrics", "week", branch],
    queryFn: () => dashboardService.getMetrics("week", branch),
    enabled: can("overview", "pos"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const waste = useQuery({
    queryKey: ["dashboard", "waste-composition", "month", branch],
    queryFn: () => dashboardService.getWasteComposition("month", branch, 10),
    enabled: can("overview", "inventory", "menu"),
    ...DASHBOARD_LIVE_QUERY,
  });
  const locations = useQuery({
    queryKey: ["dashboard", "location-snapshots", "week"],
    queryFn: () => dashboardService.getLocationSnapshots("week"),
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

  const w = week.data;
  if (w?.food_cost_pp_delta != null && w.food_cost_pp_delta >= 1) {
    alerts.push({
      id: "food-cost:week",
      severity: "warning",
      kind: "Food Cost Alert",
      title: `Food cost up ${w.food_cost_pp_delta.toFixed(1)} pts to ${w.food_cost_pct.toFixed(1)}%`,
      detail: w.compare_label,
      to: "/dashboard/food-cost",
      stat: { label: "Food Cost", value: `${w.food_cost_pct.toFixed(1)}%` },
    });
  }
  if (w?.total_sales_delta_pct != null && w.total_sales_delta_pct >= 10) {
    alerts.push({
      id: "sales-up:week",
      severity: "opportunity",
      kind: "Sales Opportunity",
      title: `Sales up ${w.total_sales_delta_pct.toFixed(0)}%`,
      detail: w.compare_label,
      to: "/dashboard/pos",
      stat: { label: "Sales Change", value: `↑${w.total_sales_delta_pct.toFixed(0)}%` },
    });
  }

  const topWaste = waste.data?.items[0];
  if (topWaste && topWaste.cost > 0) {
    alerts.push({
      id: `waste:${topWaste.name}:month`,
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
      id: `branch:${l.branch}:week`,
      severity: "critical",
      kind: "Branch Alert",
      title: `${l.branch} sales down ${Math.abs(l.delta_pct).toFixed(0)}%`,
      detail: "vs previous week",
      to: "/dashboard/branches",
      stat: { label: "Sales Change", value: `↓${Math.abs(l.delta_pct).toFixed(0)}%` },
    });
  }

  alerts.sort((a, b) => RANK[a.severity] - RANK[b.severity]);

  const raw = useSyncExternalStore(subscribe, readRaw, () => "[]");
  const acked = useMemo(() => {
    try {
      return new Set<string>(JSON.parse(raw));
    } catch {
      return new Set<string>();
    }
  }, [raw]);
  const openAlerts = alerts.filter((a) => !acked.has(a.id));

  return {
    /** every derived alert, acknowledged or not */
    alerts,
    /** alerts nobody has acknowledged — the number every screen should show */
    openAlerts,
    acked,
    toggleAck,
    metrics: metrics.data,
    isLoading: stock.isLoading || metrics.isLoading,
    isError: stock.isError || metrics.isError,
    refetch: () => {
      void stock.refetch();
      void metrics.refetch();
      void week.refetch();
      void waste.refetch();
      void locations.refetch();
    },
  };
}
