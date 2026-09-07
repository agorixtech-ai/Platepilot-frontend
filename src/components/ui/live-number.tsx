import { useLiveJitter } from "@/hooks/useLiveJitter";

/**
 * Renders a number that gently ticks up/down forever around `value`,
 * like a live dashboard feed. Purely cosmetic — for marketing/mock UI only.
 */
export function LiveNumber({
  value,
  decimals = 0,
  prefix = "",
  suffix = "",
  commas = false,
  locale = "en-US",
}: {
  value: number;
  decimals?: number;
  prefix?: string;
  suffix?: string;
  /** Group the integer part with commas (e.g. 12,480). */
  commas?: boolean;
  /** Grouping locale — use "en-IN" for lakh-style grouping (2,48,320). */
  locale?: string;
}) {
  const live = useLiveJitter(value);
  const text = commas
    ? live.toLocaleString(locale, { minimumFractionDigits: decimals, maximumFractionDigits: decimals })
    : live.toFixed(decimals);
  return (
    <>
      {prefix}
      {text}
      {suffix}
    </>
  );
}
