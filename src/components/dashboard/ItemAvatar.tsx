import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { dashboardService } from "@/services/dashboardService";
import { cn } from "@/lib/utils";

const SIZE_MAP = {
  sm: "h-6 w-6 text-[9px]",
  md: "h-8 w-8 text-[11px]",
  lg: "h-10 w-10 text-[13px]",
} as const;

const BG_COLORS = [
  "bg-primary/15 text-primary",
  "bg-success/15 text-success",
  "bg-warning/15 text-warning",
  "bg-info/15 text-info",
  "bg-destructive/15 text-destructive",
  "bg-chart-4/15 text-chart-4",
];

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) | 0;
  }
  return Math.abs(hash);
}

/** True once the element has come (nearly) into view — and stays true. */
function useSeen(ref: React.RefObject<HTMLElement | null>, active: boolean) {
  const [seen, setSeen] = useState(false);
  useEffect(() => {
    if (!active || seen) return;
    const el = ref.current;
    if (!el || !("IntersectionObserver" in window)) {
      setSeen(true);
      return;
    }
    const io = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setSeen(true);
          io.disconnect();
        }
      },
      { rootMargin: "200px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, [ref, active, seen]);
  return seen;
}

/**
 * Initials tile for an item. With `variant="photo"` it shows a stock photo of the item
 * (looked up by name via the backend — Pixabay) and falls back to the
 * initials while loading, when there is no match, or when the server has no API key.
 * Lookups only start once the tile is near the screen, and each name is fetched once.
 */
export function ItemAvatar({
  name,
  size = "md",
  variant = "initials",
  className,
}: {
  name: string;
  size?: "sm" | "md" | "lg";
  variant?: "initials" | "photo";
  className?: string;
}) {
  const ref = useRef<HTMLDivElement>(null);
  const wantsPhoto = variant === "photo";
  const seen = useSeen(ref, wantsPhoto);
  const [broken, setBroken] = useState(false);

  const photo = useQuery({
    queryKey: ["dashboard", "item-image", name.trim().toLowerCase()],
    queryFn: () => dashboardService.getItemImage(name),
    enabled: wantsPhoto && seen,
    // A found photo is good for 12 h; "no image" (no API key yet, no match) re-checks sooner.
    staleTime: (q) => (q.state.data?.url ? 12 * 60 * 60_000 : 5 * 60_000),
    gcTime: 24 * 60 * 60_000,
    retry: false,
    refetchOnWindowFocus: false,
  });
  const src = size === "lg" ? photo.data?.url : photo.data?.thumb;
  const showPhoto = wantsPhoto && !!src && !broken;

  const initials = name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w.charAt(0).toUpperCase())
    .join("");

  const colorIdx = hashCode(name) % BG_COLORS.length;

  return (
    <div
      ref={ref}
      className={cn(
        "flex shrink-0 items-center justify-center overflow-hidden rounded-lg font-bold select-none",
        SIZE_MAP[size],
        showPhoto ? "bg-muted" : BG_COLORS[colorIdx],
        className,
      )}
    >
      {showPhoto ? (
        <img
          src={src}
          alt={name}
          title={
            photo.data?.credit
              ? `Photo: ${photo.data.credit.name} (${photo.data.source})`
              : undefined
          }
          loading="lazy"
          onError={() => setBroken(true)}
          className="h-full w-full object-cover"
        />
      ) : (
        initials || "?"
      )}
    </div>
  );
}
