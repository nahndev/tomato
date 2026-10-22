import type { Department } from '@tomato/types';
import type { Department as DepartmentEntity } from '../../generated/prisma/client';

export function toDepartment(entity: DepartmentEntity): Department {
  return {
    id: entity.id,
    name: entity.name,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
