"use client";

import { createContext, useContext } from "react";
import type { TemplateState } from "../template-editor.types";

export const TemplateStateContext = createContext<TemplateState | null>(null);

export function useTemplateState(): TemplateState {
  const state = useContext(TemplateStateContext);
  if (!state) throw new Error("useTemplateState must be used inside a template state provider");
  return state;
}
