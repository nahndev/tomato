"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { TemplateMode } from "../../template-editor.constants";

const TemplateModeContext = createContext<TemplateMode | null>(null);

interface TemplateModeProviderProps {
  mode: TemplateMode;
  children: ReactNode;
}

export function TemplateModeProvider({ mode, children }: TemplateModeProviderProps) {
  return <TemplateModeContext.Provider value={mode}>{children}</TemplateModeContext.Provider>;
}

export function useTemplateMode(): TemplateMode {
  const mode = useContext(TemplateModeContext);
  if (mode === null) throw new Error("useTemplateMode must be used inside <TemplateModeProvider>");
  return mode;
}
