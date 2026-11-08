import { describe, expect, it } from "vitest";
import { ELLIPSE_SEGMENTS } from "../canvas.constants";
import { dedupePoints, getArrowPoints, getEllipsePoints, getRectPoints, isSamePoints, movePoints } from "./zone.utils";

const frame = { width: 200, height: 100 };

describe("getRectPoints", () => {
  it("returns the four corners clockwise from the start", () => {
    expect(getRectPoints({ x: 0.1, y: 0.2 }, { x: 0.5, y: 0.6 }, frame)).toEqual([
      { x: 0.1, y: 0.2 },
      { x: 0.5, y: 0.2 },
      { x: 0.5, y: 0.6 },
      { x: 0.1, y: 0.6 },
    ]);
  });

  it("keeps equal sides in frame pixels for squares, toward the pointer", () => {
    const [, , corner] = getRectPoints({ x: 0.5, y: 0.5 }, { x: 0.1, y: 0.9 }, frame, true);
    expect(corner!.x).toBeCloseTo(0.3);
    expect(corner!.y).toBeCloseTo(0.9);
  });
});

describe("movePoints", () => {
  it("moves every point and keeps the shape inside the frame", () => {
    const points = [{ x: 0.1, y: 0.1 }, { x: 0.5, y: 0.1 }, { x: 0.5, y: 0.4 }];
    expect(movePoints(points, { x: 0.2, y: 0 })[1]).toEqual({ x: 0.7, y: 0.1 });
    const [first, second] = movePoints(points, { x: 0.8, y: -0.5 });
    expect(second).toEqual({ x: 1, y: 0 });
    expect(first!.x).toBeCloseTo(0.6);
  });
});

describe("dedupePoints", () => {
  it("drops consecutive points closer than the distance", () => {
    const points = [{ x: 0, y: 0 }, { x: 0.5, y: 0 }, { x: 0.51, y: 0 }, { x: 0.5, y: 0.5 }];
    expect(dedupePoints(points, frame, 4)).toEqual([points[0], points[1], points[3]]);
  });
});

describe("isSamePoints", () => {
  it("compares points in order", () => {
    expect(isSamePoints([{ x: 0, y: 1 }], [{ x: 0, y: 1 }])).toBe(true);
    expect(isSamePoints([{ x: 0, y: 1 }], [{ x: 1, y: 0 }])).toBe(false);
  });
});

describe("getEllipsePoints", () => {
  it("inscribes the ellipse in the dragged rectangle", () => {
    const points = getEllipsePoints({ x: 0.2, y: 0.2 }, { x: 0.6, y: 0.8 }, frame);
    expect(points).toHaveLength(ELLIPSE_SEGMENTS);
    expect(points[0]!.x).toBeCloseTo(0.6);
    expect(points[0]!.y).toBeCloseTo(0.5);
    expect(Math.min(...points.map(({ x }) => x))).toBeCloseTo(0.2);
    expect(Math.max(...points.map(({ y }) => y))).toBeCloseTo(0.8);
  });

  it("keeps equal radii in frame pixels for circles", () => {
    const points = getEllipsePoints({ x: 0, y: 0 }, { x: 1, y: 1 }, frame, true);
    const width = (Math.max(...points.map(({ x }) => x)) - Math.min(...points.map(({ x }) => x))) * frame.width;
    const height = (Math.max(...points.map(({ y }) => y)) - Math.min(...points.map(({ y }) => y))) * frame.height;
    expect(width).toBeCloseTo(height);
  });
});

describe("getArrowPoints", () => {
  it("keeps the dragged ends", () => {
    expect(getArrowPoints({ x: 0.1, y: 0.1 }, { x: 0.3, y: 0.7 }, frame)).toEqual([{ x: 0.1, y: 0.1 }, { x: 0.3, y: 0.7 }]);
  });

  it("snaps to 45° in frame pixels, keeping the length", () => {
    const [, end] = getArrowPoints({ x: 0.1, y: 0.5 }, { x: 0.6, y: 0.55 }, frame, true);
    expect(end.y).toBeCloseTo(0.5);
    const [, diagonal] = getArrowPoints({ x: 0, y: 0 }, { x: 0.25, y: 0.45 }, frame, true);
    expect(diagonal.x * frame.width).toBeCloseTo(diagonal.y * frame.height);
  });
});
