import { cn } from "@tomato/ui";
import type { StorageGroupLimit } from "../../storage.types";
import { useState } from "react";
import { useStorageGroups } from "../../hooks/use-storage-groups";
import type { FileBrowserLabels, FileBrowserOptions, StorageFile } from "../../storage.types";
import { FileBrowserLoadFailed } from "./file-browser-load-failed";
import { GroupSidebar } from "./group-sidebar";
import { ResourceContent } from "./resource-content";
import { TreeSkeleton } from "./tree-skeleton";

interface FileBrowserProps {
  /** Which groups to list. Empty or null lists every group. */
  limit?: StorageGroupLimit | null;
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
  const labels: FileBrowserLabels = {
    root: "All files",
    groups: "Groups",
    search: "Filter by name",
    newFolder: "New folder",
    upload: "Upload",
    rename: "Rename",
    delete: "Delete",
    cancel: "Cancel",
    save: "Save",
    submit: "Select",
    name: "Name",
    actions: "Actions",
    move: "Move",
    expand: "Expand",
    collapse: "Collapse",
    empty: "No files here yet",
    emptyFolder: "This folder is empty",
    noResults: "No files match your search",
    clearSearch: "Clear search",
    location: "Current folder",
    loading: "Loading files",
    retry: "Try again",
    dismiss: "Dismiss",
    noSelection: "No file selected",
    selectedCount: "{count} files selected",
    clearSelection: "Clear",
    uploadFailed: "Upload failed",
    dropHint: "Drop files to upload them here",
    deleteTitle: "Delete this item?",
    deleteDescription: "This action cannot be undone.",
    filesRejected: "Some files were skipped: wrong type or too large",
    actionFailed: "Something went wrong, please try again",
    loadFailed: "Could not load the files",
    ...labelOverrides,
  };
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
            rootFolder={activeGroup.folder}
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
