import { Button, Input, Spinner } from "@tomato/ui";
import { FolderPlusIcon, UploadIcon } from "lucide-react";
import type { FileBrowserLabels } from "../../storage.types";

interface ToolbarProps {
  labels: FileBrowserLabels;
  search: string;
  hasSearch: boolean;
  isBusy: boolean;
  isEditable: boolean;
  canCreateFolder: boolean;
  isDisabled: boolean;
  onSearchChange: (search: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

export function Toolbar({
  labels,
  search,
  hasSearch,
  isBusy,
  isEditable,
  canCreateFolder,
  isDisabled,
  onSearchChange,
  onNewFolder,
  onUpload,
}: ToolbarProps) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {hasSearch && (
        <Input
          className="h-8 min-w-40 flex-1"
          aria-label={labels.search}
          placeholder={labels.search}
          value={search}
          onChange={(event) => onSearchChange(event.target.value)}
        />
      )}
      {isBusy && <Spinner />}
      {isEditable && (
        <>
          {canCreateFolder && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              disabled={isDisabled}
              onClick={onNewFolder}
            >
              <FolderPlusIcon />
              {labels.newFolder}
            </Button>
          )}
          <Button
            type="button"
            size="sm"
            disabled={isDisabled}
            onClick={onUpload}
          >
            <UploadIcon />
            {labels.upload}
          </Button>
        </>
      )}
    </div>
  );
}
