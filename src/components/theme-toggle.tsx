import { Sun } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/** Light-only product — theme toggle is a no-op indicator. */
export function ThemeToggle({
  className,
  buttonClassName,
}: {
  className?: string;
  buttonClassName?: string;
  contentAlign?: "start" | "center" | "end";
}) {
  return (
    <Button
      variant="ghost"
      size="icon"
      disabled
      aria-label="Light theme"
      title="Light theme"
      className={cn("h-9 w-9 rounded-xl opacity-60", className, buttonClassName)}
    >
      <Sun className="h-4 w-4" />
      <span className="sr-only">Light theme</span>
    </Button>
  );
}
