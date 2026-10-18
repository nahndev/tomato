"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { getTemplateDocumentName } from "@tomato/utils";
import { Spinner } from "@tomato/ui";
import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import type * as Y from "yjs";
import { SyncDocProvider, useSyncDoc, type SyncDoc } from "@/shared/lib/sync";
import { COLLAB_URL } from "../../template-editor.constants";
import { createSyncDoc } from "../../sync/create-sync-doc";

const TemplateConnectionContext = createContext(false);

interface TemplateDocProviderProps {
  templateId: string;
  children: ReactNode;
}

/** Owns the `SyncDoc` and its realtime connection; children render only once the doc has synced. */
export function TemplateDocProvider({ templateId, children }: TemplateDocProviderProps) {
  const [syncDoc, setSyncDoc] = useState<SyncDoc | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const nextSyncDoc = createSyncDoc();

    const provider = new HocuspocusProvider({
      url: COLLAB_URL,
      name: getTemplateDocumentName(templateId),
      document: nextSyncDoc.doc,
      onStatus: ({ status }) => setIsConnected(status === "connected"),
      onSynced: () => {
        nextSyncDoc.synced();
        setIsSynced(true);
      },
    });

    setSyncDoc(nextSyncDoc);

    return () => {
      provider.destroy();
      nextSyncDoc.destroy();
      setSyncDoc(null);
      setIsConnected(false);
      setIsSynced(false);
    };
  }, [templateId]);

  if (!syncDoc || !isSynced) {
    return (
      <div className="flex h-full items-center justify-center text-muted-foreground">
        <Spinner />
      </div>
    );
  }

  return (
    <SyncDocProvider value={syncDoc}>
      <TemplateConnectionContext.Provider value={isConnected}>{children}</TemplateConnectionContext.Provider>
    </SyncDocProvider>
  );
}

export function useTemplateDoc(): Y.Doc {
  return useSyncDoc().doc;
}

export function useTemplateConnection(): boolean {
  return useContext(TemplateConnectionContext);
}
