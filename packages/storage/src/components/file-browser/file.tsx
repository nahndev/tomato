import { Checkbox } from "@tomato/ui";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import { formatFileDetails } from "../../utils/file-browser.utils";
import { FileThumbnail } from "./file-thumbnail";
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
  getContentUrl: (id: string) => string;
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
  getContentUrl,
  className,
  onToggleSelected,
  onRename,
  onDelete,
  ...domProps
}: FileProps) {
  const content = (
    <>
      <FileThumbnail mimeType={item.mimeType} src={getContentUrl(item.id)} />
      <span className="min-w-0">
        <span title={item.name} className="block truncate">
          {item.name}
        </span>
        <span className="block truncate text-xs text-muted-foreground group-data-[selected=true]/row:text-foreground">
          {formatFileDetails(item)}
        </span>
      </span>
    </>
  );
  const contentClassName =
    "flex min-w-0 flex-1 items-center gap-2 self-stretch rounded-sm text-left";

  return (
    <ResourceRow
      {...domProps}
      depth={depth + 1}
      isDraggable={isEditable && !isPending}
      isSelected={isSelected}
      className={className}
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
      {isSelectable ? (
        <button
          type="button"
          className={`${contentClassName} focus-ring`}
          onClick={onToggleSelected}
        >
          {content}
        </button>
      ) : (
        <div className={contentClassName}>{content}</div>
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
