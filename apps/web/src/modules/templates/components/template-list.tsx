"use client";

import { Spinner } from "@tomato/ui";
import { useTemplates } from "../hooks/use-templates";
import { TemplateCard } from "./template-card";
import { TemplateCreateForm } from "./template-create-form";

export function TemplateList() {
  const { templates, isLoading, hasError, add, remove } = useTemplates();

  return (
    <div className="flex flex-col gap-4">
      <TemplateCreateForm onCreate={add} />
      {isLoading ? (
        <Spinner />
      ) : hasError ? (
        <p className="text-danger">Failed to load templates</p>
      ) : (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {templates.map((template) => (
            <TemplateCard key={template.id} template={template} onDelete={remove} />
          ))}
        </ul>
      )}
    </div>
  );
}
