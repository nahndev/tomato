export const SubmissionDocKey = {
  VALUES: 'values',
} as const;
export type SubmissionDocKey = (typeof SubmissionDocKey)[keyof typeof SubmissionDocKey];

export const SUBMISSION_DOCUMENT_PREFIX = 'submission';
export const SUBMISSION_REFER_SEPARATOR = ':';

export const SubmissionDependencyType = {
  PARENT: 'parent',
  REFERENCE: 'reference',
} as const;
export type SubmissionDependencyType = (typeof SubmissionDependencyType)[keyof typeof SubmissionDependencyType];
