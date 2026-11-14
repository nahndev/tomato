"use client";

import { ButtonConditionType } from "@tomato/constants";
import { useSessionValidity } from "@/modules/template-data";
import type { Widget } from "@/shared/types/template.types";
import { useMemo } from "react";
import { LOCKED_BUTTON_CONDITIONS } from "../template-widget.constants";

export interface WidgetConditions {
  conditions: Partial<Record<ButtonConditionType, boolean>>;
  isMet: boolean;
}

export function useWidgetConditions(widget: Widget): WidgetConditions {
  const isSessionValid = useSessionValidity();

  return useMemo(() => {
    const types = new Set([
      ...(Object.keys(widget.conditions ?? {}) as ButtonConditionType[]),
      ...(LOCKED_BUTTON_CONDITIONS[widget.type] ?? []),
    ]);
    const isMetByType: Record<ButtonConditionType, boolean> = {
      [ButtonConditionType.REQUIRED_FILLED]: isSessionValid !== false,
    };
    const conditions = Object.fromEntries([...types].map((type) => [type, isMetByType[type]]));
    return { conditions, isMet: Object.values(conditions).every(Boolean) };
  }, [widget.conditions, widget.type, isSessionValid]);
}
