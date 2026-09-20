import { AppFrame, Banner, MockAiInsights, MockAlerts, MockRecon } from "./DashboardMock";
import { BranchInsights } from "./BranchMock";

/**
 * The alert, insight and reconciliation cards from the real Overview and Branch
 * Insights screens, laid out together for the Alerts & Insights product page.
 * Sample data only.
 */
export function AlertsMock() {
  return (
    <AppFrame active="Overview" height={1000}>
      <Banner compact />
      <div
        style={{ display: "grid", gridTemplateColumns: "1.15fr 1fr", gap: 16, alignItems: "start" }}
      >
        <MockAiInsights />
        <MockAlerts />
      </div>
      <div
        style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 16, alignItems: "start" }}
      >
        <MockRecon />
        <BranchInsights />
      </div>
    </AppFrame>
  );
}
