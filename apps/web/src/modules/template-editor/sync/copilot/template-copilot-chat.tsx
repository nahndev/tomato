"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

/** Body of the "Assistant" toolbar tab; header, docking and the tab strip come from the toolbar panel. */
export function TemplateCopilotChat() {
  return (
    <div className="h-full overflow-hidden">
      <CopilotChat
        className="h-full"
        labels={{ welcomeMessageText: "Tell me which widgets to add, remove or change." }}
      />
    </div>
  );
}
