/** Zoom is relative to the scale that fits the content in the viewport. */
export const DEFAULT_MIN_ZOOM = 0.5;
export const DEFAULT_MAX_ZOOM = 8;
export const ZOOM_STEP = 1.5;
export const WHEEL_ZOOM_SPEED = 0.002;
/** Pixels the content keeps inside the viewport while panning. */
export const MIN_VISIBLE_SIZE = 64;
/** Pixels a pointer moves before a press counts as a drag, not a click. */
export const DRAG_THRESHOLD = 4;

export const IDENTITY_TRANSFORM = { x: 0, y: 0, scale: 1 } as const;
