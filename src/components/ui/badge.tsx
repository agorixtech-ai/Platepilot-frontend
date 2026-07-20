import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-primary text-primary-foreground",
        secondary: "border-transparent bg-secondary text-primary",
        success: "border-transparent bg-primary text-primary-foreground",
        warning: "border-transparent bg-warning-soft text-warning-foreground",
        destructive: "border-transparent bg-destructive-soft text-destructive",
        outline: "border-border text-foreground",
        lime: "border-transparent bg-[color-mix(in_srgb,var(--brand-lime)_22%,white)] text-[color-mix(in_srgb,var(--brand-forest)_80%,var(--brand-lime))]",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>, VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
