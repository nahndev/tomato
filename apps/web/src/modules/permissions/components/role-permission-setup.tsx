import type { PermissionAction } from "@tomato/constants";
import type { Role, RolePermission } from "@tomato/types";
import { Checkbox, Label } from "@tomato/ui";
import { PERMISSION_ACTIONS, PermissionFlag } from "../permissions.constants";

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
      <h3 className="mb-3 truncate font-medium">{role.name}</h3>
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
                <span>{label}</span>
                <span className="font-normal text-muted-foreground">
                  {description}
                </span>
              </Label>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
