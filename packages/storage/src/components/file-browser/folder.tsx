import { Button, cn, Typography } from "@tomato/ui";
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import { DRAG_ACTIVATOR_PROPS } from "../../storage.constants";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import { ResourceActions, ResourceRow } from "./resource-row";

interface FolderProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isOpened: boolean;
  isPending: boolean;
  onOpen: () => void;
  onToggleExpanded: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function Folder({
  node: { item, depth, isExpanded, isExpandable },
  labels,
  isOpened,
  isPending,
  onOpen,
  onToggleExpanded,
  onRename,
  onDelete,
}: FolderProps) {
  const toggleLabel = isExpanded ? labels.collapse : labels.expand;
  const Icon = isOpened ? FolderOpenIcon : FolderIcon;
  return (
    <ResourceRow
      id={item.id}
      name={item.name}
      labels={labels}
      depth={depth + 1}
      isPending={isPending}
      isDroppable
      isOpened={isOpened}
    >
      {isExpandable ? (
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${toggleLabel}: ${item.name}`}
          aria-expanded={isExpanded}
          onClick={onToggleExpanded}
        >
          <ChevronRightIcon
            className={cn("transition-transform", isExpanded && "rotate-90")}
          />
        </Button>
      ) : (
        <span className="size-6 shrink-0" />
      )}
      <button
        type="button"
        aria-current={isOpened ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-2 self-stretch rounded-sm text-left focus-ring"
        onClick={onOpen}
        {...DRAG_ACTIVATOR_PROPS}
      >
        <span className="flex size-8 shrink-0 items-center justify-center text-soft-foreground">
          <Icon className="size-5" />
        </span>
        <Typography title={item.name} className="truncate">
          {item.name}
        </Typography>
      </button>
      <ResourceActions
        name={item.name}
        labels={labels}
        isPending={isPending}
        onRename={onRename}
        onDelete={onDelete}
      />
    </ResourceRow>
  );
}
