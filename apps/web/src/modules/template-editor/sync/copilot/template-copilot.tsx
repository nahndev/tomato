"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { toast } from "@tomato/ui";
import type { ReactNode } from "react";
import { useTemplateMode } from "../../components/provider/template-builder-provider";
import { COPILOT_RUNTIME_URL, COPILOT_SILENT_ERROR_CODES, TemplateMode } from "../../template-editor.constants";
import { SessionCopilotFunctions } from "./session-copilot-functions";
import { TemplateCopilotContext } from "./template-copilot-context";
import { WidgetCopilotFunctions } from "./widget-copilot-functions";

interface TemplateCopilotProps {
  children: ReactNode;
}

/**
 * Wraps the builder in the CopilotKit provider and mounts the widget and
 * session tools beside it. Only active while editing, so the copilot cannot
 * change a template that is open in view mode.
 */
export function TemplateCopilot({ children }: TemplateCopilotProps) {
  const mode = useTemplateMode();
  if (mode !== TemplateMode.EDIT) return <>{children}</>;

  return (
    <CopilotKitProvider
      runtimeUrl={COPILOT_RUNTIME_URL}
      enableInspector={false}
      onError={(event) => {
        console.error("Copilot error", { code: event.code, message: event.error?.message, context: event.context });
        if (COPILOT_SILENT_ERROR_CODES.includes(event.code)) return;
        toast.error(`The copilot failed${event.error?.message ? `: ${event.error.message}` : ""}.`);
      }}
    >
      <TemplateCopilotContext />
      <WidgetCopilotFunctions />
      <SessionCopilotFunctions />
      {children}
    </CopilotKitProvider>
  );
}
