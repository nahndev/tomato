import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  Typography,
} from "@tomato/ui";
import type { FileBrowserItem } from "../../storage.types";

interface FileBrowserDeleteDialogProps {
  item: FileBrowserItem | null;
  onCancel: () => void;
  onConfirm: (item: FileBrowserItem) => void;
}

export function FileBrowserDeleteDialog({
  item,
  onCancel,
  onConfirm,
}: FileBrowserDeleteDialogProps) {
  return (
    <AlertDialog
      open={Boolean(item)}
      onOpenChange={(isOpen) => {
        if (!isOpen) onCancel();
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle><Typography>Delete this item?</Typography></AlertDialogTitle>
          <AlertDialogDescription>
            <Typography>{item?.name} · This action cannot be undone.</Typography>
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel><Typography>Cancel</Typography></AlertDialogCancel>
          <AlertDialogAction
            variant="destructive"
            onClick={() => {
              if (item) onConfirm(item);
            }}
          >
            <Typography>Delete</Typography>
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}
