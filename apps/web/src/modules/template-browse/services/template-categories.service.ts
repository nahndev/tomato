import { apiClient } from "@/shared/lib/api-client";
import type { TemplateCategory } from "../template-browse.types";

const TEMPLATE_CATEGORIES_URL = "/template-categories";

export async function listTemplateCategories(): Promise<TemplateCategory[]> {
  const { data } = await apiClient.get<TemplateCategory[]>(TEMPLATE_CATEGORIES_URL);
  return data;
}
