"use client";

import { SubmissionConnection } from "./submission-connection";
import { SubmissionTitleInput } from "./submission-title-input";
import type { SubmissionDetail } from "../submission.types";

interface SubmissionHeaderProps {
  submission: SubmissionDetail;
}

export function SubmissionHeader({ submission }: SubmissionHeaderProps) {
  const { templateVersion } = submission;

  return (
    <header className="flex h-14 shrink-0 items-center gap-3 border-b border-border bg-card px-4 text-foreground">
      <h1 className="min-w-0 flex-1">
        <SubmissionTitleInput placeholder={templateVersion.snapshot.name || "Untitled"} />
      </h1>
      <span className="text-sm text-muted-foreground">v{templateVersion.version}</span>
      <SubmissionConnection />
    </header>
  );
}
