"use client";

import { WidgetType } from "@tomato/constants";
import type { Widget } from "@/shared/types/template.types";
import { WidgetComponent, WidgetView, type FieldComponentProps } from "@/modules/template-widget";
import { toScopedKey, useDataScope, useScopedValue } from "@/modules/template-data";
import { useTemplateForm } from "../template-form-provider";
import { FormCanvasWidgetItem } from "./form-canvas-widget-item";
import { FormMixedViewWidgetItem } from "./form-mixed-view-widget-item";
import { FormRepeatViewWidgetItem } from "./form-repeat-view-widget-item";

function FormWidgetContent(props: FieldComponentProps) {
  if (props.widget.type === WidgetType.CANVAS) return <FormCanvasWidgetItem widget={props.widget} />;
  if (props.widget.type === WidgetType.MIXED_VIEW) return <FormMixedViewWidgetItem widget={props.widget} />;
  if (props.widget.type === WidgetType.REPEAT_VIEW) return <FormRepeatViewWidgetItem widget={props.widget} />;
  return <WidgetComponent {...props} />;
}

/** A widget with its value, read and reported under the enclosing data scope. */
export function FormWidgetItem({ widget }: { widget: Widget }) {
  const { onChange } = useTemplateForm();
  const scope = [...useDataScope(), widget.id];
  const key = toScopedKey(scope);
  const value = useScopedValue(key);

  return (
    <WidgetView widget={widget}>
      <FormWidgetContent widget={widget} value={value} onChange={(next) => onChange(key, next, scope)} />
    </WidgetView>
  );
}
