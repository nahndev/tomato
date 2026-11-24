import type { SubmissionDependency } from "@/modules/submission-dependency";
import { SubmissionIdempotencyKey } from "@tomato/protocol";
import { ReferStepStatus } from "../../../template-widget.constants";
import type { ReferStep } from "../../../template-widget.types";
import { toUserIds } from "../../../utils/users";

export function getReferSteps(
  refer: string | undefined,
  usersValue: unknown,
  dependencies: SubmissionDependency[],
): ReferStep[] {
  if (!refer) return [];
  const byKey = new Map(dependencies.map((dependency) => [dependency.idempotencyKey, dependency]));
  const userIds = [...new Set(toUserIds(usersValue))];
  const keys = new Set(userIds.map((userId) => SubmissionIdempotencyKey.format({ refer, id: userId })));

  const steps: ReferStep[] = userIds.map((userId) => {
    const idempotencyKey = SubmissionIdempotencyKey.format({ refer, id: userId });
    const targetId = byKey.get(idempotencyKey)?.targetId;
    return { userId, idempotencyKey, targetId, status: targetId ? ReferStepStatus.CREATED : ReferStepStatus.WILL_CREATE };
  });
  for (const { idempotencyKey, targetId } of dependencies) {
    if (!idempotencyKey || keys.has(idempotencyKey)) continue;
    const parsed = SubmissionIdempotencyKey.parse(idempotencyKey);
    if (parsed?.refer === refer) steps.push({ userId: parsed.id, idempotencyKey, targetId, status: ReferStepStatus.WILL_DELETE });
  }
  return steps;
}

export function getPendingReferKeys(steps: ReferStep[]): Set<string> {
  return new Set(steps.filter((step) => step.status !== ReferStepStatus.CREATED).map((step) => step.idempotencyKey));
}
