import { useEffect, useRef, useState } from "react";
import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { AlertTriangle, ChevronRight, Package, RefreshCw, XCircle } from "lucide-react";

import { cn } from "@/lib/utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { dashboardService, type StockItem } from "@/services/dashboardService";
import { useBranchFilter } from "@/contexts/BranchFilterContext";
import { DASHBOARD_LIVE_QUERY } from "@/components/dashboard/shared";

const SEVERITY = {
  critical: {
    label: "Critical",
    icon: XCircle,
    rail: "border-l-destructive",
    chip: "bg-destructive-soft text-destructive",
    tint: "text-destructive",
    detail: (stock: number) => (stock <= 0 ? "out of stock" : "below safety level"),
  },
  low: {
    label: "Low",
    icon: AlertTriangle,
    rail: "border-l-warning",
    chip: "bg-warning-soft text-warning",
    tint: "text-warning",
    detail: () => "below 5 units",
  },
} as const;

const MAX_ROWS = 5;
/** how long a newly-raised alert keeps its "New" flash */
const FLASH_MS = 15_000;

export function timeAgo(ms: number, now = Date.now()): string {
  const s = Math.max(0, Math.round((now - ms) / 1000));
  if (s < 60) return `${s}s ago`;
  if (s < 3600) return `${Math.floor(s / 60)}m ago`;
  return `${Math.floor(s / 3600)}h ago`;
}

/** Items whose status changed into critical/low since the previous poll. */
export function raisedSince(prev: Map<string, StockItem["status"]>, items: StockItem[]): string[] {
  return items.filter((i) => i.status !== "ok" && prev.get(i.item) !== i.status).map((i) => i.item);
}

