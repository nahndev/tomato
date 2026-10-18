"use client";

import { useSessionState } from "../../hooks/use-session-state";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { IconPicker } from "./icon-picker";
import { useSessionId } from "./session-provider";
import { SessionNameInput } from "./session-name-input";
import { SessionSettingPopup } from "./session-setting-popup";

export function SessionHeader() {
  const sessionId = useSessionId();
  const { session } = useSessionState();
  const { updateSession } = useSessionActions();

  return (
    <div className="flex items-center gap-2 border-b border-border p-2">
      <IconPicker value={session?.icon} onChange={(icon) => updateSession(sessionId, { icon })} />
      <SessionNameInput />
      <SessionSettingPopup />
    </div>
  );
}
