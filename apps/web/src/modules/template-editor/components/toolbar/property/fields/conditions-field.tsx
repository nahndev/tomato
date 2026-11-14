"use client";

import { ButtonConditionType, WidgetType } from "@tomato/constants";
import { Checkbox, Label, Typography } from "@tomato/ui";
import type { PropertyFieldProps } from "../../../../template-editor.types";

const CONDITION_LABELS: Record<ButtonConditionType, { label: string; description: string }> = {
  [ButtonConditionType.REQUIRED_FILLED]: {
    label: "Required fields filled",
    description: "The button stays disabled until every required field of its session has a value.",
  },
};

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
        const isLocked = widgetType === WidgetType.SUBMIT_BUTTON && type === ButtonConditionType.REQUIRED_FILLED;
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
                <Typography>{CONDITION_LABELS[type].label}</Typography>
              </Label>
              <Typography as="p" className="text-xs text-muted-foreground">
                {CONDITION_LABELS[type].description}
              </Typography>
            </div>
          </div>
        );
      })}
    </div>
  );
}
