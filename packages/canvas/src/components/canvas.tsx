"use client";

import { ColorProvider } from "@tomato/color";
import { cn } from "@tomato/ui";
import type { ReactNode } from "react";
import { LAYER_COLOR_PRESETS } from "../canvas.constants";
import { Header } from "./header";
import { CanvasToolbar } from "./toolbar/canvas-toolbar";
import { CanvasView } from "./canvas-view";
import { Sidebar } from "./sidebar/sidebar";
import { StateProvider, type StateProviderProps } from "./state-provider";

interface CanvasProps extends StateProviderProps {
  leading?: ReactNode;
  /** Rendered inside the provider, so it can use `useAddImage`. */
  extension?: ReactNode;
  className?: string;
}

export function Canvas({ leading, extension, className, ...props }: CanvasProps) {
  return (
    <ColorProvider presets={LAYER_COLOR_PRESETS}>
      <StateProvider {...props}>
        <div className={cn("grid size-full grid-rows-[auto_1fr] overflow-hidden", className)}>
          <Header leading={leading}>
            <CanvasToolbar extension={extension} />
          </Header>
          <div className="flex min-h-0 flex-row">
            <CanvasView className="flex-1" />
            <Sidebar />
          </div>
        </div>
      </StateProvider>
    </ColorProvider>
  );
}
