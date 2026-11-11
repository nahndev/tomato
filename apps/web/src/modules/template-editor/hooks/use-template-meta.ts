"use client";

import { createContext, useContext } from "react";
import type { Template } from "@/modules/template-browse";

export interface TemplateMetaValue {
  id: string;
  version?: string;
  template: Template;
}

export const TemplateMetaContext = createContext<TemplateMetaValue | null>(null);

export function useTemplateMeta(): TemplateMetaValue {
  const meta = useContext(TemplateMetaContext);
  if (!meta) throw new Error("useTemplateMeta must be used inside <TemplateProvider>");
  return meta;
}
