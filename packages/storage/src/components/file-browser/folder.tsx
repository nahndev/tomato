import { Button, cn } from "@tomato/ui";
import { ChevronRightIcon, FolderIcon } from "lucide-react";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import {
  ResourceActions,
  ResourceRow,
  type ResourceRowDomProps,
} from "./resource-row";

interface FolderProps extends ResourceRowDomProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isOpened: boolean;
  isEditable: boolean;
  isPending: boolean;
  className?: string;
  onOpen: () => void;
  onToggleExpanded: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function Folder({
  node: { item, depth, isExpanded, isExpandable },
  labels,
  isOpened,
  isEditable,
  isPending,
  className,
  onOpen,
  onToggleExpanded,
  onRename,
  onDelete,
  ...domProps
}: FolderProps) {
  const toggleLabel = isExpanded ? labels.collapse : labels.expand;
  return (
    <ResourceRow
      {...domProps}
      depth={depth + 1}
      isDraggable={isEditable && !isPending}
      className={cn(isOpened && "bg-muted", className)}
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
          <ChevronRightIcon className={cn(isExpanded && "rotate-90")} />
        </Button>
      ) : (
        <span className="size-6 shrink-0" />
      )}
      <button
        type="button"
        aria-current={isOpened ? "true" : undefined}
        className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-1 text-left focus-ring"
        onClick={onOpen}
      >
        <FolderIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{item.name}</span>
      </button>
      {isEditable && (
        <ResourceActions
          name={item.name}
          labels={labels}
          isPending={isPending}
          onRename={onRename}
          onDelete={onDelete}
        />
      )}
    </ResourceRow>
  );
}
