"use client";

import { SubmissionConnection } from "./submission-connection";
import type { SubmissionDetail } from "../submission.types";

interface SubmissionHeaderProps {
  submission: SubmissionDetail;
}

export function SubmissionHeader({ submission }: SubmissionHeaderProps) {
  const { templateVersion } = submission;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 text-foreground">
      <h1 className="truncate font-medium">{templateVersion.snapshot.name || "Untitled"}</h1>
      <div className="flex-1" />
      <span className="text-sm text-muted-foreground">v{templateVersion.version}</span>
      <SubmissionConnection />
    </header>
  );
}
