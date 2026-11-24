import { SUBMISSION_REFER_SEPARATOR } from '@tomato/constants';

export function buildSubmissionRefer(sourceId: string, widgetId: string): string {
  return [sourceId, widgetId].join(SUBMISSION_REFER_SEPARATOR);
}

export function buildSubmissionIdempotencyKey(refer: string, id: string): string {
  return [refer, id].join(SUBMISSION_REFER_SEPARATOR);
}

export function parseSubmissionIdempotencyKey(refer: string, idempotencyKey: string): string | null {
  const prefix = refer + SUBMISSION_REFER_SEPARATOR;
  if (!idempotencyKey.startsWith(prefix) || idempotencyKey.length === prefix.length) return null;
  return idempotencyKey.slice(prefix.length);
}
