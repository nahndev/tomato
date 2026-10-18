"use client";

import type { Template } from "@tomato/types";
import { createContext, useContext } from "react";

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
