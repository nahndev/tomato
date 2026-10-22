"use client";

import type { Department } from "@tomato/types";
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
import { departmentSchema, type DepartmentInput } from "../department.schemas";

interface DepartmentFormDialogProps {
  department?: Department;
  onSubmit: (input: DepartmentInput) => Promise<void>;
  children: ReactNode;
}

export function DepartmentFormDialog({ department, onSubmit, children }: DepartmentFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(department?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = departmentSchema.safeParse({ name });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(department?.name ?? "");
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
            <DialogTitle>{department ? "Edit department" : "Create department"}</DialogTitle>
            <DialogDescription>Name the department.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Department name"
            aria-label="Department name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              {department ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
