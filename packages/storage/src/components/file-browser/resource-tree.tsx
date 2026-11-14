import { Button, Typography } from "@tomato/ui";
import { FolderOpenIcon, SearchXIcon } from "lucide-react";
import { Fragment } from "react";
import type {
  FileBrowserItem,
  FileBrowserTreeNode,
} from "../../storage.types";
import { isFolder } from "../../utils/file-browser.utils";
import { File } from "./file";
import { FileBrowserLoadFailed } from "./file-browser-load-failed";
import { FileBrowserState } from "./file-browser-state";
import { Folder } from "./folder";
import { TreeSkeleton } from "./tree-skeleton";

interface ResourceTreeProps {
  nodes: FileBrowserTreeNode[];
  openedFolderId: string | null;
  selectedIds: string[];
  isLoading: boolean;
  isLoadFailed: boolean;
  isSearching: boolean;
  isSelectable: boolean;
  isPending: boolean;
  onRetry: () => void;
  onClearSearch: () => void;
  onOpen: (item: FileBrowserItem) => void;
  onToggleExpanded: (node: FileBrowserTreeNode) => void;
  onToggleSelected: (item: FileBrowserItem) => void;
  onRename: (item: FileBrowserItem) => void;
  onDelete: (item: FileBrowserItem) => void;
}

export function ResourceTree({
  nodes,
  openedFolderId,
  selectedIds,
  isLoading,
  isLoadFailed,
  isSearching,
  isSelectable,
  isPending,
  onRetry,
  onClearSearch,
  onOpen,
  onToggleExpanded,
  onToggleSelected,
  onRename,
  onDelete,
}: ResourceTreeProps) {
  if (isLoading) return <TreeSkeleton label="Loading files" />;
  if (isLoadFailed) {
    return (
      <FileBrowserLoadFailed
        title="Could not load the files"
        retryLabel="Try again"
        onRetry={onRetry}
      />
    );
  }
  if (nodes.length === 0) {
    return isSearching ? (
      <FileBrowserState
        icon={<SearchXIcon />}
        title="No files match your search"
        action={
          <Button
            type="button"
            variant="outline"
            size="sm"
            onClick={onClearSearch}
          >
            <Typography>Clear search</Typography>
          </Button>
        }
      />
    ) : (
      <FileBrowserState icon={<FolderOpenIcon />} title="No files here yet" />
    );
  }

  return (
    <ul className="flex flex-col gap-0.5 p-1.5">
      {nodes.map((node) => {
        const { item, depth, isExpandable } = node;
        const isOpened = item.id === openedFolderId;
        const rowProps = {
          node,
          isPending,
          onRename: () => onRename(item),
          onDelete: () => onDelete(item),
        };
        return (
          <Fragment key={item.id}>
            {isFolder(item) ? (
              <Folder
                {...rowProps}
                isOpened={isOpened}
                onOpen={() => onOpen(item)}
                onToggleExpanded={() => onToggleExpanded(node)}
              />
            ) : (
              <File
                {...rowProps}
                isSelectable={isSelectable}
                isSelected={selectedIds.includes(item.id)}
                onToggleSelected={() => onToggleSelected(item)}
              />
            )}
            {isOpened && !isExpandable && !isSearching && (
              <li
                style={{ paddingInlineStart: `${depth + 4.5}rem` }}
                className="py-1.5 text-xs text-muted-foreground"
              >
                <Typography>This folder is empty</Typography>
              </li>
            )}
          </Fragment>
        );
      })}
    </ul>
  );
}
