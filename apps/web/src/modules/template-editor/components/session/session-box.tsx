import { SessionFrame } from "@/shared/components/session-frame";
import { SessionGrid } from "./session-grid";
import { SessionHeader } from "./session-header";
import { SessionSettingPopup } from "./session-setting-popup";
import { SessionIdProvider } from "../provider/session-id-provider";

interface SessionBoxProps {
  sessionId: string;
}

export function SessionBox({ sessionId }: SessionBoxProps) {
  return (
    <SessionIdProvider sessionId={sessionId}>
      <SessionFrame header={<SessionHeader />} actions={<SessionSettingPopup />}>
        <SessionGrid />
      </SessionFrame>
    </SessionIdProvider>
  );
}
