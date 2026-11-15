"use client";

import { TaskConditionOperation } from "@tomato/constants";
import { Button, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { OPTION_WIDGET_TYPES, TASK_CONDITION_OPERATION_LABELS } from "../../board-editor.constants";
import type { TaskConditionDraft } from "../../board-editor.types";
import { TaskWidgetSelect } from "./task-widget-select";

interface TaskConditionRowProps {
  snapshot: TemplateSnapshot | undefined;
  condition: TaskConditionDraft;
  onChange: (condition: TaskConditionDraft) => void;
  onRemove: (id: string) => void;
}

export function TaskConditionRow({ snapshot, condition, onChange, onRemove }: TaskConditionRowProps) {
  const options = condition.widget ? (snapshot?.widgets[condition.widget]?.options ?? []) : [];

  return (
    <div className="flex flex-col gap-2 rounded-md border border-border p-2">
      <div className="flex items-center gap-1">
        <TaskWidgetSelect
          snapshot={snapshot}
          widgetTypes={OPTION_WIDGET_TYPES}
          value={condition.widget}
          onChange={(widget) => onChange({ ...condition, widget, value: null })}
          label="Condition widget"
        />
        <Button variant="ghost" size="icon-sm" aria-label="Remove condition" onClick={() => onRemove(condition.id)}>
          <Trash2Icon />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={condition.operation}
          onValueChange={(operation) => onChange({ ...condition, operation: operation as TaskConditionOperation })}
        >
          <SelectTrigger aria-label="Condition operation" className="w-full">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {Object.values(TaskConditionOperation).map((operation) => (
              <SelectItem key={operation} value={operation}>
                {TASK_CONDITION_OPERATION_LABELS[operation]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={condition.value ?? undefined}
          onValueChange={(value) => onChange({ ...condition, value })}
          disabled={options.length === 0}
        >
          <SelectTrigger aria-label="Condition value" className="w-full">
            <SelectValue placeholder="Value" />
          </SelectTrigger>
          <SelectContent>
            {options.map((option) => (
              <SelectItem key={option.key} value={option.key}>
                {option.value}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
