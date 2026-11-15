import type { Prisma } from '../../generated/prisma/client';

export const BOARD_NAME_MAX_LENGTH = 100;

export const BOARD_TEMPLATE_INCLUDE = {
  template: { include: { versions: { orderBy: { createdAt: 'desc' }, take: 1 } } },
} satisfies Prisma.BoardTemplateInclude;

export const BOARD_INCLUDE = {
  templates: { orderBy: { template: { createdAt: 'asc' } }, include: BOARD_TEMPLATE_INCLUDE },
  table: true,
  task: { include: { settings: true } },
  agenda: true,
} satisfies Prisma.BoardInclude;
