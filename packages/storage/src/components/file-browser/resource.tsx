import type { FileBrowserLabels, FileBrowserTreeNode } from "../../storage.types";
import { isFolder } from "../../utils/file-browser.utils";
import { File } from "./file";
import { Folder } from "./folder";
import type { ResourceRowDomProps } from "./resource-row";

export interface ResourceProps extends ResourceRowDomProps {
  node: FileBrowserTreeNode;
  labels: FileBrowserLabels;
  isOpened: boolean;
  isSelectable: boolean;
  isSelected: boolean;
  isEditable: boolean;
  isPending: boolean;
  className?: string;
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
  onOpen,
  onToggleExpanded,
  onToggleSelected,
  ...props
}: ResourceProps) {
  return isFolder(props.node.item) ? (
    <Folder
      {...props}
      isOpened={isOpened}
      onOpen={onOpen}
      onToggleExpanded={onToggleExpanded}
    />
  ) : (
    <File
      {...props}
      isSelectable={isSelectable}
      isSelected={isSelected}
      onToggleSelected={onToggleSelected}
    />
  );
}
