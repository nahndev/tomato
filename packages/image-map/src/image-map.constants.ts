import type { ImageMapViewport } from "./image-map.types";

/** Zoom is relative to the scale that fits the content in the viewport. */
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 8;
export const ZOOM_STEP = 1.5;
/** Pixels the content keeps inside the viewport while zooming. */
export const MIN_VISIBLE_SIZE = 64;
/** Held to pan by dragging anywhere, layers included. */
export const PAN_KEY_CODE = "Space";
/** Pixels a pointer moves before a press counts as a drag, not a click. */
export const DRAG_THRESHOLD = 4;

/** Smallest image side, in frame pixels. */
export const MIN_IMAGE_SIZE = 16;
/** Largest image side, as a ratio of the frame side. */
export const MAX_IMAGE_RATIO = 4;
/** Frame pixels an image keeps inside the frame while moving. */
export const MIN_IMAGE_VISIBLE_SIZE = 32;

export const IDENTITY_TRANSFORM = { x: 0, y: 0, scale: 1 } as const;
export const NEW_PIN_ID_PREFIX = "pin-";

export const ImageMapLayerType = {
  IMAGE: "image",
  PIN: "pin",
} as const;
export type ImageMapLayerType =
  (typeof ImageMapLayerType)[keyof typeof ImageMapLayerType];
export const PIN_DND_TYPE = "image-map-pin";

export const ResizeCorner = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
} as const;
export type ResizeCorner = (typeof ResizeCorner)[keyof typeof ResizeCorner];

export const DEFAULT_VIEWPORT: ImageMapViewport = {
  transform: null,
  selectedLayerId: null,
  isAddingPin: false,
};

/** EXIF orientations from this value on rotate the image by 90°. */
export const MIN_ROTATED_ORIENTATION = 5;
