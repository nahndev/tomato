"use client";

import type { Session } from "@tomato/types";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tomato/ui";
import { useState, type ReactNode } from "react";
import { useColumnWidth } from "../../hooks/use-column-width";
import type { FieldComponentProps } from "../../template-widget.types";

interface MixedViewWidgetItemProps extends FieldComponentProps {
  /** The widgets inside a tab; the editor and the form each render their own. */
  children?: (session: Session, columnWidth: number) => ReactNode;
  /** Keeps every tab mounted, not only the active one. */
  isAllMounted?: boolean;
}

export function MixedViewWidgetItem({ widget, children, isAllMounted }: MixedViewWidgetItemProps) {
  const tabs = widget.tabs ?? [];
  const [contentRef, columnWidth] = useColumnWidth<HTMLDivElement>();
  const [activeId, setActiveId] = useState<string>();
  const currentId = tabs.some((tab) => tab.id === activeId) ? activeId : tabs[0]?.id;

  return (
    <div className="flex flex-col rounded-md border border-border bg-card">
      <p className="truncate border-b border-border px-3 py-2 text-sm font-medium">{widget.label || "(no title)"}</p>
      <Tabs value={currentId} onValueChange={setActiveId} className="gap-1 p-1">
        {tabs.length > 0 && (
          // Switching tabs must not toggle the widget selection in the editor
          <TabsList onClick={(event) => event.stopPropagation()}>
            {tabs.map((tab) => (
              <TabsTrigger key={tab.id} value={tab.id}>
                {tab.name || "(no name)"}
              </TabsTrigger>
            ))}
          </TabsList>
        )}
        <div ref={contentRef}>
          {tabs.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">No tabs yet</p>}
          {tabs.map((tab) => (
            <TabsContent
              key={tab.id}
              value={tab.id}
              forceMount={isAllMounted || undefined}
              className="data-[state=inactive]:hidden"
            >
              {children && columnWidth > 0 && children(tab, columnWidth)}
            </TabsContent>
          ))}
        </div>
      </Tabs>
    </div>
  );
}
