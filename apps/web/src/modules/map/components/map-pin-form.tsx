"use client";

import type { MapPin } from "@tomato/types";
import { Button, ConfirmDialog, Input, Textarea, toast } from "@tomato/ui";
import { useState, type FormEvent } from "react";
import { mapPinSchema, type MapPinInput } from "../map.schemas";

interface MapPinFormProps {
  pin: MapPin;
  onSave: (input: MapPinInput) => Promise<void>;
  onDelete: () => Promise<void>;
}

export function MapPinForm({ pin, onSave, onDelete }: MapPinFormProps) {
  const [label, setLabel] = useState(pin.label);
  const [description, setDescription] = useState(pin.description);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = mapPinSchema.safeParse({ label, description });
  const isDirty = label !== pin.label || description !== pin.description;

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onSave(parsed.data);
    } catch {
      toast.error("Could not save the pin");
    } finally {
      setIsSubmitting(false);
    }
  }

  async function handleDelete() {
    try {
      await onDelete();
    } catch {
      toast.error("Could not delete the pin");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3">
      <Input
        value={label}
        onChange={(event) => setLabel(event.target.value)}
        placeholder="Label"
        aria-label="Pin label"
      />
      <Textarea
        value={description}
        onChange={(event) => setDescription(event.target.value)}
        placeholder="Description"
        aria-label="Pin description"
        rows={4}
      />
      <div className="flex justify-between gap-2">
        <ConfirmDialog
          title={`Delete “${pin.label}”?`}
          description="This action cannot be undone."
          destructive="Delete"
          onDestructive={handleDelete}
        >
          <Button type="button" variant="ghost" size="sm" className="text-muted-foreground">
            Delete
          </Button>
        </ConfirmDialog>
        <Button type="submit" size="sm" disabled={!parsed.success || !isDirty || isSubmitting}>
          Save
        </Button>
      </div>
    </form>
  );
}
