"use client";

import type { WidgetLink } from "@/shared/types/template.types";
import { TemplateDataStore } from "../components/template-data-provider";

export function useWidgetLink(widgetId: string): WidgetLink | undefined {
  return TemplateDataStore.useSelector((state) => state.links[widgetId]);
}
