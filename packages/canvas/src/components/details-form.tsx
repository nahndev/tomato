"use client";

import { MAP_PIN_DESCRIPTION_MAX_LENGTH, MAP_PIN_LABEL_MAX_LENGTH } from "@tomato/constants";
import { Input, Textarea } from "@tomato/ui";
import { useState } from "react";
import type { CanvasLayerDetails } from "../canvas.types";

interface DetailsFormProps {
  /** Layer type, used in accessible names. */
  name: string;
  details: CanvasLayerDetails;
  onSave: (details: CanvasLayerDetails) => void;
}

/** Saves each valid edit; an empty label stays in the input without being applied. */
export function DetailsForm({ name, details, onSave }: DetailsFormProps) {
  const [label, setLabel] = useState(details.label);
  const [description, setDescription] = useState(details.description);
  const isLabelInvalid = label.trim().length === 0;

  function save(next: CanvasLayerDetails) {
    const trimmedLabel = next.label.trim();
    if (trimmedLabel.length === 0) return;
    if (trimmedLabel === details.label && next.description === details.description) return;
    onSave({ label: trimmedLabel, description: next.description });
  }

  return (
    <div className="grid gap-3">
      <Input
        value={label}
        onChange={(event) => {
          setLabel(event.target.value);
          save({ label: event.target.value, description });
        }}
        onBlur={() => setLabel(details.label)}
        placeholder="Label"
        aria-label={`${name} label`}
        aria-invalid={isLabelInvalid}
        maxLength={MAP_PIN_LABEL_MAX_LENGTH}
      />
      <Textarea
        value={description}
        onChange={(event) => {
          setDescription(event.target.value);
          save({ label, description: event.target.value });
        }}
        placeholder="Description"
        aria-label={`${name} description`}
        maxLength={MAP_PIN_DESCRIPTION_MAX_LENGTH}
        rows={4}
      />
    </div>
  );
}
