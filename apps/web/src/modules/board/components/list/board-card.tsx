import type { BoardSummary } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { SquareKanbanIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getBoardPath } from "../../board.constants";

interface BoardCardProps {
  board: BoardSummary;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  return (
    <div className="relative flex flex-col gap-2 rounded-lg bg-card p-4 shadow-card motion-base hover:ring-1 hover:ring-solid">
      <Link href={getBoardPath(board.id)} className="flex min-w-0 flex-col gap-2 focus-ring" aria-label={board.name}>
        <SquareKanbanIcon className="size-5 text-muted-foreground" />
        <h4 className="line-clamp-2 pr-8 font-medium wrap-break-word">{board.name}</h4>
        <p className="text-xs text-muted-foreground">
          {board.templateCount} template{board.templateCount === 1 ? "" : "s"} ·{" "}
          {describeTimeAgo(board.createdAt)}
        </p>
      </Link>
      <ConfirmDialog
        title={`Delete “${board.name}”?`}
        description="The board and its submissions will be deleted. This action cannot be undone."
        destructive="Delete"
        onDestructive={() => onDelete(board.id)}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${board.name}`}
          className="absolute top-3 right-3 text-muted-foreground"
        >
          <Trash2Icon />
        </Button>
      </ConfirmDialog>
    </div>
  );
}
