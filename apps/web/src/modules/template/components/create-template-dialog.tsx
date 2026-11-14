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
  Typography,
} from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import type { FormEvent } from "react";
import { useState } from "react";
import type { CreateTemplateInput } from "../template.schemas";
import { createTemplateSchema } from "../template.schemas";

interface CreateTemplateDialogProps {
  onCreate: (input: CreateTemplateInput) => Promise<void>;
}

export function CreateTemplateDialog({ onCreate }: CreateTemplateDialogProps) {
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
        <Button>
          <PlusIcon className="size-4" strokeWidth={2} />
          <Typography>New template</Typography>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle><Typography>Create template</Typography></DialogTitle>
            <DialogDescription><Typography>Give your new template a name.</Typography></DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Template name"
            aria-label="Template name"
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
