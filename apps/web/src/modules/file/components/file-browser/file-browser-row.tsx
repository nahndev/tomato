"use client";

import {
  Button,
  Checkbox,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tomato/ui";
import { formatBytes } from "@tomato/utils";
import {
  EllipsisIcon,
  FileIcon,
  FolderIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import type { ComponentProps } from "react";
import type { FileBrowserItem, FileBrowserLabels } from "../../file.types";
import { isFolder } from "../../utils/file-browser.utils";

interface FileBrowserRowProps extends Pick<
  ComponentProps<"li">,
  "onDragStart" | "onDragEnd" | "onDragOver" | "onDragLeave" | "onDrop"
> {
  item: FileBrowserItem;
  labels: FileBrowserLabels;
  isSelectable: boolean;
  isSelected: boolean;
  isEditable: boolean;
  isPending: boolean;
  className?: string;
  onOpen: () => void;
  onToggle: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function FileBrowserRow({
  item,
  labels,
  isSelectable,
  isSelected,
  isEditable,
  isPending,
  className,
  onOpen,
  onToggle,
  onRename,
  onDelete,
  ...dragProps
}: FileBrowserRowProps) {
  const isItemFolder = isFolder(item);
  return (
    <li
      {...dragProps}
      draggable={isEditable && !isPending}
      className={cn(
        "flex items-center gap-2 px-3 py-1.5 text-sm",
        isSelected && "bg-accent",
        className,
      )}
    >
      {isSelectable && !isItemFolder && (
        <Checkbox
          aria-label={item.name}
          checked={isSelected}
          onCheckedChange={onToggle}
        />
      )}
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-1 text-left focus-ring"
        onClick={isItemFolder ? onOpen : onToggle}
      >
        {isItemFolder ? (
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
      {isEditable && (
        <DropdownMenu modal={false}>
          <DropdownMenuTrigger asChild>
            <Button
              type="button"
              variant="ghost"
              size="icon-xs"
              aria-label={`${labels.actions}: ${item.name}`}
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
            <DropdownMenuItem onSelect={onRename}>
              <PencilIcon />
              {labels.rename}
            </DropdownMenuItem>
            <DropdownMenuItem variant="destructive" onSelect={onDelete}>
              <Trash2Icon />
              {labels.delete}
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </li>
  );
}
