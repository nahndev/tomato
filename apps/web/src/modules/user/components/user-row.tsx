import type { User } from "@tomato/types";
import { Button, ConfirmDialog } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { UserInput } from "../user.schemas";
import { UserFormDialog } from "./user-form-dialog";

interface UserRowProps {
  user: User;
  onEdit: (id: string, input: UserInput) => Promise<void>;
  onDelete: (id: string) => void;
}

export function UserRow({ user, onEdit, onDelete }: UserRowProps) {
  return (
    <li className="flex items-center gap-3 rounded-lg bg-card p-3 shadow-card">
      <div className="min-w-0 flex-1">
        <p className="truncate font-medium">{user.name}</p>
        <p className="truncate text-sm text-muted-foreground">{user.email}</p>
      </div>
      <UserFormDialog user={user} onSubmit={(input) => onEdit(user.id, input)}>
        <Button variant="ghost" size="icon-xs" aria-label={`Edit ${user.name}`} className="text-muted-foreground">
          <PencilIcon />
        </Button>
      </UserFormDialog>
      <ConfirmDialog
        title={`Delete “${user.name}”?`}
        description="This action cannot be undone."
        destructive="Delete"
        onDestructive={() => onDelete(user.id)}
      >
        <Button variant="ghost" size="icon-xs" aria-label={`Delete ${user.name}`} className="text-muted-foreground">
          <Trash2Icon />
        </Button>
      </ConfirmDialog>
    </li>
  );
}
