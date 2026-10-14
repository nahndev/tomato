"use client";

import { Spinner } from "@tomato/ui";
import { useState } from "react";
import { useTemplates } from "../hooks/use-templates";
import { TemplateTab } from "../template.constants";
import { TemplateCard } from "./template-card";
import { TemplateCreateForm } from "./template-create-form";
import { TemplateFilter } from "./template-filter";
import { TemplateTabs } from "./template-tabs";

export function TemplateList() {
  const { templates, isLoading, hasError, add, remove } = useTemplates();
  const [tab, setTab] = useState<TemplateTab>(TemplateTab.ALL);
  const [query, setQuery] = useState("");

  const visibleTemplates = templates.filter((template) =>
    template.name.toLowerCase().includes(query.toLowerCase()),
  );

  return (
    <div className="mx-auto flex w-full max-w-5xl flex-col gap-4">
      <div className="flex items-center justify-between gap-4">
        <h1 className="text-2xl font-semibold">Templates</h1>
        <TemplateCreateForm onCreate={add} />
      </div>
      <div className="border-b border-input">
        <TemplateTabs value={tab} onChange={setTab} />
      </div>
      <TemplateFilter onFilter={setQuery} />
      {isLoading ? (
        <Spinner />
      ) : hasError ? (
        <p className="text-danger">Failed to load templates</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {visibleTemplates.map((template) => (
            <TemplateCard key={template.id} template={template} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}
