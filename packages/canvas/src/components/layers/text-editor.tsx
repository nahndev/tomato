"use client";

import { MAP_TEXT_MAX_LENGTH } from "@tomato/constants";
import { cn } from "@tomato/ui";
import { useState, type KeyboardEvent } from "react";
import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasTextLayer } from "../../canvas.types";
import { useCanvas, useCanvasStore, useCanvasValue } from "../state-provider";
import { TEXT_CLASS_NAME, textStyle } from "./text-layer";

/** Edits the text in `editingLayerId`, from the value or the draft; stays mounted while the text moves between them. */
export function TextEditor() {
  const { value } = useCanvasValue();
  const editingLayerId = useCanvas((state) => state.editingLayerId);
  const textDraft = useCanvas((state) => state.textDraft);
  const layer =
    value.layers.find(
      (current): current is CanvasTextLayer =>
        current.type === CanvasLayerType.TEXT && current.id === editingLayerId,
    ) ?? (textDraft?.id === editingLayerId ? textDraft : undefined);

  return layer ? <TextField key={layer.id} layer={layer} /> : null;
}

function TextField({ layer }: { layer: CanvasTextLayer }) {
  const store = useCanvasStore();
  const { typeText } = useCanvasValue();
  const [text, setText] = useState(layer.text);

  function finish() {
    const { setEditingLayer, setTextDraft } = store.getState();
    setEditingLayer(null);
    setTextDraft(null);
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Escape" || (event.key === "Enter" && !event.shiftKey)) {
      event.preventDefault();
      event.currentTarget.blur();
    }
  }

  return (
    <div className="absolute inset-0 z-30 pointer-events-none">
      <textarea
        autoFocus
        rows={1}
        aria-label="Text"
        value={text}
        maxLength={MAP_TEXT_MAX_LENGTH}
        style={textStyle(layer)}
        className={cn(
          TEXT_CLASS_NAME,
          "pointer-events-auto block min-w-[2ch] resize-none overflow-hidden border-0 bg-transparent p-0 outline-none field-sizing-content placeholder:text-muted-foreground",
        )}
        onPointerDown={(event) => event.stopPropagation()}
        onClick={(event) => event.stopPropagation()}
        onChange={(event) => {
          setText(event.target.value);
          typeText(layer.id, event.target.value);
        }}
        onKeyDown={handleKeyDown}
        onBlur={finish}
      />
    </div>
  );
}
