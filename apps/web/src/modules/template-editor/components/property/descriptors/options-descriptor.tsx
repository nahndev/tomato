"use client";

import { DragDropProvider, type DragEndEvent } from "@dnd-kit/react";
import { isSortable, useSortable } from "@dnd-kit/react/sortable";
import type { OptionItem } from "@tomato/types";
import { Button, Input, Label, cn } from "@tomato/ui";
import { generateId } from "@tomato/utils";
import { generateKeyBetween } from "fractional-indexing";
import { GripVerticalIcon, PlusIcon, Trash2Icon } from "lucide-react";
import { useMemo } from "react";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";
import { sortOptions } from "../../../utils/options";

interface OptionRowProps {
  option: OptionItem;
  index: number;
  onChangeText: (text: string) => void;
  onRemove: () => void;
}

function OptionRow({ option, index, onChangeText, onRemove }: OptionRowProps) {
  const { ref, handleRef, isDragging } = useSortable({ id: option.key, index });

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
        value={option.value}
        onChange={(event) => onChangeText(event.target.value)}
        placeholder={`Option ${index + 1}`}
        className="h-8"
      />
      <Button type="button" variant="ghost" size="icon-sm" onClick={onRemove} aria-label="Remove option">
        <Trash2Icon />
      </Button>
    </div>
  );
}

/** Drag-and-drop options editor shared by select, checkbox and radio. */
export function OptionsDescriptor({ value, onChange }: WidgetPropertyFieldProps<"options">) {
  const options = useMemo(() => sortOptions(value), [value]);

  function update(key: string, text: string) {
    onChange(options.map((option) => (option.key === key ? { ...option, value: text } : option)));
  }

  function remove(key: string) {
    onChange(options.filter((option) => option.key !== key));
  }

  function add() {
    const index = generateKeyBetween(options.at(-1)?.index ?? null, null);
    onChange([...options, { key: generateId(), value: "", index }]);
  }

  function move(sourceKey: string, targetIndex: number) {
    const sourcePosition = options.findIndex((option) => option.key === sourceKey);
    if (sourcePosition === -1 || sourcePosition === targetIndex) return;

    const reordered = [...options];
    const [moved] = reordered.splice(sourcePosition, 1);
    reordered.splice(targetIndex, 0, moved);

    const nextIndex = generateKeyBetween(
      reordered[targetIndex - 1]?.index ?? null,
      reordered[targetIndex + 1]?.index ?? null,
    );
    onChange(options.map((option) => (option.key === sourceKey ? { ...option, index: nextIndex } : option)));
  }

  function handleDragEnd(event: DragEndEvent) {
    const { source, target } = event.operation;
    if (typeof source?.id !== "string" || !target || !isSortable(target)) return;
    move(source.id, target.index);
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Options</Label>
      <DragDropProvider onDragEnd={handleDragEnd}>
        <div className="flex flex-col gap-1">
          {options.length === 0 && <span className="text-xs text-muted-foreground">No options yet</span>}
          {options.map((option, index) => (
            <OptionRow
              key={option.key}
              option={option}
              index={index}
              onChangeText={(text) => update(option.key, text)}
              onRemove={() => remove(option.key)}
            />
          ))}
        </div>
      </DragDropProvider>
      <Button type="button" variant="outline" size="sm" onClick={add}>
        <PlusIcon />
        Add option
      </Button>
    </div>
  );
}
