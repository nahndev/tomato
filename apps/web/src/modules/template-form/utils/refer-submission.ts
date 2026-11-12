import { LinkTargetType } from "@tomato/constants";
import type { TemplateSnapshot } from "@/shared/types/template.types";

export function getReferUserIds(
  snapshot: TemplateSnapshot,
  values: Record<string, unknown>,
  widgetId: string,
): string[] {
  const usersWidgetId = snapshot.links[widgetId]?.[LinkTargetType.WIDGET]?.uuid;
  const value = usersWidgetId ? values[usersWidgetId] : undefined;
  return (Array.isArray(value) ? value : [value]).filter((id): id is string => typeof id === "string" && id !== "");
}
