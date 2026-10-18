"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TemplateMode } from "../../template-editor.constants";

const TemplateModeContext = createContext<TemplateMode | null>(null);

interface TemplateBuilderProviderProps {
  mode: TemplateMode;
  children: ReactNode;
}

export function TemplateBuilderProvider({ mode, children }: TemplateBuilderProviderProps) {
  return <TemplateModeContext.Provider value={mode}>{children}</TemplateModeContext.Provider>;
}

export function useTemplateMode(): TemplateMode {
  const mode = useContext(TemplateModeContext);
  if (mode === null) throw new Error("useTemplateMode must be used inside <TemplateBuilderProvider>");
  return mode;
}
