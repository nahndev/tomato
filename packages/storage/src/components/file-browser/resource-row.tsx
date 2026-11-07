import {
  Button,
  cn,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@tomato/ui";
import { EllipsisIcon, PencilIcon, Trash2Icon } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import type { FileBrowserLabels } from "../../storage.types";

export type ResourceRowDomProps = Pick<
  ComponentProps<"li">,
  "onDragStart" | "onDragEnd" | "onDragOver" | "onDragLeave" | "onDrop"
>;

interface ResourceRowProps extends ResourceRowDomProps {
  depth: number;
  isDraggable?: boolean;
  isOpened?: boolean;
  isSelected?: boolean;
  className?: string;
  children: ReactNode;
}

export function ResourceRow({
  depth,
  isDraggable = false,
  isOpened = false,
  isSelected = false,
  className,
  children,
  ...domProps
}: ResourceRowProps) {
  return (
    <li
      {...domProps}
      draggable={isDraggable}
      data-selected={isSelected ? "true" : undefined}
      style={{ paddingInlineStart: `${0.5 + depth}rem` }}
      className={cn(
        "group/row flex min-h-10 items-center gap-2 rounded-md pe-2 text-sm motion-base hover:bg-muted is-selected:bg-selected",
        isOpened && "bg-inset font-medium hover:bg-inset-hover",
        className,
      )}
    >
      {children}
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
          // Touch screens have no hover, so the button stays visible there.
          className="pointer-fine:opacity-0 pointer-fine:group-hover/row:opacity-100 pointer-fine:group-focus-within/row:opacity-100 pointer-fine:data-[state=open]:opacity-100"
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
