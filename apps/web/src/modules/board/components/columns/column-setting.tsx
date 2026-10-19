"use client";

import type { Board, BoardTemplate } from "@tomato/types";
import { Button, toast } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { UpdateBoardInput } from "../../board.schemas";
import type { ColumnDraft } from "../../board.types";
import { createColumn, prepareColumns } from "../../utils/column";
import { ColumnCard } from "./column-card";
import { LinkedTemplates } from "./linked-templates";

interface ColumnSettingProps {
  board: Board;
  onSave: (input: UpdateBoardInput) => Promise<Board>;
  isSaving: boolean;
}

export function ColumnSetting({ board, onSave, isSaving }: ColumnSettingProps) {
  const [columns, setColumns] = useState<ColumnDraft[]>(board.columns);
  const [templates, setTemplates] = useState<BoardTemplate[]>(board.templates);

  const templateIds = templates.map((template) => template.id);
  const isDirty =
    JSON.stringify(columns) !== JSON.stringify(board.columns) ||
    JSON.stringify(templateIds) !== JSON.stringify(board.templates.map((template) => template.id));

  function handleRemoveTemplate(id: string) {
    setTemplates((current) => current.filter((template) => template.id !== id));
    setColumns((current) =>
      current.map((column) => ({
        ...column,
        items: Object.fromEntries(Object.entries(column.items).filter(([templateId]) => templateId !== id)),
      })),
    );
  }

  async function handleSave() {
    const prepared = prepareColumns(columns, templateIds);
    if (!prepared) {
      toast.error("Every column with a widget needs a label and a display type");
      return;
    }
    try {
      const saved = await onSave({ columns: prepared, templateIds });
      setColumns(saved.columns);
      setTemplates(saved.templates);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <div className="flex flex-col gap-8">
      <LinkedTemplates
        templates={templates}
        onAdd={(template) => setTemplates((current) => [...current, template])}
        onRemove={handleRemoveTemplate}
      />
      <section className="flex flex-col gap-3" aria-label="Columns">
        <div className="flex items-center justify-between gap-4">
          <div>
            <h2 className="font-medium">Columns</h2>
            <p className="text-sm text-muted-foreground">
              Pick, for each template, the widget a column shows (from its newest published version). Widgets of one column share a display type.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" onClick={() => setColumns((current) => [...current, createColumn()])}>
              <PlusIcon />
              Add column
            </Button>
            <Button onClick={handleSave} disabled={!isDirty || isSaving}>
              Save
            </Button>
          </div>
        </div>
        {templates.length === 0 ? (
          <p className="text-sm text-muted-foreground">Link a template first.</p>
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
    </div>
  );
}
