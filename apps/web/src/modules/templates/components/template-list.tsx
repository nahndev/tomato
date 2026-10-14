"use client";

import { useState } from "react";
import { useTemplates } from "../hooks/use-templates";
import { TemplateContent } from "./template-content";
import { TemplateCreateForm } from "./template-create-form";
import { TemplateFilter } from "./template-filter";

export function TemplateList() {
  const { templates, isLoading, hasError, add, remove } = useTemplates();
  const [query, setQuery] = useState("");

  const visibleTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="flex w-full flex-col gap-6">
      <div className="flex items-center justify-between gap-4">
        <TemplateFilter value={query} onChange={setQuery} />
        <TemplateCreateForm onCreate={add} />
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
