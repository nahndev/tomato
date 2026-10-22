"use client";

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
  Input,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { unitTypeSchema, type UnitTypeInput } from "../../unit.schemas";

interface UnitTypeNameDialogProps {
  initialName?: string;
  onSubmit: (input: UnitTypeInput) => Promise<void>;
  children: ReactNode;
}

export function UnitTypeNameDialog({ initialName = "", onSubmit, children }: UnitTypeNameDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(initialName);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = unitTypeSchema.safeParse({ name });
  const isEditing = initialName !== "";

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(initialName);
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      handleOpenChange(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle>{isEditing ? "Rename type" : "Create type"}</DialogTitle>
            <DialogDescription>Unit types group units, e.g. department or office.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Type name"
            aria-label="Type name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              {isEditing ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
