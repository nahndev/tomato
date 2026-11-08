"use client";

import { CanvasLayerType } from "../../canvas.constants";
import type { CanvasImageLayer, Size } from "../../canvas.types";
import { DetailsForm } from "../details-form";
import { useCanvas, useCanvasValue } from "../state-provider";
import { StyleForm } from "./style-form";

function ImageProperties({ image, frame }: { image: CanvasImageLayer; frame: Size }) {
  const rows = [
    ["X", image.x * frame.width],
    ["Y", image.y * frame.height],
    ["Width", image.width * frame.width],
    ["Height", image.height * frame.height],
  ] as const;

  return (
    <dl className="grid grid-cols-[auto_1fr] gap-x-4 gap-y-2 text-sm">
      {rows.map(([name, pixels]) => (
        <div key={name} className="contents">
          <dt className="text-muted-foreground">{name}</dt>
          <dd className="text-right tabular-nums">{Math.round(pixels)} px</dd>
        </div>
      ))}
    </dl>
  );
}

export function PropertyPanel() {
  const { value, changeDetails } = useCanvasValue();
  const selectedLayerId = useCanvas((state) => state.selectedLayerId);
  const layer = value.layers.find((current) => current.id === selectedLayerId);

  if (!layer) {
    return <p className="text-sm text-muted-foreground">Select a layer to see its properties.</p>;
  }

  if (layer.type === CanvasLayerType.IMAGE) {
    return <ImageProperties image={layer} frame={value.frame} />;
  }

  return (
    <div className="grid gap-4">
      <DetailsForm
        key={layer.id}
        name={layer.type}
        details={layer}
        onSave={(details) => changeDetails(layer.id, details)}
      />
      <StyleForm key={`${layer.id}-style`} layer={layer} />
    </div>
  );
}
