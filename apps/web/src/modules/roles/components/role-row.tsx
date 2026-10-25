import type { Role } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { RoleInput } from "../roles.schemas";
import { RoleFormDialog } from "./role-form-dialog";

interface RoleRowProps {
  role: Role;
  onEdit: (id: string, input: RoleInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function RoleRow({ role, onEdit, onDelete }: RoleRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
      <p className="min-w-0 flex-1 truncate font-medium">{role.name}</p>
      <RoleFormDialog role={role} onSubmit={(input) => onEdit(role.id, input)}>
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Edit ${role.name}`}
          className="text-muted-foreground"
        >
          <PencilIcon />
        </Button>
      </RoleFormDialog>
      <ConfirmDialog
        title={`Delete “${role.name}”?`}
        description="This action cannot be undone."
        destructive="Delete"
        onDestructive={() => onDelete(role.id)}
      >
        <Button
          variant="ghost"
          size="icon-xs"
          aria-label={`Delete ${role.name}`}
          className="text-muted-foreground"
        >
          <Trash2Icon />
        </Button>
      </ConfirmDialog>
    </li>
  );
}
