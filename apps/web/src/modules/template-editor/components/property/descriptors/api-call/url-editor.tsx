"use client";

import { Input } from "@tomato/ui";
import { useRef, useState } from "react";
import { insertToken, stripTokensForValidation } from "./component-token";
import { TokenInsertMenu } from "./token-insert-menu";

interface UrlEditorProps {
  widgetId: string;
  value: string;
  onChange: (value: string) => void;
}

/** URL input with `{{widget.label}}` token insertion via the trailing menu. */
export function UrlEditor({ widgetId, value, onChange }: UrlEditorProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const cursorRef = useRef(value.length);
  const [warning, setWarning] = useState<string | undefined>();

  function handleInsert(label: string) {
    const { text, cursorPosition } = insertToken(value, cursorRef.current, label);
    onChange(text);
    requestAnimationFrame(() => {
      inputRef.current?.focus();
      inputRef.current?.setSelectionRange(cursorPosition, cursorPosition);
    });
  }

  function handleBlur() {
    setWarning(/\{\{|\}\}/.test(stripTokensForValidation(value)) ? "Check the {{…}} syntax" : undefined);
  }

  return (
    <div className="flex flex-col gap-1">
      <div className="flex items-center gap-1">
        <Input
          ref={inputRef}
          value={value}
          placeholder="/path/{{widget}}"
          aria-label="URL"
          className="h-8"
          onChange={(event) => onChange(event.target.value)}
          onSelect={(event) => {
            cursorRef.current = event.currentTarget.selectionStart ?? value.length;
          }}
          onBlur={handleBlur}
        />
        <TokenInsertMenu widgetId={widgetId} onInsert={handleInsert} />
      </div>
      {warning && <p className="text-xs text-danger">{warning}</p>}
    </div>
  );
}
