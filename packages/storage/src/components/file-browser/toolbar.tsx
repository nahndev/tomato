import { Button, Input, Spinner, Typography } from "@tomato/ui";
import { FolderPlusIcon, SearchIcon, UploadIcon } from "lucide-react";
import type { FileBrowserItem, FileBrowserLabels } from "../../storage.types";

interface ToolbarProps {
  labels: FileBrowserLabels;
  search: string;
  /** Shown because uploads and new folders go there. */
  folderPath: FileBrowserItem[];
  isSearchDisabled: boolean;
  isBusy: boolean;
  /** Leaves the solid style to the submit button, the main action. */
  isSelectable: boolean;
  isDisabled: boolean;
  onSearchChange: (search: string) => void;
  onNewFolder: () => void;
  onUpload: () => void;
}

export function Toolbar({
  labels,
  search,
  folderPath,
  isSearchDisabled,
  isBusy,
  isSelectable,
  isDisabled,
  onSearchChange,
  onNewFolder,
  onUpload,
}: ToolbarProps) {
  return (
    <div className="flex shrink-0 flex-col gap-2 p-3 pb-2">
      <div className="flex items-center gap-2">
        <div className="relative min-w-0 flex-1">
          <SearchIcon className="pointer-events-none absolute start-2.5 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            className="h-8 ps-8"
            aria-label={labels.search}
            placeholder={labels.search}
            value={search}
            disabled={isSearchDisabled}
            onChange={(event) => onSearchChange(event.target.value)}
          />
        </div>
        {isBusy && <Spinner className="size-4 shrink-0" />}
        <Button
          type="button"
          variant="outline"
          size="sm"
          aria-label={labels.newFolder}
          disabled={isDisabled}
          onClick={onNewFolder}
        >
          <FolderPlusIcon />
          <Typography className="hidden @xl:inline">{labels.newFolder}</Typography>
        </Button>
        <Button
          type="button"
          variant={isSelectable ? "outline" : "default"}
          size="sm"
          aria-label={labels.upload}
          disabled={isDisabled}
          onClick={onUpload}
        >
          <UploadIcon />
          <Typography className="hidden @xl:inline">{labels.upload}</Typography>
        </Button>
      </div>
      <Typography as="p"
        aria-label={labels.location}
        className="truncate text-xs text-muted-foreground"
      >
        {[labels.root, ...folderPath.map(({ name }) => name)].join(" / ")}
      </Typography>
    </div>
  );
}
