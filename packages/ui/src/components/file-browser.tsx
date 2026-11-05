"use client";

import { formatBytes } from "@tomato/utils";
import {
  EllipsisIcon,
  FileIcon,
  FolderIcon,
  FolderPlusIcon,
  PencilIcon,
  Trash2Icon,
  UploadIcon,
} from "lucide-react";
import * as React from "react";
import { useDropzone, type Accept, type FileRejection } from "react-dropzone";
import { cn } from "../lib/cn";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "./alert-dialog";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "./breadcrumb";
import { Button } from "./button";
import { Checkbox } from "./checkbox";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "./dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "./dropdown-menu";
import { FileBrowserLabel } from "./file-browser.constants";
import { Input } from "./input";
import { Spinner } from "./spinner";

const FileBrowserItemType = {
  FILE: "file",
  FOLDER: "folder",
} as const;
type FileBrowserItemType =
  (typeof FileBrowserItemType)[keyof typeof FileBrowserItemType];

interface FileBrowserItem {
  id: string;
  name: string;
  type: FileBrowserItemType;
  parentId: string | null;
  size?: number;
  mimeType?: string;
}

type FileBrowserLabels = Record<keyof typeof FileBrowserLabel, string>;

const FileBrowserChangeType = {
  UPLOAD_FILE: "upload-file",
  CREATE_FOLDER: "create-folder",
  RENAME: "rename",
  MOVE: "move",
  DELETE: "delete",
} as const;
type FileBrowserChangeType =
  (typeof FileBrowserChangeType)[keyof typeof FileBrowserChangeType];

type FileBrowserChange =
  | {
      type: typeof FileBrowserChangeType.UPLOAD_FILE;
      payload: { file: File; parentId: string | null };
    }
  | {
      type: typeof FileBrowserChangeType.CREATE_FOLDER;
      payload: { name: string; parentId: string | null };
    }
  | {
      type: typeof FileBrowserChangeType.RENAME;
      payload: { item: FileBrowserItem; name: string };
    }
  | {
      type: typeof FileBrowserChangeType.MOVE;
      payload: { item: FileBrowserItem; parentId: string | null };
    }
  | {
      type: typeof FileBrowserChangeType.DELETE;
      payload: { item: FileBrowserItem };
    };

interface FileBrowserOptions extends Partial<FileBrowserLabels> {
  accept?: Accept;
  maxSize?: number;
  /** Applies to selection only; uploads always allow several files. */
  multiple?: boolean;
  canCreateFolder?: boolean;
  defaultFolderId?: string | null;
}

interface FileBrowserProps {
  items: FileBrowserItem[];
  /** Selected file ids; enables selection. */
  selected?: string[];
  options?: FileBrowserOptions;
  className?: string;
  /** Without it the browser is read-only. */
  onItemsChange?: (changes: FileBrowserChange[]) => void | Promise<void>;
  onSelect?: (selected: string[]) => void;
}

type NameDialogState =
  | { type: "create" }
  | { type: "rename"; item: FileBrowserItem };

function matchesAccept(item: FileBrowserItem, accept?: Accept) {
  if (!accept) return true;
  const name = item.name.toLowerCase();
  const mimeType = item.mimeType?.toLowerCase();
  return Object.entries(accept).some(([acceptedType, extensions]) => {
    const isTypeMatch = acceptedType.endsWith("/*")
      ? mimeType?.startsWith(acceptedType.slice(0, -1))
      : mimeType === acceptedType.toLowerCase();
    return (
      isTypeMatch ||
      [extensions]
        .flat()
        .some((extension) => name.endsWith(extension.toLowerCase()))
    );
  });
}

function getFolderPath(items: FileBrowserItem[], folderId: string | null) {
  const path: FileBrowserItem[] = [];
  const visitedIds = new Set<string>();
  let currentId = folderId;
  while (currentId && !visitedIds.has(currentId)) {
    visitedIds.add(currentId);
    const folder = items.find((item) => item.id === currentId);
    if (!folder) break;
    path.unshift(folder);
    currentId = folder.parentId;
  }
  return path;
}

