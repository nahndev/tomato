import type { RichTextState } from "@/shared/types/template.types";
import type { EditorThemeClasses } from "lexical";

export const TEXT_EDITOR_NAMESPACE = "text-editor";

export const TEXT_EDITOR_THEME: EditorThemeClasses = {
  text: {
    bold: "font-bold",
    italic: "italic",
    underline: "underline",
  },
};

export function onTextEditorError(error: Error): void {
  console.error("Lexical editor error:", error);
}

export function serializeEditorState(state: RichTextState | undefined): string | undefined {
  if (!state || typeof state !== "object" || !("root" in state)) return undefined;
  return JSON.stringify(state);
}
