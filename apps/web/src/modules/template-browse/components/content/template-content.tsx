import type { Template, TemplateCategory } from "@tomato/types";
import { useState } from "react";
import { TemplateList } from "./template-list";
import { TemplatePreview } from "./template-preview";

interface TemplateContentProps {
  templates: Template[];
  categories: TemplateCategory[];
}

export function TemplateContent({
  templates,
  categories,
}: TemplateContentProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  const selected = templates.find((t) => t.id === selectedId);

  return (
    <div className="flex flex-row gap-8">
      <div className="flex-1">
        <TemplateList
          templates={templates}
          selectedId={selected?.id ?? null}
          onSelect={setSelectedId}
          />
      </div>
      <div className="w-80">
        {selected && (
          <TemplatePreview
            template={selected}
            category={categories.find((c) => c.id === selected.categoryId)}
          />
        )}
      </div>
    </div>
  );
}
