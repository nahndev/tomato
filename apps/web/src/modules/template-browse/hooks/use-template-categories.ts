"use client";

import type { TemplateCategory } from "@tomato/types";
import { useEffect, useState } from "react";
import { listTemplateCategories } from "../services/template-categories.service";

export function useTemplateCategories() {
  const [categories, setCategories] = useState<TemplateCategory[]>([]);

  useEffect(() => {
    listTemplateCategories()
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  return { categories };
}
