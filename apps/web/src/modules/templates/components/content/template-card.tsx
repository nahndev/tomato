import type { Template } from "@tomato/types";
import { Trash2Icon } from "lucide-react";

interface TemplateCardProps {
  template: Template;
  onDelete: (id: string) => void;
}

export function TemplateCard({ template, onDelete }: TemplateCardProps) {
  return (
    <li className="flex items-start justify-between gap-2 rounded-lg bg-card p-4 text-card-foreground shadow-card transition-colors hover:bg-muted">
      <div className="min-w-0">
        <h2 className="truncate font-medium">{template.name}</h2>
        {template.description && (
          <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{template.description}</p>
        )}
      </div>
      <button
        type="button"
        aria-label={`Delete ${template.name}`}
        onClick={() => onDelete(template.id)}
        className="flex size-8 shrink-0 items-center justify-center rounded-md text-muted-foreground transition-colors hover:bg-danger-soft hover:text-danger focus-visible:outline-2 focus-visible:outline-ring"
      >
        <Trash2Icon className="size-4" strokeWidth={1.75} />
      </button>
    </li>
  );
}
