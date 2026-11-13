"use client";

import { useQuery } from "@tanstack/react-query";
import { listTemplateVersions } from "../services/template-versions.service";
import { templateKeys } from "../template.keys";

export function useTemplateVersions(templateId: string) {
  const { data, isLoading } = useQuery({
    queryKey: templateKeys.versions(templateId),
    queryFn: () => listTemplateVersions(templateId),
  });

  const versions = data ?? [];

  return {
    versions,
    latestVersion: versions[0]?.version,
    isLoading,
  };
}
