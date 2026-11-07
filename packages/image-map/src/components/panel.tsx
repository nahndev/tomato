"use client";

import { cn } from "@tomato/ui";
import { MapPinIcon } from "lucide-react";
import { ImageMapLayerType } from "../image-map.constants";
import type { ImageMapPinLayer } from "../image-map.types";
import { PinForm } from "./pin-form";
import { useImageMap, useMapValue } from "./state-provider";

/** Lists the pins and edits the selected one. */
export function Panel({ className }: { className?: string }) {
  const { value, changePin, removeLayer } = useMapValue();
  const selectedLayerId = useImageMap((state) => state.selectedLayerId);
  const selectLayer = useImageMap((state) => state.selectLayer);
  const pins = value.layers.filter((layer): layer is ImageMapPinLayer => layer.type === ImageMapLayerType.PIN);
  const selectedPin = pins.find((pin) => pin.id === selectedLayerId);

  return (
    <aside
      className={cn("flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4", className)}
    >
      {selectedPin && (
        <section className="grid gap-3">
          <h2 className="text-sm font-medium">Selected pin</h2>
          <PinForm
            key={selectedPin.id}
            pin={selectedPin}
            onSave={(details) => changePin(selectedPin.id, details)}
            onDelete={() => removeLayer(selectedPin.id)}
          />
        </section>
      )}
      <section className="grid gap-2">
        <h2 className="text-sm font-medium">Pins ({pins.length})</h2>
        {pins.length === 0 ? (
          <p className="text-sm text-muted-foreground">No pins yet. Use “Add pin”, then click the map.</p>
        ) : (
          <ul className="grid gap-1">
            {pins.map((pin) => (
              <li key={pin.id}>
                <button
                  type="button"
                  aria-pressed={pin.id === selectedLayerId}
                  onClick={() => selectLayer(pin.id === selectedLayerId ? null : pin.id)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-ring aria-pressed:bg-muted aria-pressed:font-medium"
                >
                  <MapPinIcon className="size-4 shrink-0 text-primary" strokeWidth={1.75} />
                  <span className="truncate">{pin.label}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </section>
    </aside>
  );
}
