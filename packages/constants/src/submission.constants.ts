export const SubmissionDocKey = {
  VALUES: 'values',
} as const;
export type SubmissionDocKey = (typeof SubmissionDocKey)[keyof typeof SubmissionDocKey];

export const SUBMISSION_DOCUMENT_PREFIX = 'submission';
