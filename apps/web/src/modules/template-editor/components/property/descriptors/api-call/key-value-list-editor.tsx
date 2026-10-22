"use client";

import { ApiCallValueSource } from "@tomato/constants";
import type { ApiCallKeyValue } from "@tomato/types";
import { Button, Input, Label } from "@tomato/ui";
import { generateId } from "@tomato/utils";
import { CodeIcon, CopyIcon, DatabaseIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { ComponentSelect } from "./component-select";

interface KeyValueListEditorProps {
  label: string;
  widgetId: string;
  value: ApiCallKeyValue[];
  onChange: (rows: ApiCallKeyValue[]) => void;
}

/** Row editor for params and headers: a key plus either a literal value or another widget's value. */
export function KeyValueListEditor({ label, widgetId, value, onChange }: KeyValueListEditorProps) {
  function update(id: string, patch: Partial<ApiCallKeyValue>) {
    onChange(value.map((row) => (row.id === id ? { ...row, ...patch } : row)));
  }

  function duplicate(row: ApiCallKeyValue) {
    onChange([...value, { ...row, id: generateId() }]);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>{label}</Label>
      <div className="flex flex-col gap-1">
        {value.length === 0 && <span className="text-xs text-muted-foreground">None yet</span>}
        {value.map((row) => {
          const isStatic = row.source === ApiCallValueSource.STATIC;
          const toggleLabel = isStatic ? "Switch to component value" : "Switch to static value";
          return (
            <div key={row.id} className="flex items-center gap-1">
              <Input
                value={row.key}
                placeholder="Key"
                aria-label={`${label} key`}
                className="h-8"
                onChange={(event) => update(row.id, { key: event.target.value })}
              />
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label={toggleLabel}
                title={toggleLabel}
                onClick={() =>
                  update(row.id, { source: isStatic ? ApiCallValueSource.WIDGET : ApiCallValueSource.STATIC })
                }
              >
                {isStatic ? <CodeIcon /> : <DatabaseIcon />}
              </Button>
              {isStatic ? (
                <Input
                  value={row.value ?? ""}
                  placeholder="Value"
                  aria-label={`${label} value`}
                  className="h-8"
                  onChange={(event) => update(row.id, { value: event.target.value })}
                />
              ) : (
                <ComponentSelect
                  excludeWidgetId={widgetId}
                  value={row.widgetId}
                  onChange={(id) => update(row.id, { widgetId: id })}
                />
              )}
              <Button type="button" variant="ghost" size="icon-sm" aria-label="Duplicate" onClick={() => duplicate(row)}>
                <CopyIcon />
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="icon-sm"
                aria-label="Delete"
                onClick={() => onChange(value.filter((current) => current.id !== row.id))}
              >
                <Trash2Icon />
              </Button>
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() =>
          onChange([...value, { id: generateId(), key: "", source: ApiCallValueSource.STATIC, value: "" }])
        }
      >
        <PlusIcon />
        Add {label.toLowerCase()}
      </Button>
    </div>
  );
}
