import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import { isFolder } from "../../utils/file-browser.utils";
import { File } from "./file";
import { Folder } from "./folder";

export interface ResourceProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isOpened: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  isEditable: boolean;
  isPending: boolean;
  canDrop: boolean;
  getContentUrl: (id: string) => string;
  onOpen: () => void;
  onToggleExpanded: () => void;
  onToggleSelected: () => void;
  onRename: () => void;
  onDelete: () => void;
}

export function Resource({
  isOpened,
  isSelectable,
  isSelected,
  canDrop,
  getContentUrl,
  onOpen,
  onToggleExpanded,
  onToggleSelected,
  ...props
}: ResourceProps) {
  return isFolder(props.node.item) ? (
    <Folder
      {...props}
      isOpened={isOpened}
      canDrop={canDrop}
      onOpen={onOpen}
      onToggleExpanded={onToggleExpanded}
    />
  ) : (
    <File
      {...props}
      isSelectable={isSelectable}
      isSelected={isSelected}
      getContentUrl={getContentUrl}
      onToggleSelected={onToggleSelected}
    />
  );
}
