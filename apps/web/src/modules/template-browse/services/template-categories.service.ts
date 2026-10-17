import type { TemplateCategory } from "@tomato/types";
import { apiClient } from "@/shared/lib/api-client";

const TEMPLATE_CATEGORIES_URL = "/template-categories";

export async function listTemplateCategories(): Promise<TemplateCategory[]> {
  const { data } = await apiClient.get<TemplateCategory[]>(TEMPLATE_CATEGORIES_URL);
  return data;
}
