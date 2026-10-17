import type { Template } from "@tomato/types";
import { TemplateListItem } from "./template-list-item";

interface TemplateListProps {
  templates: Template[];
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export function TemplateList({
  templates,
  selectedId,
  onSelect,
}: TemplateListProps) {
  return (
    <section className="flex min-w-0 flex-col gap-3">
      <h3 className="font-medium text-muted-foreground">List</h3>
      <div role="listbox" className="flex flex-col gap-2">
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            isSelected={template.id === selectedId}
            onSelect={onSelect}
          />
        ))}
      </div>
    </section>
  );
}
