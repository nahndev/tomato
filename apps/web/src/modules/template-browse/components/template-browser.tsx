"use client";

import { useState } from "react";
import { useTemplateCategories } from "../hooks/use-template-categories";
import { useTemplates } from "../hooks/use-templates";
import { ALL_CATEGORY_ID, TemplateView } from "../template-browse.constants";
import { TemplateCategories } from "./categories/template-categories";
import { TemplateContent } from "./content/template-content";
import { TemplateCreateForm } from "./template-create-form";
import { TemplateFilter } from "./template-filter";
import { TemplateViewToggle } from "./template-view-toggle";

export function TemplateBrowser() {
  const { templates, add } = useTemplates();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID);
  const { categories } = useTemplateCategories();
  const [view, setView] = useState<TemplateView>(TemplateView.GRID);

  const matchedTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(query.toLowerCase()),
  );
  const visibleTemplates =
    categoryId === ALL_CATEGORY_ID
      ? matchedTemplates
      : matchedTemplates.filter(
          (template) => template.categoryId === categoryId,
        );
  const counts: Record<string, number> = {};
  for (const template of matchedTemplates) {
    counts[template.categoryId] = (counts[template.categoryId] ?? 0) + 1;
  }

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <TemplateFilter value={query} onChange={setQuery} />
        <div className="flex items-center gap-3">
          <TemplateViewToggle value={view} onChange={setView} />
          <TemplateCreateForm onCreate={add} />
        </div>
      </div>
      <div className="flex flex-row items-start gap-8">
        <TemplateCategories
          categories={categories}
          counts={counts}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
        <div className="flex-1">
          <TemplateContent
            templates={visibleTemplates}
            categories={categories}
            />
        </div>
      </div>
    </div>
  );
}
