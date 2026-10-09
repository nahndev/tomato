import { describe, expect, it } from "vitest";
import { isDefined } from "./is-defined";

describe("isDefined", () => {
  it("filters out null and undefined", () => {
    expect([1, null, 0, undefined, ""].filter(isDefined)).toEqual([1, 0, ""]);
  });
});
