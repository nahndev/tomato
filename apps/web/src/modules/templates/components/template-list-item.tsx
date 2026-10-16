import type { Template } from "@tomato/types";
import { Trash2Icon } from "lucide-react";
import { TEMPLATE_LIST_COLUMNS } from "../templates.constants";

interface TemplateListItemProps {
  template: Template;
  onDelete: (id: string) => void;
}

export function TemplateListItem({ template, onDelete }: TemplateListItemProps) {
  return (
    <div
      role="row"
      className={`grid ${TEMPLATE_LIST_COLUMNS} items-center gap-4 rounded-lg bg-card p-4 text-card-foreground shadow-card`}
    >
      <span role="cell" className="truncate font-medium">
        {template.name}
      </span>
      <span role="cell" className="truncate text-sm text-muted-foreground">
        {template.description}
      </span>
      <span role="cell" className="text-sm text-muted-foreground">
        {template.updatedAt.slice(0, 10)}
      </span>
      <span role="cell">
        <button
          type="button"
          aria-label={`Delete ${template.name}`}
          onClick={() => onDelete(template.id)}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Trash2Icon className="size-4" strokeWidth={1.75} />
        </button>
      </span>
    </div>
  );
}
