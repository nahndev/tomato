"use client";

import { ButtonActionType } from "@tomato/constants";
import type { ButtonAction } from "@tomato/types";
import { Button, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { ChevronDownIcon, ChevronUpIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { ACTION_REGISTRY, getActionDefinition } from "../../actions/action-registry";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";

/** Ordered list of actions a button widget runs when clicked. */
export function ActionsDescriptor({ value, onChange }: WidgetPropertyFieldProps<"actions">) {
  const actions = value ?? [];

  function update(index: number, next: ButtonAction) {
    onChange(actions.map((action, current) => (current === index ? next : action)));
  }

  function move(index: number, delta: number) {
    const target = index + delta;
    if (target < 0 || target >= actions.length) return;
    const next = [...actions];
    [next[index], next[target]] = [next[target], next[index]];
    onChange(next);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Actions</Label>
      <div className="flex flex-col gap-2">
        {actions.map((action, index) => {
          const { SetupComponent } = getActionDefinition(action);
          return (
            <div key={index} className="flex flex-col gap-2 rounded-md border border-input p-2">
              <div className="flex items-center gap-1">
                <Select
                  value={action.type}
                  onValueChange={(type) => update(index, ACTION_REGISTRY[type as ButtonActionType].createDefault())}
                >
                  <SelectTrigger size="sm" className="flex-1" aria-label="Action type">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {Object.entries(ACTION_REGISTRY).map(([type, definition]) => (
                      <SelectItem key={type} value={type}>
                        {definition.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move action up"
                  disabled={index === 0}
                  onClick={() => move(index, -1)}
                >
                  <ChevronUpIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Move action down"
                  disabled={index === actions.length - 1}
                  onClick={() => move(index, 1)}
                >
                  <ChevronDownIcon />
                </Button>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-sm"
                  aria-label="Remove action"
                  onClick={() => onChange(actions.filter((_, current) => current !== index))}
                >
                  <Trash2Icon />
                </Button>
              </div>
              <SetupComponent action={action} onChange={(next) => update(index, next)} />
            </div>
          );
        })}
      </div>
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...actions, ACTION_REGISTRY[ButtonActionType.LINK].createDefault()])}
      >
        <PlusIcon />
        Add action
      </Button>
    </div>
  );
}
