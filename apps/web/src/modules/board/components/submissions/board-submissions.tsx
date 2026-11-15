"use client";

import { BoardView } from "@tomato/constants";
import { DataState, toast, Typography } from "@tomato/ui";
import { usePathname, useRouter } from "next/navigation";
import { getSubmissionPath } from "@/modules/submission-dependency";
import { useBoardSubmissions } from "../../hooks/use-board-submissions";
import { BoardAgendaView } from "../views/board-agenda-view";
import { BoardTableView } from "../views/board-table-view";
import { BoardTaskView } from "../views/board-task-view";
import { BoardViewToggle } from "../views/board-view-toggle";
import { NewSubmissionButton } from "./new-submission-button";
import type { Board } from "../../board.types";

interface BoardSubmissionsProps {
  board: Board;
  views: BoardView[];
  view?: BoardView;
}

export function BoardSubmissions({ board, views, view }: BoardSubmissionsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const { submissions, isLoading, hasError, add, remove } = useBoardSubmissions(board, view);

  async function handleCreate(templateId: string) {
    const submission = await add(templateId);
    router.push(getSubmissionPath(submission.id));
  }

  function handleViewChange(next: BoardView) {
    router.replace(next === views[0] ? pathname : `${pathname}?view=${next}`, { scroll: false });
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
        <Typography as="p" className="text-sm text-muted-foreground">
          {board.templates.length === 0
            ? "Link a template in the board settings to create submissions."
            : `${submissions.length} submission${submissions.length === 1 ? "" : "s"}`}
        </Typography>
        <div className="flex items-center gap-2">
          {view && views.length > 1 && <BoardViewToggle value={view} views={views} onChange={handleViewChange} />}
          <NewSubmissionButton templates={board.templates} onCreate={handleCreate} />
        </div>
      </div>
      <DataState
        isLoading={isLoading}
        hasError={hasError}
        errorMessage="Could not load the submissions."
        loadingClassName="py-10"
      >
        {!view && <Typography as="p" className="text-sm text-muted-foreground">This board has no views yet.</Typography>}
        {view === BoardView.TABLE && (
          <BoardTableView board={board} columns={board.tableSetting} submissions={submissions} onDelete={handleDelete} />
        )}
        {view === BoardView.TASK && <BoardTaskView board={board} submissions={submissions} />}
        {view === BoardView.AGENDA && <BoardAgendaView />}
      </DataState>
    </div>
  );
}
