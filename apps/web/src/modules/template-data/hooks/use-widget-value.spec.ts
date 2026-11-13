import { describe, expect, it } from "vitest";
import { renderInScope } from "../testing/render-in-scope";
import { useWidgetValue } from "./use-widget-value";

const VALUES = { people: ["top"], "repeat.a.people": ["tab-a"] };

describe("useWidgetValue", () => {
  it("reads a widget of the same tab before an outer one", () => {
    expect(renderInScope(() => useWidgetValue("people"), ["repeat", "a"], VALUES)).toEqual(["tab-a"]);
    expect(renderInScope(() => useWidgetValue("people"), ["repeat", "b"], VALUES)).toEqual(["top"]);
  });

  it("is undefined without values, as in the editor", () => {
    expect(renderInScope(() => useWidgetValue("people"), [])).toBeUndefined();
  });
});
