import type { SubmissionDependency } from "@/modules/submission-dependency";
import { parseSubmissionIdempotencyKey, toSubmissionIdempotencyKey } from "@tomato/utils";
import { ReferStepStatus } from "../template-widget.constants";
import type { ReferStep } from "../template-widget.types";
import { toUserIds } from "./users";

/** One step per selected user, then one per dependency of `refer` the next apply deletes. */
export function getReferSteps(
  refer: string | undefined,
  usersValue: unknown,
  dependencies: SubmissionDependency[],
): ReferStep[] {
  if (!refer) return [];
  const byKey = new Map(dependencies.map((dependency) => [dependency.idempotencyKey, dependency]));
  const userIds = [...new Set(toUserIds(usersValue))];
  const keys = new Set(userIds.map((userId) => toSubmissionIdempotencyKey(refer, userId)));

  const steps: ReferStep[] = userIds.map((userId) => {
    const idempotencyKey = toSubmissionIdempotencyKey(refer, userId);
    const targetId = byKey.get(idempotencyKey)?.targetId;
    return { userId, idempotencyKey, targetId, status: targetId ? ReferStepStatus.CREATED : ReferStepStatus.WILL_CREATE };
  });
  for (const { idempotencyKey, targetId } of dependencies) {
    const userId = idempotencyKey && !keys.has(idempotencyKey) && parseSubmissionIdempotencyKey(refer, idempotencyKey);
    if (userId) steps.push({ userId, idempotencyKey, targetId, status: ReferStepStatus.WILL_DELETE });
  }
  return steps;
}

export function hasReferChanges(steps: ReferStep[]): boolean {
  return steps.some((step) => step.status !== ReferStepStatus.CREATED);
}
