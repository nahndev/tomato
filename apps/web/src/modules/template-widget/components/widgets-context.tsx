"use client";

import type { Widget, WidgetLink } from "@tomato/types";
import { createContext, useContext } from "react";

export interface WidgetsContextValue {
  widgets: Record<string, Widget>;
  links: Record<string, WidgetLink>;
}

const WidgetsContext = createContext<WidgetsContextValue>({ widgets: {}, links: {} });

export const WidgetsProvider = WidgetsContext.Provider;

export function useWidgetById(widgetId: string | undefined): Widget | undefined {
  const { widgets } = useContext(WidgetsContext);
  return widgetId ? widgets[widgetId] : undefined;
}

export function useWidgetLink(widgetId: string): WidgetLink | undefined {
  return useContext(WidgetsContext).links[widgetId];
}
