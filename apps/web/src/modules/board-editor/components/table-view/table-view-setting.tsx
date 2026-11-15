"use client";

import type { Board, BoardColumn } from "@/modules/board";
import { Button, toast, Typography } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";
import type { ColumnDraft } from "../../board-editor.types";
import { createColumn, prepareColumns } from "../../utils/column";
import { ViewSettingSection } from "../view-setting-section";
import { ColumnCard } from "./column-card";

interface TableViewSettingProps {
  board: Board;
  onSave: (setting: BoardColumn[]) => Promise<Board>;
  isSaving: boolean;
}

export function TableViewSetting({ board, onSave, isSaving }: TableViewSettingProps) {
  const savedColumns = board.tableSetting;
  const [columns, setColumns] = useState<ColumnDraft[]>(savedColumns);
  const { templates } = board;

  const isDirty = JSON.stringify(columns) !== JSON.stringify(savedColumns);

  async function handleSave() {
    const prepared = prepareColumns(columns, templates.map((template) => template.templateId));
    if (!prepared) {
      toast.error("Every column with a widget needs a label and a display type");
      return;
    }
    try {
      const saved = await onSave(prepared);
      setColumns(saved.tableSetting);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <ViewSettingSection
      title="Table view"
      description="Pick, for each template, the widget a column shows (from its newest published version). Widgets of one column share a display type."
      actions={
        <>
          <Button variant="outline" onClick={() => setColumns((current) => [...current, createColumn()])}>
            <PlusIcon />
            <Typography>Add column</Typography>
          </Button>
          <Button onClick={handleSave} disabled={!isDirty || isSaving}>
            <Typography>Save</Typography>
          </Button>
        </>
      }
    >
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
    </ViewSettingSection>
  );
}
