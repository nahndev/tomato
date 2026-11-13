export const SubmissionDocKey = {
  VALUES: 'values',
  META: 'meta',
} as const;
export type SubmissionDocKey = (typeof SubmissionDocKey)[keyof typeof SubmissionDocKey];

export const SubmissionDocMetaKey = {
  TITLE: 'title',
  UPDATED: 'updated',
} as const;
export type SubmissionDocMetaKey = (typeof SubmissionDocMetaKey)[keyof typeof SubmissionDocMetaKey];

export const SUBMISSION_DOCUMENT_PREFIX = 'submission';
export const SUBMISSION_REFER_SEPARATOR = ':';

export const SubmissionDependencyType = {
  PARENT: 'parent',
  REFERENCE: 'reference',
} as const;
export type SubmissionDependencyType = (typeof SubmissionDependencyType)[keyof typeof SubmissionDependencyType];
