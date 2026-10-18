import { describe, expect, it } from "vitest";
import { epochToLocalInputValue, localInputValueToEpoch } from "./datetime";

describe("datetime input conversion", () => {
  it("round-trips an epoch through the local input value, to the minute", () => {
    const epoch = new Date(2026, 9, 17, 8, 5).getTime();

    expect(epochToLocalInputValue(epoch)).toBe("2026-10-17T08:05");
    expect(localInputValueToEpoch("2026-10-17T08:05")).toBe(epoch);
  });

  it("returns undefined for an empty or invalid input", () => {
    expect(localInputValueToEpoch("")).toBeUndefined();
    expect(localInputValueToEpoch("not-a-date")).toBeUndefined();
  });
});
