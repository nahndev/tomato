"use client";

import { CopilotChat } from "@copilotkit/react-core/v2";

export function ChatToolbar() {
  return (
    <div className="h-full overflow-hidden">
      <CopilotChat
        className="h-full"
        labels={{ welcomeMessageText: "Tell me which widgets to add, remove or change." }}
      />
    </div>
  );
}
