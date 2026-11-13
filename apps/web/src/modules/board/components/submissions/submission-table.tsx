"use client";

import { Button, ConfirmDialog } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getSubmissionPath } from "@/modules/submission-dependency";
import { DEFAULT_COLUMN_SIZE, UNTITLED_SUBMISSION } from "../../board.constants";
import { getColumnSizeStyle } from "../../utils/column";
import { formatCell } from "../../utils/format-cell";
import type { Board, Submission } from "../../board.types";

interface SubmissionTableProps {
  board: Board;
  submissions: Submission[];
  onDelete: (id: string) => void;
}

export function SubmissionTable({ board, submissions, onDelete }: SubmissionTableProps) {
  const { columns } = board;
  const templateNames = new Map(board.templates.map(({ templateId, template }) => [templateId, template.name]));

  if (submissions.length === 0) {
    return <p className="text-sm text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <div role="table" aria-label="Submissions" className="flex flex-col overflow-x-auto rounded-lg bg-card shadow-card">
      <div role="row" className="flex items-center gap-4 border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
        <div role="columnheader" className="min-w-0 truncate" style={getColumnSizeStyle(DEFAULT_COLUMN_SIZE)}>
          Title
        </div>
        {columns.map((column) => (
          <div key={column.id} role="columnheader" className="min-w-0 truncate" style={getColumnSizeStyle(column.size)}>
            {column.label}
          </div>
        ))}
        <div className="w-8 shrink-0" />
      </div>
      {submissions.map((submission) => (
        <div
          key={submission.id}
          role="row"
          className="group relative flex items-center gap-4 border-b border-border px-4 py-2 text-sm last:border-b-0 hover:bg-muted"
        >
          <div role="cell" className="min-w-0 truncate" style={getColumnSizeStyle(DEFAULT_COLUMN_SIZE)}>
            <Link
              href={getSubmissionPath(submission.id)}
              className="font-medium after:absolute after:inset-0 hover:underline"
            >
              {submission.title || templateNames.get(submission.templateVersion.templateId) || UNTITLED_SUBMISSION}
            </Link>
          </div>
          {columns.map((column) => (
            <div key={column.id} role="cell" className="min-w-0 truncate" style={getColumnSizeStyle(column.size)}>
              {formatCell(column, submission)}
            </div>
          ))}
          <div className="relative z-10 w-8 shrink-0">
            <ConfirmDialog
              title="Delete this submission?"
              description="This action cannot be undone."
              destructive="Delete"
              onDestructive={() => onDelete(submission.id)}
            >
              <Button variant="ghost" size="icon-xs" aria-label="Delete submission" className="text-muted-foreground">
                <Trash2Icon />
              </Button>
            </ConfirmDialog>
          </div>
        </div>
      ))}
    </div>
  );
}
