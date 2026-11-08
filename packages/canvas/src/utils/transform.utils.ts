import { MIN_VISIBLE_SIZE } from "../canvas.constants";
import type { Point, Size, Transform } from "../canvas.types";

export function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max);
}

export function getFitScale(viewport: Size, content: Size): number {
  if (content.width <= 0 || content.height <= 0) return 1;
  return Math.min(viewport.width / content.width, viewport.height / content.height);
}

export function fitTransform(viewport: Size, content: Size): Transform {
  const scale = getFitScale(viewport, content);
  return {
    scale,
    x: (viewport.width - content.width * scale) / 2,
    y: (viewport.height - content.height * scale) / 2,
  };
}

export function clampOffset(transform: Transform, viewport: Size, content: Size): Transform {
  const width = content.width * transform.scale;
  const height = content.height * transform.scale;
  const visibleX = Math.min(MIN_VISIBLE_SIZE, width, viewport.width);
  const visibleY = Math.min(MIN_VISIBLE_SIZE, height, viewport.height);
  return {
    scale: transform.scale,
    x: clamp(transform.x, visibleX - width, viewport.width - visibleX),
    y: clamp(transform.y, visibleY - height, viewport.height - visibleY),
  };
}

/** `origin` is in viewport coordinates. */
export function zoomAt(transform: Transform, scale: number, origin: Point): Transform {
  const ratio = scale / transform.scale;
  return {
    scale,
    x: origin.x - (origin.x - transform.x) * ratio,
    y: origin.y - (origin.y - transform.y) * ratio,
  };
}

export function toContentPoint(transform: Transform, point: Point): Point {
  return {
    x: (point.x - transform.x) / transform.scale,
    y: (point.y - transform.y) / transform.scale,
  };
}

/** Maps a content point to ratios of the content size, from 0 to 1. */
export function toRatioPoint(point: Point, content: Size): Point {
  return {
    x: clamp(point.x / content.width, 0, 1),
    y: clamp(point.y / content.height, 0, 1),
  };
}

export function getDistance(a: Point, b: Point): number {
  return Math.hypot(a.x - b.x, a.y - b.y);
}

export function getClientPoint(event: { clientX: number; clientY: number }): Point {
  return { x: event.clientX, y: event.clientY };
}

export function isSameTransform(a: Transform, b: Transform): boolean {
  return a.scale === b.scale && a.x === b.x && a.y === b.y;
}
