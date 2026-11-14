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
  toast,
  Typography,
} from "@tomato/ui";
import { useState, type FormEvent, type ReactNode } from "react";
import { mapSchema, type MapInput } from "../map.schemas";
import type { DepartmentMap } from "../map.types";

interface MapFormDialogProps {
  map?: DepartmentMap;
  onSubmit: (input: MapInput) => Promise<void>;
  children: ReactNode;
}

export function MapFormDialog({ map, onSubmit, children }: MapFormDialogProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState(map?.name ?? "");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const parsed = mapSchema.safeParse({ name });

  function handleOpenChange(nextOpen: boolean) {
    setIsOpen(nextOpen);
    setName(map?.name ?? "");
  }

  async function handleSubmit(event: FormEvent) {
    event.preventDefault();
    if (!parsed.success) return;
    setIsSubmitting(true);
    try {
      await onSubmit(parsed.data);
      handleOpenChange(false);
    } catch {
      toast.error("Could not save the map");
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
            <DialogTitle>{map ? "Rename map" : "Add map"}</DialogTitle>
            <DialogDescription>
              {map ? "Name of the map." : "Name the map, then choose its image."}
            </DialogDescription>
          </DialogHeader>
          <Input
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="Name"
            aria-label="Map name"
          />
          <DialogFooter>
            <DialogClose asChild>
              <Button type="button" variant="outline">
                <Typography>Cancel</Typography>
              </Button>
            </DialogClose>
            <Button type="submit" disabled={!parsed.success || isSubmitting}>
              {map ? "Save" : "Add"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
