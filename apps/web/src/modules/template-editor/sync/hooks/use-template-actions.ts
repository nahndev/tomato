"use client";

import { useHandler, useTransaction } from "@/shared/lib/sync";
import { TemplateHandler } from "../handlers/template-handler";

export interface TemplateActions {
  setName: (name: string) => void;
}

export function useTemplateActions(): TemplateActions {
  const templateHandler = useHandler(TemplateHandler);
  const transact = useTransaction();

  return {
    setName: (name) => transact(() => templateHandler.setName(name)),
  };
}
