import { Checkbox } from "@tomato/ui";
import { DRAG_ACTIVATOR_PROPS } from "../../storage.constants";
import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import { formatFileDetails } from "../../utils/file-browser.utils";
import { useStorageApi } from "./file-browser-provider";
import { FileThumbnail } from "./file-thumbnail";
import { ResourceActions, ResourceRow } from "./resource-row";

interface FileProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isSelectable: boolean;
  isSelected: boolean;
  isPending: boolean;
  onToggleSelected: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function File({
  node: { item, depth },
  labels,
  isSelectable,
  isSelected,
  isPending,
  onToggleSelected,
  onRename,
  onDelete,
}: FileProps) {
  const api = useStorageApi();
  const content = (
    <>
      <FileThumbnail mimeType={item.mimeType} src={api.getFileContentUrl(item.id)} />
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
      id={item.id}
      name={item.name}
      labels={labels}
      depth={depth + 1}
      isPending={isPending}
      isSelected={isSelected}
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
          {...DRAG_ACTIVATOR_PROPS}
        >
          {content}
        </button>
      ) : (
        <div className={contentClassName}>{content}</div>
      )}
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
