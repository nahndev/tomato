"use client";

import type Konva from "konva";
import type { KonvaEventObject } from "konva/lib/Node";
import { forwardRef, useEffect, useRef, useState } from "react";
import { Image as KonvaImage, Layer, Line, Stage } from "react-konva";

export interface CanvasStroke {
  points: number[];
}

interface CanvasStageProps {
  backgroundImage: HTMLImageElement | null;
  strokes: CanvasStroke[];
  onPointerDown?: (event: KonvaEventObject<PointerEvent>) => void;
  onPointerMove?: (event: KonvaEventObject<PointerEvent>) => void;
  onPointerUp?: () => void;
}

/** Presentational Konva stage: renders strokes over an optional image, filling its parent. */
export const CanvasStage = forwardRef<Konva.Stage, CanvasStageProps>(function CanvasStage(
  { backgroundImage, strokes, onPointerDown, onPointerMove, onPointerUp },
  ref,
) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [size, setSize] = useState({ width: 0, height: 0 });

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    const observer = new ResizeObserver(([entry]) => {
      if (entry) setSize({ width: entry.contentRect.width, height: entry.contentRect.height });
    });
    observer.observe(container);
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="h-full w-full">
      <Stage
        ref={ref}
        width={size.width}
        height={size.height}
        onPointerDown={onPointerDown}
        onPointerMove={onPointerMove}
        onPointerUp={onPointerUp}
        onPointerLeave={onPointerUp}
      >
        <Layer>
          {backgroundImage && <KonvaImage image={backgroundImage} width={size.width} height={size.height} />}
          {strokes.map((stroke, index) => (
            <Line
              key={index}
              points={stroke.points}
              stroke="#0f172a"
              strokeWidth={2}
              lineCap="round"
              lineJoin="round"
            />
          ))}
        </Layer>
      </Stage>
    </div>
  );
});
