"use client";

import type { TemplateSnapshot } from "@/shared/types/template.types";
import { createContext, useContext } from "react";

export interface TemplateFormState {
  snapshot: TemplateSnapshot;
  /** `key` is the flat key of `scope` (the widget id at the top level); `scope` ends with the widget id. */
  onChange: (key: string, value: unknown, scope: string[]) => void;
}

const TemplateFormContext = createContext<TemplateFormState | null>(null);

export const TemplateFormProvider = TemplateFormContext.Provider;

export function useTemplateForm(): TemplateFormState {
  const state = useContext(TemplateFormContext);
  if (!state) throw new Error("useTemplateForm must be used inside <TemplateFormProvider>");
  return state;
}
