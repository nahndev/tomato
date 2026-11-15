import { describe, expect, it } from "vitest";
import { getColumnSizeStyle } from "./column";

describe("getColumnSizeStyle", () => {
  it("maps a size to a style", () => {
    expect(getColumnSizeStyle({ flex: 2 })).toEqual({ flex: "2 1 0%" });
    expect(getColumnSizeStyle({ width: 300 })).toEqual({ width: 300, flexShrink: 0 });
  });
});
