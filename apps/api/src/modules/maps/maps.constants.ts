import { MAP_FRAME_DEFAULT_SIZE, MAP_IMAGE_RECT_MAX } from '@tomato/constants';
import type { MapValue } from '@tomato/types';

export const MAP_PIN_COORDINATE_MIN = 0;
export const MAP_PIN_COORDINATE_MAX = 1;
export const MAP_IMAGE_POSITION_MIN = -MAP_IMAGE_RECT_MAX;
export const MAP_IMAGE_POSITION_MAX = 1;

export const EMPTY_MAP_VALUE: MapValue = {
  frame: { ...MAP_FRAME_DEFAULT_SIZE },
  layers: [],
  viewport: { transform: null },
};
