"use client";

import { XIcon } from "lucide-react";
import type { FieldComponentProps } from "../../../template-editor.types";
import { formatBytes } from "../../../utils/format-bytes";

export interface UploadedFileMeta {
  name: string;
  size: number;
  type: string;
}

/** Only file metadata is kept until an upload endpoint exists. */
export function FileUploaderWidgetItem({ widget, value, onChange }: FieldComponentProps<UploadedFileMeta[]>) {
  const files = value ?? [];

  function handleSelect(fileList: FileList | null) {
    if (!fileList) return;
    const added = Array.from(fileList).map(({ name, size, type }) => ({ name, size, type }));
    onChange?.([...files, ...added]);
  }

  function handleRemove(index: number) {
    onChange?.(files.filter((_, current) => current !== index));
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <input
        id={widget.id}
        type="file"
        multiple
        onChange={(event) => handleSelect(event.target.files)}
        className="block w-full text-sm text-muted-foreground"
      />
      {files.length > 0 && (
        <ul className="flex flex-col gap-1">
          {files.map((file, index) => (
            <li
              key={`${file.name}-${index}`}
              className="flex items-center justify-between rounded-md border border-input px-2 py-1 text-xs"
            >
              <span className="truncate">
                {file.name} · {formatBytes(file.size)}
              </span>
              <button
                type="button"
                aria-label={`Remove ${file.name}`}
                onClick={() => handleRemove(index)}
                className="text-muted-foreground hover:text-foreground"
              >
                <XIcon className="size-3.5" />
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
