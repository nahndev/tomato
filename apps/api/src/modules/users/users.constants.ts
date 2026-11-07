import type { Prisma } from '../../generated/prisma/client';

export const EMAIL_MAX_LENGTH = 254;

export const USER_INCLUDE = {
  addresses: { orderBy: { position: 'asc' } },
  roles: {
    select: { roleId: true, role: { select: { name: true, color: true } } },
    orderBy: { role: { name: 'asc' } },
  },
} satisfies Prisma.UserInclude;
