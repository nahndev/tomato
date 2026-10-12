"use client";

import { createTemplateSchema } from "@tomato/schemas";
import type { CreateTemplateInput } from "@tomato/schemas";
import { Button } from "@tomato/ui";
import { useState } from "react";
import type { FormEvent } from "react";

interface TemplateCreateFormProps {
  onCreate: (input: CreateTemplateInput) => Promise<void>;
}

export function TemplateCreateForm({ onCreate }: TemplateCreateFormProps) {
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = createTemplateSchema.safeParse({ name });

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onCreate(parsed.data);
      setName("");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      <input
        value={name}
        onChange={(event) => setName(event.target.value)}
        placeholder="Template name"
        aria-label="Template name"
        className="h-10 w-64 rounded-md border border-input bg-background px-3 focus-visible:outline-2 focus-visible:outline-ring"
      />
      <Button type="submit" disabled={!parsed.success || isSubmitting}>
        Add
      </Button>
    </form>
  );
}
