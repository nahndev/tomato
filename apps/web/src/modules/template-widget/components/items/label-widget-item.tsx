"use client";

import type { FieldComponentProps } from "../../template-widget.types";
import { serializeEditorState } from "../lexical/lexical.config";
import { TextEditor } from "../lexical/text-editor";

export function LabelWidgetItem({ widget }: FieldComponentProps<unknown>) {
  if (!serializeEditorState(widget.content)) {
    return <p className="mt-2 text-sm text-muted-foreground">Enter content…</p>;
  }

  return <TextEditor value={widget.content} editable={false} className="mt-2 text-sm text-foreground" />;
}
