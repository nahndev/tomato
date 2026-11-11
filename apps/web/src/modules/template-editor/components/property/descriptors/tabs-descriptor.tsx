"use client";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type { Session } from "@/shared/types/template.types";
import { Button, Input, Label, cn } from "@tomato/ui";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { createContentSession } from "@/modules/template-widget";
import { NEW_TAB_NAME } from "../../../template-editor.constants";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";

interface TabRowProps {
  tab: Session;
  index: number;
  onChangeName: (name: string) => void;
  onRemove: () => void;
}

function TabRow({ tab, index, onChangeName, onRemove }: TabRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: tab.id, index });

  return (
    <div
      ref={ref}
      className={cn("flex items-center gap-1 rounded-md border border-input bg-background p-1", isDragging && "opacity-50")}
    >
      <button
        ref={handleRef}
        type="button"
        className="flex size-8 shrink-0 cursor-grab items-center justify-center text-muted-foreground active:cursor-grabbing"
        aria-label="Drag to reorder"
      >
        <GripVerticalIcon className="size-4" />
      </button>
      <Input
        value={tab.name}
        onChange={(event) => onChangeName(event.target.value)}
        placeholder={`Tab ${index + 1}`}
        className="h-8"
      />
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove tab">
        <Trash2Icon />
      </Button>
    </div>
  );
}

/** Each tab is a content session: removing one also removes its widgets. */
export function TabsDescriptor({ widgetId, value, onChange }: WidgetPropertyFieldProps<"tabs">) {
  const tabs = value ?? [];

  function rename(id: string, name: string) {
    onChange(tabs.map((tab) => (tab.id === id ? { ...tab, name } : tab)));
  }

  function remove(id: string) {
    onChange(tabs.filter((tab) => tab.id !== id));
  }

  function add() {
    onChange([...tabs, createContentSession(widgetId, NEW_TAB_NAME)]);
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source, target } = event.operation;
    if (typeof source?.id !== "string" || !target || !isSortable(target)) return;
    const sourceIndex = tabs.findIndex((tab) => tab.id === source.id);
    if (sourceIndex === -1 || sourceIndex === target.index) return;

    const reordered = [...tabs];
    const [moved] = reordered.splice(sourceIndex, 1);
    reordered.splice(target.index, 0, moved);
    onChange(reordered);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Tabs</Label>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-1">
          {tabs.length === 0 && <span className="text-xs text-muted-foreground">No tabs yet</span>}
          {tabs.map((tab, index) => (
            <TabRow
              key={tab.id}
              tab={tab}
              index={index}
              onChangeName={(name) => rename(tab.id, name)}
              onRemove={() => remove(tab.id)}
            />
          ))}
        </div>
      </DragDropProvider>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <PlusIcon />
        Add tab
      </Button>
    </div>
  );
}
