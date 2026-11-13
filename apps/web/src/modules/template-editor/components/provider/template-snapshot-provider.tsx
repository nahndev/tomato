"use client";

import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import { TemplateDataProvider } from "@/modules/template-data";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { readTemplateSnapshot } from "../../utils/read-template-snapshot";
import { useTemplateDoc } from "./template-doc-provider";

export const TemplateSnapshotContext = createContext<TemplateSnapshot | null>(null);

export function TemplateSnapshotProvider({ children }: { children: ReactNode }) {
  const doc = useTemplateDoc();
  const [snapshot, setSnapshot] = useState<TemplateSnapshot>(() => readTemplateSnapshot(doc));

  useEffect(() => {
    const onUpdate = () => setSnapshot(readTemplateSnapshot(doc));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  const dataValue = useMemo(
    () => ({ widgets: snapshot.widgets, links: snapshot.links }),
    [snapshot.widgets, snapshot.links],
  );

  return (
    <TemplateSnapshotContext.Provider value={snapshot}>
      <TemplateDataProvider value={dataValue}>{children}</TemplateDataProvider>
    </TemplateSnapshotContext.Provider>
  );
}

export function useTemplateSnapshot(): TemplateSnapshot {
  const snapshot = useContext(TemplateSnapshotContext);
  if (!snapshot) throw new Error("useTemplateSnapshot must be used inside <TemplateSnapshotProvider>");
  return snapshot;
}
