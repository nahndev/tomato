"use client";

import { useQuery } from "@tanstack/react-query";
import { getTemplate } from "../services/templates.service";
import { templateKeys } from "../template.keys";

export function useTemplate(id: string) {
  const { data, isLoading, isError } = useQuery({
    queryKey: templateKeys.detail(id),
    queryFn: () => getTemplate(id),
  });

  return { template: data, isLoading, hasError: isError };
}
