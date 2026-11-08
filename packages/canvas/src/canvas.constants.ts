import { MapPinIcon } from "@tomato/constants";
import {
  AccessibilityIcon,
  CameraIcon,
  CircleHelpIcon,
  CircleParkingIcon,
  CoffeeIcon,
  DoorOpenIcon,
  FlagIcon,
  HeartIcon,
  HouseIcon,
  InfoIcon,
  MapPinIcon as MapPinLucideIcon,
  PhoneIcon,
  StarIcon,
  TriangleAlertIcon,
  UtensilsIcon,
  WifiIcon,
  type LucideIcon,
} from "lucide-react";
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
export const ARROW_LABEL_PREFIX = "Arrow ";
export const TEXT_LABEL_FALLBACK = "Text";
/** Screen pixels from the first vertex within which a click closes the polygon. */
export const ZONE_CLOSE_DISTANCE = 8;
/** Smallest rectangle side, in screen pixels. */
export const MIN_ZONE_DRAG_SIZE = 4;
export const FINISH_KEY = "Enter";
export const CANCEL_KEY = "Escape";
export const UNDO_POINT_KEY = "Backspace";
/** Vertices of a drawn ellipse. */
export const ELLIPSE_SEGMENTS = 48;
/** Arrow head length and stroke width, in screen pixels. */
export const ARROW_HEAD_SIZE = 12;
export const ARROW_STROKE_WIDTH = 2;
/** Width of the invisible stroke that picks an arrow, in screen pixels. */
export const ARROW_HIT_WIDTH = 12;
/** Angle step a Shift drag snaps an arrow to. */
export const ARROW_SNAP_ANGLE = Math.PI / 4;

export const CanvasLayerType = {
  IMAGE: "image",
  PIN: "pin",
  ZONE: "zone",
  TEXT: "text",
  ARROW: "arrow",
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
  PAN: "pan",
  ICON: "icon",
  TEXT: "text",
  RECTANGLE: "rectangle",
  ELLIPSE: "ellipse",
  POLYGON: "polygon",
  ARROW: "arrow",
} as const;
export type CanvasTool = (typeof CanvasTool)[keyof typeof CanvasTool];

/** `react-hotkeys-hook` keys, matched on the physical key. */
export const TOOL_HOTKEYS: Record<CanvasTool, string> = {
  [CanvasTool.SELECT]: "v",
  [CanvasTool.PAN]: "h",
  [CanvasTool.ICON]: "i",
  [CanvasTool.TEXT]: "t",
  [CanvasTool.RECTANGLE]: "r",
  [CanvasTool.ELLIPSE]: "o",
  [CanvasTool.POLYGON]: "p",
  [CanvasTool.ARROW]: "a",
};

export const LayerOrder = {
  FRONT: "front",
  FORWARD: "forward",
  BACKWARD: "backward",
  BACK: "back",
} as const;
export type LayerOrder = (typeof LayerOrder)[keyof typeof LayerOrder];

export const LAYER_ORDER_HOTKEYS: Record<LayerOrder, string> = {
  [LayerOrder.FRONT]: "shift+bracketright",
  [LayerOrder.FORWARD]: "bracketright",
  [LayerOrder.BACKWARD]: "bracketleft",
  [LayerOrder.BACK]: "shift+bracketleft",
};
export const DUPLICATE_HOTKEY = "mod+d";

export const PIN_ICONS: Record<MapPinIcon, { label: string; icon: LucideIcon }> = {
  [MapPinIcon.MAP_PIN]: { label: "Pin", icon: MapPinLucideIcon },
  [MapPinIcon.FLAG]: { label: "Flag", icon: FlagIcon },
  [MapPinIcon.STAR]: { label: "Star", icon: StarIcon },
  [MapPinIcon.HEART]: { label: "Heart", icon: HeartIcon },
  [MapPinIcon.HOUSE]: { label: "House", icon: HouseIcon },
  [MapPinIcon.DOOR]: { label: "Door", icon: DoorOpenIcon },
  [MapPinIcon.INFO]: { label: "Info", icon: InfoIcon },
  [MapPinIcon.HELP]: { label: "Help", icon: CircleHelpIcon },
  [MapPinIcon.WARNING]: { label: "Warning", icon: TriangleAlertIcon },
  [MapPinIcon.CAMERA]: { label: "Camera", icon: CameraIcon },
  [MapPinIcon.COFFEE]: { label: "Coffee", icon: CoffeeIcon },
  [MapPinIcon.FOOD]: { label: "Food", icon: UtensilsIcon },
  [MapPinIcon.PARKING]: { label: "Parking", icon: CircleParkingIcon },
  [MapPinIcon.ACCESSIBLE]: { label: "Accessible", icon: AccessibilityIcon },
  [MapPinIcon.PHONE]: { label: "Phone", icon: PhoneIcon },
  [MapPinIcon.WIFI]: { label: "Wi-Fi", icon: WifiIcon },
};
export const DEFAULT_PIN_ICON = MapPinIcon.MAP_PIN;

/** In frame pixels. */
export const TEXT_FONT_SIZES = [
  { name: "Small", size: 24 },
  { name: "Medium", size: 48 },
  { name: "Large", size: 96 },
  { name: "Title", size: 160 },
] as const;
export const DEFAULT_TEXT_FONT_SIZE = 48;
