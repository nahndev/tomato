"use client";

import { useState } from "react";
import { useTemplateCategories } from "../hooks/use-template-categories";
import { useTemplates } from "../hooks/use-templates";
import { ALL_CATEGORY_ID, TemplateLayout } from "../template.constants";
import { TemplateCategories } from "./categories/template-categories";
import { TemplateLibrary } from "./library/template-library";
import { CreateTemplateDialog } from "./create-template-dialog";
import { TemplateSearch } from "./template-search";
import { TemplateLayoutToggle } from "./template-layout-toggle";

export function TemplateBrowser() {
  const { templates, add, remove } = useTemplates();
  const [query, setQuery] = useState("");
  const [categoryId, setCategoryId] = useState(ALL_CATEGORY_ID);
  const { categories } = useTemplateCategories();
  const [layout, setLayout] = useState<TemplateLayout>(TemplateLayout.GRID);

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
        <TemplateSearch value={query} onChange={setQuery} />
        <div className="flex items-center gap-3">
          <TemplateLayoutToggle value={layout} onChange={setLayout} />
          <CreateTemplateDialog onCreate={add} />
        </div>
      </div>
      <div className="flex flex-row items-start gap-8">
        <TemplateCategories
          categories={categories}
          counts={counts}
          selectedId={categoryId}
          onSelect={setCategoryId}
        />
        <div className="min-w-0 flex-1">
          <TemplateLibrary
            templates={visibleTemplates}
            categories={categories}
            layout={layout}
            onDelete={remove}
          />
        </div>
      </div>
    </div>
  );
}
