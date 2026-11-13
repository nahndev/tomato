"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { TemplateStoreProvider } from "@/modules/template-store";
import { TemplateStateContext } from "../../hooks/use-template-state";
import type { TemplateSnapshot } from "@/shared/types/template.types";
import { readTemplateState } from "../../utils/template-state-reader";
import { useTemplateDoc } from "./template-doc-provider";

export function TemplateLiveStateProvider({ children }: { children: ReactNode }) {
  const doc = useTemplateDoc();
  const [state, setState] = useState<TemplateSnapshot>(() => readTemplateState(doc));

  useEffect(() => {
    const onUpdate = () => setState(readTemplateState(doc));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  const storeValue = useMemo(() => ({ widgets: state.widgets, links: state.links }), [state.widgets, state.links]);

  return (
    <TemplateStateContext.Provider value={state}>
      <TemplateStoreProvider value={storeValue}>{children}</TemplateStoreProvider>
    </TemplateStateContext.Provider>
  );
}
