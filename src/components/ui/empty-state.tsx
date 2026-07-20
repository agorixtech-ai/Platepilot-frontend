import { cn } from "@/lib/utils";
import { LucideIcon } from "lucide-react";

interface EmptyStateProps {
  icon?: LucideIcon;
  title: string;
  description?: string;
  action?: {
    label: string;
    onClick: () => void;
  };
  className?: string;
}

export function EmptyState({
  icon: Icon,
  title,
  description,
  action,
  className,
}: EmptyStateProps) {
  return (
    <div
      className={cn(
        "flex flex-col items-center justify-center gap-3 overflow-hidden rounded-xl px-4 py-10 text-center text-white shadow-card",
        className,
      )}
      style={{ background: "var(--gradient-brand)" }}
    >
      {Icon && (
        <div className="relative">
          <div className="absolute inset-0 rounded-full bg-white/10 blur-xl" />
          <Icon className="relative h-12 w-12 text-white/80" />
        </div>
      )}
      <div className="space-y-1">
        <p className="text-sm font-semibold">{title}</p>
        {description && <p className="max-w-xs text-xs text-white/75">{description}</p>}
      </div>
      {action && (
        <button
          onClick={action.onClick}
          className="mt-2 rounded-lg bg-white px-4 py-2 text-xs font-semibold text-primary transition-all duration-200 hover:bg-white/90"
        >
          {action.label}
        </button>
      )}
    </div>
  );
}
