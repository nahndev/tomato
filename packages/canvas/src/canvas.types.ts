import type { CanvasLayerType } from "./canvas.constants";

export interface Point {
  x: number;
  y: number;
}

export interface Size {
  width: number;
  height: number;
}

/** Content is drawn at `translate(x, y) scale(scale)` from its top-left corner. */
export interface Transform extends Point {
  scale: number;
}

/** Position and size as ratios of the frame. */
export interface Rect extends Point, Size {}

export interface CanvasPin extends Point {
  id: string;
  label: string;
  description: string;
  isLocked?: boolean;
}

export type CanvasPinDetails = Pick<CanvasPin, "label" | "description">;

export interface CanvasImageLayer extends Rect {
  type: typeof CanvasLayerType.IMAGE;
  id: string;
  /** Full URL of the image. */
  src: string;
  alt?: string;
  /** Locked layers can be selected but not moved or resized. */
  isLocked?: boolean;
}

export interface CanvasPinLayer extends CanvasPin {
  type: typeof CanvasLayerType.PIN;
}

export type CanvasLayer = CanvasImageLayer | CanvasPinLayer;

export interface CanvasViewport {
  /** `null` fits the frame in the viewport. */
  transform: Transform | null;
}

export interface CanvasValue {
  /** Content size in pixels; layer positions are ratios of it. */
  frame: Size;
  /** Images are drawn in order, pins above them. Added pins are named `Pin <n>`. */
  layers: readonly CanvasLayer[];
  viewport: CanvasViewport;
}

export interface FramePreset {
  name: string;
  size: Size;
}

export interface PinDragData {
  pin: CanvasPin;
  isSelected: boolean;
}
