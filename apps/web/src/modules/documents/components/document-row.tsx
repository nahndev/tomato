import type { Document, User } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { DocumentInput } from "../documents.schemas";
import { DocumentFormDialog } from "./document-form-dialog";

interface DocumentRowProps {
  document: Document;
  owners: User[];
  onEdit: (id: string, input: DocumentInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function DocumentRow({
  document,
  owners,
  onEdit,
  onDelete,
}: DocumentRowProps) {
  const ownerName = owners.find((owner) => owner.id === document.ownerId)?.name;

  return (
    <li className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{document.title}</p>
        {ownerName && (
          <p className="truncate text-sm text-muted-foreground">{ownerName}</p>
        )}
      </div>
      <DocumentFormDialog
        document={document}
        owners={owners}
        onSubmit={(input) => onEdit(document.id, input)}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Edit ${document.title}`}
          className="text-muted-foreground"
        >
          <PencilIcon />
        </Button>
      </DocumentFormDialog>
      <ConfirmDialog
        title={`Delete “${document.title}”?`}
        description="This action cannot be undone."
        destructive="Delete"
        onDestructive={() => onDelete(document.id)}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${document.title}`}
          className="text-muted-foreground"
        >
          <Trash2Icon />
        </Button>
      </ConfirmDialog>
    </li>
  );
}
