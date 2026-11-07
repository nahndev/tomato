"use client";

import { cn } from "@tomato/ui";
import type { ReactNode } from "react";
import { Header } from "./header";
import { CanvasToolbar } from "./toolbar/canvas-toolbar";
import { CanvasView } from "./canvas-view";
import { Panel } from "./panel";
import { StateProvider, type StateProviderProps } from "./state-provider";

interface CanvasProps extends StateProviderProps {
  /** Start of the header, e.g. a back link and the title. */
  leading?: ReactNode;
  /** Extra toolbar actions, rendered inside the provider (e.g. "Add image" with `useAddImage`). */
  extension?: ReactNode;
  className?: string;
}

/** Header with the toolbar, image view and pin panel around one controlled value. */
export function Canvas({ leading, extension, className, ...props }: CanvasProps) {
  return (
    <StateProvider {...props}>
      <div className={cn("grid size-full grid-rows-[auto_1fr] overflow-hidden", className)}>
        <Header leading={leading}>
          <CanvasToolbar extension={extension} />
        </Header>
        <div className="flex min-h-0 flex-row">
          <CanvasView className="flex-1" />
          <Panel />
        </div>
      </div>
    </StateProvider>
  );
}
