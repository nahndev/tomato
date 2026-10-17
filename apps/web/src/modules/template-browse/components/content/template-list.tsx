import type { Template } from "@tomato/types";
import { TemplateListItem } from "./template-list-item";

interface TemplateListProps {
  templates: Template[];
  selectedId: string;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplateList({
  templates,
  selectedId,
  onSelect,
  onDelete,
}: TemplateListProps) {
  return (
    <section className="flex flex-col gap-3 min-w-0 flex-[2]">
      <h3 className="text-sm font-medium text-muted-foreground">List</h3>
      <div role="table" className="flex flex-col gap-2">
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            isSelected={template.id === selectedId}
            onSelect={onSelect}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
