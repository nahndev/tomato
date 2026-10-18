"use client";

import { createContext, useContext, type ReactNode } from "react";

const SessionIdContext = createContext<string | null>(null);

interface SessionProviderProps {
  sessionId: string;
  children: ReactNode;
}

export function SessionProvider({ sessionId, children }: SessionProviderProps) {
  return <SessionIdContext.Provider value={sessionId}>{children}</SessionIdContext.Provider>;
}

export function useSessionId(): string {
  const id = useContext(SessionIdContext);
  if (!id) throw new Error("useSessionId must be used inside <SessionProvider>");
  return id;
}
