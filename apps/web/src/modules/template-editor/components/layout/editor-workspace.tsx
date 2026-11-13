"use client";

import { TemplateCopilot } from "../../copilot/components/template-copilot";
import { ToolbarPanel } from "../toolbar/toolbar-panel";
import { SessionList } from "../session/session-list";

export function EditorWorkspace() {
  return (
    <TemplateCopilot>
      <div className="flex size-full flex-row overflow-hidden">
        <div className="min-w-0 flex-1">
          <SessionList />
        </div>
        <ToolbarPanel />
      </div>
    </TemplateCopilot>
  );
}
