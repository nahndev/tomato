import { SUBMISSION_REFER_SEPARATOR } from '@tomato/constants';

export interface SubmissionReferParts {
  sourceId: string;
  widgetId: string;
}

export class SubmissionRefer {
  static format({ sourceId, widgetId }: SubmissionReferParts): string {
    return [sourceId, widgetId].join(SUBMISSION_REFER_SEPARATOR);
  }

  static parse(refer: string): SubmissionReferParts | null {
    const [sourceId, widgetId, ...rest] = refer.split(SUBMISSION_REFER_SEPARATOR);
    if (!sourceId || !widgetId || rest.length > 0) return null;
    return { sourceId, widgetId };
  }
}
