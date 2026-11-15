import { DisplayBucket, ValueType } from "@tomato/constants";
import type { Submission, SubmissionDisplayValue } from "../board.types";

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

export function getWidgetLabel(submission: Submission, widgetId: string | null | undefined): string | null {
  return widgetId ? parseLabel(submission.dataDisplays[widgetId]?.[ValueType.DEFAULT]) : null;
}

export function getWidgetTimestamp(submission: Submission, widgetId: string | null): number | null {
  return widgetId ? parseTimestamp(submission.dataDisplays[widgetId]?.[ValueType.DEFAULT]) : null;
}
