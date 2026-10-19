"use client";

import type { BoardTemplate } from "@tomato/types";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  toast,
} from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import { useState } from "react";

interface NewSubmissionButtonProps {
  templates: BoardTemplate[];
  onCreate: (templateId: string) => Promise<void>;
}

export function NewSubmissionButton({ templates, onCreate }: NewSubmissionButtonProps) {
  const publishedTemplates = templates.filter((template) => template.latestVersion);
  const [isOpen, setIsOpen] = useState(false);
  const [templateId, setTemplateId] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setTemplateId(nextOpen ? (publishedTemplates[0]?.id ?? "") : "");
  }

  async function handleCreate() {
    setIsSubmitting(true);
    try {
      await onCreate(templateId);
    } catch {
      toast.error("Could not create the submission");
      setIsSubmitting(false);
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>
        <Button disabled={publishedTemplates.length === 0}>
          <PlusIcon className="size-4" strokeWidth={2} />
          New submission
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New submission</DialogTitle>
          <DialogDescription>Pick the template to fill in. Its newest published version is used.</DialogDescription>
        </DialogHeader>
        <Select value={templateId} onValueChange={setTemplateId}>
          <SelectTrigger aria-label="Template">
            <SelectValue placeholder="Template" />
          </SelectTrigger>
          <SelectContent>
            {publishedTemplates.map((template) => (
              <SelectItem key={template.id} value={template.id}>
                {template.name} v{template.latestVersion?.version}
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
          <Button onClick={handleCreate} disabled={!templateId || isSubmitting}>
            Create
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
