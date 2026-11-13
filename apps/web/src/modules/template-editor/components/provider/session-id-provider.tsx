"use client";

import { createContext, useContext, type ReactNode } from "react";

const SessionIdContext = createContext<string | null>(null);

interface SessionIdProviderProps {
  sessionId: string;
  children: ReactNode;
}

export function SessionIdProvider({ sessionId, children }: SessionIdProviderProps) {
  return <SessionIdContext.Provider value={sessionId}>{children}</SessionIdContext.Provider>;
}

export function useSessionId(): string {
  const id = useContext(SessionIdContext);
  if (!id) throw new Error("useSessionId must be used inside <SessionIdProvider>");
  return id;
}
