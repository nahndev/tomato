"use client";

import type { MapPin } from "@tomato/types";
import { cn } from "@tomato/ui";
import { MapPinIcon } from "lucide-react";
import type { MapPinInput } from "../map.schemas";
import { MapPinForm } from "./map-pin-form";

interface MapPinPanelProps {
  pins: MapPin[];
  selectedPinId: string | null;
  onSelect: (id: string | null) => void;
  onSave: (id: string, input: MapPinInput) => Promise<void>;
  onDelete: (id: string) => Promise<void>;
}

export function MapPinPanel({ pins, selectedPinId, onSelect, onSave, onDelete }: MapPinPanelProps) {
  const selectedPin = pins.find((pin) => pin.id === selectedPinId);

  return (
    <aside className="flex w-80 shrink-0 flex-col gap-4 overflow-y-auto border-l border-border bg-card p-4">
      {selectedPin && (
        <section className="grid gap-3">
          <h2 className="text-sm font-medium">Selected pin</h2>
          <MapPinForm
            key={selectedPin.id}
            pin={selectedPin}
            onSave={(input) => onSave(selectedPin.id, input)}
            onDelete={() => onDelete(selectedPin.id)}
          />
        </section>
      )}
      <section className="grid gap-2">
        <h2 className="text-sm font-medium">Pins ({pins.length})</h2>
        {pins.length === 0 ? (
          <p className="text-sm text-muted-foreground">
            No pins yet. Use “Add pin”, then click the map.
          </p>
        ) : (
          <ul className="grid gap-1">
            {pins.map((pin) => (
              <li key={pin.id}>
                <button
                  type="button"
                  aria-pressed={pin.id === selectedPinId}
                  onClick={() => onSelect(pin.id === selectedPinId ? null : pin.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-sm hover:bg-muted focus-ring",
                    pin.id === selectedPinId && "bg-muted font-medium",
                  )}
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
