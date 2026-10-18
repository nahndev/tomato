"use client";

import type { Widget } from "@tomato/types";
import { Button, Label, cn } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { WidgetItems } from "../../constants/widget-items.constants";
import { TemplateMode } from "../../template-editor.constants";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { useTemplateMode } from "../provider/template-builder-provider";
import { useWidgetSelection } from "../provider/template-provider";
import { WidgetComponents } from "./widget-registry";
import { WidgetProvider } from "./widget-provider";

interface WidgetItemProps {
  widget: Widget;
}

function WidgetPreview({ widget }: WidgetItemProps) {
  const WidgetComponent = WidgetComponents[widget.type];

  return (
    <div className="flex flex-col gap-1.5 p-2">
      {WidgetItems[widget.type].isDataField && (
        <Label htmlFor={widget.id}>
          {widget.label || "(no label)"}
          {widget.required ? " *" : ""}
        </Label>
      )}
      <WidgetComponent widget={widget} />
    </div>
  );
}

function WidgetBox({ widget, children }: PropsWithChildren<WidgetItemProps>) {
  const mode = useTemplateMode();
  const { removeWidget } = useWidgetActions();
  const { isSelected, toggle } = useWidgetSelection();
  const isSelectionVisible = mode === TemplateMode.EDIT && isSelected(widget);

  return (
    <div className="p-2">
      <div
        className={cn(
          "relative cursor-pointer border border-dashed",
          isSelectionVisible ? "border-primary" : "border-transparent",
        )}
        onClick={() => toggle(widget)}
      >
        <div inert className="min-w-0 flex-1 rounded-md bg-card">
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

export function WidgetItem({ widget }: WidgetItemProps) {
  return (
    <WidgetProvider widgetId={widget.id}>
      <WidgetBox widget={widget}>
        <WidgetPreview widget={widget} />
      </WidgetBox>
    </WidgetProvider>
  );
}
