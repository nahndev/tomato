import { Checkbox, cn } from "@tomato/ui";
import { formatBytes } from "@tomato/utils";
import { FileIcon } from "lucide-react";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import {
  ResourceActions,
  ResourceRow,
  type ResourceRowDomProps,
} from "./resource-row";

interface FileProps extends ResourceRowDomProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isSelectable: boolean;
  isSelected: boolean;
  isEditable: boolean;
  isPending: boolean;
  className?: string;
  onToggleSelected: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function File({
  node: { item, depth },
  labels,
  isSelectable,
  isSelected,
  isEditable,
  isPending,
  className,
  onToggleSelected,
  onRename,
  onDelete,
  ...domProps
}: FileProps) {
  return (
    <ResourceRow
      {...domProps}
      depth={depth + 1}
      isDraggable={isEditable && !isPending}
      className={cn(isSelected && "bg-accent", className)}
    >
      {/* Same width as a folder's chevron, so the icons line up. */}
      <span className="flex size-6 shrink-0 items-center justify-center">
        {isSelectable && (
          <Checkbox
            aria-label={item.name}
            checked={isSelected}
            onCheckedChange={onToggleSelected}
          />
        )}
      </span>
      <button
        type="button"
        className="flex min-w-0 flex-1 items-center gap-2 rounded-sm py-1 text-left focus-ring"
        onClick={onToggleSelected}
      >
        <FileIcon className="size-4 shrink-0 text-muted-foreground" />
        <span className="truncate">{item.name}</span>
      </button>
      {item.size !== undefined && (
        <span className="shrink-0 text-xs text-muted-foreground">
          {formatBytes(item.size)}
        </span>
      )}
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
