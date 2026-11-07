import { useDraggable } from "@dnd-kit/react";
import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tomato/ui";
import {
  EllipsisIcon,
  GripVerticalIcon,
  PencilIcon,
  Trash2Icon,
} from "lucide-react";
import { useState, type ReactNode } from "react";
import { useFileBrowserDrop } from "../../hooks/use-file-browser-drop";
import {
  DRAG_ACTIVATOR_PROPS,
  DROP_TARGET_CLASS,
} from "../../storage.constants";
import type { FileBrowserLabels } from "../../storage.types";

// Touch screens have no hover, so these buttons stay visible there.
const ROW_BUTTON_CLASS =
  "pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100 pointer-fine:group-focus-within/row:opacity-100 pointer-fine:data-[state=open]:opacity-100";

interface ResourceRowProps {
  id: string;
  name: string;
  labels: FileBrowserLabels;
  depth: number;
  isPending: boolean;
  isDroppable?: boolean;
  isOpened?: boolean;
  isSelected?: boolean;
  children: ReactNode;
}

export function ResourceRow({
  id,
  name,
  labels,
  depth,
  isPending,
  isDroppable = false,
  isOpened = false,
  isSelected = false,
  children,
}: ResourceRowProps) {
  const [element, setElement] = useState<HTMLLIElement | null>(null);
  const { handleRef } = useDraggable({
    id,
    element,
    disabled: isPending,
  });
  const { isDropTarget } = useFileBrowserDrop({
    id,
    element,
    disabled: !isDroppable,
  });

  return (
    <li
      ref={setElement}
      data-selected={isSelected ? "true" : undefined}
      style={{ paddingInlineStart: `${0.5 + depth}rem` }}
      className={cn(
        "group/row flex min-h-10 items-center gap-2 rounded-md pe-2 text-sm motion-base hover:bg-muted is-selected:bg-selected",
        isOpened && "bg-inset font-medium hover:bg-inset-hover",
        isDropTarget && DROP_TARGET_CLASS,
      )}
    >
      {children}
      <Button
        ref={handleRef}
        type="button"
        variant="ghost"
        size="icon-xs"
        aria-label={`${labels.move}: ${name}`}
        disabled={isPending}
        className={cn("cursor-grab touch-none", ROW_BUTTON_CLASS)}
        {...DRAG_ACTIVATOR_PROPS}
      >
        <GripVerticalIcon />
      </Button>
    </li>
  );
}

interface ResourceActionsProps {
  name: string;
  labels: FileBrowserLabels;
  isPending: boolean;
  onRename: () => void;
  onDelete: () => void;
}

export function ResourceActions({
  name,
  labels,
  isPending,
  onRename,
  onDelete,
}: ResourceActionsProps) {
  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button
          type="button"
          variant="ghost"
          size="icon-xs"
          aria-label={`${labels.actions}: ${name}`}
          disabled={isPending}
          className={ROW_BUTTON_CLASS}
        >
          <EllipsisIcon />
        </Button>
      </DropdownMenuTrigger>
      {/* Keeps focus in the dialog opened from this menu. */}
      <DropdownMenuContent
        align="end"
        onCloseAutoFocus={(event) => event.preventDefault()}
      >
        <DropdownMenuItem onSelect={onRename}>
          <PencilIcon />
          {labels.rename}
        </DropdownMenuItem>
        <DropdownMenuItem variant="destructive" onSelect={onDelete}>
          <Trash2Icon />
          {labels.delete}
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
