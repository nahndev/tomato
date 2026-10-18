"use client";

import { createContext, useContext, type ReactNode } from "react";

const WidgetIdContext = createContext<string | null>(null);

interface WidgetProviderProps {
  widgetId: string;
  children: ReactNode;
}

export function WidgetProvider({ widgetId, children }: WidgetProviderProps) {
  return <WidgetIdContext.Provider value={widgetId}>{children}</WidgetIdContext.Provider>;
}

export function useWidgetId(): string {
  const id = useContext(WidgetIdContext);
  if (!id) throw new Error("useWidgetId must be used inside <WidgetProvider>");
  return id;
}
