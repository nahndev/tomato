"use client";

import type { Template, Widget } from "@tomato/types";
import { createContext, useContext, type ReactNode } from "react";
import { values } from "remeda";
import { TemplateMetaContext, useTemplateMeta } from "../../hooks/use-template-meta";
import { useSelection } from "../../hooks/use-selection";
import { useTemplateState } from "../../hooks/use-template-state";
import { TemplateDocProvider } from "./template-doc-provider";
import { TemplateLiveStateProvider } from "./template-live-state-provider";

interface TemplateProviderProps {
  template: Template;
  version?: string;
  children: ReactNode;
}

type WidgetSelection = ReturnType<typeof useSelection<Widget, "id">>;

const WidgetSelectionContext = createContext<WidgetSelection | null>(null);

function WidgetSelectionProvider({ children }: { children: ReactNode }) {
  const { widgets } = useTemplateState();
  const selection = useSelection(values(widgets), "id");

  return <WidgetSelectionContext.Provider value={selection}>{children}</WidgetSelectionContext.Provider>;
}

export function TemplateProvider({ template, version, children }: TemplateProviderProps) {
  return (
    <TemplateDocProvider templateId={template.id}>
      <TemplateLiveStateProvider>
        <TemplateMetaContext.Provider value={{ id: template.id, version, template }}>
          <WidgetSelectionProvider>{children}</WidgetSelectionProvider>
        </TemplateMetaContext.Provider>
      </TemplateLiveStateProvider>
    </TemplateDocProvider>
  );
}

export function useTemplateId(): string {
  return useTemplateMeta().id;
}

export function useTemplateVersion(): string | undefined {
  return useTemplateMeta().version;
}

export function useWidgetSelection(): WidgetSelection {
  const selection = useContext(WidgetSelectionContext);
  if (!selection) throw new Error("useWidgetSelection must be used inside <TemplateProvider>");
  return selection;
}
