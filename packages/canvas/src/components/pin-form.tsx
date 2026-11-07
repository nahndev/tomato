"use client";

import { MAP_PIN_DESCRIPTION_MAX_LENGTH, MAP_PIN_LABEL_MAX_LENGTH } from "@tomato/constants";
import { Button, ConfirmDialog, Input, Textarea } from "@tomato/ui";
import { useState, type FormEvent } from "react";
import type { CanvasPin, CanvasPinDetails } from "../canvas.types";

interface PinFormProps {
  pin: CanvasPin;
  onSave: (details: CanvasPinDetails) => void;
  onDelete: () => void;
}

export function PinForm({ pin, onSave, onDelete }: PinFormProps) {
  const [label, setLabel] = useState(pin.label);
  const [description, setDescription] = useState(pin.description);

  const trimmedLabel = label.trim();
  const isValid =
    trimmedLabel.length > 0 &&
    trimmedLabel.length <= MAP_PIN_LABEL_MAX_LENGTH &&
    description.length <= MAP_PIN_DESCRIPTION_MAX_LENGTH;
  const isDirty = trimmedLabel !== pin.label || description !== pin.description;

  function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (isValid) onSave({ label: trimmedLabel, description });
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <Input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="Label"
        aria-label="Pin label"
        maxLength={MAP_PIN_LABEL_MAX_LENGTH}
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        aria-label="Pin description"
        maxLength={MAP_PIN_DESCRIPTION_MAX_LENGTH}
        rows={4}
      />
      <div className="flex justify-between gap-2">
        <ConfirmDialog
          title={`Delete “${pin.label}”?`}
          description="This action cannot be undone."
          destructive="Delete"
          onDestructive={onDelete}
        >
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
            Delete
          </Button>
        </ConfirmDialog>
        <Button type="submit" size="sm" disabled={!isValid || !isDirty}>
          Save
        </Button>
      </div>
    </form>
  );
}
