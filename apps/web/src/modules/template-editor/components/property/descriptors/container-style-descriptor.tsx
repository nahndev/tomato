"use client";

import { Label } from "@tomato/ui";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";
import { ColorPicker } from "../color-picker";

export function ContainerStyleDescriptor({ value, onChange }: WidgetPropertyFieldProps<"containerStyle">) {
  const style = value ?? {};

  return (
    <div className="flex flex-row items-center gap-2">
      <ColorPicker value={style.background as string | undefined} onChange={(background) => onChange({ ...style, background })} />
      <Label>Background color</Label>
    </div>
  );
}
