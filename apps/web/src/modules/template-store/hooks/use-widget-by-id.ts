"use client";

import type { Widget } from "@/shared/types/template.types";
import { useContext } from "react";
import { TemplateStoreContext } from "../components/template-store-provider";

export function useWidgetById(widgetId: string | undefined): Widget | undefined {
  const { widgets } = useContext(TemplateStoreContext);
  return widgetId ? widgets[widgetId] : undefined;
}
