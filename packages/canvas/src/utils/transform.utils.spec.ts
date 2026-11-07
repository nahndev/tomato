import { describe, expect, it } from "vitest";
import { MIN_VISIBLE_SIZE } from "../canvas.constants";
import {
  clampOffset,
  fitTransform,
  toContentPoint,
  toRatioPoint,
  zoomAt,
} from "./transform.utils";

const viewport = { width: 800, height: 600 };

describe("fitTransform", () => {
  it("fits and centers wide content", () => {
    expect(fitTransform(viewport, { width: 1600, height: 400 })).toEqual({ scale: 0.5, x: 0, y: 200 });
  });

  it("fits and centers tall content", () => {
    expect(fitTransform(viewport, { width: 300, height: 1200 })).toEqual({ scale: 0.5, x: 325, y: 0 });
  });
});

describe("zoomAt", () => {
  it("keeps the content point under the origin still", () => {
    const transform = { scale: 1, x: 100, y: 50 };
    const origin = { x: 300, y: 250 };
    const before = toContentPoint(transform, origin);
    const after = toContentPoint(zoomAt(transform, 3, origin), origin);
    expect(after.x).toBeCloseTo(before.x);
    expect(after.y).toBeCloseTo(before.y);
  });
});

describe("clampOffset", () => {
  const content = { width: 1000, height: 1000 };

  it("keeps part of the content visible", () => {
    expect(clampOffset({ scale: 1, x: 5000, y: -5000 }, viewport, content)).toEqual({
      scale: 1,
      x: viewport.width - MIN_VISIBLE_SIZE,
      y: MIN_VISIBLE_SIZE - content.height,
    });
  });

  it("leaves an offset inside the bounds unchanged", () => {
    const transform = { scale: 1, x: -100, y: 20 };
    expect(clampOffset(transform, viewport, content)).toEqual(transform);
  });
});

describe("toRatioPoint", () => {
  it("maps a content point to ratios clamped from 0 to 1", () => {
    expect(toRatioPoint({ x: 250, y: 900 }, { width: 500, height: 600 })).toEqual({ x: 0.5, y: 1 });
    expect(toRatioPoint({ x: -10, y: 300 }, { width: 500, height: 600 })).toEqual({ x: 0, y: 0.5 });
  });
});
