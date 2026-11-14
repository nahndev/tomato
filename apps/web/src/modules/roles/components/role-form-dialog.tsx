"use client";

import { ErrorCode } from "@tomato/constants";
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
  Typography,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { getApiError } from "@/shared/lib/api-client";
import { roleSchema, type RoleInput } from "../roles.schemas";

interface RoleFormDialogProps {
  onSubmit: (input: RoleInput) => Promise<void>;
  children: ReactNode;
}

export function RoleFormDialog({ onSubmit, children }: RoleFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = roleSchema.safeParse({ name });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName("");
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
            <DialogTitle><Typography>Add role</Typography></DialogTitle>
            <DialogDescription><Typography>Name of the role.</Typography></DialogDescription>
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
                <Typography>Cancel</Typography>
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              <Typography>Add</Typography>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
