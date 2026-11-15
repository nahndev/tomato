"use client";

import type { BoardTemplate } from "@/modules/board";
import { Button, Typography } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { TASK_FIELDS } from "../../board-editor.constants";
import type { TaskSettingDraft } from "../../board-editor.types";
import { createTaskCondition } from "../../utils/task-setting";
import { TaskConditionRow } from "./task-condition-row";
import { TaskWidgetSelect } from "./task-widget-select";

interface TemplateTaskSettingCardProps {
  template: BoardTemplate;
  setting: TaskSettingDraft;
  onChange: (setting: TaskSettingDraft) => void;
}

export function TemplateTaskSettingCard({ template, setting, onChange }: TemplateTaskSettingCardProps) {
  const snapshot = template.template.versions[0]?.snapshot;

  return (
    <section className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-card p-3 shadow-card" aria-label={template.template.name}>
      <Typography as="h3" className="truncate font-medium">{template.template.name}</Typography>
      {TASK_FIELDS.map((field) => (
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
      <div className="flex flex-col gap-2">
        <Typography className="text-xs text-muted-foreground">Conditions</Typography>
        {setting.conditions.map((condition) => (
          <TaskConditionRow
            key={condition.id}
            snapshot={snapshot}
            condition={condition}
            onChange={(next) =>
              onChange({ ...setting, conditions: setting.conditions.map((entry) => (entry.id === next.id ? next : entry)) })
            }
            onRemove={(id) => onChange({ ...setting, conditions: setting.conditions.filter((entry) => entry.id !== id) })}
          />
        ))}
        <Button
          variant="outline"
          size="sm"
          onClick={() => onChange({ ...setting, conditions: [...setting.conditions, createTaskCondition()] })}
          disabled={!snapshot}
        >
          <PlusIcon />
          <Typography>Add condition</Typography>
        </Button>
      </div>
    </section>
  );
}
