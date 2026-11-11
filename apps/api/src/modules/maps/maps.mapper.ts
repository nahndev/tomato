import { MapLayerType } from '@tomato/constants';
import type { MapLayer, MapPoint, MapValue } from './maps.types';
import type { AnyMapLayerDto, MapValueDto } from './dto/map-value.dto';

export function toMapValue({ frame, layers, viewport }: MapValueDto): MapValue {
  const { transform } = viewport;
  return {
    ...(frame && { frame: { width: frame.width, height: frame.height } }),
    layers: layers.map(toMapLayer),
    viewport: { transform: transform && { x: transform.x, y: transform.y, scale: transform.scale } },
  };
}

function toMapLayer(layer: AnyMapLayerDto): MapLayer {
  if (layer.type === MapLayerType.IMAGE) {
    const { type, id, fileId, x, y, width, height } = layer;
    return { type, id, fileId, x, y, width, height, ...toLock(layer) };
  }
  if (layer.type === MapLayerType.ZONE) {
    const { type, id, label, description, points, color } = layer;
    return { type, id, label, description, points: points.map(toPoint), ...(color && { color }), ...toLock(layer) };
  }
  if (layer.type === MapLayerType.TEXT) {
    const { type, id, text, x, y, fontSize, color } = layer;
    return { type, id, text, x, y, fontSize, ...(color && { color }), ...toLock(layer) };
  }
  if (layer.type === MapLayerType.ARROW) {
    const { type, id, start, end, color } = layer;
    return { type, id, start: toPoint(start), end: toPoint(end), ...(color && { color }), ...toLock(layer) };
  }
  const { type, id, label, description, x, y, color, icon } = layer;
  return { type, id, label, description, x, y, ...(color && { color }), ...(icon && { icon }), ...toLock(layer) };
}

function toPoint({ x, y }: MapPoint): MapPoint {
  return { x, y };
}

function toLock({ isLocked }: AnyMapLayerDto): Pick<MapLayer, 'isLocked'> {
  return isLocked ? { isLocked } : {};
}
