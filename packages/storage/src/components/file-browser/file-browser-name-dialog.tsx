import {
  Button,
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  Input,
  Typography,
} from "@tomato/ui";
import { useState } from "react";

interface FileBrowserNameDialogProps {
  title: string;
  initialName: string;
  onCancel: () => void;
  onSubmit: (name: string) => void;
}

export function FileBrowserNameDialog({
  title,
  initialName,
  onCancel,
  onSubmit,
}: FileBrowserNameDialogProps) {
  const [name, setName] = useState(initialName);
  const trimmedName = name.trim();

  return (
    <Dialog
      open
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <DialogContent aria-describedby={undefined}>
        <form
          className="flex flex-col gap-4"
          onSubmit={(event) => {
            event.preventDefault();
            // React bubbles through portals; don't submit a surrounding form.
            event.stopPropagation();
            if (trimmedName) onSubmit(trimmedName);
          }}
        >
          <DialogHeader>
            <DialogTitle>{title}</DialogTitle>
          </DialogHeader>
          <Input
            autoFocus
            aria-label="Name"
            value={name}
            onChange={(event) => setName(event.target.value)}
          />
          <DialogFooter>
            <Button type="button" variant="outline" onClick={onCancel}>
              <Typography>Cancel</Typography>
            </Button>
            <Button type="submit" disabled={!trimmedName}>
              <Typography>Save</Typography>
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
