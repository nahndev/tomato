import { cn } from "@tomato/ui";
import type { StorageFile, StorageGroupLimit } from "@tomato/types";
import { useState } from "react";
import { useStorageGroups } from "../../hooks/use-storage-groups";
import { DEFAULT_FILE_BROWSER_LABELS } from "../../storage.constants";
import type { FileBrowserOptions } from "../../storage.types";
import { FileBrowserLoadFailed } from "./file-browser-load-failed";
import { GroupSidebar } from "./group-sidebar";
import { ResourceContent } from "./resource-content";
import { TreeSkeleton } from "./tree-skeleton";

interface FileBrowserProps {
  /** Which groups to list. Empty or null lists every group. */
  limit?: StorageGroupLimit | null;
  /** Files selected when the browser opens or when `value` changes. */
  value?: StorageFile[];
  /** Called only by the submit button. Without it, nothing can be selected. */
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function FileBrowser({
  limit,
  value,
  onChangeValue,
  options = {},
  className,
}: FileBrowserProps) {
  const { data: groups = [], isLoading, refetch } = useStorageGroups(limit);
  const [activeId, setActiveId] = useState<string | null>(null);

  const { accept, maxSize, multiple, ...labelOverrides } = options;
  const labels = { ...DEFAULT_FILE_BROWSER_LABELS, ...labelOverrides };
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
            labels={labels}
            value={value}
            onChangeValue={onChangeValue}
            accept={accept}
            maxSize={maxSize}
            multiple={multiple}
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
