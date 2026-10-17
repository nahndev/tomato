import type { Template } from "@tomato/types";
import { Trash2Icon } from "lucide-react";
import { TEMPLATE_LIST_COLUMNS } from "../../template-browse.constants";

interface TemplateListItemProps {
  template: Template;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onDelete: (id: string) => void;
}

export function TemplateListItem({
  template,
  isSelected,
  onSelect,
  onDelete,
}: TemplateListItemProps) {
  return (
    <div
      role="row"
      aria-selected={isSelected}
      onClick={() => onSelect(template.id)}
      className={`grid ${TEMPLATE_LIST_COLUMNS} cursor-pointer items-center gap-4 rounded-lg p-4 text-card-foreground shadow-card transition-colors hover:bg-muted ${isSelected ? "bg-muted" : "bg-card"}`}
    >
      <span role="cell" className="truncate font-medium">
        <button
          type="button"
          className="max-w-full truncate rounded-md text-left focus-visible:outline-2 focus-visible:outline-ring"
        >
          {template.name}
        </button>
      </span>
      <span role="cell" className="hidden truncate text-sm text-muted-foreground md:block">
        {template.description}
      </span>
      <span role="cell" className="hidden text-sm text-muted-foreground md:block">
        {template.updatedAt.slice(0, 10)}
      </span>
      <span role="cell">
        <button
          type="button"
          aria-label={`Delete ${template.name}`}
          onClick={(event) => {
            event.stopPropagation();
            onDelete(template.id);
          }}
          className="flex size-8 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-ring"
        >
          <Trash2Icon className="size-4" strokeWidth={1.75} />
        </button>
      </span>
    </div>
  );
}
