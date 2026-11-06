import { Button, cn } from "@tomato/ui";
import type { FileBrowserGroup, StorageGroupOwner } from "../../storage.types";

export function getGroupKey({ type, uuid }: StorageGroupOwner) {
  return `${type}:${uuid}`;
}

interface GroupSidebarProps {
  groups: FileBrowserGroup[];
  activeKey: string;
  label: string;
  onSelect: (key: string) => void;
}

export function GroupSidebar({
  groups,
  activeKey,
  label,
  onSelect,
}: GroupSidebarProps) {
  return (
    <nav aria-label={label} className="w-48 shrink-0 overflow-y-auto">
      <ul className="flex flex-col gap-1">
        {groups.map((group) => {
          const key = getGroupKey(group);
          const isActive = key === activeKey;
          return (
            <li key={key}>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-current={isActive ? "true" : undefined}
                className={cn("w-full justify-start", isActive && "bg-accent")}
                onClick={() => onSelect(key)}
              >
                <span className="truncate">{group.label}</span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
