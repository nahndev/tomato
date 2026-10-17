"use client";

import { useQuery } from "@tanstack/react-query";
import { listTemplateCategories } from "../services/template-categories.service";
import { templateKeys } from "../template-browse.keys";

export function useTemplateCategories() {
  const { data } = useQuery({
    queryKey: templateKeys.categories,
    queryFn: listTemplateCategories,
  });

  return { categories: data ?? [] };
}
