import { TemplateLayout } from "../../template.constants";
import { TemplateListItem } from "./template-list-item";
import { TemplateListToolbar } from "./template-list-toolbar";
import type { Template } from "@/shared/types/template.types";
import type { TemplateCategory } from "../../template.types";

interface TemplateListProps {
  templates: Template[];
  categories: TemplateCategory[];
  layout: TemplateLayout;
  selectedId: string | null;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplateList({
  templates,
  categories,
  layout,
  selectedId,
  onSelect,
  onDelete,
}: TemplateListProps) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <TemplateListToolbar
        selected={templates.find((template) => template.id === selectedId)}
        onDelete={onDelete}
      />
      <div
        role="listbox"
        className={
          layout === TemplateLayout.GRID
            ? "grid grid-cols-[repeat(auto-fill,minmax(10rem,1fr))] gap-4"
            : "flex flex-col gap-2"
        }
      >
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            category={categories.find((c) => c.id === template.categoryId)}
            layout={layout}
            isSelected={template.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
