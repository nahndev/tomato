"use client";

import {
  ConfirmDialog,
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuShortcut,
  DropdownMenuTrigger,
} from "@tomato/ui";
import {
  ArrowDownIcon,
  ArrowDownToLineIcon,
  ArrowUpIcon,
  ArrowUpToLineIcon,
  CopyIcon,
  Layers2Icon,
  LockIcon,
  LockOpenIcon,
  Trash2Icon,
  type LucideIcon,
} from "lucide-react";
import { DUPLICATE_HOTKEY, LAYER_ORDER_HOTKEYS, LayerOrder } from "../../canvas.constants";
import type { CanvasLayer } from "../../canvas.types";
import { formatHotkey } from "../../utils/hotkey.utils";
import { getLayerPosition } from "../../utils/layer.utils";
import { useCanvasValue } from "../state-provider";
import { ToolbarButton } from "./toolbar-button";

const ORDER_ITEMS: readonly { order: LayerOrder; label: string; icon: LucideIcon; isForward: boolean }[] = [
  { order: LayerOrder.FRONT, label: "Bring to front", icon: ArrowUpToLineIcon, isForward: true },
  { order: LayerOrder.FORWARD, label: "Bring forward", icon: ArrowUpIcon, isForward: true },
  { order: LayerOrder.BACKWARD, label: "Send backward", icon: ArrowDownIcon, isForward: false },
  { order: LayerOrder.BACK, label: "Send to back", icon: ArrowDownToLineIcon, isForward: false },
];

/** Orders the layer among the layers of its type, which are drawn together. */
function ArrangeMenu({ layer }: { layer: CanvasLayer }) {
  const { value, reorder } = useCanvasValue();
  const position = getLayerPosition(value.layers, layer.id);
  const isFront = !position || position.index === position.count - 1;
  const isBack = !position || position.index === 0;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <ToolbarButton label={`Arrange ${layer.type}`} disabled={isFront && isBack}>
          <Layers2Icon />
        </ToolbarButton>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-52">
        {ORDER_ITEMS.map(({ order, label, icon: Icon, isForward }) => (
          <DropdownMenuItem key={order} disabled={isForward ? isFront : isBack} onSelect={() => reorder(layer.id, order)}>
            <Icon />
            {label}
            <DropdownMenuShortcut>{formatHotkey(LAYER_ORDER_HOTKEYS[order])}</DropdownMenuShortcut>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export function LayerTool({ layer }: { layer: CanvasLayer }) {
  const { duplicate, setIsLocked, removeLayer } = useCanvasValue();
  const isLocked = Boolean(layer.isLocked);
  const name = layer.type;

  return (
    <div className="flex items-center gap-1">
      <ToolbarButton label={`Duplicate ${name}`} hotkey={DUPLICATE_HOTKEY} onClick={() => duplicate(layer.id)}>
        <CopyIcon />
      </ToolbarButton>
      <ArrangeMenu layer={layer} />
      <ToolbarButton
        label={isLocked ? `Unlock ${name}` : `Lock ${name}`}
        aria-pressed={isLocked}
        className="aria-pressed:bg-muted"
        onClick={() => setIsLocked(layer.id, !isLocked)}
      >
        {isLocked ? <LockIcon /> : <LockOpenIcon />}
      </ToolbarButton>
      <ConfirmDialog
        title={`Delete ${name}?`}
        description={`The ${name} is removed from this map.`}
        destructive="Delete"
        onDestructive={() => removeLayer(layer.id)}
      >
        <ToolbarButton label={`Delete ${name}`} hotkey="delete" className="text-danger">
          <Trash2Icon />
        </ToolbarButton>
      </ConfirmDialog>
    </div>
  );
}
