import type { Prisma } from '../../generated/prisma/client';

export const SUBMISSIONS_ROUTE = 'submissions';
export const SUBMISSION_VALUES_PATH = 'values';

export const SUBMISSION_INCLUDE = { templateVersion: { select: { templateId: true } } } satisfies Prisma.SubmissionInclude;
export const SUBMISSION_DETAIL_INCLUDE = { templateVersion: true } satisfies Prisma.SubmissionInclude;
export const SUBMISSION_OMIT = { dataClocks: true } satisfies Prisma.SubmissionOmit;
