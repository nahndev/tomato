"use client";

import type { WidgetType } from "@tomato/constants";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
} from "@tomato/ui";
import { Fragment, useMemo } from "react";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { UNSELECTED } from "../../board-editor.constants";
import { groupBySession } from "../../utils/widget-options";

interface TaskWidgetSelectProps {
  snapshot: TemplateSnapshot | undefined;
  widgetTypes: readonly WidgetType[];
  value: string | null;
  onChange: (widgetId: string | null) => void;
  label: string;
}

export function TaskWidgetSelect({ snapshot, widgetTypes, value, onChange, label }: TaskWidgetSelectProps) {
  const groups = useMemo(
    () => (snapshot ? groupBySession(snapshot, (widget) => (widgetTypes.includes(widget.type) ? [widget] : [])) : []),
    [snapshot, widgetTypes],
  );
  const selected = groups.flatMap((group) => group.options).find((widget) => widget.id === value);
  const placeholder = !snapshot ? "Not published" : groups.length > 0 ? "Select widget" : "No matching widget";

  return (
    <Select
      value={value ?? UNSELECTED}
      onValueChange={(next) => onChange(next === UNSELECTED ? null : next)}
      disabled={groups.length === 0 && !value}
    >
      <SelectTrigger aria-label={label} className="w-full">
        <SelectValue>{selected ? selected.label || "(no label)" : placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNSELECTED}>{placeholder}</SelectItem>
        {groups.map((group, index) => (
          <Fragment key={group.sessionId}>
            {index === 0 && <SelectSeparator />}
            <SelectGroup>
              {groups.length > 1 && <SelectLabel>{group.sessionName ?? "Other"}</SelectLabel>}
              {group.options.map((widget) => (
                <SelectItem key={widget.id} value={widget.id}>
                  {widget.label || "(no label)"}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
