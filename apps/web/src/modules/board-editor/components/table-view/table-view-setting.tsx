"use client";

import type { Board, UpdateBoardInput } from "@/modules/board";
import { Button, toast, Typography } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ColumnDraft } from "../../board-editor.types";
import { createColumn, prepareColumns } from "../../utils/column";
import { ColumnCard } from "./column-card";

interface TableViewSettingProps {
  board: Board;
  onSave: (input: UpdateBoardInput) => Promise<Board>;
  isSaving: boolean;
}

export function TableViewSetting({ board, onSave, isSaving }: TableViewSettingProps) {
  const [columns, setColumns] = useState<ColumnDraft[]>(board.columns);
  const { templates } = board;

  const isDirty = JSON.stringify(columns) !== JSON.stringify(board.columns);

  async function handleSave() {
    const prepared = prepareColumns(columns, templates.map((template) => template.templateId));
    if (!prepared) {
      toast.error("Every column with a widget needs a label and a display type");
      return;
    }
    try {
      const saved = await onSave({ columns: prepared });
      setColumns(saved.columns);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <section className="flex flex-col gap-3" aria-label="Columns">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Typography as="h2" className="font-medium">Columns</Typography>
          <Typography as="p" className="text-sm text-muted-foreground">
            Pick, for each template, the widget a column shows (from its newest published version). Widgets of one column share a display type.
          </Typography>
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={() => setColumns((current) => [...current, createColumn()])}>
            <PlusIcon />
            <Typography>Add column</Typography>
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || isSaving}>
            <Typography>Save</Typography>
          </Button>
        </div>
      </div>
      {templates.length === 0 ? (
        <Typography as="p" className="text-sm text-muted-foreground">Link a template first.</Typography>
      ) : (
        <div className="flex items-start gap-3 overflow-x-auto pb-2">
          {columns.map((column) => (
            <ColumnCard
              key={column.id}
              column={column}
              templates={templates}
              onChange={(next) => setColumns((current) => current.map((entry) => (entry.id === next.id ? next : entry)))}
              onRemove={(id) => setColumns((current) => current.filter((entry) => entry.id !== id))}
            />
          ))}
        </div>
      )}
    </section>
  );
}
