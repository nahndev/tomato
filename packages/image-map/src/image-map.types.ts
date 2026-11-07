import type { ImageMapLayerType } from "./image-map.constants";

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

export interface ImageMapPin extends Point {
  id: string;
  label: string;
  description: string;
}

export type ImageMapPinDetails = Pick<ImageMapPin, "label" | "description">;

export interface ImageMapImageLayer extends Rect {
  type: typeof ImageMapLayerType.IMAGE;
  id: string;
  /** Full URL of the image. */
  src: string;
  alt?: string;
}

export interface ImageMapPinLayer extends ImageMapPin {
  type: typeof ImageMapLayerType.PIN;
}

export type ImageMapLayer = ImageMapImageLayer | ImageMapPinLayer;

export interface ImageMapViewport {
  /** `null` fits the frame in the viewport. */
  transform: Transform | null;
}

export interface ImageMapValue {
  /** Content size in pixels; layer positions are ratios of it. */
  frame: Size;
  /** Images are drawn in order, pins above them. Added pins are named `Pin <n>`. */
  layers: readonly ImageMapLayer[];
  viewport: ImageMapViewport;
}

export interface PinDragData {
  pin: ImageMapPin;
  isSelected: boolean;
}
