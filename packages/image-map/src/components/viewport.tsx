"use client";

import { cn } from "@tomato/ui";
import { useRef, type ReactNode } from "react";
import { TransformComponent, TransformWrapper } from "react-zoom-pan-pinch";
import { useSpacePan } from "../hooks/use-space-pan";
import { useViewportObserver } from "../hooks/use-viewport-observer";
import { useZoomPanPinchSync } from "../hooks/use-zoom-pan-pinch-sync";
import { getScaleRange, selectIsReady } from "../image-map.store";
import { useImageMap } from "./state-provider";

// Layers own their drags unless the pan key is held.
const PANNING_OFF = { disabled: true };
const PANNING_ON = { disabled: false };
// Out of the layout flow, so the content's natural size cannot stretch the parent.
const WRAPPER_STYLE = { position: "absolute", inset: 0 } as const;

interface ViewportProps {
  className?: string;
  children: ReactNode;
}

/** Zooms (wheel, pinch); dragging anywhere while holding Space pans. */
export function Viewport({ className, children }: ViewportProps) {
  const contentSize = useImageMap((state) => state.contentSize);
  const isReady = useImageMap(selectIsReady);
  const minScale = useImageMap((state) => getScaleRange(state).minScale);
  const maxScale = useImageMap((state) => getScaleRange(state).maxScale);
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
          wrapperStyle={WRAPPER_STYLE}
          contentClass={cn(
            // While panning anywhere, layers ignore the pointer so it reaches the library.
            "relative cursor-default group-data-panning/viewport:cursor-[inherit] group-data-panning/viewport:**:pointer-events-none!",
            !isReady && "invisible",
          )}
          contentStyle={{ width: contentSize?.width, height: contentSize?.height }}
        >
          {children}
        </TransformComponent>
      </TransformWrapper>
    </div>
  );
}
