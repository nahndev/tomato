"use client";

import { LinkTargetType } from "@tomato/constants";
import { Button } from "@tomato/ui";
import { CircleCheckIcon, CircleIcon, LoaderCircleIcon, PlayIcon } from "lucide-react";
import Link from "next/link";
import { REFER_USER_SHORT_ID_LENGTH } from "../../template-widget.constants";
import type { FieldComponentProps, ReferStep } from "../../template-widget.types";
import { useWidgetById, useWidgetLink } from "../widgets-context";

interface ReferSubmissionWidgetItemProps extends FieldComponentProps {
  steps?: ReferStep[];
}

export function ReferSubmissionWidgetItem({ widget, value, onChange, steps = [] }: ReferSubmissionWidgetItemProps) {
  const link = useWidgetLink(widget.id);
  const usersWidget = useWidgetById(link?.[LinkTargetType.WIDGET]?.uuid);
  const isLinked = Boolean(usersWidget && link?.[LinkTargetType.TEMPLATE]);
  const isStarted = Boolean(value);

  return (
    <div className="flex flex-col gap-3 rounded-md border bg-background p-3">
      <div className="flex items-center justify-between gap-2">
        <span className="text-sm font-medium">{widget.label || "(no label)"}</span>
        <Button
          type="button"
          size="sm"
          disabled={!onChange || !isLinked || steps.length === 0}
          onClick={() => onChange?.(new Date().toISOString())}
        >
          <PlayIcon />
          Start
        </Button>
      </div>
      {!isLinked ? (
        <p className="text-sm text-muted-foreground">Pick a users widget and a template</p>
      ) : steps.length === 0 ? (
        <p className="text-sm text-muted-foreground">One step per user of {usersWidget?.label || "(no label)"}</p>
      ) : (
        <ol className="flex flex-col gap-2">
          {steps.map((step) => {
            const userLabel = `User ${step.userId.slice(-REFER_USER_SHORT_ID_LENGTH)}`;
            return (
              <li key={step.userId} className="flex items-center gap-2 text-sm">
                {step.href ? (
                  <CircleCheckIcon className="size-4 text-primary" />
                ) : isStarted ? (
                  <LoaderCircleIcon className="size-4 animate-spin text-muted-foreground" />
                ) : (
                  <CircleIcon className="size-4 text-muted-foreground" />
                )}
                <span className="font-medium">{userLabel}</span>
                {step.href ? (
                  <Link href={step.href} className="text-muted-foreground underline-offset-4 hover:underline">
                    Submission created
                  </Link>
                ) : (
                  <span className="text-muted-foreground">{isStarted ? "Creating submission…" : "Waiting to start"}</span>
                )}
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}
