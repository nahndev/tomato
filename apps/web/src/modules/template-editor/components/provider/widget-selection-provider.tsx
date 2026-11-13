"use client";

import type { Widget } from "@/shared/types/template.types";
import { createContext, useContext, type ReactNode } from "react";
import { values } from "remeda";
import { useSelection } from "../../hooks/use-selection";
import { useTemplateSnapshot } from "./template-snapshot-provider";

type WidgetSelection = ReturnType<typeof useSelection<Widget, "id">>;

const WidgetSelectionContext = createContext<WidgetSelection | null>(null);

export function WidgetSelectionProvider({ children }: { children: ReactNode }) {
  const { widgets } = useTemplateSnapshot();
  const selection = useSelection(values(widgets), "id");

  return <WidgetSelectionContext.Provider value={selection}>{children}</WidgetSelectionContext.Provider>;
}

export function useWidgetSelection(): WidgetSelection {
  const selection = useContext(WidgetSelectionContext);
  if (!selection) throw new Error("useWidgetSelection must be used inside <WidgetSelectionProvider>");
  return selection;
}
