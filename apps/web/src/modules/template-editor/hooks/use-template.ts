"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplate } from "../services/template-editor.service";
import { templateEditorKeys } from "../template-editor.keys";

export function useTemplate(id: string) {
  return useQuery({
    queryKey: templateEditorKeys.template(id),
    queryFn: () => getTemplate(id),
  });
}
