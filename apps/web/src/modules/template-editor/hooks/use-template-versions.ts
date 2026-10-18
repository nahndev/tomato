"use client";

import { useQuery } from "@tanstack/react-query";
import { listTemplateVersions } from "../services/template-editor.service";
import { templateEditorKeys } from "../template-editor.keys";

export function useTemplateVersions(templateId: string) {
  const { data, isLoading } = useQuery({
    queryKey: templateEditorKeys.versions(templateId),
    queryFn: () => listTemplateVersions(templateId),
  });

  const versions = data ?? [];

  return {
    versions,
    latestVersion: versions[0]?.version,
    isLoading,
  };
}
