import { describe, expect, it } from "vitest";
import { toUserIds } from "./users";

describe("toUserIds", () => {
  it("keeps a list of ids", () => {
    expect(toUserIds(["a", "b"])).toEqual(["a", "b"]);
  });

  it("wraps a single id and drops empty or non-string items", () => {
    expect(toUserIds("a")).toEqual(["a"]);
    expect(toUserIds(["a", "", 1, null])).toEqual(["a"]);
  });

  it("returns an empty list for no value", () => {
    expect(toUserIds(undefined)).toEqual([]);
    expect(toUserIds("")).toEqual([]);
    expect(toUserIds({})).toEqual([]);
  });
});
