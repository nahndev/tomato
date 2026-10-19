import { DisplayBucket } from "@tomato/constants";
import type { SubmissionDisplayValue } from "@tomato/types";

/** The text bucket wins; the entity keys are only a fallback when there is no text bucket at all. */
export function parseLabel(value: SubmissionDisplayValue | undefined): string | null {
  const text = value?.[DisplayBucket.TEXT];
  const entity = value?.[DisplayBucket.ENTITY];
  if (typeof text === "string" && text.length > 0) return text;
  if (typeof text === "string" && entity !== undefined) return null;
  if (Array.isArray(entity) && entity.length > 0) return entity.join(", ");
  return null;
}

/** Numbers are stored under the text bucket. */
export function parseNumber(value: SubmissionDisplayValue | undefined): number | null {
  const text = value?.[DisplayBucket.TEXT];
  if (typeof text !== "string" || text.length === 0) return null;
  const parsed = Number(text);
  return Number.isNaN(parsed) ? null : parsed;
}

export function parseTimestamp(value: SubmissionDisplayValue | undefined): number | null {
  const date = value?.[DisplayBucket.DATE];
  return typeof date === "number" ? date : null;
}
