"use client";

import { STORAGE_FILE_MAX_SIZE } from "@tomato/constants";
import type { StorageFile } from "@tomato/types";
import { Button, cn, Input, Spinner } from "@tomato/ui";
import { FolderPlusIcon, UploadIcon } from "lucide-react";
import { useState } from "react";
import { useDropzone, type FileRejection } from "react-dropzone";
import { DEFAULT_FILE_BROWSER_LABELS } from "../../file.constants";
import type {
  FileBrowserItem,
  FileBrowserLabels,
  FileBrowserOptions,
  StorageGroupOwner,
} from "../../file.types";
import { useFileBrowserDrag } from "../../hooks/use-file-browser-drag";
import { useStorageGroup } from "../../hooks/use-storage-group";
import {
  compareItems,
  getFolderPath,
  isFolder,
  matchesAccept,
} from "../../utils/file-browser.utils";
import { FileBrowserBreadcrumb } from "./file-browser-breadcrumb";
import { DROP_TARGET_CLASS } from "./file-browser.constants";
import { FileBrowserDeleteDialog } from "./file-browser-delete-dialog";
import { FileBrowserNameDialog } from "./file-browser-name-dialog";
import { FileBrowserRow } from "./file-browser-row";

type NameDialogState =
  | { type: "create" }
  | { type: "rename"; item: FileBrowserItem };

const EMPTY_VALUE: StorageFile[] = [];

export interface FileBrowserProps {
  group: StorageGroupOwner;
  /** Files selected when the browser opens or when `value` changes. */
  value?: StorageFile[];
  /** Called only by the submit button. Without it, nothing can be selected. */
  onChangeValue?: (files: StorageFile[]) => void | Promise<void>;
  options?: FileBrowserOptions;
  className?: string;
}

export function FileBrowser({
  group: owner,
  value = EMPTY_VALUE,
  onChangeValue,
  options = {},
  className,
}: FileBrowserProps) {
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
  } = useStorageGroup(owner);

  const [openedFolderId, setOpenedFolderId] = useState(defaultFolderId);
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

  const normalizedSearch = search.trim().toLowerCase();
  const visibleItems = items
    .filter(
      (item) =>
        item.parentId === folderId &&
        (isFolder(item) || matchesAccept(item, accept)) &&
        item.name.toLowerCase().includes(normalizedSearch),
    )
    .sort(compareItems);

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

  function navigate(nextFolderId: string | null) {
    setOpenedFolderId(nextFolderId);
    setSearch("");
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

        <div className="flex flex-wrap items-center gap-2">
          {hasItems && (
            <Input
              className="h-8 min-w-40 flex-1"
              aria-label={labels.search}
              placeholder={labels.search}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          )}
          {(isPending || isLoading) && <Spinner />}
          {isEditable && (
            <>
              {canCreateFolder && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending || !group}
                  onClick={() => setNameDialog({ type: "create" })}
                >
                  <FolderPlusIcon />
                  {labels.newFolder}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={isPending || !group}
                onClick={open}
              >
                <UploadIcon />
                {labels.upload}
              </Button>
            </>
          )}
        </div>

        {hasItems && (
          <FileBrowserBreadcrumb
            rootLabel={labels.root}
            folderPath={folderPath}
            dropTargetId={dropTargetId}
            getDropTargetProps={getDropTargetProps}
            onNavigate={navigate}
          />
        )}

        {(error || isError) && (
          <p role="alert" className="text-sm text-danger">
            {error ?? labels.loadFailed}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border">
          {visibleItems.length === 0 ? (
            !isLoading &&
            !isError && (
              <p className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
                {labels.empty}
              </p>
            )
          ) : (
            <ul className="divide-y divide-border">
              {visibleItems.map((item) => (
                <FileBrowserRow
                  key={item.id}
                  item={item}
                  labels={labels}
                  isSelectable={isSelectable}
                  isSelected={selectedIds.includes(item.id)}
                  isEditable={isEditable}
                  isPending={isPending}
                  className={cn(
                    draggingId === item.id && "opacity-50",
                    dropTargetId === item.id && DROP_TARGET_CLASS,
                  )}
                  onOpen={() => navigate(item.id)}
                  onToggle={() => toggleSelected(item)}
                  onRename={() => setNameDialog({ type: "rename", item })}
                  onDelete={() => setDeletingItem(item)}
                  {...getDragSourceProps(item)}
                  {...(isFolder(item) ? getDropTargetProps(item.id) : {})}
                />
              ))}
            </ul>
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
