import type { Prisma } from '../../generated/prisma/client';

export const SUBMISSION_INCLUDE = { templateVersion: { select: { templateId: true } } } satisfies Prisma.SubmissionInclude;
export const SUBMISSION_DETAIL_INCLUDE = { templateVersion: true } satisfies Prisma.SubmissionInclude;
export const SUBMISSION_OMIT = { dataClocks: true, metaClocks: true } satisfies Prisma.SubmissionOmit;
export const UPDATED_SUBMISSION_SELECT = {
  id: true,
  boardId: true,
  data: true,
  dataDisplays: true,
  title: true,
  updatedAt: true,
} satisfies Prisma.SubmissionSelect;
