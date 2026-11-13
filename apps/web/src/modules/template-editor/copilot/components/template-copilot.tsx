"use client";

import { CopilotKitProvider } from "@copilotkit/react-core/v2";
import "@copilotkit/react-core/v2/styles.css";
import { toast } from "@tomato/ui";
import type { ReactNode } from "react";
import { useTemplateMode } from "../../components/provider/template-mode-provider";
import { COPILOT_RUNTIME_URL, COPILOT_SILENT_ERROR_CODES, TemplateMode } from "../../template-editor.constants";
import { SessionCopilotTools } from "./session-copilot-tools";
import { CopilotAgentContext } from "./copilot-agent-context";
import { WidgetCopilotTools } from "./widget-copilot-tools";

interface TemplateCopilotProps {
  children: ReactNode;
}

/** Only active while editing, so the copilot cannot change a template open in view mode. */
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
      <CopilotAgentContext />
      <WidgetCopilotTools />
      <SessionCopilotTools />
      {children}
    </CopilotKitProvider>
  );
}
