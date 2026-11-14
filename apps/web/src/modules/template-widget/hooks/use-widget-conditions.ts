"use client";

import { ButtonConditionType } from "@tomato/constants";
import { useSessionIssues, useSessionValidity } from "@/modules/template-data";
import type { Widget } from "@/shared/types/template.types";
import { useMemo } from "react";
import { LOCKED_BUTTON_CONDITIONS } from "../template-widget.constants";

export interface WidgetConditionError {
  type: ButtonConditionType;
  details: string[];
}

export interface WidgetConditions {
  conditions: Partial<Record<ButtonConditionType, boolean>>;
  isMet: boolean;
  errors: WidgetConditionError[];
}

export function useWidgetConditions(widget: Widget): WidgetConditions {
  const isSessionValid = useSessionValidity();
  const sessionIssues = useSessionIssues();

  return useMemo(() => {
    const types = [
      ...new Set([
        ...(Object.keys(widget.conditions ?? {}) as ButtonConditionType[]),
        ...(LOCKED_BUTTON_CONDITIONS[widget.type] ?? []),
      ]),
    ];
    const isMetByType: Record<ButtonConditionType, boolean> = {
      [ButtonConditionType.REQUIRED_FILLED]: isSessionValid !== false,
    };
    const detailsByType: Record<ButtonConditionType, string[]> = {
      [ButtonConditionType.REQUIRED_FILLED]: sessionIssues.map((issue) => issue.message),
    };
    const unmetTypes = types.filter((type) => !isMetByType[type]);
    return {
      conditions: Object.fromEntries(types.map((type) => [type, isMetByType[type]])),
      isMet: unmetTypes.length === 0,
      errors: unmetTypes.map((type) => ({ type, details: detailsByType[type] })),
    };
  }, [widget.conditions, widget.type, isSessionValid, sessionIssues]);
}
