"use client";

import type { SubmissionDetail } from "@tomato/types";
import { Button } from "@tomato/ui";
import { ArrowLeftIcon } from "lucide-react";
import Link from "next/link";
import { SubmissionConnection } from "./submission-connection";

const BOARD_PATH = "/workspace/boards";

interface SubmissionHeaderProps {
  submission: SubmissionDetail;
}

export function SubmissionHeader({ submission }: SubmissionHeaderProps) {
  const { templateVersion } = submission;

  return (
    <header className="flex items-center gap-3 border-b border-border bg-card px-4 py-2 text-foreground">
      <Button asChild variant="ghost" size="icon" aria-label="Back to board">
        <Link href={`${BOARD_PATH}/${submission.boardId}`}>
          <ArrowLeftIcon />
        </Link>
      </Button>
      <h1 className="truncate font-medium">{templateVersion.snapshot.name || "Untitled"}</h1>
      <div className="flex-1" />
      <span className="text-sm text-muted-foreground">v{templateVersion.version}</span>
      <SubmissionConnection />
    </header>
  );
}
