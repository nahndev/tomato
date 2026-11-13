"use client";

import { DragDropProvider } from "@dnd-kit/react";
import { Spinner, Toaster } from "@tomato/ui";
import { notFound } from "next/navigation";
import { useTemplate, useTemplateVersions } from "@/modules/template";
import type { TemplateMode } from "../template-editor.constants";
import { TemplateModeProvider } from "./provider/template-mode-provider";
import { TemplateEditorProvider } from "./provider/template-editor-provider";
import { EditorWorkspace } from "./layout/editor-workspace";
import { EditorHeader } from "./layout/editor-header";

interface TemplateEditorProps {
  templateId: string;
  mode: TemplateMode;
}

export function TemplateEditor({ templateId, mode }: TemplateEditorProps) {
  const { template, isLoading, hasError } = useTemplate(templateId);
  const { latestVersion } = useTemplateVersions(templateId);

  if (isLoading) {
    return (
      <div className="flex h-screen items-center justify-center bg-canvas">
        <Spinner />
      </div>
    );
  }

  if (hasError || !template) notFound();

  return (
    <DragDropProvider>
      <TemplateEditorProvider template={template} version={latestVersion}>
        <TemplateModeProvider mode={mode}>
          <div className="grid h-screen grid-rows-[auto_1fr] overflow-hidden bg-canvas">
            <EditorHeader />
            <div className="min-h-0">
              <EditorWorkspace />
            </div>
          </div>
          <Toaster />
        </TemplateModeProvider>
      </TemplateEditorProvider>
    </DragDropProvider>
  );
}
