"use client";

import { HocuspocusProvider } from "@hocuspocus/provider";
import { getTemplateDocumentName } from "@tomato/utils";
import { Spinner } from "@tomato/ui";
import { useEffect, useState, type ReactNode } from "react";
import type * as Y from "yjs";
import { COLLAB_URL } from "@/shared/lib/collab-url";
import { createStoreContext } from "@tomato/store-context";
import { SyncDocProvider, useSyncDoc, type SyncDoc } from "@/shared/lib/sync";
import { createTemplateSyncDoc } from "../../sync/create-template-sync-doc";

const TemplateConnectionStore = createStoreContext<{ isConnected: boolean }>("TemplateConnection");

interface TemplateDocProviderProps {
  templateId: string;
  children: ReactNode;
}

export function TemplateDocProvider({ templateId, children }: TemplateDocProviderProps) {
  const [syncDoc, setSyncDoc] = useState<SyncDoc | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isSynced, setIsSynced] = useState(false);

  useEffect(() => {
    const nextSyncDoc = createTemplateSyncDoc();

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
    <SyncDocProvider syncDoc={syncDoc}>
      <TemplateConnectionStore.Provider isConnected={isConnected}>{children}</TemplateConnectionStore.Provider>
    </SyncDocProvider>
  );
}

export function useTemplateDoc(): Y.Doc {
  return useSyncDoc().doc;
}

export function useTemplateConnection(): boolean {
  return TemplateConnectionStore.useSelector((state) => state.isConnected);
}
