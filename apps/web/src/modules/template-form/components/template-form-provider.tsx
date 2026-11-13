"use client";

import type { TemplateSnapshot } from "@/shared/types/template.types";
import { createStoreContext } from "@tomato/store-context";

export interface TemplateFormState {
  snapshot: TemplateSnapshot;
  /** `key` is the flat key of `scope` (the widget id at the top level); `scope` ends with the widget id. */
  onChange: (key: string, value: unknown, scope: string[]) => void;
}

const TemplateFormStore = createStoreContext<TemplateFormState>("TemplateForm");

export const TemplateFormProvider = TemplateFormStore.Provider;

export const useTemplateForm = TemplateFormStore.useSelector;
