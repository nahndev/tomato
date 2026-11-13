"use client";

import { WidgetType } from "@tomato/constants";
import type { Widget } from "@/shared/types/template.types";
import { WidgetComponent, WidgetView } from "@/modules/template-widget";
import { Button, cn } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { TemplateMode } from "../../template-editor.constants";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { useTemplateMode } from "../provider/template-mode-provider";
import { useWidgetSelection } from "../provider/widget-selection-provider";
import { EditorCanvasWidgetItem } from "./editor-canvas-widget-item";
import { EditorMixedViewWidgetItem } from "./editor-mixed-view-widget-item";
import { EditorRepeatViewWidgetItem } from "./editor-repeat-view-widget-item";
import { isContainerWidget } from "../../utils/container-widget";

interface EditorWidgetItemProps {
  widget: Widget;
}

function EditorWidgetContent({ widget }: EditorWidgetItemProps) {
  if (widget.type === WidgetType.CANVAS) return <EditorCanvasWidgetItem widget={widget} />;
  if (widget.type === WidgetType.MIXED_VIEW) return <EditorMixedViewWidgetItem widget={widget} />;
  if (widget.type === WidgetType.REPEAT_VIEW) return <EditorRepeatViewWidgetItem widget={widget} />;
  return <WidgetComponent widget={widget} />;
}

function WidgetSelectionFrame({ widget, children }: PropsWithChildren<EditorWidgetItemProps>) {
  const mode = useTemplateMode();
  const { removeWidget } = useWidgetActions();
  const { isSelected, toggle } = useWidgetSelection();
  const isSelectionVisible = mode === TemplateMode.EDIT && isSelected(widget);
  const isContainer = isContainerWidget(widget.type);

  return (
    <div className="p-2">
      <div
        className={cn(
          "relative cursor-pointer border border-dashed",
          isSelectionVisible ? "border-primary" : "border-transparent",
        )}
        onClick={(event) => {
          event.stopPropagation();
          toggle(widget);
        }}
      >
        <div inert={!isContainer} className="min-w-0 flex-1 rounded-md bg-card">
          {children}
        </div>
        {isSelectionVisible && (
          <div className="absolute bottom-full flex w-full flex-row items-center gap-2">
            <div className="bg-primary px-1 py-0.5">
              <p className="truncate text-xs text-primary-foreground">{widget.label || "(no label)"}</p>
            </div>
            <div className="flex-1" />
            <Button
              size="icon-xs"
              variant="destructive"
              className="rounded-none"
              aria-label="Remove widget"
              onClick={(event) => {
                event.stopPropagation();
                removeWidget(widget.id);
              }}
            >
              <Trash2Icon />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

export function EditorWidgetItem({ widget }: EditorWidgetItemProps) {
  return (
    <WidgetSelectionFrame widget={widget}>
      <WidgetView widget={widget}>
        <EditorWidgetContent widget={widget} />
      </WidgetView>
    </WidgetSelectionFrame>
  );
}
