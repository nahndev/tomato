"use client";

import { useContext } from "react";
import { TemplateStoreContext } from "../components/template-store-provider";
import { readScopedValue } from "../utils/data-scope";
import { useDataScope } from "./use-data-scope";

/** Another widget's value, read from the enclosing data scope outwards. */
export function useWidgetValue(widgetId: string | undefined): unknown {
  const { values } = useContext(TemplateStoreContext);
  const scope = useDataScope();
  return widgetId && values ? readScopedValue(values, scope, widgetId) : undefined;
}
