import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import {
  AlertTriangle,
  BarChart3,
  Check,
  CheckCircle2,
  ChevronRight,
  MapPin,
  Package,
  Percent,
  RotateCcw,
  ShoppingCart,
  Trash2,
  TrendingUp,
  type LucideIcon,
} from "lucide-react";

import { useAlerts, type AlertSeverity, type AppAlert } from "@/components/dashboard/useAlerts";
import { BranchPicker } from "@/components/dashboard/MobileHeader";
import { EmptyNote, ErrorStrip } from "@/components/dashboard/MobileUI";
import { Skeleton } from "@/components/ui/skeleton";
import { cn } from "@/lib/utils";

const ACK_KEY = "platepielet_acked_alerts";

// ponytail: acknowledgements live in this device's localStorage; move to a
// backend table when acks must sync across devices/team members.
function readAcked(): Set<string> {
  try {
    return new Set(JSON.parse(localStorage.getItem(ACK_KEY) ?? "[]"));
  } catch {
    return new Set();
  }
}

const KIND_ICON: Record<string, LucideIcon> = {
  "Critical Stock": Package,
  "Low Stock": Package,
  "Branch Alert": BarChart3,
  "Food Cost Alert": Percent,
  "Waste Alert": Trash2,
  "Sales Opportunity": TrendingUp,
};

const SEVERITY_TONE: Record<AlertSeverity, { row: string; badge: string; text: string }> = {
  critical: {
    row: "bg-destructive-soft",
    badge: "bg-destructive text-destructive-foreground",
    text: "text-destructive",
  },
  warning: {
    row: "bg-warning-soft",
    badge: "bg-warning text-warning-foreground",
    text: "text-warning-dark",
  },
  opportunity: {
    row: "bg-success-soft",
    badge: "bg-success text-success-foreground",
    text: "text-success",
  },
};

const CATEGORIES = ["All", "Critical Stock", "Low Stock", "Branch Alert"] as const;
type Category = (typeof CATEGORIES)[number];

function AlertCard({
  alert,
  acked,
  onToggle,
}: {
  alert: AppAlert;
  acked: boolean;
  onToggle: () => void;
}) {
  const tone = SEVERITY_TONE[alert.severity];
  const Icon = KIND_ICON[alert.kind] ?? AlertTriangle;
  const isStock = alert.kind === "Critical Stock" || alert.kind === "Low Stock";

  return (
    <div className={cn("rounded-2xl p-3", tone.row)}>
      <div className="flex items-center gap-3">
        <div className="relative shrink-0">
          <span className="flex h-14 w-14 items-center justify-center rounded-xl bg-card text-muted-foreground">
            <Icon className="h-6 w-6" />
          </span>
          <span
            className={cn(
              "absolute -left-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full ring-2 ring-white",
              tone.badge,
            )}
          >
            <AlertTriangle className="h-2.5 w-2.5" strokeWidth={2.5} />
          </span>
        </div>

        <Link to={alert.to} className="min-w-0 flex-1">
          <p className={cn("text-[12px] font-bold", tone.text)}>{alert.kind}</p>
          <p className="text-[15px] font-bold leading-snug text-foreground">{alert.title}</p>
          <p className="truncate text-[12px] text-muted-foreground">{alert.detail}</p>
        </Link>

        <Link to={alert.to} aria-label={`Open ${alert.kind}`} className="shrink-0">
          <ChevronRight className="h-4 w-4 text-muted-foreground" />
        </Link>
      </div>

      <div className="mt-2.5 flex items-center gap-2 pl-[68px]">
        <div className="shrink-0 rounded-xl bg-card px-2.5 py-1.5 text-center">
          <p className="text-[9px] text-muted-foreground">{alert.stat.label}</p>
          <p className={cn("text-[13px] font-bold leading-tight", tone.text)}>{alert.stat.value}</p>
        </div>
        <Link
          to={alert.to}
          className="flex flex-1 items-center justify-center gap-1.5 rounded-full border border-success/40 bg-card py-2 text-[12px] font-semibold text-success"
        >
          {isStock ? (
            <>
              <ShoppingCart className="h-3.5 w-3.5" /> Order Now
            </>
          ) : (
            <>
              <TrendingUp className="h-3.5 w-3.5" /> View Details
            </>
          )}
        </Link>
        <button
          type="button"
          onClick={onToggle}
          aria-label={acked ? "Reopen" : "Acknowledge"}
          className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-card text-muted-foreground"
        >
          {acked ? <RotateCcw className="h-3.5 w-3.5" /> : <Check className="h-3.5 w-3.5" />}
        </button>
      </div>
    </div>
  );
}

