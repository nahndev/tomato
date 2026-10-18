"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import type { RichTextState } from "@tomato/types";
import { $createParagraphNode, $getRoot } from "lexical";
import { useEffect, useRef } from "react";
import { serializeEditorState } from "./lexical.config";

/**
 * `LexicalComposer` only reads its initial state on mount, so this keeps the
 * editor in lockstep with later `value` changes (e.g. a remote edit) without
 * clobbering a local edit that already produced the same value.
 */
export function useSyncEditorState(value: RichTextState | undefined) {
  const [editor] = useLexicalComposerContext();
  const lastSeenJson = useRef(serializeEditorState(value));

  useEffect(() => {
    const nextJson = serializeEditorState(value);
    if (nextJson === lastSeenJson.current) return;
    lastSeenJson.current = nextJson;

    if (nextJson === JSON.stringify(editor.getEditorState().toJSON())) return;

    if (!nextJson) {
      editor.update(() => {
        const root = $getRoot();
        root.clear();
        root.append($createParagraphNode());
      });
      return;
    }

    editor.setEditorState(editor.parseEditorState(nextJson));
  }, [editor, value]);
}
