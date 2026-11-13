"use client";

import type { Widget } from "@/shared/types/template.types";
import { useContext } from "react";
import { TemplateDataContext } from "../components/template-data-provider";

export function useWidget(widgetId: string | undefined): Widget | undefined {
  const { widgets } = useContext(TemplateDataContext);
  return widgetId ? widgets[widgetId] : undefined;
}
