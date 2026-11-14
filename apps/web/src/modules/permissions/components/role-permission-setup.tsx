import type { PermissionAction } from "@tomato/constants";
import { Checkbox, Label, Typography } from "@tomato/ui";
import { PERMISSION_ACTIONS, PermissionFlag } from "../permissions.constants";
import type { RolePermission } from "../permissions.types";
import type { Role } from "@/modules/roles";

interface RolePermissionSetupProps {
  role: Role;
  permission?: RolePermission;
  isDisabled: boolean;
  onToggle: (action: PermissionAction, value: boolean) => void;
}

export function RolePermissionSetup({
  role,
  permission,
  isDisabled,
  onToggle,
}: RolePermissionSetupProps) {
  return (
    <section className="rounded-lg bg-card p-4 shadow-card">
      <Typography as="h3" className="mb-3 truncate font-medium">{role.name}</Typography>
      <ul className="flex flex-col gap-3">
        {PERMISSION_ACTIONS.map(({ action, label, description }) => {
          const id = `${role.id}-${action}`;
          return (
            <li key={action} className="flex items-center gap-3">
              <Checkbox
                id={id}
                checked={permission?.[PermissionFlag[action]] ?? false}
                disabled={isDisabled}
                onCheckedChange={(checked) => onToggle(action, checked === true)}
              />
              <Label htmlFor={id} className="flex flex-col items-start gap-0">
                <Typography>{label}</Typography>
                <Typography className="font-normal text-muted-foreground">
                  {description}
                </Typography>
              </Label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
