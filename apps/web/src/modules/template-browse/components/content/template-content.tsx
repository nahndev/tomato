import type { Template, TemplateCategory } from "@tomato/types";
import { useState } from "react";
import { TemplateList } from "./template-list";
import { TemplatePreview } from "./template-preview";

interface TemplateContentProps {
  templates: Template[];
  categories: TemplateCategory[];
  onDelete: (id: string) => void;
}

export function TemplateContent({
  templates,
  categories,
  onDelete,
}: TemplateContentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = templates.find((t) => t.id === selectedId);

  return (
    <div className="flex flex-row gap-8">
      <div className="min-w-0 flex-1">
        <TemplateList
          templates={templates}
          categories={categories}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          onDelete={onDelete}
        />
      </div>
      <aside className="w-80 shrink-0 pt-8">
        {selected && (
          <TemplatePreview
            template={selected}
            category={categories.find((c) => c.id === selected.categoryId)}
          />
        )}
      </aside>
    </div>
  );
}
