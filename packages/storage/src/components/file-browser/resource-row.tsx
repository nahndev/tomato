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
  className?: string;
  children: ReactNode;
}

export function ResourceRow({
  depth,
  isDraggable = false,
  className,
  children,
  ...domProps
}: ResourceRowProps) {
  return (
    <li
      {...domProps}
      draggable={isDraggable}
      style={{ paddingInlineStart: `${0.75 + depth}rem` }}
      className={cn(
        "flex items-center gap-2 py-1.5 pe-3 text-sm",
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
