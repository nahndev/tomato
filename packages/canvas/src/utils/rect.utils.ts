import {
  MAX_IMAGE_RATIO,
  MIN_IMAGE_SIZE,
  MIN_IMAGE_VISIBLE_SIZE,
  ResizeCorner,
} from "../canvas.constants";
import type { Point, Rect, Size } from "../canvas.types";
import { clamp } from "./transform.utils";

const CORNER_SIGNS: Record<ResizeCorner, Point> = {
  [ResizeCorner.TOP_LEFT]: { x: -1, y: -1 },
  [ResizeCorner.TOP_RIGHT]: { x: 1, y: -1 },
  [ResizeCorner.BOTTOM_LEFT]: { x: -1, y: 1 },
  [ResizeCorner.BOTTOM_RIGHT]: { x: 1, y: 1 },
};

function toPixels(rect: Rect, frame: Size): Rect {
  return {
    x: rect.x * frame.width,
    y: rect.y * frame.height,
    width: rect.width * frame.width,
    height: rect.height * frame.height,
  };
}

function toRatios(rect: Rect, frame: Size): Rect {
  return {
    x: rect.x / frame.width,
    y: rect.y / frame.height,
    width: rect.width / frame.width,
    height: rect.height / frame.height,
  };
}

export function fitImageRect(size: Size, frame: Size): Rect {
  const scale = Math.min(frame.width / size.width, frame.height / size.height);
  const width = size.width * scale;
  const height = size.height * scale;
  return toRatios(
    { x: (frame.width - width) / 2, y: (frame.height - height) / 2, width, height },
    frame,
  );
}

/** `delta` is in frame pixels; part of the image stays inside the frame. */
export function moveRect(rect: Rect, delta: Point, frame: Size): Rect {
  const pixels = toPixels(rect, frame);
  const visibleX = Math.min(MIN_IMAGE_VISIBLE_SIZE, pixels.width);
  const visibleY = Math.min(MIN_IMAGE_VISIBLE_SIZE, pixels.height);
  return toRatios(
    {
      ...pixels,
      x: clamp(pixels.x + delta.x, visibleX - pixels.width, frame.width - visibleX),
      y: clamp(pixels.y + delta.y, visibleY - pixels.height, frame.height - visibleY),
    },
    frame,
  );
}

/** `delta` is in frame pixels. */
export function resizeRect(rect: Rect, corner: ResizeCorner, delta: Point, frame: Size): Rect {
  const pixels = toPixels(rect, frame);
  const sign = CORNER_SIGNS[corner];
  const minFactor = MIN_IMAGE_SIZE / Math.min(pixels.width, pixels.height);
  const maxFactor = MAX_IMAGE_RATIO * Math.min(frame.width / pixels.width, frame.height / pixels.height);
  const factor = clamp(
    Math.max((pixels.width + sign.x * delta.x) / pixels.width, (pixels.height + sign.y * delta.y) / pixels.height),
    minFactor,
    maxFactor,
  );
  const width = pixels.width * factor;
  const height = pixels.height * factor;
  return toRatios(
    {
      x: sign.x < 0 ? pixels.x + pixels.width - width : pixels.x,
      y: sign.y < 0 ? pixels.y + pixels.height - height : pixels.y,
      width,
      height,
    },
    frame,
  );
}

export function isSameRect(a: Rect, b: Rect): boolean {
  return a.x === b.x && a.y === b.y && a.width === b.width && a.height === b.height;
}
