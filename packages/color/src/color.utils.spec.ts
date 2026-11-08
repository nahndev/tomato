import { describe, expect, it } from "vitest";
import { pickRandomColor } from "./color.utils";

describe("pickRandomColor", () => {
  it("picks one of the colors", () => {
    const colors = ["#ef4444", "#22c55e", "#3b82f6"];
    for (let i = 0; i < 20; i++) expect(colors).toContain(pickRandomColor(colors));
  });

  it("returns undefined without colors", () => {
    expect(pickRandomColor([])).toBeUndefined();
  });
});
