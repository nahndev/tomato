import { SUBMISSION_REFER_SEPARATOR } from '@tomato/constants';
import { SubmissionRefer } from './submission-refer';

export interface SubmissionIdempotencyKeyParts {
  refer: string;
  id: string;
}

export class SubmissionIdempotencyKey {
  static format({ refer, id }: SubmissionIdempotencyKeyParts): string {
    return [refer, id].join(SUBMISSION_REFER_SEPARATOR);
  }

  static parse(key: string): SubmissionIdempotencyKeyParts | null {
    const index = key.lastIndexOf(SUBMISSION_REFER_SEPARATOR);
    const refer = key.slice(0, index);
    const id = key.slice(index + SUBMISSION_REFER_SEPARATOR.length);
    if (index < 0 || !id || !SubmissionRefer.parse(refer)) return null;
    return { refer, id };
  }
}
