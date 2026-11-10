"use client";

import { createContext, useContext, type ComponentType } from "react";

export interface WidgetContainerProps {
  containerId: string;
  columnWidth: number;
}

/** Renders the widgets inside a container widget; the editor and the form each provide their own. */
const WidgetContainerContext = createContext<ComponentType<WidgetContainerProps> | null>(null);

export const WidgetContainerProvider = WidgetContainerContext.Provider;

export function useWidgetContainer(): ComponentType<WidgetContainerProps> | null {
  return useContext(WidgetContainerContext);
}
