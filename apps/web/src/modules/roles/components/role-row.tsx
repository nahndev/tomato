import { RoleStatusBadge } from "./role-status-badge";
import type { Role } from "../roles.types";

import { Typography } from "@tomato/ui";
interface RoleRowProps {
  role: Role;
  onOpen: (id: string) => void;
}

export function RoleRow({ role, onOpen }: RoleRowProps) {
  return (
    <li>
      <button
        type="button"
        onClick={() => onOpen(role.id)}
        className="flex w-full cursor-pointer items-center gap-3 rounded-lg bg-card p-3 text-left shadow-card motion-base hover:bg-muted focus-ring"
      >
        <span
          aria-hidden
          className="size-6 shrink-0 rounded-sm border border-input"
          style={{ backgroundColor: role.color }}
        />
        <span className="min-w-0 flex-1">
          <Typography className="block truncate font-medium">{role.name}</Typography>
          {role.description && (
            <Typography className="block truncate text-sm text-muted-foreground">
              {role.description}
            </Typography>
          )}
        </span>
        <RoleStatusBadge status={role.status} />
      </button>
    </li>
  );
}
