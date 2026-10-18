import { SessionConditionType } from "@tomato/constants";
import type { SessionCondition } from "@tomato/types";

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function evaluateSessionCondition(
  condition: SessionCondition | undefined,
  data: Record<string, unknown>,
): boolean {
  if (!condition || condition.type === SessionConditionType.ALWAYS) return true;
  if (condition.type === SessionConditionType.BUTTON_CLICKED) return Boolean(data[condition.widgetId]);
  return hasValue(data[condition.widgetId]);
}
