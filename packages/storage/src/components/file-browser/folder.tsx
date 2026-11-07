import { Button, cn } from "@tomato/ui";
import { ChevronRightIcon, FolderIcon, FolderOpenIcon } from "lucide-react";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import {
  ResourceActions,
  ResourceRow,
  type ResourceRowDomProps,
} from "./resource-row";

export function FolderGlyph({ isOpened }: { isOpened: boolean }) {
  const Icon = isOpened ? FolderOpenIcon : FolderIcon;
  return (
    <span className="flex size-8 shrink-0 items-center justify-center text-soft-foreground">
      <Icon className="size-5" />
    </span>
  );
}

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
      isOpened={isOpened}
      className={className}
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
      >
        <FolderGlyph isOpened={isOpened} />
        <span title={item.name} className="truncate">
          {item.name}
        </span>
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
