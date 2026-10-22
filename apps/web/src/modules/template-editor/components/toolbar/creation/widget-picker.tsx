"use client";

import { useDragDropMonitor, useDraggable } from "@dnd-kit/react";
import { ScrollArea } from "@tomato/ui";
import { generateId } from "@tomato/utils";
import { useMemo, useState } from "react";
import {
  WIDGET_GROUP_LABELS,
  WIDGET_GROUP_ORDER,
  WidgetItemList,
} from "../../../constants/widget-items.constants";
import { useTemplateState } from "../../../hooks/use-template-state";
import { useWidgetActions } from "../../../sync/hooks/use-widget-actions";
import type { WidgetItemDefinition } from "../../../template-editor.types";
import { EditorIcon } from "../../editor-icon";
import { useWidgetSelection } from "../../provider/template-provider";

interface WidgetCreationButtonProps {
  definition: WidgetItemDefinition;
}

function WidgetCreationButton({ definition }: WidgetCreationButtonProps) {
  const { selected, selectKey } = useWidgetSelection();
  const [id, setId] = useState(() => generateId());
  const { addWidget } = useWidgetActions();
  const { ref: draggableRef } = useDraggable({ id });

  function handleAddWidget() {
    addWidget(id, definition.type, selected);
    selectKey(id);
  }

  useDragDropMonitor({
    onDragStart({ operation: { source } }) {
      if (source && source.id === id) handleAddWidget();
    },
    onDragEnd() {
      setId(generateId());
    },
  });

  return (
    <button
      ref={draggableRef}
      type="button"
      onClick={handleAddWidget}
      className="flex cursor-pointer items-center gap-3 rounded-md px-3 py-2 text-left text-sm motion-base hover:bg-muted focus-ring"
    >
      <div className="flex size-7 shrink-0 items-center justify-center rounded bg-primary/10">
        <EditorIcon icon={definition.icon} className="size-3.5 text-primary" />
      </div>
      <div>
        <p className="leading-none font-medium">{definition.label}</p>
        <p className="mt-0.5 text-xs text-muted-foreground">{definition.description}</p>
      </div>
    </button>
  );
}

export function WidgetPicker() {
  const { widgets } = useTemplateState();
  const widgetCount = Object.keys(widgets).length;

  const groups = useMemo(
    () =>
      WIDGET_GROUP_ORDER.map((group) => ({
        group,
        definitions: WidgetItemList.filter((definition) => definition.group === group),
      })).filter(({ definitions }) => definitions.length > 0),
    [],
  );

  return (
    <ScrollArea className="size-full">
      {groups.map(({ group, definitions }) => (
        <div key={group} className="flex flex-col gap-1 py-2">
          <h6 className="px-3 text-xs font-semibold tracking-wider text-muted-foreground uppercase">
            {WIDGET_GROUP_LABELS[group]}
          </h6>
          {definitions.map((definition) => (
            <WidgetCreationButton key={definition.type + widgetCount} definition={definition} />
          ))}
        </div>
      ))}
    </ScrollArea>
  );
}
