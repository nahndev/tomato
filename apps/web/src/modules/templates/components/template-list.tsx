import type { Template } from "@tomato/types";
import { TemplateListHeader } from "./template-list-header";
import { TemplateListItem } from "./template-list-item";

interface TemplateListProps {
  templates: Template[];
  onDelete: (id: string) => void;
}

export function TemplateList({ templates, onDelete }: TemplateListProps) {
  return (
    <div role="table" className="flex flex-col gap-2">
      <TemplateListHeader />
      {templates.map((template) => (
        <TemplateListItem key={template.id} template={template} onDelete={onDelete} />
      ))}
    </div>
  );
}
