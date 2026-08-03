import { expect, test } from "bun:test";

import { bucketOf, WASTE_RISK_PCT } from "./DishActivityMatrix";

test("waste outranks the quadrant — a leaky star is still a waste risk", () => {
  expect(bucketOf({ waste_pct: WASTE_RISK_PCT, quadrant: "star" })).toBe("waste_risk");
  expect(bucketOf({ waste_pct: 40, quadrant: "plow_horse" })).toBe("waste_risk");
});

test("clean dishes fall out of the backend quadrant", () => {
  expect(bucketOf({ waste_pct: 0, quadrant: "star" })).toBe("efficient");
  expect(bucketOf({ waste_pct: 4.9, quadrant: "plow_horse" })).toBe("high_usage");
  expect(bucketOf({ waste_pct: 0, quadrant: "puzzle" })).toBe("low_activity");
  expect(bucketOf({ waste_pct: 0, quadrant: "dog" })).toBe("low_activity");
});
