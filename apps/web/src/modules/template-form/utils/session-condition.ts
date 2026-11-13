import { SessionConditionType } from "@tomato/constants";
import type { SessionCondition } from "@/shared/types/template.types";

function hasValue(value: unknown): boolean {
  if (value === undefined || value === null || value === "") return false;
  if (Array.isArray(value)) return value.length > 0;
  return true;
}

export function evaluateSessionCondition(
  condition: SessionCondition | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!condition || condition.type === SessionConditionType.ALWAYS) return true;
  if (condition.type === SessionConditionType.BUTTON_CLICKED) return Boolean(values[condition.widgetId]);
  return hasValue(values[condition.widgetId]);
}
