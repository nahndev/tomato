"use client";

import { useContext } from "react";
import { TemplateDataContext } from "../components/template-data-provider";
import { readScopedValue } from "../utils/data-scope";
import { useDataScope } from "./use-data-scope";

/** Another widget's value, read from the enclosing data scope outwards. */
export function useWidgetValue(widgetId: string | undefined): unknown {
  const { values } = useContext(TemplateDataContext);
  const scope = useDataScope();
  return widgetId && values ? readScopedValue(values, scope, widgetId) : undefined;
}
