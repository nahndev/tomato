"use client";

import { LexicalComposer } from "@lexical/react/LexicalComposer";
import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { ContentEditable } from "@lexical/react/LexicalContentEditable";
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary";
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin";
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin";
import type { RichTextState } from "@tomato/types";
import { cn } from "@tomato/ui";
import { BLUR_COMMAND, COMMAND_PRIORITY_LOW } from "lexical";
import { useEffect, useRef } from "react";
import { FloatingToolbarPlugin } from "./floating-toolbar-plugin";
import {
  TEXT_EDITOR_NAMESPACE,
  TEXT_EDITOR_THEME,
  onTextEditorError,
  serializeEditorState,
} from "./lexical.config";
import { Toolbar } from "./toolbar";
import { useSyncEditorState } from "./use-sync-editor-state";

const EDITABLE_CLASS = "min-h-24 w-full px-3 py-2 text-sm focus-visible:outline-none";

/** Commits on blur and on unmount, so an edit isn't lost when the owning UI closes without a DOM blur. */
function CommitOnBlur({ onCommit }: { onCommit: (state: RichTextState) => void }) {
  const [editor] = useLexicalComposerContext();
  const onCommitRef = useRef(onCommit);
  onCommitRef.current = onCommit;

  useEffect(() => {
    const commit = () => onCommitRef.current(editor.getEditorState().toJSON() as unknown as RichTextState);
    const unregister = editor.registerCommand(
      BLUR_COMMAND,
      () => {
        commit();
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
    return () => {
      commit();
      unregister();
    };
  }, [editor]);

  return null;
}

function SyncContent({ value }: { value: RichTextState | undefined }) {
  useSyncEditorState(value);
  return null;
}

export interface TextEditorProps {
  id?: string;
  value: RichTextState | undefined;
  onChange?: (value: RichTextState) => void;
  editable?: boolean;
  placeholder?: string;
  className?: string;
}

export function TextEditor({ id, value, onChange, editable = true, placeholder, className }: TextEditorProps) {
  const contentClass = className ?? EDITABLE_CLASS;

  return (
    <LexicalComposer
      initialConfig={{
        namespace: TEXT_EDITOR_NAMESPACE,
        theme: TEXT_EDITOR_THEME,
        editable,
        onError: onTextEditorError,
        editorState: serializeEditorState(value),
      }}
    >
      {editable ? (
        <div className="rounded-lg border border-input bg-background">
          <FloatingToolbarPlugin>
            <Toolbar />
          </FloatingToolbarPlugin>
          <div className="relative">
            <RichTextPlugin
              contentEditable={<ContentEditable id={id} className={contentClass} />}
              placeholder={
                placeholder ? (
                  <div className="pointer-events-none absolute top-2 leading-0 text-muted-foreground">
                    <span className={cn(contentClass)}>{placeholder}</span>
                  </div>
                ) : null
              }
              ErrorBoundary={LexicalErrorBoundary}
            />
          </div>
          <HistoryPlugin />
        </div>
      ) : (
        <RichTextPlugin
          contentEditable={<ContentEditable className={className} />}
          placeholder={null}
          ErrorBoundary={LexicalErrorBoundary}
        />
      )}
      {onChange ? <CommitOnBlur onCommit={onChange} /> : null}
      <SyncContent value={value} />
    </LexicalComposer>
  );
}
