import { cn } from "@tomato/ui";
import type { StorageFile } from "@tomato/types";
import { useState } from "react";
import { useStorageGroups } from "../../hooks/use-storage-groups";
import { DEFAULT_FILE_BROWSER_LABELS } from "../../storage.constants";
import type {
  FileBrowserOptions,
  StorageGroupOwner,
} from "../../storage.types";
import { FileBrowserLoadFailed } from "./file-browser-load-failed";
import { GroupSidebar } from "./group-sidebar";
import { ResourceContent } from "./resource-content";
import { TreeSkeleton } from "./tree-skeleton";

export interface FileBrowserProps {
  owners: StorageGroupOwner[];
  /** Files selected when the browser opens or when `value` changes. */
  value?: StorageFile[];
  /** Called only by the submit button. Without it, nothing can be selected. */
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function FileBrowser({
  owners,
  value,
  onChangeValue,
  options,
  className,
}: FileBrowserProps) {
  const { data: groups = [], isLoading, refetch } = useStorageGroups(owners);
  const [activeId, setActiveId] = useState<string | null>(null);
  if (owners.length === 0) return null;

  const labels = { ...DEFAULT_FILE_BROWSER_LABELS, ...options };
  const activeGroup =
    groups.find((group) => group.id === activeId) ?? groups[0];

  return (
    <div
      className={cn(
        "@container min-h-0 overflow-hidden rounded-surface border border-border bg-card",
        className,
      )}
    >
      <div className="flex h-full min-h-0 flex-col @xl:flex-row">
        <GroupSidebar
          groups={groups}
          activeId={activeGroup?.id}
          label={labels.groups}
          onSelect={setActiveId}
        />
        {activeGroup ? (
          <ResourceContent
            key={activeGroup.id}
            className="min-w-0 flex-1"
            rootFolder={activeGroup.rootFolder}
            value={value}
            onChangeValue={onChangeValue}
            options={options}
          />
        ) : (
          <div className="flex min-w-0 flex-1 flex-col">
            {isLoading ? (
              <TreeSkeleton label={labels.loading} />
            ) : (
              <FileBrowserLoadFailed
                title={labels.loadFailed}
                retryLabel={labels.retry}
                onRetry={() => void refetch()}
              />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
