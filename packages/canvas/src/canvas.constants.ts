import type { FramePreset } from "./canvas.types";

/** Zoom is relative to the scale that fits the content in the viewport. */
export const MIN_ZOOM = 0.5;
export const MAX_ZOOM = 8;
export const ZOOM_STEP = 1.5;
/** Pixels the content keeps inside the viewport while zooming. */
export const MIN_VISIBLE_SIZE = 64;
/** Pixels a pointer moves before a press counts as a drag, not a click. */
export const DRAG_THRESHOLD = 4;

/** Smallest image side, in frame pixels. */
export const MIN_IMAGE_SIZE = 16;
/** Largest image side, as a ratio of the frame side. */
export const MAX_IMAGE_RATIO = 4;
/** Frame pixels an image keeps inside the frame while moving. */
export const MIN_IMAGE_VISIBLE_SIZE = 32;

/** Offset of a duplicated layer, as a ratio of the frame side. */
export const DUPLICATE_OFFSET = 0.02;

export const FRAME_PRESETS = [
  { name: "Widescreen 16:9", size: { width: 1920, height: 1080 } },
  { name: "Standard 4:3", size: { width: 1600, height: 1200 } },
  { name: "Square 1:1", size: { width: 1080, height: 1080 } },
  { name: "Portrait 9:16", size: { width: 1080, height: 1920 } },
  { name: "A4 landscape", size: { width: 3508, height: 2480 } },
  { name: "A4 portrait", size: { width: 2480, height: 3508 } },
] as const satisfies readonly FramePreset[];

export const LAYER_COLOR_PRESETS = [
  "#64748b",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
] as const;

export const IDENTITY_TRANSFORM = { x: 0, y: 0, scale: 1 } as const;
export const NEW_PIN_LABEL_PREFIX = "Pin ";
export const IMAGE_LABEL_PREFIX = "Image ";
export const NEW_ZONE_LABEL_PREFIX = "Zone ";
/** Screen pixels from the first vertex within which a click closes the polygon. */
export const ZONE_CLOSE_DISTANCE = 8;
/** Smallest rectangle side, in screen pixels. */
export const MIN_ZONE_DRAG_SIZE = 4;
export const FINISH_KEY = "Enter";
export const CANCEL_KEY = "Escape";
export const UNDO_POINT_KEY = "Backspace";

export const CanvasLayerType = {
  IMAGE: "image",
  PIN: "pin",
  ZONE: "zone",
} as const;
export type CanvasLayerType =
  (typeof CanvasLayerType)[keyof typeof CanvasLayerType];
export const PIN_DND_TYPE = "canvas-pin";

export const ResizeCorner = {
  TOP_LEFT: "top-left",
  TOP_RIGHT: "top-right",
  BOTTOM_LEFT: "bottom-left",
  BOTTOM_RIGHT: "bottom-right",
} as const;
export type ResizeCorner = (typeof ResizeCorner)[keyof typeof ResizeCorner];

/** EXIF orientations from this value on rotate the image by 90°. */
export const MIN_ROTATED_ORIENTATION = 5;

export const SidePanel = {
  LAYERS: "layers",
  PROPERTY: "property",
} as const;
export type SidePanel = (typeof SidePanel)[keyof typeof SidePanel];

export const CanvasTool = {
  SELECT: "select",
  PIN: "pin",
  RECTANGLE: "rectangle",
  POLYGON: "polygon",
} as const;
export type CanvasTool = (typeof CanvasTool)[keyof typeof CanvasTool];
