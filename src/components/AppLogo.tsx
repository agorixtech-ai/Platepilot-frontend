import { Link } from "react-router-dom";
import { cn } from "@/lib/utils";

export const LOGO_SRC = "/logo.jpeg";
export const LOGO_ALT = "PlatePilot";

const iconSizes = {
  sm: "h-8 w-8",
  md: "h-9 w-9",
  lg: "h-11 w-11",
} as const;

type AppLogoProps = {
  className?: string;
  iconClassName?: string;
  showText?: boolean;
  textClassName?: string;
  textWrapperClassName?: string;
  subtitle?: string;
  subtitleClassName?: string;
  to?: string;
  size?: keyof typeof iconSizes;
};

export function AppLogo({
  className,
  iconClassName,
  showText = false,
  textClassName,
  textWrapperClassName,
  subtitle,
  subtitleClassName,
  to,
  size = "md",
}: AppLogoProps) {
  const inner = (
    <>
      <img
        src={LOGO_SRC}
        alt={LOGO_ALT}
        className={cn(iconSizes[size], "shrink-0 rounded-xl object-cover", iconClassName)}
      />
      {showText && (
        <div className={cn("min-w-0", textWrapperClassName)}>
          <p
            className={cn(
              "truncate text-[15px] font-bold leading-tight tracking-tight",
              textClassName,
            )}
          >
            PlatePilot
          </p>
          {subtitle && (
            <p className={cn("truncate text-[10px] leading-tight font-medium", subtitleClassName)}>
              {subtitle}
            </p>
          )}
        </div>
      )}
    </>
  );

  const rootClass = cn("flex min-w-0 items-center gap-3 select-none", className);

  if (to) {
    return (
      <Link to={to} className={rootClass}>
        {inner}
      </Link>
    );
  }

  return <div className={rootClass}>{inner}</div>;
}
