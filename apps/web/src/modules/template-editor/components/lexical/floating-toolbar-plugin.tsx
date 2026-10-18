"use client";

import type { PropsWithChildren } from "react";
import { useEditorFocus } from "./use-editor-focus";

export function FloatingToolbarPlugin({ children }: PropsWithChildren) {
  const isFocused = useEditorFocus();

  if (!isFocused) return null;

  return (
    <div className="fixed right-0 bottom-0 z-40 flex w-screen flex-row rounded-lg bg-card shadow-popover ring-1 ring-border">
      <div className="flex-1" />
      {children}
    </div>
  );
}
