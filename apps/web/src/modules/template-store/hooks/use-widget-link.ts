"use client";

import type { WidgetLink } from "@/shared/types/template.types";
import { useContext } from "react";
import { TemplateStoreContext } from "../components/template-store-provider";

export function useWidgetLink(widgetId: string): WidgetLink | undefined {
  return useContext(TemplateStoreContext).links[widgetId];
}
