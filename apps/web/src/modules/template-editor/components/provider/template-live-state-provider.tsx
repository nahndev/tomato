"use client";

import { useEffect, useState, type ReactNode } from "react";
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

  return <TemplateStateContext.Provider value={state}>{children}</TemplateStateContext.Provider>;
}
