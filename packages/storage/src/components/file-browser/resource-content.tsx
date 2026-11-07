import { DragDropProvider } from "@dnd-kit/react";
import { STORAGE_FILE_MAX_SIZE } from "@tomato/constants";
import type { StorageFile, StorageFolder } from "@tomato/types";
import { Button, cn } from "@tomato/ui";
import {
  FolderOpenIcon,
  SearchXIcon,
  TriangleAlertIcon,
  UploadIcon,
  XIcon,
} from "lucide-react";
import { Fragment, useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { useFileBrowserDrag } from "../../hooks/use-file-browser-drag";
import { useFolderTree } from "../../hooks/use-folder-tree";
import { DEFAULT_FILE_BROWSER_LABELS } from "../../storage.constants";
import type {
  FileBrowserItem,
  FileBrowserLabels,
  FileBrowserOptions,
} from "../../storage.types";
import {
  getFolderPath,
  getTreeNodes,
  isFolder,
} from "../../utils/file-browser.utils";
import { FileBrowserDeleteDialog } from "./file-browser-delete-dialog";
import { FileBrowserLoadFailed } from "./file-browser-load-failed";
import { FileBrowserNameDialog } from "./file-browser-name-dialog";
import { useStorageApi } from "./file-browser-provider";
import { FileBrowserState } from "./file-browser-state";
import { Resource } from "./resource";
import { SelectionBar } from "./selection-bar";
import { Toolbar } from "./toolbar";
import { TreeDropZone } from "./tree-drop-zone";
import { TreeSkeleton } from "./tree-skeleton";
import { UploadList } from "./upload-list";

type NameDialogState =
  | { type: "create" }
  | { type: "rename"; item: FileBrowserItem };

const EMPTY_VALUE: StorageFile[] = [];

interface ResourceContentProps {
  rootFolder: StorageFolder;
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function ResourceContent({
  rootFolder,
  value = EMPTY_VALUE,
  onChangeValue,
  options = {},
  className,
}: ResourceContentProps) {
  const api = useStorageApi();
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
    tree,
    items,
    isLoading,
    isError,
    refetch,
    uploads,
    dismissUpload,
    uploadFiles,
    createFolder,
    rename,
    move,
    remove,
  } = useFolderTree(rootFolder.id);

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

  const { canDropOn, dragDropProps } = useFileBrowserDrag(
    items,
    (item, targetId) => {
      if (targetId) expand(targetId);
      void runAction(() => move(item, targetId));
    },
  );

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
    const file = tree?.files.find((candidate) => candidate.id === id);
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
    disabled: !isEditable || isPending || !tree,
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

  const isSearching = search.trim().length > 0;
  const banner = error ?? (isError && tree ? labels.loadFailed : null);

  function renderTree() {
    if (isLoading) return <TreeSkeleton label={labels.loading} />;
    if (isError && !tree) {
      return (
        <FileBrowserLoadFailed
          title={labels.loadFailed}
          retryLabel={labels.retry}
          onRetry={() => void refetch()}
        />
      );
    }
    if (nodes.length === 0 && isSearching) {
      return (
        <FileBrowserState
          icon={<SearchXIcon />}
          title={labels.noResults}
          action={
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setSearch("")}
            >
              {labels.clearSearch}
            </Button>
          }
        />
      );
    }
    if (nodes.length === 0) {
      return <FileBrowserState icon={<FolderOpenIcon />} title={labels.empty} />;
    }
    return (
      <ul className="flex flex-col gap-0.5 p-1.5">
        {nodes.map((node) => {
          const isOpened = node.item.id === folderId;
          return (
            <Fragment key={node.item.id}>
              <Resource
                node={node}
                labels={labels}
                isOpened={isOpened}
                isSelectable={isSelectable}
                isSelected={selectedIds.includes(node.item.id)}
                isEditable={isEditable}
                isPending={isPending}
                getContentUrl={api.getFileContentUrl}
                canDrop={canDropOn(node.item.id)}
                onOpen={() => handleOpen(node.item)}
                onToggleExpanded={() =>
                  node.isExpanded ? collapse(node.item) : expand(node.item.id)
                }
                onToggleSelected={() => toggleSelected(node.item)}
                onRename={() =>
                  setNameDialog({ type: "rename", item: node.item })
                }
                onDelete={() => setDeletingItem(node.item)}
              />
              {isOpened && !node.isExpandable && !isSearching && (
                <li
                  style={{ paddingInlineStart: `${node.depth + 4.5}rem` }}
                  className="py-1.5 text-xs text-muted-foreground"
                >
                  {labels.emptyFolder}
                </li>
              )}
            </Fragment>
          );
        })}
      </ul>
    );
  }

  return (
    <DragDropProvider {...dragDropProps}>
      <div
        {...getRootProps({
          className: cn(
            "relative flex min-h-0 flex-col outline-none",
            className,
          ),
        })}
      >
        <input {...getInputProps()} />

        <Toolbar
          labels={labels}
          search={search}
          folderPath={folderPath}
          isSearchDisabled={!hasItems}
          isBusy={isPending}
          isEditable={isEditable}
          isSelectable={isSelectable}
          canCreateFolder={canCreateFolder}
          isDisabled={isPending || !tree}
          onSearchChange={setSearch}
          onNewFolder={() => setNameDialog({ type: "create" })}
          onUpload={open}
        />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <TreeDropZone
            canDrop={canDropOn(null)}
            className="flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-border"
          >
            {renderTree()}
          </TreeDropZone>
          {/* Floats over the tree, so showing it doesn't move the rows. */}
          {banner && (
            <div
              role="alert"
              className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-md border border-outline bg-soft px-3 py-2 text-sm text-soft-foreground shadow-popover danger"
            >
              <TriangleAlertIcon className="size-4 shrink-0" />
              <span className="min-w-0 flex-1">{banner}</span>
              {error && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label={labels.dismiss}
                  onClick={() => setError(null)}
                >
                  <XIcon />
                </Button>
              )}
            </div>
          )}
        </div>

        <UploadList
          uploads={uploads}
          labels={labels}
          onDismiss={dismissUpload}
        />

        {isSelectable && (
          <SelectionBar
            files={selectedFiles}
            labels={labels}
            isSubmitting={isSubmitting}
            getContentUrl={api.getFileContentUrl}
            onClear={() => setSelectedIds([])}
            onSubmit={handleSubmit}
          />
        )}

        {isDragActive && (
          <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-focus bg-card/90 text-sm font-medium">
            <UploadIcon className="size-6 text-soft-foreground" />
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
    </DragDropProvider>
  );
}
