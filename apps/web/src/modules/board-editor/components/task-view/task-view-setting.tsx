"use client";

import type { Board, BoardTaskSettingInput } from "@/modules/board";
import { Button, toast, Typography } from "@tomato/ui";
import { useState } from "react";
import type { TaskSettingDraft } from "../../board-editor.types";
import { prepareTaskSettings, toTaskSettingDrafts } from "../../utils/task-setting";
import { ViewSettingSection } from "../view-setting-section";
import { TemplateTaskSettingCard } from "./template-task-setting-card";

interface TaskViewSettingProps {
  board: Board;
  onSave: (setting: BoardTaskSettingInput[]) => Promise<Board>;
  isSaving: boolean;
}

export function TaskViewSetting({ board, onSave, isSaving }: TaskViewSettingProps) {
  const [saved, setSaved] = useState<TaskSettingDraft[]>(() => toTaskSettingDrafts(board));
  const [drafts, setDrafts] = useState<TaskSettingDraft[]>(saved);
  const { templates } = board;

  const isDirty = JSON.stringify(drafts) !== JSON.stringify(saved);

  async function handleSave() {
    const prepared = prepareTaskSettings(drafts);
    if (!prepared) {
      toast.error("Every condition needs a widget and a value");
      return;
    }
    try {
      const next = toTaskSettingDrafts(await onSave(prepared));
      setSaved(next);
      setDrafts(next);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <ViewSettingSection
      title="Task view"
      description="Pick, for each template, the widgets that give a task its type, title, status and assignee (from its newest published version), and the conditions its submissions must pass."
      actions={
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          <Typography>Save</Typography>
        </Button>
      }
    >
      {templates.length === 0 ? (
        <Typography as="p" className="text-sm text-muted-foreground">Link a template first.</Typography>
      ) : (
        <div className="flex items-start gap-3 overflow-x-auto pb-2">
          {templates.map((template) => {
            const setting = drafts.find((draft) => draft.templateId === template.templateId);
            return (
              setting && (
                <TemplateTaskSettingCard
                  key={template.templateId}
                  template={template}
                  setting={setting}
                  onChange={(next) =>
                    setDrafts((current) => current.map((entry) => (entry.templateId === next.templateId ? next : entry)))
                  }
                />
              )
            );
          })}
        </div>
      )}
    </ViewSettingSection>
  );
}
