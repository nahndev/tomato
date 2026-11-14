import { ImageVariant } from "@tomato/constants";
import {
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  DialogTrigger,
  Typography,
} from "@tomato/ui";
import {
  DownloadIcon,
  ImagePlusIcon,
  PlusIcon,
  Trash2Icon,
} from "lucide-react";
import { useState } from "react";
import type {
  FileBrowserOptions,
  StorageFile,
  StorageGroupLimit,
} from "../storage.types";
import { FileBrowser } from "./file-browser/file-browser";
import { useStorageApi } from "./file-browser/file-browser-provider";
import { Picture } from "./picture";

interface ImageFilePickerProps {
  id?: string;
  value?: string;
  limit?: StorageGroupLimit | null;
  options?: FileBrowserOptions;
  onChange?: (fileId: string | undefined) => void;
}

export function ImageFilePicker({
  id,
  value,
  limit,
  options,
  onChange,
}: ImageFilePickerProps) {
  const [isPickerOpen, setIsPickerOpen] = useState(false);
  const openPicker = () => setIsPickerOpen(true);

  return (
    <>
      {value ? (
        <div className="group relative">
          <ImageExpandDialog fileId={value} />
          <ImageActions
            id={id}
            fileId={value}
            onUpload={openPicker}
            onChange={onChange}
          />
        </div>
      ) : (
        <ImagePlaceholder id={id} isDisabled={!onChange} onClick={openPicker} />
      )}
      <ImagePickerDialog
        isOpen={isPickerOpen}
        limit={limit}
        options={options}
        onOpenChange={setIsPickerOpen}
        onPick={(fileId) => onChange?.(fileId)}
      />
    </>
  );
}

interface ImagePickerDialogProps {
  isOpen: boolean;
  limit?: StorageGroupLimit | null;
  options?: FileBrowserOptions;
  onOpenChange: (isOpen: boolean) => void;
  onPick: (fileId: string) => void;
}

function ImagePickerDialog({
  isOpen,
  limit,
  options,
  onOpenChange,
  onPick,
}: ImagePickerDialogProps) {
  function handleChangeValue([file]: StorageFile[]) {
    if (file) onPick(file.id);
    onOpenChange(false);
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent
        aria-describedby={undefined}
        className="h-[min(36rem,calc(100dvh-2rem))] grid-rows-[auto_minmax(0,1fr)] sm:max-w-5xl"
      >
        <FileBrowser
          className="h-full"
          limit={limit}
          options={{ accept: { "image/*": [] }, multiple: false, ...options }}
          onChangeValue={handleChangeValue}
        />
      </DialogContent>
    </Dialog>
  );
}

interface ImagePlaceholderProps {
  id?: string;
  isDisabled: boolean;
  onClick: () => void;
}

function ImagePlaceholder({ id, isDisabled, onClick }: ImagePlaceholderProps) {
  return (
    <button
      id={id}
      type="button"
      disabled={isDisabled}
      onClick={onClick}
      className="focus-ring flex aspect-video w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-md border border-dashed border-border bg-muted text-muted-foreground disabled:cursor-default"
    >
      <ImagePlusIcon />
      <Typography className="text-sm">Choose image</Typography>
    </button>
  );
}

function ImageExpandDialog({ fileId }: { fileId: string }) {
  const api = useStorageApi();

  return (
    <Dialog>
      <DialogTrigger asChild>
        <button
          type="button"
          aria-label="Expand image"
          className="focus-ring block w-full cursor-zoom-in rounded-md"
        >
          <Picture
            src={api.getFileContentUrl(fileId, ImageVariant.MEDIUM)}
            className="aspect-video w-full rounded-md border border-border"
            imageClassName="object-contain"
          />
        </button>
      </DialogTrigger>
      <DialogContent
        aria-describedby={undefined}
        className="h-[calc(100dvh-2rem)] grid-rows-[minmax(0,1fr)] p-2 sm:max-w-[calc(100%-2rem)]"
      >
        <DialogTitle className="sr-only">Image</DialogTitle>
        <Picture
          src={api.getFileContentUrl(fileId)}
          className="size-full rounded-md"
          imageClassName="object-contain"
        />
      </DialogContent>
    </Dialog>
  );
}

interface ImageActionsProps {
  id?: string;
  fileId: string;
  onUpload: () => void;
  onChange?: (fileId: string | undefined) => void;
}

function ImageActions({ id, fileId, onUpload, onChange }: ImageActionsProps) {
  const api = useStorageApi();

  return (
    <>
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-md bg-overlay opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100"
      />
      <div className="absolute right-2 bottom-2 flex gap-1 opacity-0 transition-opacity group-focus-within:opacity-100 group-hover:opacity-100">
        {onChange && (
          <Button
            id={id}
            type="button"
            variant="secondary"
            size="icon-sm"
            aria-label="Upload image"
            onClick={onUpload}
          >
            <PlusIcon />
          </Button>
        )}
        <Button asChild variant="secondary" size="icon-sm">
          <a
            href={api.getFileContentUrl(fileId)}
            download
            aria-label="Download image"
          >
            <DownloadIcon />
          </a>
        </Button>
        {onChange && (
          <Button
            type="button"
            variant="destructive"
            size="icon-sm"
            aria-label="Remove image"
            onClick={() => onChange(undefined)}
          >
            <Trash2Icon />
          </Button>
        )}
      </div>
    </>
  );
}
