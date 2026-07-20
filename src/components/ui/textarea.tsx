import * as React from "react";

import { cn } from "@/lib/utils";

const Textarea = React.forwardRef<HTMLTextAreaElement, React.ComponentProps<"textarea">>(
  ({ className, ...props }, ref) => {
    return (
      <textarea
        className={cn(
          "flex min-h-[60px] w-full rounded-lg border border-input bg-white px-3 py-2 text-sm text-foreground shadow-xs transition-all duration-200 placeholder:text-muted-foreground focus-visible:outline-none focus-visible:border-primary focus-visible:shadow-[0_0_0_4px_rgba(22,163,74,0.12)] disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",
          className,
        )}
        ref={ref}
        {...props}
      />
    );
  },
);
Textarea.displayName = "Textarea";

export { Textarea };
