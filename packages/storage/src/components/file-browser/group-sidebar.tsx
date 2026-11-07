import { GroupType } from "@tomato/constants";
import { Button, cn } from "@tomato/ui";
import { Building2Icon, UserIcon } from "lucide-react";
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
    <nav
      aria-label={label}
      className="flex shrink-0 flex-col gap-2 overflow-auto border-b border-border bg-muted p-2 @xl:w-48 @xl:border-e @xl:border-b-0"
    >
      <p className="hidden px-2 pt-1 text-xs font-medium text-muted-foreground @xl:block">
        {label}
      </p>
      <ul className="flex gap-1 @xl:flex-col">
        {groups.map((group) => {
          const key = getGroupKey(group);
          const isActive = key === activeKey;
          return (
            <li key={key} className="min-w-0 shrink-0 @xl:shrink">
              <Button
                type="button"
                variant="ghost"
                size="sm"
                aria-current={isActive ? "true" : undefined}
                data-selected={isActive ? "true" : undefined}
                className={cn(
                  "w-full justify-start is-selected:primary",
                  "max-w-48 @xl:max-w-none",
                )}
                onClick={() => onSelect(key)}
              >
                {group.type === GroupType.DEPARTMENT ? (
                  <Building2Icon />
                ) : (
                  <UserIcon />
                )}
                <span title={group.label} className="truncate">
                  {group.label}
                </span>
              </Button>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
