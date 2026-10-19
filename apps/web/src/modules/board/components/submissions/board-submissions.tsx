"use client";

import type { Board } from "@tomato/types";
import { Spinner, toast } from "@tomato/ui";
import { useRouter } from "next/navigation";
import { getSubmissionPath } from "@/modules/submission";
import { useBoardSubmissions } from "../../hooks/use-board-submissions";
import { NewSubmissionButton } from "./new-submission-button";
import { SubmissionTable } from "./submission-table";

interface BoardSubmissionsProps {
  board: Board;
}

export function BoardSubmissions({ board }: BoardSubmissionsProps) {
  const router = useRouter();
  const { submissions, isLoading, hasError, add, remove } = useBoardSubmissions(board.id);

  async function handleCreate(templateId: string) {
    const submission = await add(templateId);
    router.push(getSubmissionPath(submission.id));
  }

  async function handleDelete(id: string) {
    try {
      await remove(id);
    } catch {
      toast.error("Could not delete the submission");
    }
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <p className="text-sm text-muted-foreground">
          {board.templates.length === 0
            ? "Link a template in the Columns tab to create submissions."
            : `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`}
        </p>
        <NewSubmissionButton templates={board.templates} onCreate={handleCreate} />
      </div>
      {isLoading ? (
        <div className="flex justify-center py-10 text-muted-foreground">
          <Spinner />
        </div>
      ) : hasError ? (
        <p className="text-sm text-muted-foreground">Could not load the submissions.</p>
      ) : (
        <SubmissionTable board={board} submissions={submissions} onDelete={handleDelete} />
      )}
    </div>
  );
}
