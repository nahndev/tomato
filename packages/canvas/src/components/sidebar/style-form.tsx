"use client";

import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger, Button, Typography } from "@tomato/ui";
import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasColoredLayer } from "../../canvas.types";
import { getPinIcon } from "../../utils/pin-icon.utils";
import { PinIconGrid } from "../pin-icon-grid";
import { useCanvasValue } from "../state-provider";
import { ColorField } from "./color-field";

function IconField({ id, icon }: { id: string; icon?: string }) {
  const { changeIcon } = useCanvasValue();
  const { label, icon: Icon } = getPinIcon(icon);

  return (
    <div className="flex items-center gap-2">
      <Typography className="flex-1 text-sm text-muted-foreground">Icon</Typography>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button type="button" variant="outline" size="sm" aria-label={`Icon: ${label}`}>
            <Icon />
            {label}
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <PinIconGrid value={icon ?? ""} onSelect={(next) => changeIcon(id, next)} />
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}

export function StyleForm({ layer }: { layer: CanvasColoredLayer }) {
  const { changeColor } = useCanvasValue();

  return (
    <div className="grid gap-2">
      <Typography as="h3" className="text-xs font-medium text-muted-foreground uppercase">Style</Typography>
      {layer.type === CanvasLayerType.PIN && <IconField id={layer.id} icon={layer.icon} />}
      <ColorField label="Color" value={layer.color} onChange={(color) => changeColor(layer.id, color)} />
    </div>
  );
}
