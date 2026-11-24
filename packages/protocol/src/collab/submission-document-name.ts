import { SUBMISSION_DOCUMENT_PREFIX } from '@tomato/constants';

export interface SubmissionDocumentNameParts {
  submissionId: string;
}

export class SubmissionDocumentName {
  static format({ submissionId }: SubmissionDocumentNameParts): string {
    return `${SUBMISSION_DOCUMENT_PREFIX}/${submissionId}`;
  }

  static parse(name: string): SubmissionDocumentNameParts | null {
    const [prefix, submissionId, ...rest] = name.split('/');
    if (prefix !== SUBMISSION_DOCUMENT_PREFIX || !submissionId || rest.length > 0) return null;
    return { submissionId };
  }
}
