"use client";

import { cn } from "@tomato/ui";
import { useRef, type ReactNode } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { getScaleRange, selectIsReady } from "../canvas.store";
import { useSpacePan } from "../hooks/use-space-pan";
import { useViewportObserver } from "../hooks/use-viewport-observer";
import { useZoomPanPinchSync } from "../hooks/use-zoom-pan-pinch-sync";
import { useCanvas } from "./state-provider";

// Layers own their drags unless the pan key is held.
const PANNING_OFF = { disabled: true };
const PANNING_ON = { disabled: false };
// Out of the layout flow, so the content's natural size cannot stretch the parent.
const WRAPPER_STYLE = { position: "absolute", inset: 0 } as const;

interface ViewportProps {
  className?: string;
  children: ReactNode;
}

export function Viewport({ className, children }: ViewportProps) {
  const contentSize = useCanvas((state) => state.contentSize);
  const isReady = useCanvas(selectIsReady);
  const minScale = useCanvas((state) => getScaleRange(state).minScale);
  const maxScale = useCanvas((state) => getScaleRange(state).maxScale);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { ref: transformRef, handleTransform, gesture } = useZoomPanPinchSync();
  useViewportObserver(viewportRef);
  const isSpacePanning = useSpacePan(viewportRef);

  return (
    <div
      ref={viewportRef}
      data-panning={isSpacePanning || undefined}
      className={cn(
        "group/viewport relative touch-none overflow-hidden select-none data-panning:cursor-grab data-panning:active:cursor-grabbing",
        className,
      )}
    >
      <TransformWrapper
        ref={transformRef}
        minScale={minScale}
        maxScale={maxScale}
        limitToBounds={false}
        doubleClick={{ disabled: true }}
        panning={isSpacePanning ? PANNING_ON : PANNING_OFF}
        velocityAnimation={{ disabled: true }}
        autoAlignment={{ disabled: true }}
        zoomAnimation={{ disabled: true }}
        onTransform={handleTransform}
        onPanningStart={() => gesture.start("pan")}
        onPanningStop={() => gesture.stop("pan")}
        onPinchStart={() => gesture.start("pinch")}
        onPinchStop={() => gesture.stop("pinch")}
        onWheelStart={() => gesture.start("wheel")}
        onWheelStop={() => gesture.stop("wheel")}
      >
        <TransformComponent
          wrapperStyle={{ width: "100%", height: "100%" }}
          contentClass={cn(
            // While panning anywhere, layers ignore the pointer so it reaches the library.
            "relative cursor-default group-data-panning/viewport:cursor-[inherit] group-data-panning/viewport:**:pointer-events-none!",
            !isReady && "invisible",
          )}
          contentStyle={{
            width: contentSize?.width,
            height: contentSize?.height,
          }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
