"use client";

import { MAP_PIN_DESCRIPTION_MAX_LENGTH, MAP_PIN_LABEL_MAX_LENGTH } from "@tomato/constants";
import { Button, ConfirmDialog, Input, Textarea } from "@tomato/ui";
import { useState, type FormEvent } from "react";
import type { CanvasLayerDetails } from "../canvas.types";

interface DetailsFormProps {
  /** Layer type, used in accessible names. */
  name: string;
  details: CanvasLayerDetails;
  onSave: (details: CanvasLayerDetails) => void;
  onDelete: () => void;
}

export function DetailsForm({ name, details, onSave, onDelete }: DetailsFormProps) {
  const [label, setLabel] = useState(details.label);
  const [description, setDescription] = useState(details.description);

  const trimmedLabel = label.trim();
  const isValid =
    trimmedLabel.length > 0 &&
    trimmedLabel.length <= MAP_PIN_LABEL_MAX_LENGTH &&
    description.length <= MAP_PIN_DESCRIPTION_MAX_LENGTH;
  const isDirty = trimmedLabel !== details.label || description !== details.description;

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
        aria-label={`${name} label`}
        maxLength={MAP_PIN_LABEL_MAX_LENGTH}
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        aria-label={`${name} description`}
        maxLength={MAP_PIN_DESCRIPTION_MAX_LENGTH}
        rows={4}
      />
      <div className="flex justify-between gap-2">
        <ConfirmDialog
          title={`Delete “${details.label}”?`}
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
