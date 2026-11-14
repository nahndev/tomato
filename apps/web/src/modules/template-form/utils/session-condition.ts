import { SessionConditionType } from "@tomato/constants";
import { hasValue } from "@/modules/template-data";
import type { SessionCondition } from "@/shared/types/template.types";

export function evaluateSessionCondition(
  condition: SessionCondition | undefined,
  values: Record<string, unknown>,
): boolean {
  if (!condition || condition.type === SessionConditionType.ALWAYS) return true;
  if (condition.type === SessionConditionType.BUTTON_CLICKED) return Boolean(values[condition.widgetId]);
  return hasValue(values[condition.widgetId]);
}
