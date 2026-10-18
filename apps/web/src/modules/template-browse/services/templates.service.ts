import type { PaginatedResponse, Template } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";
import type { CreateTemplateInput } from "../template-browse.schemas";

const TEMPLATES_URL = "/templates";

export async function listTemplates(): Promise<PaginatedResponse<Template>> {
  const { data } = await apiClient.get<PaginatedResponse<Template>>(TEMPLATES_URL);
  return data;
}

export async function createTemplate(input: CreateTemplateInput): Promise<Template> {
  const { data } = await apiClient.post<Template>(TEMPLATES_URL, input);
  return data;
}

export async function deleteTemplate(id: string): Promise<void> {
  await apiClient.delete(`${TEMPLATES_URL}/${id}`);
}
