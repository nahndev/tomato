"use client";

import type { Widget } from "@tomato/types";
import { WidgetView } from "@/modules/template-widget";
import { Button, cn } from "@tomato/ui";
import { Trash2Icon } from "lucide-react";
import type { PropsWithChildren } from "react";
import { TemplateMode } from "../../template-editor.constants";
import { useWidgetActions } from "../../sync/hooks/use-widget-actions";
import { useTemplateMode } from "../provider/template-builder-provider";
import { useWidgetSelection } from "../provider/template-provider";

interface WidgetItemProps {
  widget: Widget;
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
    <WidgetBox widget={widget}>
      <WidgetView widget={widget} />
    </WidgetBox>
  );
}
