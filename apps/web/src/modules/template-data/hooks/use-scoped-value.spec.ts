import { describe, expect, it } from "vitest";
import { renderInScope } from "../testing/render-in-scope";
import { useScopedValue } from "./use-scoped-value";

const VALUES = { people: ["top"], "repeat.a.people": ["tab-a"] };

describe("useScopedValue", () => {
  it("reads exactly the given key", () => {
    expect(renderInScope(() => useScopedValue("repeat.b.people"), [], VALUES)).toBeUndefined();
    expect(renderInScope(() => useScopedValue("repeat.a.people"), [], VALUES)).toEqual(["tab-a"]);
  });
});
