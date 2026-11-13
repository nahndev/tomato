import { apiClient } from "@/shared/lib/api-client";
import type { TemplateVersion } from "@/shared/types/template.types";

const versionsUrl = (templateId: string) => `/templates/${templateId}/versions`;

export async function listTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
  const { data } = await apiClient.get<TemplateVersion[]>(versionsUrl(templateId));
  return data;
}

export async function publishTemplate(templateId: string): Promise<TemplateVersion> {
  const { data } = await apiClient.post<TemplateVersion>(versionsUrl(templateId));
  return data;
}
