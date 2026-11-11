import type { Prisma, UserAddress } from '../../generated/prisma/client';
import type { USER_INCLUDE } from './users.constants';

export type UserWithRelations = Prisma.UserGetPayload<{ include: typeof USER_INCLUDE }>;

export interface UserUpdateData {
  eid?: string | null;
  name?: string;
  familyName?: string | null;
  email?: string;
  tel?: string | null;
  avatarFileId?: string;
  addresses?: Pick<UserAddress, 'street' | 'city' | 'postalCode' | 'country'>[];
  roleIds?: string[];
}
