import { SUBMISSION_DOCUMENT_PREFIX } from '@tomato/constants';

export function getSubmissionDocumentName(submissionId: string): string {
  return `${SUBMISSION_DOCUMENT_PREFIX}/${submissionId}`;
}

export function parseSubmissionDocumentName(documentName: string): string | null {
  const [prefix, submissionId, ...rest] = documentName.split('/');
  if (prefix !== SUBMISSION_DOCUMENT_PREFIX || !submissionId || rest.length > 0) return null;
  return submissionId;
}
