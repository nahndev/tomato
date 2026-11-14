"use client";

import { Badge } from "@tomato/ui";
import { VirtualSelect } from "@tomato/ui/client";
import { XIcon } from "lucide-react";
import { getUserFullName, useAllUsers } from "@/modules/user";
import { USER_SHORT_ID_LENGTH } from "../../../template-widget.constants";
import type { FieldComponentProps } from "../../../template-widget.types";
import { toUserIds } from "../../../utils/users";

export function UsersWidgetItem({ widget, value, onChange }: FieldComponentProps<string[]>) {
  const { users, isLoading } = useAllUsers(widget.departmentUuid);
  const selectedIds = toUserIds(value);
  const namesById = new Map(users.map((user) => [user.id, getUserFullName(user)]));
  const options = users
    .filter((user) => !selectedIds.includes(user.id))
    .map((user) => ({ value: user.id, label: `${getUserFullName(user)} (${user.email})` }));

  return (
    <div className="mt-2 flex flex-col gap-2">
      {selectedIds.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {selectedIds.map((id) => (
            <Badge key={id}>
              {namesById.get(id) ?? `User ${id.slice(-USER_SHORT_ID_LENGTH)}`}
              {onChange && (
                <button
                  type="button"
                  aria-label="Remove user"
                  onClick={() => onChange(selectedIds.filter((selectedId) => selectedId !== id))}
                >
                  <XIcon />
                </button>
              )}
            </Badge>
          ))}
        </div>
      )}
      <VirtualSelect
        aria-label={widget.label}
        options={options}
        onValueChange={(id) => onChange?.([...selectedIds, id])}
        placeholder={isLoading ? "Loading users…" : "Add a user"}
        searchPlaceholder="Search users"
        emptyMessage="No users"
        isDisabled={!onChange || isLoading}
        className="w-full"
      />
    </div>
  );
}
