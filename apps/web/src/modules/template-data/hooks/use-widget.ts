"use client";

import type { Widget } from "@/shared/types/template.types";
import { TemplateDataStore } from "../components/template-data-provider";

export function useWidget(widgetId: string | undefined): Widget | undefined {
  return TemplateDataStore.useSelector((state) => (widgetId ? state.widgets[widgetId] : undefined));
}
