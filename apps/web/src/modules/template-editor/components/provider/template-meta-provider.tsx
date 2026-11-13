"use client";

import { createContext, useContext, useMemo, type ReactNode } from "react";

interface TemplateMeta {
  id: string;
  version?: string;
}

const TemplateMetaContext = createContext<TemplateMeta | null>(null);

interface TemplateMetaProviderProps {
  templateId: string;
  version?: string;
  children: ReactNode;
}

export function TemplateMetaProvider({ templateId, version, children }: TemplateMetaProviderProps) {
  const meta = useMemo(() => ({ id: templateId, version }), [templateId, version]);
  return <TemplateMetaContext.Provider value={meta}>{children}</TemplateMetaContext.Provider>;
}

function useTemplateMeta(): TemplateMeta {
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
