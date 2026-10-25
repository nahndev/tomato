"use client";

import type { Document, User } from "@tomato/types";
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
  Textarea,
  toast,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import {
  documentSchema,
  type DocumentInput,
} from "../documents.schemas";

interface DocumentFormDialogProps {
  document?: Document;
  owners: User[];
  onSubmit: (input: DocumentInput) => Promise<void>;
  children: ReactNode;
}

export function DocumentFormDialog({
  document,
  owners,
  onSubmit,
  children,
}: DocumentFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState(document?.title ?? "");
  const [content, setContent] = useState(document?.content ?? "");
  const [ownerId, setOwnerId] = useState(document?.ownerId ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = documentSchema.safeParse({ title, content, ownerId });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setTitle(document?.title ?? "");
    setContent(document?.content ?? "");
    setOwnerId(document?.ownerId ?? "");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      handleOpenChange(false);
    } catch {
      toast.error("Could not save the document");
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
            <DialogTitle>
              {document ? "Edit document" : "Add document"}
            </DialogTitle>
            <DialogDescription>Title and content.</DialogDescription>
          </DialogHeader>
          <Input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Title"
            aria-label="Document title"
          />
          <Textarea
            value={content}
            onChange={(event) => setContent(event.target.value)}
            placeholder="Content"
            aria-label="Document content"
            rows={8}
          />
          <Select
            value={ownerId}
            onValueChange={setOwnerId}
            disabled={Boolean(document)}
          >
            <SelectTrigger aria-label="Document owner" className="w-full">
              <SelectValue placeholder="Owner" />
            </SelectTrigger>
            <SelectContent>
              {owners.map((owner) => (
                <SelectItem key={owner.id} value={owner.id}>
                  {owner.name}
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
              {document ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
