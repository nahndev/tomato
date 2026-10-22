import type { UnitType } from '@tomato/types';
import type { UnitType as UnitTypeModel } from '../../generated/prisma/client';

export function toUnitType(entity: UnitTypeModel): UnitType {
  return { id: entity.id, name: entity.name, isDefault: entity.isDefault };
}
