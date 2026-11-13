"use client";

import { createContext, useContext, type ReactNode } from "react";
import type { Template } from "@/shared/types/template.types";

export interface TemplateMetaValue {
  id: string;
  version?: string;
  template: Template;
}

const TemplateMetaContext = createContext<TemplateMetaValue | null>(null);

interface TemplateMetaProviderProps {
  template: Template;
  version?: string;
  children: ReactNode;
}

export function TemplateMetaProvider({ template, version, children }: TemplateMetaProviderProps) {
  return (
    <TemplateMetaContext.Provider value={{ id: template.id, version, template }}>{children}</TemplateMetaContext.Provider>
  );
}

export function useTemplateMeta(): TemplateMetaValue {
  const meta = useContext(TemplateMetaContext);
  if (!meta) throw new Error("useTemplateMeta must be used inside <TemplateMetaProvider>");
  return meta;
}

export function useTemplateId(): string {
  return useTemplateMeta().id;
}

export function useTemplateVersion(): string | undefined {
  return useTemplateMeta().version;
}
