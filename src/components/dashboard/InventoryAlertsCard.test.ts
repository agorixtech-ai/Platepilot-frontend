import { expect, test } from "bun:test";

import { raisedSince, timeAgo } from "./InventoryAlertsCard";
import type { StockItem } from "@/services/dashboardService";

const item = (name: string, status: StockItem["status"]): StockItem => ({
  item: name,
  current_stock: status === "critical" ? 0 : status === "low" ? 3 : 20,
  status,
});

test("timeAgo buckets seconds / minutes / hours", () => {
  const now = 1_000_000_000;
  expect(timeAgo(now, now)).toBe("0s ago");
  expect(timeAgo(now - 59_000, now)).toBe("59s ago");
  expect(timeAgo(now - 90_000, now)).toBe("1m ago");
  expect(timeAgo(now - 3_600_000, now)).toBe("1h ago");
  expect(timeAgo(now + 5_000, now)).toBe("0s ago"); // clock skew must not go negative
});

test("raisedSince flags only newly raised or worsened alerts", () => {
  const prev = new Map<string, StockItem["status"]>([
    ["Rice", "ok"],
    ["Cream", "low"],
    ["Tikka", "low"],
  ]);
  const next = [
    item("Rice", "low"), // ok -> low: new
    item("Cream", "low"), // unchanged: not new
    item("Tikka", "critical"), // low -> critical: worsened
    item("Butter", "critical"), // unseen item: new
    item("Naan", "ok"), // healthy: never an alert
  ];
  expect(raisedSince(prev, next)).toEqual(["Rice", "Tikka", "Butter"]);
});
