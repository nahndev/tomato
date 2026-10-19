"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { SubmissionDocKey } from "@tomato/constants";
import { Spinner } from "@tomato/ui";
import { getSubmissionDocumentName } from "@tomato/utils";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import * as Y from "yjs";
import { COLLAB_URL } from "@/shared/lib/collab-url";

interface SubmissionDocState {
  doc: Y.Doc;
  isConnected: boolean;
}

const SubmissionDocContext = createContext<SubmissionDocState | null>(null);

function readValues(doc: Y.Doc): Record<string, unknown> {
  return Object.fromEntries(doc.getMap<unknown>(SubmissionDocKey.VALUES).entries());
}

interface SubmissionDocProviderProps {
  submissionId: string;
  children: ReactNode;
}

/** Owns the submission's `Y.Doc` and its realtime connection; children render once the doc has synced. */
export function SubmissionDocProvider({ submissionId, children }: SubmissionDocProviderProps) {
  const [doc, setDoc] = useState<Y.Doc | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const nextDoc = new Y.Doc();
    const provider = new HocuspocusProvider({
      url: COLLAB_URL,
      name: getSubmissionDocumentName(submissionId),
      document: nextDoc,
      onStatus: ({ status }) => setIsConnected(status === "connected"),
      onSynced: () => setIsSynced(true),
    });

    setDoc(nextDoc);

    return () => {
      provider.destroy();
      nextDoc.destroy();
      setDoc(null);
      setIsConnected(false);
      setIsSynced(false);
    };
  }, [submissionId]);

  const state = useMemo(() => (doc ? { doc, isConnected } : null), [doc, isConnected]);

  if (!state || !isSynced) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return <SubmissionDocContext.Provider value={state}>{children}</SubmissionDocContext.Provider>;
}

function useSubmissionDocState(): SubmissionDocState {
  const state = useContext(SubmissionDocContext);
  if (!state) throw new Error("useSubmissionDoc must be used inside <SubmissionDocProvider>");
  return state;
}

export function useSubmissionConnection(): boolean {
  return useSubmissionDocState().isConnected;
}

/** Live values of the submission and a setter that writes through the doc. */
export function useSubmissionValues() {
  const { doc } = useSubmissionDocState();
  const [values, setValues] = useState(() => readValues(doc));

  useEffect(() => {
    const onUpdate = () => setValues(readValues(doc));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  const setValue = useCallback(
    (widgetId: string, value: unknown) =>
      doc.transact(() => doc.getMap<unknown>(SubmissionDocKey.VALUES).set(widgetId, value)),
    [doc],
  );

  return { values, setValue };
}
