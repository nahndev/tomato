"use client";

import type { Template } from "@/shared/types/template.types";
import type { ReactNode } from "react";
import { TemplateDocProvider } from "./template-doc-provider";
import { TemplateMetaProvider } from "./template-meta-provider";
import { TemplateSnapshotProvider } from "./template-snapshot-provider";
import { WidgetSelectionProvider } from "./widget-selection-provider";

interface TemplateEditorProviderProps {
  template: Template;
  version?: string;
  children: ReactNode;
}

export function TemplateEditorProvider({ template, version, children }: TemplateEditorProviderProps) {
  return (
    <TemplateDocProvider templateId={template.id}>
      <TemplateSnapshotProvider>
        <TemplateMetaProvider template={template} version={version}>
          <WidgetSelectionProvider>{children}</WidgetSelectionProvider>
        </TemplateMetaProvider>
      </TemplateSnapshotProvider>
    </TemplateDocProvider>
  );
}