export default function Alerts() {
  const { alerts, isLoading, isError, refetch } = useAlerts();
  const [tab, setTab] = useState<"open" | "ack">("open");
  const [acked, setAcked] = useState(readAcked);
  const [category, setCategory] = useState<Category>("All");

  const toggle = (id: string) => {
    const next = new Set(acked);
    if (next.has(id)) next.delete(id);
    else next.add(id);
    setAcked(next);
    try {
      localStorage.setItem(ACK_KEY, JSON.stringify([...next]));
    } catch {
      /* storage blocked — ack lasts for this session only */
    }
  };

  const open = alerts.filter((a) => !acked.has(a.id));
  const done = alerts.filter((a) => acked.has(a.id));
  const list = tab === "open" ? open : done;

  const counts = useMemo(() => {
    const c: Record<Category, number> = {
      All: list.length,
      "Critical Stock": 0,
      "Low Stock": 0,
      "Branch Alert": 0,
    };
    for (const a of list) if (a.kind in c) c[a.kind as Category]++;
    return c;
  }, [list]);

  const filtered = category === "All" ? list : list.filter((a) => a.kind === category);

  return (
    <div className="mx-auto max-w-xl px-4 pb-4">
      {/* Header — title + subtitle + branch picker. */}
      <div className="flex items-start justify-between gap-3 pt-5 pb-4">
        <div className="min-w-0">
          <h1 className="text-[26px] font-extrabold tracking-tight text-foreground">Alerts</h1>
          <p className="mt-1 text-[13px] text-muted-foreground">
            Stay ahead of stock issues, trends and important updates.
          </p>
        </div>
        <div className="mt-1 flex shrink-0 items-center gap-1 rounded-full border border-border/70 px-3 py-2">
          <MapPin className="h-3.5 w-3.5 text-muted-foreground" />
          <BranchPicker className="text-foreground" />
        </div>
      </div>

      {isError && (
        <div className="mb-3">
          <ErrorStrip onRetry={refetch} />
        </div>
      )}

      {/* Open / Acknowledged toggle. */}
      <div className="flex gap-2">
        <button
          type="button"
          onClick={() => setTab("open")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-semibold transition-colors",
            tab === "open"
              ? "bg-success text-success-foreground"
              : "border border-border/70 bg-card text-muted-foreground",
          )}
        >
          <AlertTriangle className="h-4 w-4" /> Open ({open.length})
        </button>
        <button
          type="button"
          onClick={() => setTab("ack")}
          className={cn(
            "flex flex-1 items-center justify-center gap-1.5 rounded-full py-3 text-[14px] font-semibold transition-colors",
            tab === "ack"
              ? "bg-success text-success-foreground"
              : "border border-border/70 bg-card text-muted-foreground",
          )}
        >
          <CheckCircle2 className="h-4 w-4" /> Acknowledged ({done.length})
        </button>
      </div>

      {/* Category chips. */}
      <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
        {CATEGORIES.map((c) => (
          <button
            key={c}
            type="button"
            onClick={() => setCategory(c)}
            className={cn(
              "shrink-0 whitespace-nowrap rounded-full border px-3 py-1.5 text-[12px] font-semibold transition-colors",
              category === c
                ? "border-success bg-success/10 text-success"
                : "border-border/70 bg-card text-muted-foreground",
            )}
          >
            {c === "Branch Alert" ? "Branch Alerts" : c} ({counts[c]})
          </button>
        ))}
      </div>

      <div className="mt-4 flex flex-col gap-3">
        {isLoading && <Skeleton className="h-32 w-full rounded-2xl" />}
        {!isLoading &&
          filtered.map((a) => (
            <AlertCard key={a.id} alert={a} acked={tab === "ack"} onToggle={() => toggle(a.id)} />
          ))}
        {!isLoading && filtered.length === 0 && (
          <EmptyNote>{tab === "open" ? "No open alerts." : "Nothing acknowledged yet."}</EmptyNote>
        )}
      </div>
    </div>
  );
}
