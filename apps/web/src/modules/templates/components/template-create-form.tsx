"use client";

import type { CreateTemplateInput } from "@tomato/schemas";
import { createTemplateSchema } from "@tomato/schemas";
import {
  Button,
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@tomato/ui";
import type { FormEvent } from "react";
import { useState } from "react";

interface TemplateCreateFormProps {
  onCreate: (input: CreateTemplateInput) => Promise<void>;
}

export function TemplateCreateForm({ onCreate }: TemplateCreateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = createTemplateSchema.safeParse({ name });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    if (!nextOpen) setName("");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onCreate(parsed.data);
      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button size="sm">Create</Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>Create template</DialogTitle>
            <DialogDescription>Give your new template a name.</DialogDescription>
          </DialogHeader>
          <input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Template name"
            aria-label="Template name"
            className="h-10 w-full rounded-md border border-input bg-background px-3 focus-visible:outline-2 focus-visible:outline-ring"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              Add
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
