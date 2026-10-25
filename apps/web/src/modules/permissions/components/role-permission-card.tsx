import type { PermissionAction, PermissionResource } from "@tomato/constants";
import type { Role, RolePermission } from "@tomato/types";
import { Checkbox } from "@tomato/ui";
import {
  PERMISSION_ACTIONS,
  PERMISSION_RESOURCES,
  PermissionFlag,
} from "../permissions.constants";

interface RolePermissionCardProps {
  role: Role;
  permissions: RolePermission[];
  isDisabled: boolean;
  onToggle: (
    resource: PermissionResource,
    action: PermissionAction,
    value: boolean,
  ) => void;
}

export function RolePermissionCard({
  role,
  permissions,
  isDisabled,
  onToggle,
}: RolePermissionCardProps) {
  return (
    <section className="rounded-lg bg-card p-4 shadow-card">
      <h2 className="mb-3 truncate font-medium">{role.name}</h2>
      <table className="w-full text-sm">
        <thead>
          <tr className="text-left text-muted-foreground">
            <th className="py-1 font-normal">Resource</th>
            {PERMISSION_ACTIONS.map(({ action, label }) => (
              <th key={action} className="w-24 py-1 text-center font-normal">
                {label}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {PERMISSION_RESOURCES.map(({ resource, label: resourceLabel }) => {
            const current = permissions.find(
              (item) => item.resource === resource,
            );
            return (
              <tr key={resource}>
                <td className="py-2">{resourceLabel}</td>
                {PERMISSION_ACTIONS.map(({ action, label }) => (
                  <td key={action} className="py-2 text-center">
                    <Checkbox
                      checked={current?.[PermissionFlag[action]] ?? false}
                      disabled={isDisabled}
                      aria-label={`${label} ${resourceLabel} for ${role.name}`}
                      onCheckedChange={(checked) =>
                        onToggle(resource, action, checked === true)
                      }
                    />
                  </td>
                ))}
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}
