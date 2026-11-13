import { SessionGrid } from "./session-grid";
import { SessionHeader } from "./session-header";
import { SessionIdProvider } from "./session-id-provider";

interface SessionBoxProps {
  sessionId: string;
}

export function SessionBox({ sessionId }: SessionBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-card p-4 text-foreground shadow-card">
        <SessionIdProvider sessionId={sessionId}>
          <SessionHeader />
          <SessionGrid />
        </SessionIdProvider>
      </div>
    </div>
  );
}
