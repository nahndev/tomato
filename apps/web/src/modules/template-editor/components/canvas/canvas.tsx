"use client";

import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, useEffect, useImperativeHandle, useRef, useState } from "react";
import simplify from "simplify-js";
import { CanvasStage, type CanvasStroke } from "./canvas-stage";

const SIMPLIFY_TOLERANCE = 1;

function simplifyPoints(flat: number[]): number[] {
  const points = [];
  for (let index = 0; index < flat.length; index += 2) {
    points.push({ x: flat[index], y: flat[index + 1] });
  }
  return simplify(points, SIMPLIFY_TOLERANCE, true).flatMap((point) => [point.x, point.y]);
}

export interface CanvasRef {
  insertImage: (file: File) => void;
  clear: () => void;
}

interface CanvasProps {
  value?: string;
  onChange?: (dataUrl: string) => void;
  className?: string;
}

export const Canvas = forwardRef<CanvasRef, CanvasProps>(function Canvas({ value, onChange, className }, ref) {
  const stageRef = useRef<Konva.Stage>(null);
  const isDrawingRef = useRef(false);
  const [backgroundImage, setBackgroundImage] = useState<HTMLImageElement | null>(null);
  const [strokes, setStrokes] = useState<CanvasStroke[]>([]);

  useEffect(() => {
    if (!value) return;
    const image = new Image();
    image.onload = () => setBackgroundImage(image);
    image.src = value;
  }, [value]);

  useEffect(() => {
    if (!backgroundImage) return;
    const stage = stageRef.current;
    if (stage) onChange?.(stage.toDataURL({ mimeType: "image/png" }));
  }, [backgroundImage]);

  function handlePointerDown(event: KonvaEventObject<PointerEvent>) {
    isDrawingRef.current = true;
    const point = event.target.getStage()?.getPointerPosition();
    if (!point) return;
    setStrokes((previous) => [...previous, { points: [point.x, point.y] }]);
  }

  function handlePointerMove(event: KonvaEventObject<PointerEvent>) {
    if (!isDrawingRef.current) return;
    const point = event.target.getStage()?.getPointerPosition();
    if (!point) return;
    setStrokes((previous) => {
      const last = previous[previous.length - 1];
      if (!last) return previous;
      return [...previous.slice(0, -1), { points: [...last.points, point.x, point.y] }];
    });
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    setStrokes((previous) => {
      const last = previous[previous.length - 1];
      if (!last) return previous;
      return [...previous.slice(0, -1), { points: simplifyPoints(last.points) }];
    });
    const stage = stageRef.current;
    if (stage) onChange?.(stage.toDataURL({ mimeType: "image/png" }));
  }

  useImperativeHandle(ref, () => ({
    insertImage(file: File) {
      const reader = new FileReader();
      reader.onload = () => {
        const image = new Image();
        image.onload = () => {
          setBackgroundImage(image);
          setStrokes([]);
        };
        image.src = reader.result as string;
      };
      reader.readAsDataURL(file);
    },
    clear() {
      setBackgroundImage(null);
      setStrokes([]);
      onChange?.("");
    },
  }));

  return (
    <div
      className={
        className ?? "h-full w-full touch-none overflow-hidden rounded-md border border-input bg-white"
      }
    >
      <CanvasStage
        ref={stageRef}
        backgroundImage={backgroundImage}
        strokes={strokes}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
      />
    </div>
  );
});

export default Canvas;
