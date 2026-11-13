"use client";

import { LinkTargetType } from "@tomato/constants";
import { Button } from "@tomato/ui";
import { CheckIcon, CircleCheckIcon, CircleMinusIcon, CirclePlusIcon, LoaderCircleIcon } from "lucide-react";
import Link from "next/link";
import { ReferStepStatus, USER_SHORT_ID_LENGTH } from "../../template-widget.constants";
import type { FieldComponentProps, ReferStep } from "../../template-widget.types";
import { useWidgetById, useWidgetLink } from "../widgets-context";

interface ReferSubmissionWidgetItemProps extends FieldComponentProps {
  steps?: ReferStep[];
  /** An apply was sent and its changes are not visible yet. */
  isApplying?: boolean;
}

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

export function ReferSubmissionWidgetItem({
  widget,
  onChange,
  steps = [],
  isApplying = false,
}: ReferSubmissionWidgetItemProps) {
  const link = useWidgetLink(widget.id);
  const usersWidget = useWidgetById(link?.[LinkTargetType.WIDGET]?.uuid);
  const isLinked = Boolean(usersWidget && link?.[LinkTargetType.TEMPLATE]);
  const hasChanges = steps.some((step) => step.status !== ReferStepStatus.CREATED);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{widget.label || "(no label)"}</span>
        <Button
          type="button"
          size="sm"
          disabled={!onChange || !isLinked || !hasChanges || isApplying}
          onClick={() => onChange?.(new Date().toISOString())}
        >
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
          {steps.map((step) => {
            const description = getReferStepDescription(step.status, isApplying);
            return (
              <li key={step.userId} className="flex items-center gap-2 text-sm">
                <ReferStepIcon status={step.status} isApplying={isApplying} />
                <span className="font-medium">User {step.userId.slice(-USER_SHORT_ID_LENGTH)}</span>
                {step.href ? (
                  <Link href={step.href} className="text-muted-foreground underline-offset-4 hover:underline">
                    {description}
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{description}</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
