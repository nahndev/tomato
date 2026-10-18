"use client";

import { Textarea } from "@tomato/ui";
import { useRef, useState } from "react";
import { insertToken, stripTokensForValidation } from "./component-token";
import { TokenInsertMenu } from "./token-insert-menu";

interface JsonEditorProps {
  widgetId: string;
  value: string | undefined;
  onChange: (value: string) => void;
}

/** JSON payload editor with `{{widget.label}}` token insertion. */
export function JsonEditor({ widgetId, value, onChange }: JsonEditorProps) {
  const text = value ?? "";
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const cursorRef = useRef(text.length);
  const [error, setError] = useState<string | undefined>();

  function handleInsert(label: string) {
    const { text: nextText, cursorPosition } = insertToken(text, cursorRef.current, label);
    onChange(nextText);
    requestAnimationFrame(() => {
      textareaRef.current?.focus();
      textareaRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  function handleBlur() {
    if (!text.trim()) {
      setError(undefined);
      return;
    }
    try {
      JSON.parse(stripTokensForValidation(text));
      setError(undefined);
    } catch {
      setError("Not valid JSON");
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-start gap-1">
        <Textarea
          ref={textareaRef}
          value={text}
          placeholder={'{ "name": "{{Full name}}" }'}
          aria-label="Payload"
          className="min-h-24 font-mono text-xs"
          onChange={(event) => onChange(event.target.value)}
          onSelect={(event) => {
            cursorRef.current = event.currentTarget.selectionStart ?? text.length;
          }}
          onBlur={handleBlur}
        />
        <TokenInsertMenu widgetId={widgetId} onInsert={handleInsert} />
      </div>
      {error && <p className="text-xs text-danger">{error}</p>}
    </div>
  );
}
