import type { User } from '@tomato/types';
import type { UserWithRelations } from './users.types';

export function toUser(entity: UserWithRelations): User {
  return {
    id: entity.id,
    departmentId: entity.departmentId,
    eid: entity.eid,
    name: entity.name,
    familyName: entity.familyName,
    email: entity.email,
    tel: entity.tel,
    avatarKey: entity.avatarKey,
    addresses: entity.addresses.map(({ street, city, postalCode, country }) => ({
      street,
      city,
      postalCode,
      country,
    })),
    roleIds: entity.roles.map(({ roleId }) => roleId),
    createdAt: entity.createdAt.toISOString(),
    updatedAt: entity.updatedAt.toISOString(),
  };
}
