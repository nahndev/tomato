import { LinkTargetType, WidgetBehaviorType } from "@tomato/constants";
import type { WidgetReferences } from "@/modules/template-store";
import { getReferSteps, hasReferChanges } from "@/modules/template-widget";
import type { TemplateSnapshot } from "@/shared/types/template.types";

/** The latest apply time among refer submission widgets whose steps still have changes. */
export function getPendingReferAppliedAt(
  snapshot: TemplateSnapshot,
  values: Record<string, unknown>,
  references: WidgetReferences,
): string | undefined {
  let latest: string | undefined;
  for (const [widgetId, behaviors] of Object.entries(snapshot.behaviors)) {
    const appliedAt = values[widgetId];
    if (!behaviors.includes(WidgetBehaviorType.REFER_SUBMISSION) || typeof appliedAt !== "string") continue;
    const usersWidgetId = snapshot.links[widgetId]?.[LinkTargetType.WIDGET]?.uuid;
    const usersValue = usersWidgetId ? values[usersWidgetId] : undefined;
    if (!hasReferChanges(getReferSteps(usersValue, references[widgetId]))) continue;
    if (!latest || appliedAt > latest) latest = appliedAt;
  }
  return latest;
}
