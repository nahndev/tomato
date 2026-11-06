import { STORAGE_FILE_MAX_SIZE } from "@tomato/constants";
import type { StorageFile } from "@tomato/types";
import { Button, cn } from "@tomato/ui";
import { FolderIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useFileBrowserDrag } from "../../hooks/use-file-browser-drag";
import { useStorageGroup } from "../../hooks/use-storage-group";
import type { StorageApi } from "../../storage.api";
import {
  DEFAULT_FILE_BROWSER_LABELS,
  DROP_TARGET_CLASS,
} from "../../storage.constants";
import type {
  FileBrowserItem,
  FileBrowserLabels,
  FileBrowserOptions,
  StorageGroupOwner,
} from "../../storage.types";
import {
  getFolderPath,
  getTreeNodes,
  isFolder,
} from "../../utils/file-browser.utils";
import { FileBrowserDeleteDialog } from "./file-browser-delete-dialog";
import { FileBrowserNameDialog } from "./file-browser-name-dialog";
import { Resource } from "./resource";
import { ResourceRow } from "./resource-row";
import { Toolbar } from "./toolbar";

type NameDialogState =
  | { type: "create" }
  | { type: "rename"; item: FileBrowserItem };

const EMPTY_VALUE: StorageFile[] = [];

interface ResourceContentProps {
  api: StorageApi;
  owner: StorageGroupOwner;
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function ResourceContent({
  api,
  owner,
  value = EMPTY_VALUE,
  onChangeValue,
  options = {},
  className,
}: ResourceContentProps) {
  const {
    accept,
    maxSize = STORAGE_FILE_MAX_SIZE,
    multiple = true,
    canCreateFolder = true,
    isReadOnly = false,
    defaultFolderId = null,
    ...labelOverrides
  } = options;
  const labels: FileBrowserLabels = {
    ...DEFAULT_FILE_BROWSER_LABELS,
    ...labelOverrides,
  };
  const {
    group,
    items,
    isLoading,
    isError,
    uploadFiles,
    createFolder,
    rename,
    move,
    remove,
  } = useStorageGroup(api, owner);

  const [openedFolderId, setOpenedFolderId] = useState(defaultFolderId);
  const [expandedIds, setExpandedIds] = useState<ReadonlySet<string>>(
    () => new Set(),
  );
  const [search, setSearch] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [isPending, setIsPending] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [nameDialog, setNameDialog] = useState<NameDialogState | null>(null);
  const [deletingItem, setDeletingItem] = useState<FileBrowserItem | null>(
    null,
  );
  const [selectedIds, setSelectedIds] = useState(() =>
    value.map(({ id }) => id),
  );
  const [syncedValue, setSyncedValue] = useState(value);
  if (value !== syncedValue) {
    setSyncedValue(value);
    setSelectedIds(value.map(({ id }) => id));
  }

  const { draggingId, dropTargetId, getDropTargetProps, getDragSourceProps } =
    useFileBrowserDrag(items, (item, targetId) => {
      if (targetId) expand(targetId);
      void runAction(() => move(item, targetId));
    });

  // Falls back to the root when the opened folder has been removed.
  const folderId = items.some(
    (item) => item.id === openedFolderId && isFolder(item),
  )
    ? openedFolderId
    : null;
  const folderPath = getFolderPath(items, folderId);
  const isSelectable = Boolean(onChangeValue);
  const isEditable = !isReadOnly;
  const hasItems = items.length > 0;

  const selectedFiles = selectedIds.flatMap((id) => {
    const file = group?.files.find((candidate) => candidate.id === id);
    return file ? [file] : [];
  });

  // The opened folder and its ancestors always stay expanded.
  const nodes = getTreeNodes(items, {
    accept,
    search,
    expandedIds: new Set([...expandedIds, ...folderPath.map(({ id }) => id)]),
  });

  async function runAction(
    action: () => Promise<unknown>,
    rejectionError: string | null = null,
  ) {
    setError(rejectionError);
    setIsPending(true);
    try {
      await action();
    } catch {
      setError(labels.actionFailed);
    } finally {
      setIsPending(false);
    }
  }

  function handleDrop(files: File[], rejections: FileRejection[]) {
    const rejectionError = rejections.length > 0 ? labels.filesRejected : null;
    if (files.length === 0) {
      setError(rejectionError);
      return;
    }
    void runAction(() => uploadFiles(files, folderId), rejectionError);
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    maxSize,
    disabled: !isEditable || isPending || !group,
    noClick: true,
    noKeyboard: true,
    onDrop: handleDrop,
  });

  function expand(id: string) {
    setExpandedIds((current) => new Set(current).add(id));
  }

  function collapse(item: FileBrowserItem) {
    setExpandedIds((current) => {
      const next = new Set(current);
      next.delete(item.id);
      return next;
    });
    if (folderPath.some(({ id }) => id === item.id)) {
      setOpenedFolderId(item.parentId);
    }
  }

