import type { Template } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import Link from "next/link";
import { getTemplatePath } from "../../template-browse.constants";

interface TemplateListToolbarProps {
  selected?: Template;
  onDelete: (id: string) => void;
}

export function TemplateListToolbar({
  selected,
  onDelete,
}: TemplateListToolbarProps) {
  if (!selected) {
    return <div className="h-10"></div>;
  }
  return (
    <div
      role="toolbar"
      aria-label="Template actions"
      className="flex h-10 items-center justify-between gap-2"
    >
      <div className=""></div>
      <div className="flex items-center gap-1">
        <Button asChild variant="ghost" size="icon-sm">
          <Link
            href={getTemplatePath(selected.id)}
            aria-label={`Edit ${selected.name}`}
            title="Edit"
          >
            <PencilIcon />
          </Link>
        </Button>
        <ConfirmDialog
          title={`Delete “${selected.name}”?`}
          description="This action cannot be undone."
          destructive="Delete"
          onDestructive={() => onDelete(selected.id)}
        >
          <Button
            variant="ghost"
            size="icon-sm"
            aria-label={`Delete ${selected.name}`}
            title="Delete"
          >
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      </div>
    </div>
  );
}
