"use client";

import type { BoardTemplate } from "@/modules/board";
import { Typography } from "@tomato/ui";
import { AGENDA_FIELDS } from "../../board-editor.constants";
import type { AgendaSettingDraft } from "../../board-editor.types";
import { TaskWidgetSelect } from "../task-view/task-widget-select";

interface TemplateAgendaSettingCardProps {
  template: BoardTemplate;
  setting: AgendaSettingDraft;
  onChange: (setting: AgendaSettingDraft) => void;
}

export function TemplateAgendaSettingCard({ template, setting, onChange }: TemplateAgendaSettingCardProps) {
  const snapshot = template.template.versions[0]?.snapshot;

  return (
    <section className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-card p-3 shadow-card" aria-label={template.template.name}>
      <Typography as="h3" className="truncate font-medium">{template.template.name}</Typography>
      {AGENDA_FIELDS.map((field) => (
        <div key={field.key} className="flex flex-col gap-1">
          <Typography className="text-xs text-muted-foreground">{field.label}</Typography>
          <TaskWidgetSelect
            snapshot={snapshot}
            widgetTypes={field.widgetTypes}
            value={setting[field.key]}
            onChange={(widget) => onChange({ ...setting, [field.key]: widget })}
            label={`${field.label} widget for ${template.template.name}`}
          />
        </div>
      ))}
    </section>
  );
}
