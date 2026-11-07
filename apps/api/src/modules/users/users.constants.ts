import type { Prisma } from '../../generated/prisma/client';

export const EMAIL_MAX_LENGTH = 254;

export const USER_INCLUDE = {
  addresses: { orderBy: { position: 'asc' } },
  roles: { select: { roleId: true } },
} satisfies Prisma.UserInclude;
