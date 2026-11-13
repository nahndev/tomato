"use client";

import { useSessionSnapshot } from "../../hooks/use-session-snapshot";
import { useSessionActions } from "../../sync/hooks/use-session-actions";
import { IconPicker } from "./icon-picker";
import { useSessionId } from "../provider/session-id-provider";
import { SessionNameInput } from "./session-name-input";
import { SessionSettingPopup } from "./session-setting-popup";

export function SessionHeader() {
  const sessionId = useSessionId();
  const { session } = useSessionSnapshot();
  const { updateSession } = useSessionActions();

  return (
    <div className="flex items-center gap-2 border-b border-border p-2">
      <IconPicker value={session?.icon} onChange={(icon) => updateSession(sessionId, { icon })} />
      <SessionNameInput />
      <SessionSettingPopup />
    </div>
  );
}
