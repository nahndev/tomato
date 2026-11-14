"use client";

import { SessionValidationStore } from "../components/session-validation-provider";
import type { WidgetValidation } from "../template-data.types";
import { toScopedKey } from "../utils/data-scope";
import { useDataScope } from "./use-data-scope";

export function useWidgetValidation(widgetId: string): WidgetValidation | undefined {
  const key = toScopedKey([...useDataScope(), widgetId]);
  return SessionValidationStore.useSelector((state) => state.results[key]);
}
