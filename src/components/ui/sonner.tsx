import type { ComponentProps } from "react";
import { Toaster as Sonner } from "sonner";

type ToasterProps = ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast group-[.toaster]:bg-white group-[.toaster]:text-foreground group-[.toaster]:border-border group-[.toaster]:border-l-4 group-[.toaster]:shadow-card group-[.toaster]:rounded-xl",
          description: "group-[.toast]:text-muted-foreground",
          actionButton:
            "group-[.toast]:bg-primary group-[.toast]:text-primary-foreground group-[.toast]:rounded-lg",
          cancelButton: "group-[.toast]:bg-secondary group-[.toast]:text-secondary-foreground",
          success: "group-[.toaster]:border-l-success group-[.toaster]:bg-success-soft",
          error: "group-[.toaster]:border-l-destructive group-[.toaster]:bg-destructive-soft",
          warning: "group-[.toaster]:border-l-warning group-[.toaster]:bg-warning-soft",
          info: "group-[.toaster]:border-l-info group-[.toaster]:bg-info-soft",
        },
      }}
      {...props}
    />
  );
};

export { Toaster };
