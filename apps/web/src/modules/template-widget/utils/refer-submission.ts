import { ReferStepStatus } from "../template-widget.constants";
import type { ReferStep } from "../template-widget.types";
import { toUserIds } from "./users";

/** Selected users first, then users whose submission the next apply deletes. */
export function getReferSteps(usersValue: unknown, references: Record<string, string> = {}): ReferStep[] {
  const selected = new Set(toUserIds(usersValue));
  const steps: ReferStep[] = [...selected].map((userId) => {
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
