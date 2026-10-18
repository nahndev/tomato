import { SessionCanvas } from "./session-canvas";
import { SessionHeader } from "./session-header";
import { SessionProvider } from "./session-provider";

interface SessionBoxProps {
  sessionId: string;
}

export function SessionBox({ sessionId }: SessionBoxProps) {
  return (
    <div className="flex flex-col items-center">
      <div className="rounded-lg bg-card p-4 text-foreground shadow-card">
        <SessionProvider sessionId={sessionId}>
          <SessionHeader />
          <SessionCanvas />
        </SessionProvider>
      </div>
    </div>
  );
}
