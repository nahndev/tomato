"use client";

import { createContext, useContext } from "react";
import type { TemplateSnapshot } from "@/shared/types/template.types";

export const TemplateStateContext = createContext<TemplateSnapshot | null>(null);

export function useTemplateState(): TemplateSnapshot {
  const state = useContext(TemplateStateContext);
  if (!state) throw new Error("useTemplateState must be used inside a template state provider");
  return state;
}
