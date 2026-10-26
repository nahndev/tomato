import type { PermissionResourceRef } from "@tomato/types";
import { Button } from "@tomato/ui";
import type { PermissionGroup, PermissionItem } from "../permissions.types";
import { isSameResource, toResourceKey } from "../permissions.utils";

interface PermissionSidebarProps {
  groups: PermissionGroup[];
  selected: PermissionResourceRef;
  onSelect: (resource: PermissionResourceRef) => void;
}

export function PermissionSidebar({
  groups,
  selected,
  onSelect,
}: PermissionSidebarProps) {
  const renderItem = (item: PermissionItem, className?: string) => {
    const isSelected = isSameResource(item.resource, selected);
    return (
    <Button
      variant={isSelected ? "secondary" : "ghost"}
      size="sm"
      className={`w-full justify-start ${className ?? ""}`}
      aria-current={isSelected}
      onClick={() => onSelect(item.resource)}
    >
      <span className="truncate">{item.label}</span>
    </Button>
    );
  };

  return (
    <nav
      aria-label="Resources"
      className="w-64 shrink-0 self-start rounded-lg bg-card p-2 shadow-card"
    >
      <ul className="flex flex-col gap-1">
        {groups.map((group) => (
          <li key={toResourceKey(group.resource)}>
            {renderItem(group, "font-medium")}
            <ul className="ml-4 mt-1 flex flex-col gap-1">
              {group.items.map((item) => (
                <li key={toResourceKey(item.resource)}>{renderItem(item)}</li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </nav>
  );
}
