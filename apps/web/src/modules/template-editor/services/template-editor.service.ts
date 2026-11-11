import { apiClient } from "@/shared/lib/api-client";
import type { TemplateVersion } from "../template-editor.types";
import type { Template } from "@/modules/template-browse";

const TEMPLATES_URL = "/templates";

export async function getTemplate(id: string): Promise<Template> {
  const { data } = await apiClient.get<Template>(`${TEMPLATES_URL}/${id}`);
  return data;
}

export async function listTemplateVersions(templateId: string): Promise<TemplateVersion[]> {
  const { data } = await apiClient.get<TemplateVersion[]>(`${TEMPLATES_URL}/${templateId}/versions`);
  return data;
}

export async function publishTemplate(templateId: string): Promise<TemplateVersion> {
  const { data } = await apiClient.post<TemplateVersion>(`${TEMPLATES_URL}/${templateId}/versions`);
  return data;
}
