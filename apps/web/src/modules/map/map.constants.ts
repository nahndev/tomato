import type { UserFilePickerOptions } from "@/modules/file";
import { ImageMimeType, MAP_IMAGE_MAX_SIZE } from "@tomato/constants";

export const MAP_LIST_PAGE_SIZE = 100;
export const MAP_NAME_MAX_LENGTH = 100;
/** Delay before value changes (pan, zoom, pin moves) are saved. */
export const MAP_SAVE_DELAY = 500;
/** Map content size in pixels; layers are stored as ratios of it. */
export const MAP_FRAME_SIZE = { width: 1920, height: 1080 } as const;

export const MAP_IMAGE_PICKER_OPTIONS: UserFilePickerOptions = {
  accept: Object.fromEntries(
    Object.values(ImageMimeType).map((mimeType) => [mimeType, []]),
  ),
  maxSize: MAP_IMAGE_MAX_SIZE,
  multiple: false,
  title: "Choose map image",
  confirmLabel: "Add to map",
  confirmFailedMessage: "Could not use the image",
};
