import { useState } from "react";
import { TemplateList } from "./template-list";
import { TemplateDetails } from "./template-details";
import type { Template } from "@/shared/types/template.types";
import type { TemplateLayout } from "../../template.constants";
import type { TemplateCategory } from "../../template.types";

interface TemplateLibraryProps {
  templates: Template[];
  categories: TemplateCategory[];
  layout: TemplateLayout;
  onDelete: (id: string) => void;
}

export function TemplateLibrary({
  templates,
  categories,
  layout,
  onDelete,
}: TemplateLibraryProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = templates.find((t) => t.id === selectedId);

  return (
    <div className="flex flex-row gap-8">
      <div className="min-w-0 flex-1">
        <TemplateList
          templates={templates}
          categories={categories}
          layout={layout}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onDelete={onDelete}
        />
      </div>
      <aside className="w-80 shrink-0 pt-8">
        {selected && (
          <TemplateDetails
            template={selected}
            category={categories.find((c) => c.id === selected.categoryId)}
          />
        )}
      </aside>
    </div>
  );
}
