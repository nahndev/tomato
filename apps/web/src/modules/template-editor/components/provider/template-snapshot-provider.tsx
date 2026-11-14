"use client";

import { useEffect, useState, type ReactNode } from "react";
import { createStoreContext } from "@tomato/store-context";
import { TemplateDataProvider } from "@/modules/template-data";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { readTemplateSnapshot } from "../../utils/read-template-snapshot";
import { useTemplateDoc } from "./template-doc-provider";

const TemplateSnapshotStore = createStoreContext<TemplateSnapshot>("TemplateSnapshot");

export const TemplateSnapshotProvider = TemplateSnapshotStore.Provider;

export const useTemplateSnapshot = TemplateSnapshotStore.useSelector;

function DocSnapshotSync() {
  const doc = useTemplateDoc();
  const store = TemplateSnapshotStore.useStoreApi();

  useEffect(() => {
    const onUpdate = () => store.setState(readTemplateSnapshot(doc));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc, store]);

  return null;
}

function SnapshotDataProvider({ children }: { children: ReactNode }) {
  const widgets = useTemplateSnapshot((snapshot) => snapshot.widgets);
  const links = useTemplateSnapshot((snapshot) => snapshot.links);
  const widgetToSession = useTemplateSnapshot((snapshot) => snapshot.widgetToSession);
  return (
    <TemplateDataProvider widgets={widgets} links={links} widgetToSession={widgetToSession}>
      {children}
    </TemplateDataProvider>
  );
}

export function TemplateDocSnapshotProvider({ children }: { children: ReactNode }) {
  const doc = useTemplateDoc();
  // Seeds the store once: `DocSnapshotSync` writes every doc update into it.
  const [initialSnapshot] = useState(() => readTemplateSnapshot(doc));

  return (
    <TemplateSnapshotProvider {...initialSnapshot}>
      <DocSnapshotSync />
      <SnapshotDataProvider>{children}</SnapshotDataProvider>
    </TemplateSnapshotProvider>
  );
}
