"use client";

import { MAP_TEXT_MAX_LENGTH } from "@tomato/constants";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue, Textarea } from "@tomato/ui";
import { useState } from "react";
import { TEXT_FONT_SIZES } from "../../canvas.constants";
import type { CanvasTextLayer } from "../../canvas.types";
import { useCanvasValue } from "../state-provider";

/** Saves each edit; an empty text stays in the input without being applied. */
export function TextForm({ layer }: { layer: CanvasTextLayer }) {
  const { changeText } = useCanvasValue();
  const [text, setText] = useState(layer.text);
  const fontSize = Math.round(layer.fontSize);
  const isPreset = TEXT_FONT_SIZES.some(({ size }) => size === fontSize);

  return (
    <div className="grid gap-3">
      <Textarea
        value={text}
        onChange={(event) => {
          setText(event.target.value);
          if (event.target.value.trim()) changeText(layer.id, { text: event.target.value });
        }}
        onBlur={() => setText(layer.text)}
        placeholder="Text"
        aria-label="Text"
        aria-invalid={text.trim().length === 0}
        maxLength={MAP_TEXT_MAX_LENGTH}
        rows={3}
      />
      <div className="flex items-center gap-2">
        <span className="flex-1 text-sm text-muted-foreground">Size</span>
        <Select value={String(fontSize)} onValueChange={(size) => changeText(layer.id, { fontSize: Number(size) })}>
          <SelectTrigger className="w-40" aria-label="Text size">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {!isPreset && <SelectItem value={String(fontSize)}>Custom · {fontSize} px</SelectItem>}
            {TEXT_FONT_SIZES.map(({ name, size }) => (
              <SelectItem key={size} value={String(size)}>
                {name} · {size} px
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    </div>
  );
}
