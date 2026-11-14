"use client";

import { Typography } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-widget.types";
import { serializeEditorState } from "../../lexical/lexical.config";
import { TextEditor } from "../../lexical/text-editor";

export function LabelWidgetItem({ widget }: FieldComponentProps) {
  if (!serializeEditorState(widget.content)) {
    return <Typography as="p" className="mt-2 text-sm text-muted-foreground">Enter content…</Typography>;
  }

  return <TextEditor value={widget.content} editable={false} className="mt-2 text-sm text-foreground" />;
}
