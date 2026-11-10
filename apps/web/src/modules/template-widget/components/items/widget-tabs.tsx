"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@tomato/ui";
import { useState, type ReactNode } from "react";
import { useColumnWidth } from "../../hooks/use-column-width";
import type { ViewTab } from "../../template-widget.types";

interface WidgetTabsProps<T extends ViewTab> {
  title: string;
  tabs: T[];
  emptyText: string;
  children?: (tab: T, columnWidth: number) => ReactNode;
  isAllMounted?: boolean;
}

export function WidgetTabs<T extends ViewTab>({ title, tabs, emptyText, children, isAllMounted }: WidgetTabsProps<T>) {
  const [contentRef, columnWidth] = useColumnWidth<HTMLDivElement>();
  const [activeId, setActiveId] = useState<string>();
  const currentId = tabs.some((tab) => tab.id === activeId) ? activeId : tabs[0]?.id;

  return (
    <div className="flex flex-col rounded-md border border-border bg-card">
      <p className="truncate border-b border-border px-3 py-2 text-sm font-medium">{title || "(no title)"}</p>
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
          {tabs.length === 0 && <p className="px-2 py-3 text-sm text-muted-foreground">{emptyText}</p>}
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