function canMoveTo(
  items: FileBrowserItem[],
  item: FileBrowserItem,
  targetId: string | null,
) {
  if (item.parentId === targetId) return false;
  return !getFolderPath(items, targetId).some(({ id }) => id === item.id);
}

function isFolder(item: FileBrowserItem) {
  return item.type === FileBrowserItemType.FOLDER;
}

function compareItems(first: FileBrowserItem, second: FileBrowserItem) {
  if (first.type !== second.type) return isFolder(first) ? -1 : 1;
  return first.name.localeCompare(second.name);
}

function NameDialog({
  title,
  initialName,
  labels,
  onCancel,
  onSubmit,
}: {
  title: string;
  initialName: string;
  labels: FileBrowserLabels;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}) {
  const [name, setName] = React.useState(initialName);
  const trimmedName = name.trim();

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            // React bubbles through portals; don't submit a surrounding form.
            event.stopPropagation();
            if (trimmedName) onSubmit(trimmedName);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            aria-label={labels.NAME}
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              {labels.CANCEL}
            </Button>
            <Button type="submit" disabled={!trimmedName}>
              {labels.SAVE}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}

function FileBrowser({
  items,
  selected,
  options = {},
  className,
  onItemsChange,
  onSelect,
}: FileBrowserProps) {
  const {
    accept,
    maxSize,
    multiple = true,
    canCreateFolder = true,
    defaultFolderId = null,
    ...labelOverrides
  } = options;
  const labels: FileBrowserLabels = { ...FileBrowserLabel, ...labelOverrides };
  const [openedFolderId, setOpenedFolderId] = React.useState(defaultFolderId);
  const [search, setSearch] = React.useState("");
  const [error, setError] = React.useState<string | null>(null);
  const [isPending, setIsPending] = React.useState(false);
  const [draggingId, setDraggingId] = React.useState<string | null>(null);
  // `null` is the root folder; `undefined` means no target.
  const [dropTargetId, setDropTargetId] = React.useState<string | null>();
  const [nameDialog, setNameDialog] = React.useState<NameDialogState | null>(
    null,
  );
  const [deletingItem, setDeletingItem] =
    React.useState<FileBrowserItem | null>(null);

  // Falls back to the root when the opened folder has been removed.
  const folderId = items.some(
    (item) => item.id === openedFolderId && isFolder(item),
  )
    ? openedFolderId
    : null;
  const folderPath = getFolderPath(items, folderId);
  const draggingItem = items.find((item) => item.id === draggingId);
  const isSelectable = selected !== undefined;
  const hasItems = items.length > 0;

  const normalizedSearch = search.trim().toLowerCase();
  const visibleItems = items
    .filter(
      (item) =>
        item.parentId === folderId &&
        (isFolder(item) || matchesAccept(item, accept)) &&
        item.name.toLowerCase().includes(normalizedSearch),
    )
    .sort(compareItems);

  async function applyChanges(
    changes: FileBrowserChange[],
    rejectionError: string | null = null,
  ) {
    setError(rejectionError);
    setIsPending(true);
    try {
      await onItemsChange?.(changes);
    } catch {
      setError(labels.ACTION_FAILED);
    } finally {
      setIsPending(false);
    }
  }

  function handleDrop(files: File[], rejections: FileRejection[]) {
    const rejectionError = rejections.length > 0 ? labels.FILES_REJECTED : null;
    if (files.length === 0) {
      setError(rejectionError);
      return;
    }
    void applyChanges(
      files.map((file) => ({
        type: FileBrowserChangeType.UPLOAD_FILE,
        payload: { file, parentId: folderId },
      })),
      rejectionError,
    );
  }

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({
    accept,
    maxSize,
    disabled: !onItemsChange || isPending,
    noClick: true,
    noKeyboard: true,
    onDrop: handleDrop,
  });

  function navigate(nextFolderId: string | null) {
    setOpenedFolderId(nextFolderId);
    setSearch("");
  }

  function toggleSelected(item: FileBrowserItem) {
    if (!selected) return;
    if (selected.includes(item.id)) {
      onSelect?.(selected.filter((id) => id !== item.id));
    } else {
      onSelect?.(multiple ? [...selected, item.id] : [item.id]);
    }
  }

  function handleNameSubmit(state: NameDialogState, name: string) {
    setNameDialog(null);
    if (state.type === "create") {
      void applyChanges([
        {
          type: FileBrowserChangeType.CREATE_FOLDER,
          payload: { name, parentId: folderId },
        },
      ]);
    } else if (name !== state.item.name) {
      void applyChanges([
        {
          type: FileBrowserChangeType.RENAME,
          payload: { item: state.item, name },
        },
      ]);
    }
  }

  function getDropTargetProps(targetId: string | null) {
    const movingItem =
      draggingItem && canMoveTo(items, draggingItem, targetId)
        ? draggingItem
        : null;

    return {
      onDragOver: (event: React.DragEvent) => {
        if (!movingItem) return;
        event.preventDefault();
        event.dataTransfer.dropEffect = "move";
        setDropTargetId(targetId);
      },
      onDragLeave: () => {
        setDropTargetId((current) =>
          current === targetId ? undefined : current,
        );
      },
      onDrop: (event: React.DragEvent) => {
        if (!movingItem) return;
        event.preventDefault();
        event.stopPropagation();
        setDropTargetId(undefined);
        setDraggingId(null);
        void applyChanges([
          {
            type: FileBrowserChangeType.MOVE,
            payload: { item: movingItem, parentId: targetId },
          },
        ]);
      },
    };
  }

  const dropTargetClass = "bg-accent ring-2 ring-focus ring-inset";

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
              aria-label={labels.SEARCH}
              placeholder={labels.SEARCH}
              value={search}
              onChange={(event) => setSearch(event.target.value)}
            />
          )}
          {isPending && <Spinner />}
          {onItemsChange && (
            <>
              {canCreateFolder && (
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  disabled={isPending}
                  onClick={() => setNameDialog({ type: "create" })}
                >
                  <FolderPlusIcon />
                  {labels.NEW_FOLDER}
                </Button>
              )}
              <Button
                type="button"
                size="sm"
                disabled={isPending}
                onClick={open}
              >
                <UploadIcon />
                {labels.UPLOAD}
              </Button>
            </>
          )}
        </div>

        {hasItems && (
          <Breadcrumb>
            <BreadcrumbList>
              {[null, ...folderPath].map((folder, index) => {
                const targetId = folder?.id ?? null;
                const name = folder?.name ?? labels.ROOT;
                const isCurrent = index === folderPath.length;
                return (
                  <React.Fragment key={targetId ?? "root"}>
                    {index > 0 && <BreadcrumbSeparator />}
                    <BreadcrumbItem
                      {...getDropTargetProps(targetId)}
                      className={cn(
                        "rounded-sm px-1",
                        dropTargetId === targetId && dropTargetClass,
                      )}
                    >
                      {isCurrent ? (
                        <BreadcrumbPage>{name}</BreadcrumbPage>
                      ) : (
                        <BreadcrumbLink asChild>
                          <button type="button" onClick={() => navigate(targetId)}>
                            {name}
                          </button>
                        </BreadcrumbLink>
                      )}
                    </BreadcrumbItem>
                  </React.Fragment>
                );
              })}
            </BreadcrumbList>
          </Breadcrumb>
        )}

        {error && (
          <p role="alert" className="text-sm text-danger">
            {error}
          </p>
        )}

        <div className="min-h-0 flex-1 overflow-y-auto rounded-lg border border-border">
          {visibleItems.length === 0 ? (
            <p className="flex h-full items-center justify-center p-6 text-center text-sm text-muted-foreground">
              {labels.EMPTY}
            </p>
          ) : (
            <ul className="divide-y divide-border">
              {visibleItems.map((item) => {
                const isSelected = selected?.includes(item.id) ?? false;
                const hasCheckbox = isSelectable && !isFolder(item);
                return (
                  <li
                    key={item.id}
                    draggable={Boolean(onItemsChange) && !isPending}
                    onDragStart={(event) => {
                      event.dataTransfer.effectAllowed = "move";
                      event.dataTransfer.setData("text/plain", item.name);
                      setDraggingId(item.id);
                    }}
                    onDragEnd={() => {
                      setDraggingId(null);
                      setDropTargetId(undefined);
                    }}
                    {...(isFolder(item) ? getDropTargetProps(item.id) : {})}
                    className={cn(
                      "flex items-center gap-2 px-3 py-1.5 text-sm",
                      isSelected && "bg-accent",
                      draggingId === item.id && "opacity-50",
                      dropTargetId === item.id && dropTargetClass,
                    )}
                  >
                    {hasCheckbox && (
                      <Checkbox
                        aria-label={item.name}
                        checked={isSelected}
                        onCheckedChange={() => toggleSelected(item)}
                      />
                    )}
                    <button
                      type="button"
                      className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-1 text-left focus-ring"
                      onClick={() => {
                        if (isFolder(item)) navigate(item.id);
                        else toggleSelected(item);
                      }}
                    >
                      {isFolder(item) ? (
                        <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
                      ) : (
                        <FileIcon className="size-4 shrink-0 text-muted-foreground" />
                      )}
                      <span className="truncate">{item.name}</span>
                    </button>
                    {item.size !== undefined && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {formatBytes(item.size)}
                      </span>
                    )}
                    {onItemsChange && (
                      <DropdownMenu modal={false}>
                        <DropdownMenuTrigger asChild>
                          <Button
                            type="button"
                            variant="ghost"
                            size="icon-xs"
                            aria-label={`${labels.ACTIONS}: ${item.name}`}
                            disabled={isPending}
                          >
                            <EllipsisIcon />
                          </Button>
                        </DropdownMenuTrigger>
                        {/* Keeps focus in the dialog opened from this menu. */}
                        <DropdownMenuContent
                          align="end"
                          onCloseAutoFocus={(event) => event.preventDefault()}
                        >
                          <DropdownMenuItem
                            onSelect={() =>
                              setNameDialog({ type: "rename", item })
                            }
                          >
                            <PencilIcon />
                            {labels.RENAME}
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            variant="destructive"
                            onSelect={() => setDeletingItem(item)}
                          >
                            <Trash2Icon />
                            {labels.DELETE}
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    )}
                  </li>
                );
              })}
            </ul>
          )}
        </div>

        {isDragActive && (
          <div className="pointer-events-none absolute inset-0 flex items-center justify-center rounded-lg border-2 border-dashed border-focus bg-card/90 text-sm font-medium">
            {labels.DROP_HINT}
          </div>
        )}
      </div>

      {/* Outside the dropzone: React events bubble through portals. */}
      {nameDialog && (
        <NameDialog
          title={
            nameDialog.type === "create" ? labels.NEW_FOLDER : labels.RENAME
          }
          initialName={nameDialog.type === "rename" ? nameDialog.item.name : ""}
          labels={labels}
          onCancel={() => setNameDialog(null)}
          onSubmit={(name) => handleNameSubmit(nameDialog, name)}
        />
      )}

      <AlertDialog
        open={Boolean(deletingItem)}
        onOpenChange={(isOpen) => {
          if (!isOpen) setDeletingItem(null);
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>{labels.DELETE_TITLE}</AlertDialogTitle>
            <AlertDialogDescription>
              {deletingItem?.name} · {labels.DELETE_DESCRIPTION}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>{labels.CANCEL}</AlertDialogCancel>
            <AlertDialogAction
              variant="destructive"
              onClick={() => {
                if (deletingItem) {
                  void applyChanges([
                    {
                      type: FileBrowserChangeType.DELETE,
                      payload: { item: deletingItem },
                    },
                  ]);
                }
              }}
            >
              {labels.DELETE}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
}

export { FileBrowser, FileBrowserChangeType, FileBrowserItemType };
export type { Accept as FileBrowserAccept } from "react-dropzone";
export type {
  FileBrowserChange,
  FileBrowserItem,
  FileBrowserLabels,
  FileBrowserOptions,
  FileBrowserProps,
};
export { FileBrowserLabel } from "./file-browser.constants";
