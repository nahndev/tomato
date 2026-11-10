"use client";

import { useLexicalComposerContext } from "@lexical/react/LexicalComposerContext";
import { Button, Separator } from "@tomato/ui";
import {
  $getSelection,
  $isElementNode,
  $isRangeSelection,
  COMMAND_PRIORITY_LOW,
  FORMAT_ELEMENT_COMMAND,
  FORMAT_TEXT_COMMAND,
  SELECTION_CHANGE_COMMAND,
  type ElementFormatType,
} from "lexical";
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
import { useEffect, useState } from "react";

const ALIGN_OPTIONS: { format: ElementFormatType; icon: LucideIcon; label: string }[] = [
  { format: "left", icon: AlignLeftIcon, label: "Align left" },
  { format: "center", icon: AlignCenterIcon, label: "Align center" },
  { format: "right", icon: AlignRightIcon, label: "Align right" },
  { format: "justify", icon: AlignJustifyIcon, label: "Justify" },
];

function useActiveFormats() {
  const [editor] = useLexicalComposerContext();
  const [formats, setFormats] = useState({
    bold: false,
    italic: false,
    underline: false,
    align: "left" as ElementFormatType,
  });

  useEffect(() => {
    return editor.registerCommand(
      SELECTION_CHANGE_COMMAND,
      () => {
        const selection = $getSelection();
        if ($isRangeSelection(selection)) {
          const anchorNode = selection.anchor.getNode();
          const element = anchorNode.getKey() === "root" ? anchorNode : anchorNode.getTopLevelElementOrThrow();
          setFormats({
            bold: selection.hasFormat("bold"),
            italic: selection.hasFormat("italic"),
            underline: selection.hasFormat("underline"),
            align: ($isElementNode(element) && element.getFormatType()) || "left",
          });
        }
        return false;
      },
      COMMAND_PRIORITY_LOW,
    );
  }, [editor]);

  return formats;
}

export function Toolbar() {
  const [editor] = useLexicalComposerContext();
  const { bold, italic, underline, align } = useActiveFormats();

  const textButtons = [
    { format: "bold", icon: BoldIcon, isActive: bold, label: "Bold" },
    { format: "italic", icon: ItalicIcon, isActive: italic, label: "Italic" },
    { format: "underline", icon: UnderlineIcon, isActive: underline, label: "Underline" },
  ] as const;

  return (
    <div className="flex items-center gap-1 p-1 text-foreground">
      {textButtons.map(({ format, icon: Icon, isActive, label }) => (
        <Button
          key={format}
          type="button"
          variant={isActive ? "default" : "ghost"}
          size="icon-sm"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_TEXT_COMMAND, format)}
        >
          <Icon />
        </Button>
      ))}
      <Separator orientation="vertical" className="mx-1 h-6" />
      {ALIGN_OPTIONS.map(({ format, icon: Icon, label }) => (
        <Button
          key={format}
          type="button"
          variant={align === format ? "default" : "ghost"}
          size="icon-sm"
          aria-label={label}
          onMouseDown={(event) => event.preventDefault()}
          onClick={() => editor.dispatchCommand(FORMAT_ELEMENT_COMMAND, format)}
        >
          <Icon />
        </Button>
      ))}
    </div>
  );
}
