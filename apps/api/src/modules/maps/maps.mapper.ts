import type { DepartmentMap, DepartmentMapDetail, MapPin } from '@tomato/types';
import type {
  DepartmentMap as DepartmentMapEntity,
  MapPin as MapPinEntity,
} from '../../generated/prisma/client';

export function toDepartmentMap(entity: DepartmentMapEntity): DepartmentMap {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    name: entity.name,
    imageFileId: entity.imageFileId,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toMapPin(entity: MapPinEntity): MapPin {
  return {
    id: entity.id,
    mapId: entity.mapId,
    label: entity.label,
    description: entity.description,
    x: entity.x,
    y: entity.y,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}

export function toDepartmentMapDetail(entity: DepartmentMapEntity & { pins: MapPinEntity[] }): DepartmentMapDetail {
  return { ...toDepartmentMap(entity), pins: entity.pins.map(toMapPin) };
}
