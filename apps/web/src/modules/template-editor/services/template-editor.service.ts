import { apiClient } from "@/shared/lib/api-client";
import type { Template } from "@/shared/types/template.types";

const TEMPLATES_URL = "/templates";

export async function getTemplate(id: string): Promise<Template> {
  const { data } = await apiClient.get<Template>(`${TEMPLATES_URL}/${id}`);
  return data;
}
