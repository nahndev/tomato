"use client";

import { useEffect, useMemo, useState, type ReactNode } from "react";
import { WidgetsProvider } from "@/modules/template-widget";
import { TemplateStateContext } from "../../hooks/use-template-state";
import type { TemplateState } from "../../template-editor.types";
import { readTemplateState } from "../../utils/template-state-reader";
import { useTemplateDoc } from "./template-doc-provider";

export function TemplateLiveStateProvider({ children }: { children: ReactNode }) {
  const doc = useTemplateDoc();
  const [state, setState] = useState<TemplateState>(() => readTemplateState(doc));

  useEffect(() => {
    const onUpdate = () => setState(readTemplateState(doc));
    onUpdate();
    doc.on("update", onUpdate);
    return () => doc.off("update", onUpdate);
  }, [doc]);

  const widgetsValue = useMemo(() => ({ widgets: state.widgets, links: state.links }), [state.widgets, state.links]);

  return (
    <TemplateStateContext.Provider value={state}>
      <WidgetsProvider value={widgetsValue}>{children}</WidgetsProvider>
    </TemplateStateContext.Provider>
  );
}
