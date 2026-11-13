"use client";

import { TemplateDataStore } from "../components/template-data-provider";
import { readScopedValue } from "../utils/data-scope";
import { useDataScope } from "./use-data-scope";

/** Another widget's value, read from the enclosing data scope outwards. */
export function useWidgetValue(widgetId: string | undefined): unknown {
  const scope = useDataScope();
  return TemplateDataStore.useSelector(({ values }) =>
    widgetId && values ? readScopedValue(values, scope, widgetId) : undefined,
  );
}
