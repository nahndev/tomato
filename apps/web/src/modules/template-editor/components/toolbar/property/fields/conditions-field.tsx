"use client";

import { ButtonConditionType } from "@tomato/constants";
import { BUTTON_CONDITION_ITEMS, LOCKED_BUTTON_CONDITIONS } from "@/modules/template-widget";
import { Checkbox, Label, Typography } from "@tomato/ui";
import type { PropertyFieldProps } from "../../../../template-editor.types";

export function ConditionsField({ widgetType, value, onChange }: PropertyFieldProps<"conditions">) {
  const conditions = value ?? {};

  function handleCheckedChange(type: ButtonConditionType, isChecked: boolean) {
    onChange(
      isChecked
        ? { ...conditions, [type]: conditions[type] ?? {} }
        : Object.fromEntries(Object.entries(conditions).filter(([key]) => key !== type)),
    );
  }

  return (
    <div className="flex flex-col gap-3">
      {Object.values(ButtonConditionType).map((type) => {
        const isLocked = LOCKED_BUTTON_CONDITIONS[widgetType]?.includes(type) ?? false;
        const id = `prop-condition-${type}`;
        return (
          <div key={type} className="flex items-start gap-2">
            <Checkbox
              id={id}
              checked={isLocked || type in conditions}
              disabled={isLocked}
              onCheckedChange={(checked) => handleCheckedChange(type, checked === true)}
            />
            <div className="flex flex-col gap-1">
              <Label htmlFor={id}>
                <Typography>{BUTTON_CONDITION_ITEMS[type].label}</Typography>
              </Label>
              <Typography as="p" className="text-xs text-muted-foreground">
                {BUTTON_CONDITION_ITEMS[type].description}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
