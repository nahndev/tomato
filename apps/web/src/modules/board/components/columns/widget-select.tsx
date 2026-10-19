"use client";

import { ValueType, type DisplayType } from "@tomato/constants";
import type { BoardColumnItem, BoardTemplate } from "@tomato/types";
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
import { VALUE_TYPE_LABELS } from "../../board.constants";
import { formatOptionKey, groupWidgetOptions, parseOptionKey, type WidgetOption } from "../../utils/widget-options";

/** Radix Select forbids an empty item value, so a sentinel stands for "no widget". */
const UNSELECTED = "__unselected__";

interface WidgetSelectProps {
  template: BoardTemplate;
  allowedDisplayTypes: DisplayType[] | null;
  value: BoardColumnItem | undefined;
  onChange: (item: BoardColumnItem | null) => void;
}

function getOptionLabel({ widget, property }: WidgetOption): string {
  const label = widget.label || "(no label)";
  return property === ValueType.DEFAULT ? label : `${label} · ${VALUE_TYPE_LABELS[property]}`;
}

export function WidgetSelect({ template, allowedDisplayTypes, value, onChange }: WidgetSelectProps) {
  const snapshot = template.latestVersion?.snapshot;
  const groups = useMemo(
    () => (snapshot ? groupWidgetOptions(snapshot, allowedDisplayTypes) : []),
    [snapshot, allowedDisplayTypes],
  );
  const options = groups.flatMap((group) => group.options);
  const selectedKey = value ? formatOptionKey(value.widgetId, value.property) : UNSELECTED;
  const selected = options.find((option) => option.key === selectedKey);
  const placeholder = !snapshot ? "Not published" : options.length > 0 ? "Select widget" : "No matching widget";

  return (
    <Select
      value={selectedKey}
      onValueChange={(key) => onChange(key === UNSELECTED ? null : parseOptionKey(key))}
      disabled={options.length === 0 && !value}
    >
      <SelectTrigger aria-label={`Widget for ${template.name}`}>
        <SelectValue>{selected ? getOptionLabel(selected) : placeholder}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        <SelectItem value={UNSELECTED}>{placeholder}</SelectItem>
        {groups.map((group, index) => (
          <Fragment key={group.sessionId}>
            {index === 0 && <SelectSeparator />}
            <SelectGroup>
              {groups.length > 1 && <SelectLabel>{group.sessionName ?? "Other"}</SelectLabel>}
              {group.options.map((option) => (
                <SelectItem key={option.key} value={option.key}>
                  {getOptionLabel(option)}
                </SelectItem>
              ))}
            </SelectGroup>
          </Fragment>
        ))}
      </SelectContent>
    </Select>
  );
}
