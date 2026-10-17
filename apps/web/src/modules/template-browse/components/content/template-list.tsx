import type { Template, TemplateCategory } from "@tomato/types";
import { TemplateListItem } from "./template-list-item";

interface TemplateListProps {
  templates: Template[];
  categories: TemplateCategory[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateList({
  templates,
  categories,
  selectedId,
  onSelect,
}: TemplateListProps) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="font-medium text-muted-foreground">List</h3>
      <div role="listbox" className="grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4">
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            category={categories.find((c) => c.id === template.categoryId)}
            isSelected={template.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
