import type { RichTextState } from "@/shared/types/template.types";

export function toRichTextState(text: string): RichTextState {
  const paragraphs = text.split("\n").map((line) => ({
    type: "paragraph",
    version: 1,
    direction: "ltr",
    format: "",
    indent: 0,
    textFormat: 0,
    textStyle: "",
    children: line
      ? [{ type: "text", version: 1, text: line, detail: 0, format: 0, mode: "normal", style: "" }]
      : [],
  }));
  return {
    root: {
      type: "root",
      version: 1,
      direction: "ltr",
      format: "",
      indent: 0,
      children: paragraphs,
    },
  };
}

function nodeText(node: unknown): string {
  if (typeof node !== "object" || node === null) return "";
  const { text, children } = node as { text?: unknown; children?: unknown };
  if (typeof text === "string") return text;
  return Array.isArray(children) ? children.map(nodeText).join("") : "";
}

export function richTextStateToText(state: RichTextState): string {
  const children = state.root.children;
  return Array.isArray(children) ? children.map(nodeText).join("\n") : "";
}
