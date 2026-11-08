import { ARROW_SNAP_ANGLE, ELLIPSE_SEGMENTS } from "../canvas.constants";
import type { Point, Size } from "../canvas.types";
import { clamp } from "./transform.utils";

/** Corners clockwise from `start`; `isSquare` keeps equal sides in frame pixels. */
export function getRectPoints(start: Point, end: Point, frame: Size, isSquare = false): Point[] {
  let corner = end;
  if (isSquare) {
    const side = Math.min(Math.abs(end.x - start.x) * frame.width, Math.abs(end.y - start.y) * frame.height);
    corner = {
      x: start.x + (Math.sign(end.x - start.x) * side) / frame.width,
      y: start.y + (Math.sign(end.y - start.y) * side) / frame.height,
    };
  }
  return [start, { x: corner.x, y: start.y }, corner, { x: start.x, y: corner.y }];
}

/** Inscribed in the rectangle from `start` to `end`; `isCircle` keeps equal radii in frame pixels. */
export function getEllipsePoints(start: Point, end: Point, frame: Size, isCircle = false): Point[] {
  const [first, , corner] = getRectPoints(start, end, frame, isCircle);
  const center = { x: (first!.x + corner!.x) / 2, y: (first!.y + corner!.y) / 2 };
  const radius = { x: Math.abs(corner!.x - first!.x) / 2, y: Math.abs(corner!.y - first!.y) / 2 };
  return Array.from({ length: ELLIPSE_SEGMENTS }, (_, index) => {
    const angle = (index / ELLIPSE_SEGMENTS) * 2 * Math.PI;
    return {
      x: clamp(center.x + radius.x * Math.cos(angle), 0, 1),
      y: clamp(center.y + radius.y * Math.sin(angle), 0, 1),
    };
  });
}

/** `isSnapped` turns the arrow to the nearest 45° in frame pixels, keeping its length; the end stays inside the frame. */
export function getArrowPoints(start: Point, end: Point, frame: Size, isSnapped = false): [Point, Point] {
  if (!isSnapped) return [start, end];
  const dx = (end.x - start.x) * frame.width;
  const dy = (end.y - start.y) * frame.height;
  const angle = Math.round(Math.atan2(dy, dx) / ARROW_SNAP_ANGLE) * ARROW_SNAP_ANGLE;
  const length = Math.hypot(dx, dy);
  const snapped = {
    x: clamp(start.x + (Math.cos(angle) * length) / frame.width, 0, 1),
    y: clamp(start.y + (Math.sin(angle) * length) / frame.height, 0, 1),
  };
  return [start, snapped];
}

/** The whole shape stays inside the frame. */
export function movePoints(points: readonly Point[], delta: Point): Point[] {
  const xs = points.map(({ x }) => x);
  const ys = points.map(({ y }) => y);
  const dx = clamp(delta.x, -Math.min(...xs), 1 - Math.max(...xs));
  const dy = clamp(delta.y, -Math.min(...ys), 1 - Math.max(...ys));
  return points.map(({ x, y }) => ({ x: x + dx, y: y + dy }));
}

/** Drops consecutive vertices closer than `distance`, in frame pixels. */
export function dedupePoints(points: readonly Point[], frame: Size, distance: number): Point[] {
  return points.filter((point, index) => {
    const previous = points[index - 1];
    return !previous || Math.hypot((point.x - previous.x) * frame.width, (point.y - previous.y) * frame.height) >= distance;
  });
}

export function toSvgPoints(points: readonly Point[]): string {
  return points.map(({ x, y }) => `${x},${y}`).join(" ");
}

export function isSamePoints(a: readonly Point[], b: readonly Point[]): boolean {
  return a.length === b.length && a.every((point, index) => point.x === b[index]!.x && point.y === b[index]!.y);
}
