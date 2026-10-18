"use client";

import { TemplateCopilot } from "../../sync/copilot/template-copilot";
import { ToolbarPanel } from "../toolbar/toolbar-panel";
import { TemplateCanvas } from "./template-canvas";

export function TemplateBuilder() {
  return (
    <TemplateCopilot>
      <div className="flex size-full flex-row overflow-hidden">
        <div className="min-w-0 flex-1">
          <TemplateCanvas />
        </div>
        <ToolbarPanel />
      </div>
    </TemplateCopilot>
  );
}
