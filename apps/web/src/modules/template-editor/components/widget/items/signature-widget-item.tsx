"use client";

import { Button } from "@tomato/ui";
import { useEffect, useRef, type PointerEvent } from "react";
import type { FieldComponentProps } from "../../../template-editor.types";

const CANVAS_WIDTH = 600;
const CANVAS_HEIGHT = 160;
const STROKE_COLOR = "#0f172a";
const STROKE_WIDTH = 2;

interface Point {
  x: number;
  y: number;
}

/** Value is a PNG data URL produced by canvas.toDataURL(). */
export function SignatureWidgetItem({ value, onChange }: FieldComponentProps<string>) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDrawingRef = useRef(false);
  const lastPointRef = useRef<Point | null>(null);

  useEffect(() => {
    if (!value) return;
    const canvas = canvasRef.current;
    const context = canvas?.getContext("2d");
    if (!canvas || !context) return;
    const image = new Image();
    image.onload = () => context.drawImage(image, 0, 0, canvas.width, canvas.height);
    image.src = value;
  }, [value]);

  function getPoint(event: PointerEvent<HTMLCanvasElement>): Point {
    const canvas = canvasRef.current!;
    const rect = canvas.getBoundingClientRect();
    return {
      x: (event.clientX - rect.left) * (canvas.width / rect.width),
      y: (event.clientY - rect.top) * (canvas.height / rect.height),
    };
  }

  function handlePointerDown(event: PointerEvent<HTMLCanvasElement>) {
    isDrawingRef.current = true;
    lastPointRef.current = getPoint(event);
  }

  function handlePointerMove(event: PointerEvent<HTMLCanvasElement>) {
    const context = canvasRef.current?.getContext("2d");
    if (!isDrawingRef.current || !context || !lastPointRef.current) return;
    const point = getPoint(event);
    context.strokeStyle = STROKE_COLOR;
    context.lineWidth = STROKE_WIDTH;
    context.lineCap = "round";
    context.beginPath();
    context.moveTo(lastPointRef.current.x, lastPointRef.current.y);
    context.lineTo(point.x, point.y);
    context.stroke();
    lastPointRef.current = point;
  }

  function handlePointerUp() {
    if (!isDrawingRef.current) return;
    isDrawingRef.current = false;
    lastPointRef.current = null;
    if (canvasRef.current) onChange?.(canvasRef.current.toDataURL("image/png"));
  }

  function handleClear() {
    const canvas = canvasRef.current;
    canvas?.getContext("2d")?.clearRect(0, 0, canvas.width, canvas.height);
    onChange?.("");
  }

  return (
    <div className="mt-2 flex flex-col gap-2">
      <canvas
        ref={canvasRef}
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
        className="h-40 w-full touch-none rounded-md border border-input bg-white"
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerLeave={handlePointerUp}
      />
      <Button type="button" variant="outline" size="sm" className="self-start" onClick={handleClear}>
        Clear
      </Button>
    </div>
  );
}
