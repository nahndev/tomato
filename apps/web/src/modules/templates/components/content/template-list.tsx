import type { Template } from "@tomato/types";
import { TemplateListHeader } from "./template-list-header";
import { TemplateListItem } from "./template-list-item";

interface TemplateListProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

export function TemplateList({ templates, onDelete }: TemplateListProps) {
  return (
    <section className="flex flex-col gap-3 min-w-0 flex-[2]">
      <h3 className="text-sm font-medium text-muted-foreground">List</h3>
      <div role="table" className="flex flex-col gap-2">
        <TemplateListHeader />
        {templates.map((template) => (
          <TemplateListItem
            key={template.id}
            template={template}
            onDelete={onDelete}
          />
        ))}
      </div>
    </section>
  );
}
