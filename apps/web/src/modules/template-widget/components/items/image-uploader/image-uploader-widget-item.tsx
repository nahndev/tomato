"use client";

import { ImageFilePicker } from "@tomato/storage-ui";
import type { FieldComponentProps } from "../../../template-widget.types";

export function ImageUploaderWidgetItem({
  widget,
  value,
  onChange,
}: FieldComponentProps<string | undefined>) {
  return (
    <ImageFilePicker
      id={widget.id}
      value={typeof value === "string" && value ? value : undefined}
      onChange={onChange}
    />
  );
}
