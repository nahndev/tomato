"use client";

import { getSubmissionPath } from "@/modules/submission-dependency";
import { Button } from "@tomato/ui";
import { CheckIcon, CircleCheckIcon, CircleMinusIcon, CirclePlusIcon, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { ReferStepStatus, USER_SHORT_ID_LENGTH } from "../../template-widget.constants";
import { useReferApply } from "../../hooks/use-refer-apply";
import { useReferSteps } from "../../hooks/use-refer-steps";
import type { FieldComponentProps, ReferStep } from "../../template-widget.types";

function ReferStepIcon({ status, isApplying }: { status: ReferStepStatus; isApplying: boolean }) {
  if (status === ReferStepStatus.CREATED) return <CircleCheckIcon className="size-4 text-primary" />;
  if (isApplying) return <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />;
  if (status === ReferStepStatus.WILL_DELETE) return <CircleMinusIcon className="size-4 text-destructive" />;
  return <CirclePlusIcon className="size-4 text-muted-foreground" />;
}

function getReferStepDescription(status: ReferStepStatus, isApplying: boolean): string {
  if (status === ReferStepStatus.CREATED) return "Submission created";
  if (status === ReferStepStatus.WILL_DELETE) return isApplying ? "Deleting submission…" : "Will delete submission";
  return isApplying ? "Creating submission…" : "Will create submission";
}

function ReferStepItem({ step, isApplying }: { step: ReferStep; isApplying: boolean }) {
  const description = getReferStepDescription(step.status, isApplying);
  return (
    <li className="flex items-center gap-2 text-sm">
      <ReferStepIcon status={step.status} isApplying={isApplying} />
      <span className="font-medium">User {step.userId.slice(-USER_SHORT_ID_LENGTH)}</span>
      {step.targetId ? (
        <Link href={getSubmissionPath(step.targetId)} className="text-muted-foreground underline-offset-4 hover:underline">
          {description}
        </Link>
      ) : (
        <span className="text-muted-foreground">{description}</span>
      )}
    </li>
  );
}

export function ReferSubmissionWidgetItem({ widget, onChange }: FieldComponentProps) {
  const referSteps = useReferSteps(widget.id);
  const { steps, usersWidget, hasChanges, isLinked } = referSteps;
  const { applyingKeys, isApplying, apply } = useReferApply(referSteps, onChange);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{widget.label || "(no label)"}</span>
        <Button type="button" size="sm" disabled={!onChange || !isLinked || !hasChanges || isApplying} onClick={apply}>
          {isApplying ? <LoaderCircleIcon className="animate-spin" /> : <CheckIcon />}
          Apply
        </Button>
      </div>
      {!isLinked ? (
        <p className="text-sm text-muted-foreground">Pick a users widget and a template</p>
      ) : steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">One step per user of {usersWidget?.label || "(no label)"}</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {steps.map((step) => (
            <ReferStepItem key={step.idempotencyKey} step={step} isApplying={applyingKeys.has(step.idempotencyKey)} />
          ))}
        </ol>
      )}
    </div>
  );
}
