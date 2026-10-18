import { describe, expect, it } from "vitest";
import { findLayoutError, toPlacementLayout } from "./copilot-widget-layout";

const current = { column: 0, span: 2 };

describe("findLayoutError", () => {
  it("accepts a layout that fits the grid", () => {
    expect(findLayoutError({ column: 6, span: 2 }, current)).toBeNull();
  });

  it("rejects column + span beyond the grid", () => {
    expect(findLayoutError({ column: 6, span: 3 }, current)).toMatch(/^Error:/);
  });

  it("checks a given field against the current value of the other", () => {
    expect(findLayoutError({ column: 7 }, current)).toMatch(/^Error:/);
    expect(findLayoutError({ span: 8 }, { column: 1, span: 2 })).toMatch(/^Error:/);
  });

  it("ignores column and span for a full-width widget", () => {
    expect(findLayoutError({ fullWidth: true, column: 7, span: 8 }, current)).toBeNull();
    expect(findLayoutError({ column: 7, span: 8 }, { ...current, isFullWidth: true })).toBeNull();
  });
});

describe("toPlacementLayout", () => {
  it("keeps only the given fields", () => {
    expect(toPlacementLayout({ span: 4 })).toEqual({ span: 4 });
    expect(toPlacementLayout({ column: 0, fullWidth: false })).toEqual({ column: 0, isFullWidth: false });
  });
});
