import { Avatar } from "@tomato/storage-ui";
import type { User } from "@tomato/types";
import { Button, ConfirmDialog, TableCell, TableRow } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { UserDetailInput } from "../user.schemas";
import { getUserFullName, getUserInitials } from "../user.utils";
import { UserFormDialog } from "./user-form-dialog";

interface UserRowProps {
  user: User;
  roleId?: string;
  onEdit: (id: string, input: Partial<UserDetailInput>) => Promise<void>;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UserRow({ user, roleId, onEdit, onOpen, onDelete }: UserRowProps) {
  const fullName = getUserFullName(user);
  const ringRole = user.roles.find((role) => role.id === roleId) ?? user.roles[0];

  return (
    <TableRow className="relative">
      <TableCell className="pl-4">
        <span
          className="flex w-fit rounded-full border-2 border-transparent p-0.5"
          style={{ borderColor: ringRole?.color }}
        >
          <Avatar uuid={user.avatarFileId} alt={fullName}>
            {getUserInitials(user)}
          </Avatar>
        </span>
      </TableCell>
      <TableCell>
        {/* `after` stretches the click area over the row; the actions stay above it */}
        <button
          type="button"
          onClick={() => onOpen(user.id)}
          className="cursor-pointer rounded-sm text-left font-medium focus-ring after:absolute after:inset-0"
        >
          {fullName}
        </button>
      </TableCell>
      <TableCell className="text-muted-foreground">{user.email}</TableCell>
      <TableCell className="text-muted-foreground">{user.tel}</TableCell>
      <TableCell className="text-muted-foreground">
        {user.roles.map((role) => role.name).join(", ")}
      </TableCell>
      <TableCell className="pr-4 text-right">
        <UserFormDialog user={user} onSubmit={(input) => onEdit(user.id, input)}>
          <Button variant="ghost" size="icon-xs" aria-label={`Edit ${user.name}`} className="relative text-muted-foreground">
            <PencilIcon />
          </Button>
        </UserFormDialog>
        <ConfirmDialog
          title={`Delete “${user.name}”?`}
          description="This action cannot be undone."
          destructive="Delete"
          onDestructive={() => onDelete(user.id)}
        >
          <Button variant="ghost" size="icon-xs" aria-label={`Delete ${user.name}`} className="relative text-muted-foreground">
            <Trash2Icon />
          </Button>
        </ConfirmDialog>
      </TableCell>
    </TableRow>
  );
}
