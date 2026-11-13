import { describe, expect, it } from "vitest";
import { readScopedValue, toScopedKey } from "./data-scope";

describe("toScopedKey", () => {
  it("keeps a top-level widget id and joins a nested scope", () => {
    expect(toScopedKey(["people"])).toBe("people");
    expect(toScopedKey(["repeat", "tab", "people"])).toBe("repeat.tab.people");
  });
});

describe("readScopedValue", () => {
  const values = { people: ["top"], "repeat.a.people": ["tab-a"] };

  it("prefers the value in the enclosing scope", () => {
    expect(readScopedValue(values, ["repeat", "a"], "people")).toEqual(["tab-a"]);
  });

  it("falls back to an outer scope", () => {
    expect(readScopedValue(values, ["repeat", "b"], "people")).toEqual(["top"]);
    expect(readScopedValue(values, [], "people")).toEqual(["top"]);
  });

  it("is undefined when no scope holds it", () => {
    expect(readScopedValue(values, ["repeat", "a"], "missing")).toBeUndefined();
  });
});
