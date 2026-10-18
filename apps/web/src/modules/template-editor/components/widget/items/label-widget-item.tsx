"use client";

import type { FieldComponentProps } from "../../../template-editor.types";
import { serializeEditorState } from "../../lexical/lexical.config";
import { TextEditor } from "../../lexical/text-editor";

/** Read-only static content. Never collects a value. */
export function LabelWidgetItem({ widget }: FieldComponentProps<unknown>) {
  if (!serializeEditorState(widget.content)) {
    return <p className="mt-2 text-sm text-muted-foreground">Enter content…</p>;
  }

  return <TextEditor value={widget.content} editable={false} className="mt-2 text-sm text-foreground" />;
}
