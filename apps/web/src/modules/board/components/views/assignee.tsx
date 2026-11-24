"use client";

import { Avatar } from "@tomato/storage-ui";
import { Button, Popover, PopoverContent, PopoverTrigger, Typography } from "@tomato/ui";
import { VirtualSelect } from "@tomato/ui/client";
import { UserPlusIcon, XIcon } from "lucide-react";
import { getUserFullName, getUserInitials, useAllUsers } from "@/modules/user";
import { MAX_VISIBLE_ASSIGNEES } from "../../board.constants";

interface AssigneeProps {
  userIds: string[];
  departmentId?: string;
  onChange?: (userIds: string[]) => void;
}

export function Assignee({ userIds, departmentId, onChange }: AssigneeProps) {
  const { users } = useAllUsers();
  const { users: candidates, isLoading } = useAllUsers(departmentId);
  const usersById = new Map(users.map((user) => [user.id, user]));
  const assignees = userIds.map((id) => ({ id, user: usersById.get(id) }));
  const names = assignees.map(({ id, user }) => (user ? getUserFullName(user) : id));
  const hidden = assignees.length - MAX_VISIBLE_ASSIGNEES;

  const stack = (
    <span className="flex items-center -space-x-2">
      {assignees.length === 0 && (
        <span className="flex size-7 items-center justify-center rounded-full border border-dashed border-border text-muted-foreground">
          <UserPlusIcon className="size-3.5" />
        </span>
      )}
      {assignees.slice(0, MAX_VISIBLE_ASSIGNEES).map(({ id, user }) => (
        <Avatar key={id} uuid={user?.avatarFileId} alt={user ? getUserFullName(user) : id} className="size-7 ring-2 ring-card">
          <Typography className="text-xs">{user ? getUserInitials(user) : "?"}</Typography>
        </Avatar>
      ))}
      {hidden > 0 && (
        <Typography className="flex size-7 items-center justify-center rounded-full bg-muted text-xs text-muted-foreground ring-2 ring-card">
          +{hidden}
        </Typography>
      )}
    </span>
  );
  const title = names.length > 0 ? names.join(", ") : "Unassigned";

  if (!onChange) {
    return (
      <span title={title} className="flex w-28 shrink-0 justify-end">
        {stack}
      </span>
    );
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          title={title}
          aria-label={`Assignees: ${title}`}
          className="relative z-10 h-auto w-28 shrink-0 justify-end rounded-full p-0"
        >
          {stack}
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="flex w-72 flex-col gap-2 p-2">
        {assignees.length === 0 ? (
          <Typography as="p" className="px-1 py-2 text-sm text-muted-foreground">Unassigned</Typography>
        ) : (
          <ul aria-label="Assignees" className="flex flex-col gap-1">
            {assignees.map(({ id, user }, index) => (
              <li key={id} className="flex items-center gap-2 rounded-md px-1 py-1 hover:bg-muted">
                <Avatar uuid={user?.avatarFileId} alt={names[index]} className="size-6">
                  <Typography className="text-xs">{user ? getUserInitials(user) : "?"}</Typography>
                </Avatar>
                <Typography className="min-w-0 flex-1 truncate text-sm">{names[index]}</Typography>
                <Button
                  variant="ghost"
                  size="icon-xs"
                  aria-label={`Remove ${names[index]}`}
                  onClick={() => onChange(userIds.filter((userId) => userId !== id))}
                  className="text-muted-foreground"
                >
                  <XIcon />
                </Button>
              </li>
            ))}
          </ul>
        )}
        <VirtualSelect
          aria-label="Add an assignee"
          options={candidates
            .filter((user) => !userIds.includes(user.id))
            .map((user) => ({ value: user.id, label: `${getUserFullName(user)} (${user.email})` }))}
          onValueChange={(id) => onChange([...userIds, id])}
          placeholder={isLoading ? "Loading users…" : "Add a user"}
          searchPlaceholder="Search users"
          emptyMessage="No users"
          isDisabled={isLoading}
          className="h-8 w-full"
        />
      </PopoverContent>
    </Popover>
  );
}
