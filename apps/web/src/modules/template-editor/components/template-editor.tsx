"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { Spinner, Toaster } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useTemplate } from "../hooks/use-template";
import { useTemplateVersions } from "../hooks/use-template-versions";
import type { TemplateMode } from "../template-editor.constants";
import { TemplateBuilderProvider } from "./provider/template-builder-provider";
import { TemplateProvider } from "./provider/template-provider";
import { TemplateBuilder } from "./template/template-builder";
import { TemplateHeader } from "./template/template-header";

interface TemplateEditorProps {
  templateId: string;
  mode: TemplateMode;
}

export function TemplateEditor({ templateId, mode }: TemplateEditorProps) {
  const { data: template, isLoading, isError } = useTemplate(templateId);
  const { latestVersion } = useTemplateVersions(templateId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (isError || !template) notFound();

  return (
    <DragDropProvider>
      <TemplateProvider template={template} version={latestVersion}>
        <TemplateBuilderProvider mode={mode}>
          <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-canvas">
            <TemplateHeader />
            <div className="min-h-0">
              <TemplateBuilder />
            </div>
          </div>
          <Toaster />
        </TemplateBuilderProvider>
      </TemplateProvider>
    </DragDropProvider>
  );
}
