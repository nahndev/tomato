import type { User } from '@tomato/types';
import type { User as UserEntity } from '../../generated/prisma/client';

export function toUser(entity: UserEntity): User {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    name: entity.name,
    email: entity.email,
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
