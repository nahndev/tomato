"use client";

import { DisplayType } from "@tomato/constants";
import type { BoardColumnItem, BoardTemplate } from "@tomato/types";
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { ColumnDraft } from "../../board.types";
import {
  COLUMN_FLEX_STEPS,
  COLUMN_WIDTH_STEPS,
  DISPLAY_TYPE_LABELS,
} from "../../board.constants";
import { decodeColumnSize, encodeColumnSize, setColumnItem } from "../../utils/column";
import { getCommonDisplayTypes } from "../../utils/widget-value-types";
import { WidgetSelect } from "./widget-select";

const SIZE_VALUES = [
  ...COLUMN_WIDTH_STEPS.map((width) => ({ size: { width }, label: `${width}px` })),
  ...COLUMN_FLEX_STEPS.map((flex) => ({ size: { flex }, label: `${flex}fr` })),
];

interface ColumnCardProps {
  column: ColumnDraft;
  templates: BoardTemplate[];
  onChange: (column: ColumnDraft) => void;
  onRemove: (id: string) => void;
}

function getSelectedEntries(column: ColumnDraft, templates: BoardTemplate[], exceptTemplateId?: string) {
  return Object.entries(column.items).flatMap(([templateId, item]) => {
    const widget = templates.find((template) => template.id === templateId)?.latestVersion?.snapshot.widgets[item.widgetId];
    return widget && templateId !== exceptTemplateId ? [{ widgetType: widget.type, property: item.property }] : [];
  });
}

export function ColumnCard({ column, templates, onChange, onRemove }: ColumnCardProps) {
  const allowedTypes = getCommonDisplayTypes(getSelectedEntries(column, templates));
  const typeOptions = Object.values(DisplayType).filter((type) => allowedTypes === null || allowedTypes.includes(type));

  function handleItemChange(templateId: string, item: BoardColumnItem | null) {
    const next = setColumnItem(column, templateId, item);
    const common = getCommonDisplayTypes(getSelectedEntries(next, templates));
    const isTypeValid = next.type !== null && (common === null || common.includes(next.type));
    onChange({ ...next, type: isTypeValid ? next.type : (common?.[0] ?? null) });
  }

  return (
    <section className="flex w-72 shrink-0 flex-col gap-3 rounded-lg bg-card p-3 shadow-card" aria-label="Column">
      <div className="flex items-center gap-1">
        <Input
          value={column.label}
          onChange={(event) => onChange({ ...column, label: event.target.value })}
          placeholder="Label"
          aria-label="Column label"
        />
        <Button variant="ghost" size="icon-sm" aria-label="Remove column" onClick={() => onRemove(column.id)}>
          <Trash2Icon />
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-2">
        <Select
          value={encodeColumnSize(column.size)}
          onValueChange={(encoded) => onChange({ ...column, size: decodeColumnSize(encoded) })}
        >
          <SelectTrigger aria-label="Column size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {SIZE_VALUES.map(({ size, label }) => (
              <SelectItem key={label} value={encodeColumnSize(size)}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select
          value={column.type ?? undefined}
          onValueChange={(type) => onChange({ ...column, type: type as DisplayType })}
          disabled={typeOptions.length === 0}
        >
          <SelectTrigger aria-label="Display type">
            <SelectValue placeholder="Display as" />
          </SelectTrigger>
          <SelectContent>
            {typeOptions.map((type) => (
              <SelectItem key={type} value={type}>
                {DISPLAY_TYPE_LABELS[type]}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {templates.map((template) => (
        <div key={template.id} className="flex flex-col gap-1">
          <span className="truncate text-xs text-muted-foreground">{template.name}</span>
          <WidgetSelect
            template={template}
            allowedDisplayTypes={getCommonDisplayTypes(getSelectedEntries(column, templates, template.id))}
            value={column.items[template.id]}
            onChange={(item) => handleItemChange(template.id, item)}
          />
        </div>
      ))}
    </section>
  );
}
