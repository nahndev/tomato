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
import { userSchema, type UserInput } from "../user.schemas";
import type { User } from "../user.types";

interface UserFormDialogProps {
  user: User;
  onSubmit: (input: UserInput) => Promise<void>;
  children: ReactNode;
}

export function UserFormDialog({ user, onSubmit, children }: UserFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(user.name);
  const [email, setEmail] = useState(user.email);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = userSchema.safeParse({ name, email });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(user.name);
    setEmail(user.email);
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
        getApiError(error)?.code === ErrorCode.CONFLICT ? "This email is already in use" : "Could not save the user",
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
            <DialogTitle><Typography>Edit user</Typography></DialogTitle>
            <DialogDescription><Typography>Name and email of the user.</Typography></DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            aria-label="User name"
          />
          <Input
            type="email"
            value={email}
            onChange={(event) => setEmail(event.target.value)}
            placeholder="Email"
            aria-label="User email"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                <Typography>Cancel</Typography>
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              <Typography>Save</Typography>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
