import { useSyncExternalStore, type ReactNode } from "react";
import { Link } from "react-router-dom";
import { useQueryClient } from "@tanstack/react-query";
import { AlertTriangle, ArrowDown, ArrowUp, ChevronRight, Clock, TrendingUp, type LucideIcon } from "lucide-react";
import RefreshIcon from "@/components/ui/icons/refresh-icon";

import { cn } from "@/lib/utils";
import type { AlertSeverity, AppAlert } from "@/components/dashboard/useAlerts";
import type { ItemImage } from "@/services/dashboardService";

/* Phone-first building blocks (Home, Insights, Alerts, Food Cost, Purchasing,
   Waste, More …) — white cards on the pale canvas, brand-green accents, per the
   PlatePielet mobile design. Tailwind + theme tokens only. */

export const CARD = "rounded-2xl border border-border/60 bg-card shadow-card";

/** ▲/▼ chip. `good` says which direction is favourable (food cost: "down"). */
export function Delta({
  value,
  suffix = "%",
  good = "up",
  className,
}: {
  value: number | null | undefined;
  suffix?: string;
  good?: "up" | "down";
  className?: string;
}) {
  if (value == null) return null;
  const up = value >= 0;
  const favourable = up === (good === "up");
  const Icon = up ? ArrowUp : ArrowDown;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 text-[11px] font-semibold",
        favourable ? "text-success" : "text-destructive",
        className,
      )}
    >
      <Icon className="h-3 w-3" strokeWidth={2.6} />
      {Math.abs(value).toFixed(1).replace(/\.0$/, "")}
      {suffix}
    </span>
  );
}

const SEVERITY: Record<
  AlertSeverity,
  { icon: LucideIcon; ring: string; solid: string; title: string }
> = {
  critical: {
    icon: AlertTriangle,
    ring: "bg-destructive-soft",
    solid: "bg-destructive text-destructive-foreground",
    title: "text-destructive",
  },
  warning: {
    icon: AlertTriangle,
    ring: "bg-warning-soft",
    solid: "bg-warning text-warning-foreground",
    title: "text-warning-dark",
  },
  opportunity: {
    icon: TrendingUp,
    ring: "bg-success-soft",
    solid: "bg-success text-success-foreground",
    title: "text-success",
  },
};

export function AlertRow({ alert, action }: { alert: AppAlert; action?: ReactNode }) {
  const s = SEVERITY[alert.severity];
  const Icon = s.icon;
  return (
    <div className={cn(CARD, "flex items-center gap-3 p-3")}>
      <span
        className={cn("flex h-11 w-11 shrink-0 items-center justify-center rounded-full", s.ring)}
      >
        <span className={cn("flex h-7 w-7 items-center justify-center rounded-full", s.solid)}>
          <Icon className="h-4 w-4" strokeWidth={2.4} />
        </span>
      </span>
      <Link to={alert.to} className="min-w-0 flex-1">
        <p className={cn("text-[13px] font-bold", s.title)}>{alert.kind}</p>
        <p className="truncate text-[13px] text-foreground">{alert.title}</p>
        <p className="truncate text-[11px] text-muted-foreground">{alert.detail}</p>
      </Link>
      {action ?? (
        <Link to={alert.to} aria-label={`Open ${alert.kind}`}>
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      )}
    </div>
  );
}

export function StatTile({
  label,
  value,
  sub,
  tone = "neutral",
  to,
  className,
}: {
  label: string;
  value: ReactNode;
  sub?: ReactNode;
  tone?: "neutral" | "critical" | "warning" | "success";
  to?: string;
  className?: string;
}) {
  const valueTone = {
    neutral: "text-foreground",
    critical: "text-destructive",
    warning: "text-warning-dark",
    success: "text-success",
  }[tone];
  const body = (
    <div className={cn(CARD, "h-full p-3.5", className)}>
      <p className="text-[11px] font-medium text-muted-foreground">{label}</p>
      <p className={cn("mt-1 text-[22px] font-bold leading-none tracking-tight", valueTone)}>
        {value}
      </p>
      {sub != null && <div className="mt-1.5 text-[11px] text-muted-foreground">{sub}</div>}
    </div>
  );
  return to ? <Link to={to}>{body}</Link> : body;
}

/** Green-tinted rounded icon square used by every list row. */
export function IconSquare({ icon: Icon, className }: { icon: LucideIcon; className?: string }) {
  return (
    <span
      className={cn(
        "flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-primary-soft text-primary",
        className,
      )}
    >
      <Icon className="h-5 w-5" />
    </span>
  );
}

