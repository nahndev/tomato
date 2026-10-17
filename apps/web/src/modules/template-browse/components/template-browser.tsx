"use client";

import { useState } from "react";
import { useTemplates } from "../hooks/use-templates";
import { TemplateView } from "../template-browse.constants";
import { TemplateContent } from "./content/template-content";
import { TemplateCreateForm } from "./template-create-form";
import { TemplateFilter } from "./template-filter";
import { TemplateViewToggle } from "./template-view-toggle";

export function TemplateBrowser() {
  const { templates, isLoading, hasError, add, remove } = useTemplates();
  const [query, setQuery] = useState("");
  const [view, setView] = useState<TemplateView>(TemplateView.GRID);

  const visibleTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex w-full flex-1 flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <TemplateFilter value={query} onChange={setQuery} />
        <div className="flex items-center gap-3">
          <TemplateViewToggle value={view} onChange={setView} />
          <TemplateCreateForm onCreate={add} />
        </div>
      </div>
      <TemplateContent
        templates={visibleTemplates}
        isLoading={isLoading}
        hasError={hasError}
        onDelete={remove}
      />
    </div>
  );
}
