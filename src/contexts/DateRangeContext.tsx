import { createContext, useContext, useState, type ReactNode } from "react";
import type { Period } from "@/services/dashboardService";

export type DateRange =
  | { kind: "today" }
  | { kind: "7d" }
  | { kind: "30d" }
  | { kind: "custom"; from: Date; to: Date };

interface DateRangeState {
  range: DateRange;
  setRange: (r: DateRange) => void;
}

const DateRangeContext = createContext<DateRangeState>({
  range: { kind: "today" },
  setRange: () => {},
});

const STORAGE_KEY = "platepilot_range";

/** Only the presets are remembered — a custom range is a fixed pair of dates that would
    silently go stale by the next launch. */
function loadRange(): DateRange {
  try {
    const kind = localStorage.getItem(STORAGE_KEY);
    if (kind === "today" || kind === "7d" || kind === "30d") return { kind };
  } catch {
    /* storage blocked — start on Today */
  }
  return { kind: "today" };
}

export function DateRangeProvider({ children }: { children: ReactNode }) {
  const [range, setRangeState] = useState<DateRange>(loadRange);
  const setRange = (r: DateRange) => {
    setRangeState(r);
    try {
      if (r.kind !== "custom") localStorage.setItem(STORAGE_KEY, r.kind);
    } catch {
      /* selection just won't persist */
    }
  };
  return (
    <DateRangeContext.Provider value={{ range, setRange }}>{children}</DateRangeContext.Provider>
  );
}

export function useDateRange() {
  return useContext(DateRangeContext);
}

/** Map a DateRange onto the backend's fixed Period buckets for the real API. */
export function rangeToPeriod(range: DateRange): Period {
  switch (range.kind) {
    case "today":
      return "today";
    case "7d":
      return "week";
    case "30d":
      return "month";
    case "custom": {
      const days = Math.round((range.to.getTime() - range.from.getTime()) / 86_400_000) + 1;
      return days <= 1 ? "today" : days <= 7 ? "week" : days <= 31 ? "month" : "year";
    }
  }
}

/** Stable key for react-query cache entries. */
export function rangeKey(range: DateRange): string {
  return range.kind === "custom"
    ? `custom:${range.from.toISOString().slice(0, 10)}:${range.to.toISOString().slice(0, 10)}`
    : range.kind;
}
