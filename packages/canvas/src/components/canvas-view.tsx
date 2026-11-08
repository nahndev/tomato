"use client";

import { cn } from "@tomato/ui";
import { CanvasLayerType, CanvasTool } from "../canvas.constants";
import type { Point } from "../canvas.types";
import { isShapeDrawTool } from "../hooks/use-shape-draw";
import { toLayerList } from "../utils/layer.utils";
import { ArrowLayer } from "./layers/arrow-layer";
import { FrameLayer } from "./layers/frame-layer";
import { ImageLayer } from "./layers/image-layer";
import { MapLayer } from "./layers/map-layer";
import { PinLayer } from "./layers/pin-layer";
import { ShapeDrawLayer } from "./layers/shape-draw-layer";
import { TextEditor } from "./layers/text-editor";
import { TextLayer } from "./layers/text-layer";
import { ZoneLayer } from "./layers/zone-layer";
import { useCanvas, useCanvasValue } from "./state-provider";
import { Viewport } from "./viewport";
import { ZoomControls } from "./zoom-controls";

const PLACE_TOOLS: readonly CanvasTool[] = [CanvasTool.ICON, CanvasTool.TEXT];

export function CanvasView({ className }: { className?: string }) {
  const { value, clickPoint, changePin, changeImage, changeZone, changeArrow, changeText, addZone, addArrow } =
    useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const tool = useCanvas((state) => state.tool);
  const setTool = useCanvas((state) => state.setTool);
  const selectLayer = useCanvas((state) => state.selectLayer);
  const { frame, layers } = value;
  const isSelecting = tool === CanvasTool.SELECT;
  const labels = new Map(toLayerList(layers).map(({ layer, label }) => [layer.id, label]));

  function handleDraw(points: Point[]) {
    const [start, end] = points;
    if (tool === CanvasTool.ARROW) addArrow(start!, end!);
    else addZone(points);
  }

  return (
    <div className={cn("relative min-w-0", className)}>
      <Viewport className="size-full bg-muted">
        <FrameLayer width={frame.width} height={frame.height} />
        <MapLayer
          className={cn(PLACE_TOOLS.includes(tool) && "cursor-crosshair")}
          onPointClick={clickPoint}
        />
        {layers.map((layer) =>
          layer.type === CanvasLayerType.IMAGE ? (
            <ImageLayer
              key={layer.id}
              image={layer}
              isSelectable={isSelecting}
              onChange={
                isSelecting && !layer.isLocked ? changeImage : undefined
              }
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.ZONE ? (
            <ZoneLayer
              key={layer.id}
              zone={layer}
              isSelectable={isSelecting}
              onChange={isSelecting && !layer.isLocked ? changeZone : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.ARROW ? (
            <ArrowLayer
              key={layer.id}
              arrow={layer}
              label={labels.get(layer.id) ?? ""}
              isSelectable={isSelecting}
              onChange={isSelecting && !layer.isLocked ? changeArrow : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.TEXT ? (
            <TextLayer
              key={layer.id}
              text={layer}
              isSelectable={isSelecting}
              onChange={isSelecting && !layer.isLocked ? (id, point) => changeText(id, point) : undefined}
            />
          ) : null,
        )}
        {layers.map((layer) =>
          layer.type === CanvasLayerType.PIN ? (
            <PinLayer
              key={layer.id}
              pin={layer}
              isSelected={layer.id === selectedLayerId}
              onSelect={selectLayer}
              onMove={layer.isLocked ? undefined : changePin}
            />
          ) : null,
        )}
        <TextEditor />
        {isShapeDrawTool(tool) && (
          <ShapeDrawLayer
            key={tool}
            tool={tool}
            onDraw={handleDraw}
            onCancel={() => setTool(CanvasTool.SELECT)}
          />
        )}
      </Viewport>
      <ZoomControls className="absolute right-3 bottom-3" />
    </div>
  );
}
