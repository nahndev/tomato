"use client";

import { Button } from "@tomato/ui";
import dynamic from "next/dynamic";
import { useRef } from "react";
import type { FieldComponentProps } from "../../../template-editor.types";
import type { CanvasRef } from "../../canvas/canvas";

const Canvas = dynamic(() => import("../../canvas/canvas").then((module) => module.Canvas), { ssr: false });

export function BoardWidgetItem({ widget, value, onChange }: FieldComponentProps<string>) {
  const canvasRef = useRef<CanvasRef>(null);

  function handleSelectImage(file: File | undefined) {
    if (file) canvasRef.current?.insertImage(file);
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <div className="h-64 w-full">
        <Canvas ref={canvasRef} value={value} onChange={onChange} />
      </div>
      <div className="flex items-center gap-3">
        <input
          id={widget.id}
          type="file"
          accept="image/*"
          onChange={(event) => handleSelectImage(event.target.files?.[0])}
          className="block flex-1 text-sm text-muted-foreground"
        />
        <Button type="button" variant="outline" size="sm" onClick={() => canvasRef.current?.clear()}>
          Clear
        </Button>
      </div>
    </div>
  );
}
