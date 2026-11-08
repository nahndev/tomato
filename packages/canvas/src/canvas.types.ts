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
  /** Hex; the theme color when missing. */
  color?: string;
  isLocked?: boolean;
}

export type CanvasLayerDetails = Pick<CanvasPin, "label" | "description">;

export interface CanvasImageLayer extends Rect {
  type: typeof CanvasLayerType.IMAGE;
  id: string;
  src: string;
  alt?: string;
  /** Locked layers can be selected but not moved or resized. */
  isLocked?: boolean;
}

export interface CanvasPinLayer extends CanvasPin {
  type: typeof CanvasLayerType.PIN;
}

/** Closed polygon, vertices as ratios of the frame; rectangles are 4 points. */
export interface CanvasZoneLayer extends CanvasLayerDetails {
  type: typeof CanvasLayerType.ZONE;
  id: string;
  points: readonly Point[];
  /** Hex; the theme color when missing. */
  fillColor?: string;
  strokeColor?: string;
  isLocked?: boolean;
}

export type CanvasPinStyle = Pick<CanvasPin, "color">;
export type CanvasZoneStyle = Pick<CanvasZoneLayer, "fillColor" | "strokeColor">;

export type CanvasLayer = CanvasImageLayer | CanvasZoneLayer | CanvasPinLayer;

export interface CanvasViewport {
  /** `null` fits the frame in the viewport. */
  transform: Transform | null;
}

export interface CanvasValue {
  /** Content size in pixels; layer positions are ratios of it. */
  frame: Size;
  /** Drawn in order: images, then zones, then pins. Added pins and zones are named `Pin <n>` / `Zone <n>`. */
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
