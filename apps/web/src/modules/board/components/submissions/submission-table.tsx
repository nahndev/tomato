"use client";

import type { Board, Submission } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getSubmissionPath } from "@/modules/submission";
import { getColumnSizeStyle } from "../../utils/column";
import { formatCell } from "../../utils/format-cell";

interface SubmissionTableProps {
  board: Board;
  submissions: Submission[];
  onDelete: (id: string) => void;
}

export function SubmissionTable({ board, submissions, onDelete }: SubmissionTableProps) {
  const { columns } = board;

  if (columns.length === 0) {
    return <p className="text-sm text-muted-foreground">Add columns in the Columns tab to see submission values.</p>;
  }

  if (submissions.length === 0) {
    return <p className="text-sm text-muted-foreground">No submissions yet.</p>;
  }

  return (
    <div role="table" aria-label="Submissions" className="flex flex-col overflow-x-auto rounded-lg bg-card shadow-card">
      <div role="row" className="flex items-center gap-4 border-b border-border px-4 py-2 text-xs font-medium text-muted-foreground">
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
          {columns.map((column, index) => (
            <div key={column.id} role="cell" className="min-w-0 truncate" style={getColumnSizeStyle(column.size)}>
              {index === 0 ? (
                <Link
                  href={getSubmissionPath(submission.id)}
                  className="font-medium after:absolute after:inset-0 hover:underline"
                >
                  {formatCell(column, submission)}
                </Link>
              ) : (
                formatCell(column, submission)
              )}
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
