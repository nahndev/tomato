import { SUBMISSION_REFER_SEPARATOR } from '@tomato/constants';

/** The `refer` of every dependency a widget of `sourceId` creates. */
export function toSubmissionRefer(sourceId: string, widgetId: string): string {
  return [sourceId, widgetId].join(SUBMISSION_REFER_SEPARATOR);
}

/** The `idempotency_key` of the dependency `refer` creates for `id`. */
export function toSubmissionIdempotencyKey(refer: string, id: string): string {
  return [refer, id].join(SUBMISSION_REFER_SEPARATOR);
}

/** The `id` an idempotency key of `refer` was built from, or `null` when the key is not one of `refer`'s. */
export function parseSubmissionIdempotencyKey(refer: string, idempotencyKey: string): string | null {
  const prefix = refer + SUBMISSION_REFER_SEPARATOR;
  if (!idempotencyKey.startsWith(prefix) || idempotencyKey.length === prefix.length) return null;
  return idempotencyKey.slice(prefix.length);
}
