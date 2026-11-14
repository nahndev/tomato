import { STORAGE_FILE_MAX_SIZE } from "@tomato/constants";
import { Button, cn, Typography } from "@tomato/ui";
import { TriangleAlertIcon, UploadIcon, XIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { useFileSelection } from "../../hooks/use-file-selection";
import { useFolderTree } from "../../hooks/use-folder-tree";
import type {
  FileBrowserItem,
  FileBrowserTreeNode,
  StorageFile,
  StorageFolder,
} from "../../storage.types";
import {
  getFolderPath,
  getTreeNodes,
  isFolder,
} from "../../utils/file-browser.utils";
import { FileBrowserDeleteDialog } from "./file-browser-delete-dialog";
import { FileBrowserDragProvider } from "./file-browser-drag-provider";
import { FileBrowserNameDialog } from "./file-browser-name-dialog";
import { ResourceTree } from "./resource-tree";
import { SelectionBar } from "./selection-bar";
import { Toolbar } from "./toolbar";
import { TreeDropZone } from "./tree-drop-zone";
import { UploadList } from "./upload-list";

type NameDialogState =
  { type: "create" } | { type: "rename"; item: FileBrowserItem };

const EMPTY_VALUE: StorageFile[] = [];

interface ResourceContentProps {
  rootFolder: StorageFolder;
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  accept?: Accept;
  maxSize?: number;
  multiple?: boolean;
  className?: string;
}

export function ResourceContent({
  rootFolder,
  value = EMPTY_VALUE,
  onChangeValue,
  accept,
  maxSize = STORAGE_FILE_MAX_SIZE,
  multiple = true,
  className,
}: ResourceContentProps) {
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
  const { selectedIds, toggleSelected, clearSelection } = useFileSelection(
    value,
    multiple,
  );

  const [openedFolderId, setOpenedFolderId] = useState<string | null>(null);
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

  const folderId = items.some(
    (item) => item.id === openedFolderId && isFolder(item),
  )
    ? openedFolderId
    : null;
  const folderPath = getFolderPath(items, folderId);
  const isSelectable = Boolean(onChangeValue);

  const selectedFiles = selectedIds.flatMap((id) => {
    const file = tree?.files.find((candidate) => candidate.id === id);
    return file ? [file] : [];
  });

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
      setError("Something went wrong, please try again");
    } finally {
      setIsPending(false);
    }
  }

  function handleDrop(files: File[], rejections: FileRejection[]) {
    const rejectionError = rejections.length > 0 ? "Some files were skipped: wrong type or too large" : null;
    if (files.length === 0) {
      setError(rejectionError);
      return;
    }
    void runAction(() => uploadFiles(files, folderId), rejectionError);
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    maxSize,
    disabled: isPending || !tree,
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

  function handleToggleExpanded({ item, isExpanded }: FileBrowserTreeNode) {
    if (isExpanded) collapse(item);
    else expand(item.id);
  }

  function handleMove(item: FileBrowserItem, parentId: string | null) {
    if (parentId) expand(parentId);
    void runAction(() => move(item, parentId));
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
      setError("Something went wrong, please try again");
    } finally {
      setIsSubmitting(false);
    }
  }

  const banner = error ?? (isError && tree ? "Could not load the files" : null);

  return (
    <FileBrowserDragProvider items={items} onMove={handleMove}>
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
          search={search}
          folderPath={folderPath}
          isSearchDisabled={items.length === 0}
          isBusy={isPending}
          isSelectable={isSelectable}
          isDisabled={isPending || !tree}
          onSearchChange={setSearch}
          onNewFolder={() => setNameDialog({ type: "create" })}
          onUpload={open}
        />

        <div className="relative flex min-h-0 flex-1 flex-col">
          <TreeDropZone className="flex min-h-0 flex-1 flex-col overflow-y-auto border-t border-border">
            <ResourceTree
              nodes={nodes}
              openedFolderId={folderId}
              selectedIds={selectedIds}
              isLoading={isLoading}
              isLoadFailed={isError && !tree}
              isSearching={search.trim().length > 0}
              isSelectable={isSelectable}
              isPending={isPending}
              onRetry={() => void refetch()}
              onClearSearch={() => setSearch("")}
              onOpen={handleOpen}
              onToggleExpanded={handleToggleExpanded}
              onToggleSelected={({ id }) => toggleSelected(id)}
              onRename={(item) => setNameDialog({ type: "rename", item })}
              onDelete={setDeletingItem}
            />
          </TreeDropZone>
          {/* Floats over the tree, so showing it doesn't move the rows. */}
          {banner && (
            <div
              role="alert"
              className="absolute inset-x-2 bottom-2 flex items-center gap-2 rounded-md border border-outline bg-soft px-3 py-2 text-sm text-soft-foreground shadow-popover danger"
            >
              <TriangleAlertIcon className="size-4 shrink-0" />
              <Typography className="min-w-0 flex-1">{banner}</Typography>
              {error && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  aria-label="Dismiss"
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
          onDismiss={dismissUpload}
        />

        {isSelectable && (
          <SelectionBar
            files={selectedFiles}
            isSubmitting={isSubmitting}
            onClear={clearSelection}
            onSubmit={handleSubmit}
          />
        )}

        {isDragActive && (
          <div className="pointer-events-none absolute inset-2 flex flex-col items-center justify-center gap-2 rounded-lg border-2 border-dashed border-focus bg-card/90 text-sm font-medium">
            <UploadIcon className="size-6 text-soft-foreground" />
            <Typography>Drop files to upload them here</Typography>
          </div>
        )}
      </div>

      {/* Outside the dropzone: React events bubble through portals. */}
      {nameDialog && (
        <FileBrowserNameDialog
          title={
            nameDialog.type === "create" ? "New folder" : "Rename"
          }
          initialName={nameDialog.type === "rename" ? nameDialog.item.name : ""}
          onCancel={() => setNameDialog(null)}
          onSubmit={(name) => handleNameSubmit(nameDialog, name)}
        />
      )}

      <FileBrowserDeleteDialog
        item={deletingItem}
        onCancel={() => setDeletingItem(null)}
        onConfirm={(item) => {
          setDeletingItem(null);
          void runAction(() => remove(item));
        }}
      />
    </FileBrowserDragProvider>
  );
}