/** One row of a ListGroup. Renders a Link, a button, or (disabled) a "Soon" tag. */
export function ListRow({
  icon,
  title,
  sub,
  to,
  onClick,
  disabled,
  trailing,
}: {
  icon: LucideIcon;
  title: string;
  sub?: string;
  to?: string;
  onClick?: () => void;
  disabled?: boolean;
  trailing?: ReactNode;
}) {
  const inner = (
    <>
      <IconSquare icon={icon} />
      <span className="min-w-0 flex-1">
        <span className="block text-[14px] font-semibold text-foreground">{title}</span>
        {sub && <span className="block truncate text-[12px] text-muted-foreground">{sub}</span>}
      </span>
      {trailing ??
        (disabled ? (
          <span className="rounded-full bg-muted px-2 py-0.5 text-[10px] font-semibold text-muted-foreground">
            Soon
          </span>
        ) : (
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        ))}
    </>
  );
  const cls = cn(
    "flex w-full items-center gap-3 px-3.5 py-3 text-left",
    disabled ? "opacity-60" : "active:bg-muted/60",
  );
  if (to && !disabled)
    return (
      <Link to={to} className={cls}>
        {inner}
      </Link>
    );
  return (
    <button type="button" className={cls} onClick={onClick} disabled={disabled}>
      {inner}
    </button>
  );
}

export function ListGroup({ children, className }: { children: ReactNode; className?: string }) {
  return (
    <div className={cn(CARD, "divide-y divide-border/60 overflow-hidden", className)}>
      {children}
    </div>
  );
}

/** Segmented pill tabs (Open / Acknowledged, Buy now / Coming soon …). */
export function Segments<T extends string>({
  value,
  onChange,
  options,
  className,
}: {
  value: T;
  onChange: (v: T) => void;
  options: { value: T; label: string }[];
  className?: string;
}) {
  return (
    <div className={cn("flex gap-1.5", className)} role="tablist">
      {options.map((o) => (
        <button
          key={o.value}
          type="button"
          role="tab"
          aria-selected={value === o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "flex-1 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
            value === o.value
              ? "border-primary bg-primary text-primary-foreground"
              : "border-border/70 bg-card text-muted-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function SectionTitle({ children, right }: { children: ReactNode; right?: ReactNode }) {
  return (
    <div className="mb-2 mt-5 flex items-center justify-between">
      <h2 className="text-[15px] font-bold text-foreground">{children}</h2>
      {right}
    </div>
  );
}

export function EmptyNote({ children }: { children: ReactNode }) {
  return (
    <div className="rounded-2xl border border-dashed border-border p-6 text-center text-sm text-muted-foreground">
      {children}
    </div>
  );
}

/** Pixabay's terms require a visible credit wherever its photos appear.
    Renders only once at least one item photo has actually loaded. */
export function PhotoCredit() {
  const qc = useQueryClient();
  const hasPhotos = useSyncExternalStore(
    (notify) => qc.getQueryCache().subscribe(notify),
    () =>
      qc
        .getQueryCache()
        .findAll({ queryKey: ["dashboard", "item-image"] })
        .some((q) => !!(q.state.data as ItemImage | undefined)?.url),
  );
  if (!hasPhotos) return null;
  return (
    <p className="mt-3 text-center text-[10px] text-muted-foreground">
      Photos from{" "}
      <a
        href="https://pixabay.com"
        target="_blank"
        rel="noreferrer"
        className="underline underline-offset-2"
      >
        Pixabay
      </a>
    </p>
  );
}

/** Data syncs once a day. When the latest sale is more than a day old the backend
    reports sync_status "Stale" — say so at the top of the screen, because "Today"
    then means the last day that has data, not the calendar day. */
export function StaleBanner({ lastSync, status }: { lastSync?: string | null; status?: string }) {
  if (!lastSync || status !== "Stale") return null;
  const d = new Date(lastSync);
  const days = Math.max(1, Math.floor((Date.now() - d.getTime()) / 86_400_000));
  return (
    <div className="flex items-center gap-2 bg-warning-soft px-4 py-1.5 text-[11px] font-medium text-warning-dark">
      <Clock className="h-3.5 w-3.5 shrink-0" />
      <span>
        Showing data up to {d.toLocaleDateString([], { day: "numeric", month: "short" })} · last
        sync {days} days ago
      </span>
    </div>
  );
}

/** Data syncs once a day — every data view says how fresh it is. */
export function SyncNote({ lastSync }: { lastSync?: string | null }) {
  return (
    <p className="mt-4 text-center text-[11px] text-muted-foreground">
      {lastSync
        ? `Last synced ${new Date(lastSync).toLocaleString([], {
            day: "numeric",
            month: "short",
            hour: "2-digit",
            minute: "2-digit",
          })}`
        : "Not synced yet — data appears once POS sales are synced"}
    </p>
  );
}

export function ErrorStrip({ onRetry }: { onRetry: () => void }) {
  return (
    <div className="flex items-center justify-between gap-3 rounded-2xl bg-destructive-soft p-3 text-[12px] text-destructive">
      <span>Couldn&apos;t load this data.</span>
      <button
        type="button"
        onClick={onRetry}
        className="flex items-center gap-1 rounded-full bg-destructive px-3 py-1 font-semibold text-destructive-foreground"
      >
        <RefreshIcon className="h-3 w-3" />
        Retry
      </button>
    </div>
  );
}
