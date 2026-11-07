import { MapLayerType } from '@tomato/constants';
import type { DepartmentMap, MapLayer, MapValue } from '@tomato/types';
import type { DepartmentMap as DepartmentMapEntity } from '../../generated/prisma/client';
import type { AnyMapLayerDto, MapValueDto } from './dto/map-value.dto';

export function toDepartmentMap(entity: DepartmentMapEntity): DepartmentMap {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    name: entity.name,
    // Validated as a `MapValueDto` on write.
    value: entity.value as unknown as MapValue,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

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
  const { type, id, label, description, x, y } = layer;
  return { type, id, label, description, x, y, ...toLock(layer) };
}

function toLock({ isLocked }: AnyMapLayerDto): Pick<MapLayer, 'isLocked'> {
  return isLocked ? { isLocked } : {};
}
