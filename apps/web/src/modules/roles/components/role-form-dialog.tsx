"use client";

import { ErrorCode } from "@tomato/constants";
import type { Role } from "@tomato/types";
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
  toast,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { getApiError } from "@/shared/lib/api-client";
import { roleSchema, type RoleInput } from "../roles.schemas";

interface RoleFormDialogProps {
  role?: Role;
  onSubmit: (input: RoleInput) => Promise<void>;
  children: ReactNode;
}

export function RoleFormDialog({
  role,
  onSubmit,
  children,
}: RoleFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(role?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = roleSchema.safeParse({ name });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(role?.name ?? "");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      handleOpenChange(false);
    } catch (error) {
      toast.error(
        getApiError(error)?.code === ErrorCode.CONFLICT
          ? "This role already exists"
          : "Could not save the role",
      );
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
            <DialogTitle>{role ? "Edit role" : "Add role"}</DialogTitle>
            <DialogDescription>Name of the role.</DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            aria-label="Role name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              {role ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
