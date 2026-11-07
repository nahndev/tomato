import { describe, expect, it } from "vitest";
import { MAX_IMAGE_RATIO, MIN_IMAGE_SIZE, MIN_IMAGE_VISIBLE_SIZE, ResizeCorner } from "../image-map.constants";
import { fitImageRect, moveRect, resizeRect } from "./rect.utils";

const frame = { width: 1000, height: 500 };
const rect = { x: 0.1, y: 0.2, width: 0.2, height: 0.4 };

describe("fitImageRect", () => {
  it("fits and centers the image in the frame", () => {
    expect(fitImageRect({ width: 200, height: 200 }, frame)).toEqual({ x: 0.25, y: 0, width: 0.5, height: 1 });
  });
});

describe("moveRect", () => {
  it("moves by frame pixels", () => {
    const moved = moveRect(rect, { x: 100, y: -50 }, frame);
    expect(moved.x).toBeCloseTo(0.2);
    expect(moved.y).toBeCloseTo(0.1);
    expect(moved.width).toBeCloseTo(rect.width);
  });

  it("keeps part of the image inside the frame", () => {
    const moved = moveRect(rect, { x: 5000, y: -5000 }, frame);
    expect(moved.x * frame.width).toBeCloseTo(frame.width - MIN_IMAGE_VISIBLE_SIZE);
    expect(moved.y * frame.height).toBeCloseTo(MIN_IMAGE_VISIBLE_SIZE - rect.height * frame.height);
  });
});

describe("resizeRect", () => {
  it("keeps the aspect ratio and the opposite corner", () => {
    const resized = resizeRect(rect, ResizeCorner.TOP_LEFT, { x: -200, y: 0 }, frame);
    expect(resized.width).toBeCloseTo(0.4);
    expect(resized.height).toBeCloseTo(0.8);
    expect(resized.x + resized.width).toBeCloseTo(rect.x + rect.width);
    expect(resized.y + resized.height).toBeCloseTo(rect.y + rect.height);
  });

  it("limits the size", () => {
    const small = resizeRect(rect, ResizeCorner.BOTTOM_RIGHT, { x: -5000, y: -5000 }, frame);
    expect(small.width * frame.width).toBeCloseTo(MIN_IMAGE_SIZE);
    const large = resizeRect(rect, ResizeCorner.BOTTOM_RIGHT, { x: 1e6, y: 1e6 }, frame);
    expect(Math.max(large.width, large.height)).toBeCloseTo(MAX_IMAGE_RATIO);
  });
});
