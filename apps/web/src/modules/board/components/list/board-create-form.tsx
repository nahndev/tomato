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
import { useState, type FormEvent } from "react";
import { createBoardSchema, type CreateBoardInput } from "../../board.schemas";

interface BoardCreateFormProps {
  onCreate: (input: CreateBoardInput) => Promise<void>;
}

export function BoardCreateForm({ onCreate }: BoardCreateFormProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = createBoardSchema.safeParse({ name });

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
          <Typography>New board</Typography>
        </Button>
      </DialogTrigger>
      <DialogContent>
        <form onSubmit={handleSubmit} className="grid gap-4">
          <DialogHeader>
            <DialogTitle><Typography>Create board</Typography></DialogTitle>
            <DialogDescription><Typography>Give your new board a name. You can link templates afterwards.</Typography></DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Board name"
            aria-label="Board name"
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
