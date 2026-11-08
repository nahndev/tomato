import { STORAGE_FILE_MAX_SIZE } from './storage.constants';

export const MAP_IMAGE_MAX_SIZE = STORAGE_FILE_MAX_SIZE;
export const MAP_PIN_LABEL_MAX_LENGTH = 100;
export const MAP_PIN_DESCRIPTION_MAX_LENGTH = 1000;
export const MAP_LAYER_ID_MAX_LENGTH = 64;
export const MAP_LAYER_MAX_COUNT = 500;
export const MAP_ZONE_MIN_POINTS = 3;
export const MAP_ZONE_MAX_POINTS = 100;
/** Largest image width/height, as a ratio of the frame width/height. */
export const MAP_IMAGE_RECT_MAX = 4;
/** Frame of maps saved without one; layers are ratios of the frame. */
export const MAP_FRAME_DEFAULT_SIZE = { width: 1920, height: 1080 } as const;
/** Frame side limits, in pixels. */
export const MAP_FRAME_MIN_SIZE = 100;
export const MAP_FRAME_MAX_SIZE = 10000;
export const MAP_TEXT_MAX_LENGTH = 1000;
/** Text size limits, in frame pixels. */
export const MAP_TEXT_MIN_FONT_SIZE = 8;
export const MAP_TEXT_MAX_FONT_SIZE = 1000;

export const MapLayerType = {
  IMAGE: 'image',
  PIN: 'pin',
  ZONE: 'zone',
  TEXT: 'text',
  ARROW: 'arrow',
} as const;
export type MapLayerType = (typeof MapLayerType)[keyof typeof MapLayerType];

/** Icons a pin layer can show. */
export const MapPinIcon = {
  MAP_PIN: 'map-pin',
  FLAG: 'flag',
  STAR: 'star',
  HEART: 'heart',
  HOUSE: 'house',
  DOOR: 'door',
  INFO: 'info',
  HELP: 'help',
  WARNING: 'warning',
  CAMERA: 'camera',
  COFFEE: 'coffee',
  FOOD: 'food',
  PARKING: 'parking',
  ACCESSIBLE: 'accessible',
  PHONE: 'phone',
  WIFI: 'wifi',
} as const;
export type MapPinIcon = (typeof MapPinIcon)[keyof typeof MapPinIcon];
