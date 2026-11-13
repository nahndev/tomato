import type { PaginatedResponse } from "@/shared/types/api.types";
import { apiClient } from "@/shared/lib/api-client";
import type { CreateTemplateInput } from "../template.schemas";
import type { Template } from "@/shared/types/template.types";

const TEMPLATES_URL = "/templates";

export async function listTemplates(): Promise<PaginatedResponse<Template>> {
  const { data } = await apiClient.get<PaginatedResponse<Template>>(TEMPLATES_URL);
  return data;
}

export async function getTemplate(id: string): Promise<Template> {
  const { data } = await apiClient.get<Template>(`${TEMPLATES_URL}/${id}`);
  return data;
}

export async function createTemplate(input: CreateTemplateInput): Promise<Template> {
  const { data } = await apiClient.post<Template>(TEMPLATES_URL, input);
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await apiClient.delete(`${TEMPLATES_URL}/${id}`);
}
