"use client";

import type { CreateTemplateInput } from "@tomato/schemas";
import type { Template } from "@tomato/types";
import { useCallback, useEffect, useState } from "react";
import { createTemplate, deleteTemplate, listTemplates } from "../services/templates.service";

export function useTemplates() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const { items } = await listTemplates();
      setTemplates(items);
      setHasError(false);
    } catch {
      setHasError(true);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const add = useCallback(
    async (input: CreateTemplateInput) => {
      await createTemplate(input);
      await refresh();
    },
    [refresh],
  );

  const remove = useCallback(
    async (id: string) => {
      await deleteTemplate(id);
      await refresh();
    },
    [refresh],
  );

  return { templates, isLoading, hasError, add, remove };
}
