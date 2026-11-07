export interface MapImageLayer {
  type: 'image';
  id: string;
  /** Id of an image file in the storage service. */
  fileId: string;
  /** Position and size, as ratios of the frame size. */
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface MapPinLayer {
  type: 'pin';
  id: string;
  label: string;
  description: string;
  /** From 0 (left) to 1 (right) of the frame. */
  x: number;
  /** From 0 (top) to 1 (bottom) of the frame. */
  y: number;
}

export type MapLayer = MapImageLayer | MapPinLayer;

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

export interface MapValue {
  /** Images drawn in order, pins above them. */
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
