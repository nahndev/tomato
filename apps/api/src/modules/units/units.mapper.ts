import type { Unit } from '@tomato/types';
import { toUnitType } from '../unit-types/unit-types.mapper';
import type { UnitEntity } from './units.repository';

export function toUnit(entity: UnitEntity): Unit {
  return {
    id: entity.id,
    name: entity.name,
    isSystem: entity.isSystem,
    type: toUnitType(entity.type),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
