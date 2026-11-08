export interface MapImageLayer {
  type: "image";
  id: string;
  /** Id of an image file in the storage service. */
  fileId: string;
  /** Position and size, as ratios of the frame size. */
  x: number;
  y: number;
  width: number;
  height: number;
  /** Locked layers cannot be moved or resized. */
  isLocked?: boolean;
}

export interface MapPinLayer {
  type: "pin";
  id: string;
  label: string;
  description: string;
  /** From 0 (left) to 1 (right) of the frame. */
  x: number;
  y: number;
  /** Lowercase hex; the theme color when missing. */
  color?: string;
  /** A `MapPinIcon`; `map-pin` when missing. */
  icon?: string;
  isLocked?: boolean;
}

/** Ratios of the frame size, from 0 to 1. */
export interface MapPoint {
  x: number;
  y: number;
}

/** Closed polygon; rectangles are stored as 4 points. */
export interface MapZoneLayer {
  type: "zone";
  id: string;
  label: string;
  description: string;
  points: MapPoint[];
  /** Lowercase hex; the theme color when missing. */
  color?: string;
  isLocked?: boolean;
}

/** `x` and `y` are the top-left corner, as ratios of the frame size. */
export interface MapTextLayer {
  type: "text";
  id: string;
  text: string;
  x: number;
  y: number;
  /** In frame pixels. */
  fontSize: number;
  /** Lowercase hex; the theme color when missing. */
  color?: string;
  isLocked?: boolean;
}

export interface MapArrowLayer {
  type: "arrow";
  id: string;
  start: MapPoint;
  /** The arrow head. */
  end: MapPoint;
  /** Lowercase hex; the theme color when missing. */
  color?: string;
  isLocked?: boolean;
}

export type MapLayer = MapImageLayer | MapPinLayer | MapZoneLayer | MapTextLayer | MapArrowLayer;

/** Content is drawn at `translate(x, y) scale(scale)` from its top-left corner. */
export interface MapTransform {
  x: number;
  y: number;
  scale: number;
}

export interface MapViewport {
  /** `null` fits the frame in the viewport. */
  transform: MapTransform | null;
}

/** Size of the frame in pixels. */
export interface MapFrame {
  width: number;
  height: number;
}

export interface MapValue {
  /** `MAP_FRAME_DEFAULT_SIZE` when missing. */
  frame?: MapFrame;
  /** Drawn in order: images, zones, arrows, texts, then pins. */
  layers: MapLayer[];
  viewport: MapViewport;
}

export interface DepartmentMap {
  id: string;
  departmentId: string;
  name: string;
  value: MapValue;
  createdAt: string;
  updatedAt: string;
}
