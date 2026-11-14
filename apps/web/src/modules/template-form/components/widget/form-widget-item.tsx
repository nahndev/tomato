"use client";

import type { Widget } from "@/shared/types/template.types";
import { WidgetView } from "@/modules/template-widget";
import { toScopedKey, useDataScope, useScopedValue } from "@/modules/template-data";
import { useTemplateForm } from "../template-form-provider";
import { FormWidgetComponents } from "./form-widget-registry";

export function FormWidgetItem({ widget }: { widget: Widget }) {
  const onChange = useTemplateForm((state) => state.onChange);
  const scope = [...useDataScope(), widget.id];
  const key = toScopedKey(scope);
  const value = useScopedValue(key);
  const Component = FormWidgetComponents[widget.type];

  return (
    <WidgetView widget={widget}>
      <Component widget={widget} value={value} onChange={(next) => onChange(key, next, scope)} />
    </WidgetView>
  );
}
