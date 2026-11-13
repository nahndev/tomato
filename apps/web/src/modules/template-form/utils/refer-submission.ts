import { LinkTargetType, WidgetBehaviorType } from "@tomato/constants";
import { ReferStepStatus, type ReferStep } from "@/modules/template-widget";
import type { TemplateSnapshot } from "@/shared/types/template.types";

export function getReferUserIds(
  snapshot: TemplateSnapshot,
  values: Record<string, unknown>,
  widgetId: string,
): string[] {
  const usersWidgetId = snapshot.links[widgetId]?.[LinkTargetType.WIDGET]?.uuid;
  const value = usersWidgetId ? values[usersWidgetId] : undefined;
  const ids = (Array.isArray(value) ? value : [value]).filter((id): id is string => typeof id === "string" && id !== "");
  return [...new Set(ids)];
}

/** Selected users first, then users whose submission the next apply deletes. */
export function getReferSteps(userIds: string[], references: Record<string, string> = {}): ReferStep[] {
  const selected = new Set(userIds);
  const steps: ReferStep[] = userIds.map((userId) => {
    const href = references[userId];
    return { userId, href, status: href ? ReferStepStatus.CREATED : ReferStepStatus.WILL_CREATE };
  });
  for (const [userId, href] of Object.entries(references)) {
    if (!selected.has(userId)) steps.push({ userId, href, status: ReferStepStatus.WILL_DELETE });
  }
  return steps;
}

export function hasReferChanges(steps: ReferStep[]): boolean {
  return steps.some((step) => step.status !== ReferStepStatus.CREATED);
}

/** The latest apply time among refer submission widgets whose steps still have changes. */
export function getPendingReferAppliedAt(
  snapshot: TemplateSnapshot,
  values: Record<string, unknown>,
  references: Record<string, Record<string, string>>,
): string | undefined {
  let latest: string | undefined;
  for (const [widgetId, behaviors] of Object.entries(snapshot.behaviors)) {
    const appliedAt = values[widgetId];
    if (!behaviors.includes(WidgetBehaviorType.REFER_SUBMISSION) || typeof appliedAt !== "string") continue;
    if (!hasReferChanges(getReferSteps(getReferUserIds(snapshot, values, widgetId), references[widgetId]))) continue;
    if (!latest || appliedAt > latest) latest = appliedAt;
  }
  return latest;
}