export function InventoryAlertsCard({ className }: { className?: string }) {
  const { branch } = useBranchFilter();

  const { data, isLoading, isError, isFetching, refetch, dataUpdatedAt } = useQuery({
    queryKey: ["dashboard", "stock-items", branch],
    queryFn: () => dashboardService.getStockItems(branch, 50),
    ...DASHBOARD_LIVE_QUERY,
  });

  // Re-render every second so "updated Xs ago" actually ticks (the poll itself is 60s).
  const [, tick] = useState(0);
  useEffect(() => {
    const id = setInterval(() => tick((n) => n + 1), 1000);
    return () => clearInterval(id);
  }, []);

  // Flag items whose status changed since the previous poll — that's what makes
  // this read as a feed rather than a list. First load is never "new".
  const seen = useRef<Map<string, StockItem["status"]> | null>(null);
  const [fresh, setFresh] = useState<string[]>([]);
  useEffect(() => {
    if (!data) return;
    const prev = seen.current;
    seen.current = new Map(data.items.map((i) => [i.item, i.status]));
    if (!prev) return;
    const raised = raisedSince(prev, data.items);
    if (!raised.length) return;
    setFresh(raised);
    const id = setTimeout(() => setFresh([]), FLASH_MS);
    return () => clearTimeout(id);
  }, [data]);

  const alerts = (data?.items ?? []).filter(
    (r): r is StockItem & { status: keyof typeof SEVERITY } => r.status !== "ok",
  );
  const criticalCount = alerts.filter((r) => r.status === "critical").length;
  const shown = alerts.slice(0, MAX_ROWS);
  const live = criticalCount > 0 ? "bg-destructive" : alerts.length ? "bg-warning" : "bg-success";

  return (
    <Card
      className={cn("flex h-full flex-col border border-border/60 bg-card shadow-sm", className)}
    >
      <CardHeader className="border-b border-border/40 px-4 pb-2.5 pt-4">
        <div className="flex items-center justify-between gap-2">
          <div className="flex min-w-0 items-center gap-2">
            <span className="relative flex h-2 w-2 shrink-0">
              <span
                className={cn(
                  "absolute inline-flex h-full w-full animate-ping rounded-full opacity-75",
                  live,
                )}
              />
              <span className={cn("relative inline-flex h-2 w-2 rounded-full", live)} />
            </span>
            <span className="text-[9px] font-bold uppercase tracking-widest text-muted-foreground">
              Live
            </span>
            <CardTitle className="truncate text-[12px] font-bold text-foreground">
              Inventory Alerts
            </CardTitle>
          </div>
          {alerts.length > 0 && (
            <Badge
              variant="outline"
              className={cn(
                "shrink-0 border-0 text-[10px] font-bold tabular-nums",
                criticalCount > 0
                  ? "bg-destructive-soft text-destructive"
                  : "bg-warning-soft text-warning",
              )}
            >
              {alerts.length}
            </Badge>
          )}
        </div>
        <p className="mt-1 truncate text-[10px] text-muted-foreground">
          {isLoading ? (
            "Checking Tally stock levels…"
          ) : isError ? (
            <span className="text-destructive">Stock feed unavailable</span>
          ) : (
            <>
              {criticalCount} critical · {alerts.length - criticalCount} low ·{" "}
              <span className="tabular-nums">updated {timeAgo(dataUpdatedAt)}</span>
              {isFetching && " · syncing"}
            </>
          )}
        </p>
      </CardHeader>

      <CardContent className="flex flex-1 flex-col px-4 pb-4 pt-3">
        {isLoading ? (
          <div className="space-y-2">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-[52px] animate-pulse rounded-lg bg-secondary" />
            ))}
          </div>
        ) : isError ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-2 py-6 text-center">
            <AlertTriangle className="h-5 w-5 text-destructive/70" />
            <p className="text-[11.5px] font-medium text-muted-foreground">
              Could not reach the stock feed
            </p>
            <Button
              variant="outline"
              size="sm"
              className="h-7 gap-1.5 text-[10px]"
              onClick={() => refetch()}
            >
              <RefreshCw className={cn("h-3 w-3", isFetching && "animate-spin")} />
              Retry
            </Button>
          </div>
        ) : !alerts.length ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-1.5 py-6 text-center">
            <Package className="h-5 w-5 text-muted-foreground/50" />
            <p className="text-[11.5px] font-medium text-muted-foreground">
              No active stock alerts
            </p>
            <p className="text-[10px] text-muted-foreground/70">
              All tracked items are within healthy levels
            </p>
          </div>
        ) : (
          <>
            <ul className="flex-1 space-y-2">
              {shown.map((row, i) => {
                const cfg = SEVERITY[row.status];
                const isFresh = fresh.includes(row.item);
                return (
                  <li key={row.item}>
                    <Link
                      to={`/dashboard/inventory?q=${encodeURIComponent(row.item)}`}
                      className={cn(
                        "group flex animate-fade-in-up items-center gap-2.5 rounded-lg border border-l-2 border-border/40 bg-secondary/20 px-2.5 py-2 transition-colors hover:bg-secondary/50",
                        cfg.rail,
                        isFresh && "ring-1 ring-primary/40",
                        `stagger-${i + 1}`,
                      )}
                    >
                      <cfg.icon className={cn("h-4 w-4 shrink-0", cfg.tint)} />
                      <div className="min-w-0 flex-1">
                        <div className="flex items-center gap-1.5">
                          <span
                            className={cn(
                              "rounded px-1.5 py-px text-[8px] font-bold uppercase tracking-wider",
                              cfg.chip,
                            )}
                          >
                            {cfg.label}
                          </span>
                          {isFresh && (
                            <span className="rounded bg-primary/15 px-1.5 py-px text-[8px] font-bold uppercase tracking-wider text-primary">
                              New
                            </span>
                          )}
                        </div>
                        <p className="mt-0.5 truncate text-[11px] font-semibold text-foreground">
                          {row.item}
                        </p>
                        <p className="truncate text-[10px] text-muted-foreground">
                          <span className="tabular-nums">
                            {row.current_stock <= 0 ? "0" : row.current_stock.toFixed(1)}
                          </span>{" "}
                          units left · {cfg.detail(row.current_stock)}
                        </p>
                      </div>
                      <ChevronRight className="h-3.5 w-3.5 shrink-0 text-muted-foreground/40 transition-colors group-hover:text-primary" />
                    </Link>
                  </li>
                );
              })}
            </ul>

            <Link
              to={
                criticalCount > 0 ? "/dashboard/inventory?status=critical" : "/dashboard/inventory"
              }
              className="mt-2.5 flex items-center justify-between rounded-lg border border-border/40 px-2.5 py-2 text-[10px] font-semibold text-muted-foreground transition-colors hover:border-primary/30 hover:text-primary"
            >
              View all {alerts.length} alert{alerts.length === 1 ? "" : "s"} in Inventory
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </>
        )}
      </CardContent>
    </Card>
  );
}
