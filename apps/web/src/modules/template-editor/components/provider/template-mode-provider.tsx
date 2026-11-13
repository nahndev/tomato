"use client";

import { createStoreContext } from "@tomato/store-context";
import type { TemplateMode } from "../../template-editor.constants";

const TemplateModeStore = createStoreContext<{ mode: TemplateMode }>("TemplateMode");

export const TemplateModeProvider = TemplateModeStore.Provider;

export function useTemplateMode(): TemplateMode {
  return TemplateModeStore.useSelector((state) => state.mode);
}
