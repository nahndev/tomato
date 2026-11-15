import type { Prisma } from '../../generated/prisma/client';

export const BOARD_NAME_MAX_LENGTH = 100;

export const BOARD_TEMPLATE_INCLUDE = {
  template: { include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } } },
  tableSetting: true,
  taskSetting: true,
} satisfies Prisma.BoardTemplateInclude;

export const BOARD_INCLUDE = {
  templates: { orderBy: { template: { createdAt: 'asc' } }, include: BOARD_TEMPLATE_INCLUDE },
} satisfies Prisma.BoardInclude;
