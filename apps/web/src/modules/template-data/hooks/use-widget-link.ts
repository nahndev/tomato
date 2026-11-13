"use client";

import type { WidgetLink } from "@/shared/types/template.types";
import { useContext } from "react";
import { TemplateDataContext } from "../components/template-data-provider";

export function useWidgetLink(widgetId: string): WidgetLink | undefined {
  return useContext(TemplateDataContext).links[widgetId];
}
