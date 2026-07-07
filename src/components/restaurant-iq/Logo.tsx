import { AppLogo } from "@/components/AppLogo";

export function Logo({ className = "" }: { className?: string }) {
  return (
    <AppLogo
      to="/"
      showText
      className={className}
      textClassName="font-display text-lg font-bold tracking-tight text-foreground"
    />
  );
}
