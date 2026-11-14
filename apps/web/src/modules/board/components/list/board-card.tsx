import { Button, ConfirmDialog, Typography } from "@tomato/ui";
import { describeTimeAgo } from "@tomato/utils";
import { SquareKanbanIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import type { BoardSummary } from "../../board.types";

interface BoardCardProps {
  board: BoardSummary;
  onDelete: (id: string) => void;
}

export function BoardCard({ board, onDelete }: BoardCardProps) {
  return (
    <div className="relative flex flex-col gap-2 rounded-lg bg-card p-4 shadow-card motion-base hover:ring-1 hover:ring-solid">
      <Link href={`/system/boards/${board.id}`} className="flex min-w-0 flex-col gap-2 focus-ring" aria-label={board.name}>
        <SquareKanbanIcon className="size-5 text-muted-foreground" />
        <Typography as="h4" className="line-clamp-2 pr-8 font-medium wrap-break-word">{board.name}</Typography>
        <Typography as="p" className="text-xs text-muted-foreground">
          {board._count.templates} template{board._count.templates === 1 ? "" : "s"} ·{" "}
          {describeTimeAgo(board.createdAt)}
        </Typography>
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
