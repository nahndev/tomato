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
}

export interface ImageMapImageLayer extends Rect {
  type: typeof ImageMapLayerType.IMAGE;
  id: string;
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
  selectedLayerId: string | null;
  isAddingPin: boolean;
}

export interface ImageMapValue {
  /** Content size in pixels; layer positions are ratios of it. */
  frame: Size;
  /** Images are drawn in order, pins above them. Added pins get a `NEW_PIN_ID_PREFIX` id and an empty label. */
  layers: readonly ImageMapLayer[];
  viewport: ImageMapViewport;
}

export interface PinDragData {
  pin: ImageMapPin;
  isSelected: boolean;
}
