"use client";

import type { Widget } from "@/shared/types/template.types";
import { WidgetView } from "@/modules/template-widget";
import { Button, cn, Typography } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { TemplateMode } from "../../template-editor.constants";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { useTemplateMode } from "../provider/template-mode-provider";
import { useIsWidgetSelected, useToggleWidget } from "../provider/widget-selection-provider";
import { EditorWidgetComponents } from "./editor-widget-registry";
import { isContainerWidget } from "../../utils/container-widget";

interface EditorWidgetItemProps {
  widget: Widget;
}

function WidgetSelectionFrame({ widget, children }: PropsWithChildren<EditorWidgetItemProps>) {
  const mode = useTemplateMode();
  const { removeWidget } = useWidgetActions();
  const isSelected = useIsWidgetSelected(widget.id);
  const toggle = useToggleWidget();
  const isSelectionVisible = mode === TemplateMode.EDIT && isSelected;
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
          toggle(widget.id);
        }}
      >
        <div inert={!isContainer} className="min-w-0 flex-1 rounded-md bg-card">
          {children}
        </div>
        {isSelectionVisible && (
          <div className="absolute bottom-full flex w-full flex-row items-center gap-2">
            <div className="bg-primary px-1 py-0.5">
              <Typography as="p" className="truncate text-xs text-primary-foreground">{widget.label || "(no label)"}</Typography>
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
  const Component = EditorWidgetComponents[widget.type];
  return (
    <WidgetSelectionFrame widget={widget}>
      <WidgetView widget={widget}>
        <Component widget={widget} />
      </WidgetView>
    </WidgetSelectionFrame>
  );
}
