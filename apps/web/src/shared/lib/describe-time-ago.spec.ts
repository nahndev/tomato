import { describe, expect, it } from "vitest";
import { describeTimeAgo } from "./describe-time-ago";

const NOW = new Date("2026-10-16T12:00:00Z");

describe("describeTimeAgo", () => {
  it.each([
    ["2026-10-16T11:59:40Z", "just now"],
    ["2026-10-16T11:55:00Z", "5 minutes ago"],
    ["2026-10-16T09:00:00Z", "3 hours ago"],
    ["2026-10-15T12:00:00Z", "yesterday"],
    ["2026-10-13T12:00:00Z", "3 days ago"],
    ["2026-10-02T12:00:00Z", "2 weeks ago"],
    ["2026-07-16T12:00:00Z", "3 months ago"],
    ["2024-10-16T12:00:00Z", "2 years ago"],
  ])("%s -> %s", (date, expected) => {
    expect(describeTimeAgo(date, NOW)).toBe(expected);
  });
});
