"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { SubmissionDocKey, SubmissionDocMetaKey } from "@tomato/constants";
import { Spinner } from "@tomato/ui";
import { getSubmissionDocumentName } from "@tomato/utils";
import { useCallback, useEffect, useState, type ReactNode } from "react";
import * as Y from "yjs";
import { COLLAB_URL } from "@/shared/lib/collab-url";
import { createStoreContext } from "@tomato/store-context";

const SubmissionDocStore = createStoreContext<{ doc: Y.Doc; isConnected: boolean }>("SubmissionDoc");

function readMap(doc: Y.Doc, key: SubmissionDocKey): Record<string, unknown> {
  return Object.fromEntries(doc.getMap<unknown>(key).entries());
}

function useDocMap(key: SubmissionDocKey) {
  const doc = SubmissionDocStore.useSelector((state) => state.doc);
  const [entries, setEntries] = useState(() => readMap(doc, key));

  useEffect(() => {
    const onUpdate = () => setEntries(readMap(doc, key));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc, key]);

  return { doc, entries };
}

function markUpdated(doc: Y.Doc): void {
  doc.getMap<unknown>(SubmissionDocKey.META).set(SubmissionDocMetaKey.UPDATED, Date.now());
}

interface SubmissionDocProviderProps {
  submissionId: string;
  children: ReactNode;
}

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

  if (!doc || !isSynced) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <SubmissionDocStore.Provider doc={doc} isConnected={isConnected}>
      {children}
    </SubmissionDocStore.Provider>
  );
}

export function useSubmissionConnection(): boolean {
  return SubmissionDocStore.useSelector((state) => state.isConnected);
}

export function useSubmissionValues() {
  const { doc, entries: values } = useDocMap(SubmissionDocKey.VALUES);

  const setValue = useCallback(
    (widgetId: string, value: unknown) =>
      doc.transact(() => {
        doc.getMap<unknown>(SubmissionDocKey.VALUES).set(widgetId, value);
        markUpdated(doc);
      }),
    [doc],
  );

  return { values, setValue };
}

export function useSubmissionTitle() {
  const { doc, entries: meta } = useDocMap(SubmissionDocKey.META);
  const title = meta[SubmissionDocMetaKey.TITLE];

  const setTitle = useCallback(
    (next: string) =>
      doc.transact(() => {
        doc.getMap<unknown>(SubmissionDocKey.META).set(SubmissionDocMetaKey.TITLE, next);
        markUpdated(doc);
      }),
    [doc],
  );

  return { title: typeof title === "string" ? title : "", setTitle };
}
