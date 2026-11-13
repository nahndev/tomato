"use client";

import { useContext } from "react";
import { TemplateStoreContext } from "../components/template-store-provider";

export function useWidgetReferences(widgetId: string): Record<string, string> | undefined {
  return useContext(TemplateStoreContext).references?.[widgetId];
}
