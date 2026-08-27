import { fmtCurrency } from "@/components/dashboard/shared";
import type { MenuEngineeringItem } from "@/services/dashboardService";

export function recommendationCopy(item: MenuEngineeringItem): string {
  const raise = Math.max(1, Math.round(item.price * 0.08));
  const monthlyGain = raise * item.sold;
  if (item.quadrant === "star") return "Keep the price steady. Feature this dish and upsell it.";
  if (item.quadrant === "plow_horse")
    return `A ${fmtCurrency(raise)} price increase could add about ${fmtCurrency(monthlyGain)} over 30 days at current sales.`;
  if (item.quadrant === "puzzle")
    return "Don't discount first. Make it easier to notice and pair it with a popular item.";
  return "Review the recipe and supplier cost first; if neither improves, consider removing it.";
}
