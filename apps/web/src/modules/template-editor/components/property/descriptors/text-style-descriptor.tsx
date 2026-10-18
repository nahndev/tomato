"use client";

import { Button, Label } from "@tomato/ui";
import {
  AlignCenterIcon,
  AlignJustifyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  BoldIcon,
  ItalicIcon,
  UnderlineIcon,
  type LucideIcon,
} from "lucide-react";
import type { WidgetPropertyFieldProps } from "../../../template-editor.types";
import { ColorPicker } from "../color-picker";

interface StyleButton {
  property: string;
  on: string;
  off?: string;
  icon: LucideIcon;
  label: string;
}

const STYLE_BUTTONS: StyleButton[] = [
  { property: "fontWeight", on: "bold", off: "normal", icon: BoldIcon, label: "Bold" },
  { property: "fontStyle", on: "italic", off: "normal", icon: ItalicIcon, label: "Italic" },
  { property: "textDecoration", on: "underline", off: "none", icon: UnderlineIcon, label: "Underline" },
  { property: "textAlign", on: "start", icon: AlignLeftIcon, label: "Align left" },
  { property: "textAlign", on: "center", icon: AlignCenterIcon, label: "Align center" },
  { property: "textAlign", on: "end", icon: AlignRightIcon, label: "Align right" },
  { property: "textAlign", on: "justify", icon: AlignJustifyIcon, label: "Justify" },
];

export function TextStyleDescriptor({ value, onChange }: WidgetPropertyFieldProps<"textStyle">) {
  const style = value ?? {};

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Text styles</Label>
      <div className="flex flex-wrap items-center gap-1">
        {STYLE_BUTTONS.map(({ property, on, off, icon: Icon, label }) => {
          const isOn = style[property] === on;
          return (
            <Button
              key={`${property}-${on}`}
              type="button"
              size="icon-sm"
              variant={isOn ? "default" : "ghost"}
              aria-label={label}
              aria-pressed={isOn}
              onClick={() => onChange({ ...style, [property]: isOn && off ? off : on })}
            >
              <Icon />
            </Button>
          );
        })}
        <ColorPicker value={style.color as string | undefined} onChange={(color) => onChange({ ...style, color })} />
      </div>
    </div>
  );
}
