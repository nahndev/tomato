import { Avatar } from "@tomato/storage-ui";
import { Button, ConfirmDialog, TableCell, TableRow } from "@tomato/ui";
import { PencilIcon, Trash2Icon } from "lucide-react";
import type { UserDetailInput } from "../user.schemas";
import { getUserFullName, getUserInitials } from "../user.utils";
import { UserFormDialog } from "./user-form-dialog";
import type { User } from "../user.types";

interface UserRowProps {
  user: User;
  roleId?: string;
  onEdit: (id: string, input: Partial<UserDetailInput>) => Promise<void>;
  onOpen: (id: string) => void;
  onDelete: (id: string) => void;
}

export function UserRow({ user, roleId, onEdit, onOpen, onDelete }: UserRowProps) {
  const fullName = getUserFullName(user);
  const ringRole = user.roles.find((role) => role.roleId === roleId) ?? user.roles[0];
  const roleNames = user.roles.map(({ role }) => role.name).join(", ");

  return (
    <TableRow className="relative">
      <TableCell className="pl-4">
        <span
          className="flex w-fit rounded-full border-2 border-transparent p-0.5"
          style={{ borderColor: ringRole?.role.color }}
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
          title={fullName}
          className="block w-full cursor-pointer truncate rounded-sm text-left font-medium focus-ring after:absolute after:inset-0"
        >
          {fullName}
        </button>
      </TableCell>
      <TableCell title={user.email} className="truncate text-muted-foreground">
        {user.email}
      </TableCell>
      <TableCell
        title={user.tel ?? undefined}
        className="hidden truncate text-muted-foreground @3xl:table-cell"
      >
        {user.tel}
      </TableCell>
      <TableCell
        title={roleNames}
        className="hidden truncate text-muted-foreground @lg:table-cell"
      >
        {roleNames}
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
