"use client";

import type { Unit, UnitType } from "@tomato/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { unitSchema, type UnitInput } from "../../unit.schemas";

interface UnitFormDialogProps {
  unit?: Unit;
  types: UnitType[];
  onSubmit: (input: UnitInput) => Promise<void>;
  children: ReactNode;
}

export function UnitFormDialog({ unit, types, onSubmit, children }: UnitFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(unit?.name ?? "");
  const [typeId, setTypeId] = useState(unit?.type.id ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = unitSchema.safeParse({ name, typeId });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(unit?.name ?? "");
    setTypeId(unit?.type.id ?? "");
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
            <DialogTitle>{unit ? "Edit unit" : "Create unit"}</DialogTitle>
            <DialogDescription>Name the unit and pick its type.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Unit name"
            aria-label="Unit name"
          />
          <Select value={typeId} onValueChange={setTypeId} disabled={unit?.isSystem}>
            <SelectTrigger aria-label="Unit type" className="w-full">
              <SelectValue placeholder="Select type" />
            </SelectTrigger>
            <SelectContent>
              {types.map((type) => (
                <SelectItem key={type.id} value={type.id}>
                  {type.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              {unit ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