  function handleOpen(item: FileBrowserItem) {
    if (item.id === folderId) {
      collapse(item);
      return;
    }
    expand(item.id);
    setOpenedFolderId(item.id);
  }

  function toggleSelected(item: FileBrowserItem) {
    if (!isSelectable) return;
    setSelectedIds((current) => {
      if (current.includes(item.id)) {
        return current.filter((id) => id !== item.id);
      }
      return multiple ? [...current, item.id] : [item.id];
    });
  }

  function handleNameSubmit(state: NameDialogState, name: string) {
    setNameDialog(null);
    if (state.type === "create") {
      void runAction(() => createFolder(name, folderId));
    } else if (name !== state.item.name) {
      void runAction(() => rename(state.item, name));
    }
  }

  async function handleSubmit() {
    setError(null);
    setIsSubmitting(true);
    try {
      await onChangeValue?.(selectedFiles);
    } catch {
      setError(labels.actionFailed);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <div
        {...getRootProps({
          className: cn(
            "relative flex min-h-0 flex-col gap-3 rounded-lg outline-none",
            className,
          ),
        })}
      >
        <input {...getInputProps()} />

        <Toolbar
          labels={labels}
          search={search}
          hasSearch={hasItems}
          isBusy={isPending || isLoading}
          isEditable={isEditable}
          canCreateFolder={canCreateFolder}
          isDisabled={isPending || !group}
          onSearchChange={setSearch}
          onNewFolder={() => setNameDialog({ type: "create" })}
          onUpload={open}
        />

        {(error || isError) && (
          <p role="alert" className="text-sm text-danger">
            {error ?? labels.loadFailed}
          </p>
        )}

        <div className="flex min-h-0 flex-1 flex-col overflow-y-auto rounded-lg border border-border">
          {hasItems && (
            <ul className="divide-y divide-border">
              <ResourceRow
                depth={0}
                className={cn(
                  folderId === null && "bg-muted",
                  dropTargetId === null && DROP_TARGET_CLASS,
                )}
                {...getDropTargetProps(null)}
              >
                <button
                  type="button"
                  aria-current={folderId === null ? "true" : undefined}
                  className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-1 text-left font-medium focus-ring"
                  onClick={() => setOpenedFolderId(null)}
                >
                  <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                  <span className="truncate">{labels.root}</span>
                </button>
              </ResourceRow>
              {nodes.map((node) => (
                <Resource
                  key={node.item.id}
                  node={node}
                  labels={labels}
                  isOpened={node.item.id === folderId}
                  isSelectable={isSelectable}
                  isSelected={selectedIds.includes(node.item.id)}
                  isEditable={isEditable}
                  isPending={isPending}
                  className={cn(
                    draggingId === node.item.id && "opacity-50",
                    dropTargetId === node.item.id && DROP_TARGET_CLASS,
                  )}
                  onOpen={() => handleOpen(node.item)}
                  onToggleExpanded={() =>
                    node.isExpanded ? collapse(node.item) : expand(node.item.id)
                  }
                  onToggleSelected={() => toggleSelected(node.item)}
                  onRename={() =>
                    setNameDialog({ type: "rename", item: node.item })
                  }
                  onDelete={() => setDeletingItem(node.item)}
                  {...getDragSourceProps(node.item)}
                  {...(isFolder(node.item)
                    ? getDropTargetProps(node.item.id)
                    : {})}
                />
              ))}
            </ul>
          )}
          {nodes.length === 0 && !isLoading && !isError && (
            <p className="flex flex-1 items-center justify-center p-6 text-center text-sm text-muted-foreground">
              {labels.empty}
            </p>
          )}
        </div>

        {isSelectable && (
          <div className="flex justify-end">
            <Button
              type="button"
              disabled={selectedFiles.length === 0 || isSubmitting}
              onClick={handleSubmit}
            >
              {labels.submit}
            </Button>
          </div>
        )}

        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-focus bg-card/90 text-sm font-medium">
            {labels.dropHint}
          </div>
        )}
      </div>

      {/* Outside the dropzone: React events bubble through portals. */}
      {nameDialog && (
        <FileBrowserNameDialog
          title={
            nameDialog.type === "create" ? labels.newFolder : labels.rename
          }
          initialName={nameDialog.type === "rename" ? nameDialog.item.name : ""}
          labels={labels}
          onCancel={() => setNameDialog(null)}
          onSubmit={(name) => handleNameSubmit(nameDialog, name)}
        />
      )}

      <FileBrowserDeleteDialog
        item={deletingItem}
        labels={labels}
        onCancel={() => setDeletingItem(null)}
        onConfirm={(item) => {
          setDeletingItem(null);
          void runAction(() => remove(item));
        }}
      />
    </>
  );
}
