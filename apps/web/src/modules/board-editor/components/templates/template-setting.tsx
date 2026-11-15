"use client";

import type { Board, BoardTemplate, UpdateBoardInput } from "@/modules/board";
import { Badge, Button, toast, Typography } from "@tomato/ui";
import { XIcon } from "lucide-react";
import { useState } from "react";
import { AddTemplate } from "./add-template";

interface TemplateSettingProps {
  board: Board;
  onSave: (input: UpdateBoardInput) => Promise<Board>;
  isSaving: boolean;
}

export function TemplateSetting({ board, onSave, isSaving }: TemplateSettingProps) {
  const [templates, setTemplates] = useState<BoardTemplate[]>(board.templates);

  const templateIds = templates.map((template) => template.templateId);
  const isDirty = JSON.stringify(templateIds) !== JSON.stringify(board.templates.map((template) => template.templateId));

  async function handleSave() {
    try {
      const saved = await onSave({ templateIds });
      setTemplates(saved.templates);
      toast.success("Board saved");
    } catch {
      toast.error("Could not save the board");
    }
  }

  return (
    <section className="flex flex-col gap-3" aria-label="Linked templates">
      <div className="flex items-center justify-between gap-4">
        <div>
          <Typography as="h2" className="font-medium">Templates</Typography>
          <Typography as="p" className="text-sm text-muted-foreground">
            Submissions of this board are created from the newest published version of these templates.
          </Typography>
        </div>
        <Button onClick={handleSave} disabled={!isDirty || isSaving}>
          <Typography>Save</Typography>
        </Button>
      </div>
      {templates.length > 0 && (
        <ul className="flex flex-wrap gap-2">
          {templates.map((template) => (
            <li key={template.templateId} className="flex items-center gap-2 rounded-md bg-card py-1 pr-1 pl-3 text-sm shadow-card">
              {template.template.name}
              {template.template.versions[0] ? (
                <Badge variant="secondary"><Typography>v{template.template.versions[0].version}</Typography></Badge>
              ) : (
                <Badge variant="secondary"><Typography>Not published</Typography></Badge>
              )}
              <Button
                variant="ghost"
                size="icon-xs"
                aria-label={`Unlink ${template.template.name}`}
                onClick={() => setTemplates((current) => current.filter((entry) => entry.templateId !== template.templateId))}
              >
                <XIcon />
              </Button>
            </li>
          ))}
        </ul>
      )}
      <AddTemplate linkedIds={templateIds} onAdd={(template) => setTemplates((current) => [...current, template])} />
    </section>
  );
}
