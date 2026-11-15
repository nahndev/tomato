"use client";

import type { Board, BoardAgendaSettingInput } from "@/modules/board";
import { Button, toast, Typography } from "@tomato/ui";
import { useState } from "react";
import type { AgendaSettingDraft } from "../../board-editor.types";
import { prepareAgendaSettings, toAgendaSettingDrafts } from "../../utils/agenda-setting";
import { ViewSettingSection } from "../view-setting-section";
import { TemplateAgendaSettingCard } from "./template-agenda-setting-card";

interface AgendaViewSettingProps {
  board: Board;
  onSave: (setting: BoardAgendaSettingInput[]) => Promise<Board>;
  isSaving: boolean;
}

export function AgendaViewSetting({ board, onSave, isSaving }: AgendaViewSettingProps) {
  const [saved, setSaved] = useState<AgendaSettingDraft[]>(() => toAgendaSettingDrafts(board));
  const [drafts, setDrafts] = useState<AgendaSettingDraft[]>(saved);
  const { templates } = board;

  const isDirty = JSON.stringify(drafts) !== JSON.stringify(saved);

  async function handleSave() {
    const prepared = prepareAgendaSettings(drafts);
    if (!prepared) {
      toast.error("Every template with agenda widgets needs a start widget");
      return;
    }
    try {
      const next = toAgendaSettingDrafts(await onSave(prepared));
      setSaved(next);
      setDrafts(next);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <ViewSettingSection
      title="Agenda view"
      description="Pick, for each template, the widgets that give a submission its title, start date and end date (from its newest published version). Without an end, a submission shows on its start day only."
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
                <TemplateAgendaSettingCard
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
