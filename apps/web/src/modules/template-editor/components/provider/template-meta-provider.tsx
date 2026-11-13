"use client";

import { createStoreContext } from "@tomato/store-context";

const TemplateMetaStore = createStoreContext<{ templateId: string; version?: string }>("TemplateMeta");

export const TemplateMetaProvider = TemplateMetaStore.Provider;

export function useTemplateId(): string {
  return TemplateMetaStore.useSelector((state) => state.templateId);
}

export function useTemplateVersion(): string | undefined {
  return TemplateMetaStore.useSelector((state) => state.version);
}
