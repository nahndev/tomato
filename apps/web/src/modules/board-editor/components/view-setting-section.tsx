"use client";

import { Button, ConfirmDialog, toast, Typography } from "@tomato/ui";
import { PlusIcon } from "lucide-react";
import type { ReactNode } from "react";

interface ViewSettingSectionProps {
  title: string;
  description: string;
  isEnabled: boolean;
  isPending: boolean;
  onAdd: () => Promise<void>;
  onRemove: () => Promise<void>;
  actions?: ReactNode;
  children?: ReactNode;
}

export function ViewSettingSection({
  title,
  description,
  isEnabled,
  isPending,
  onAdd,
  onRemove,
  actions,
  children,
}: ViewSettingSectionProps) {
  async function run(action: () => Promise<void>, errorMessage: string) {
    try {
      await action();
    } catch {
      toast.error(errorMessage);
    }
  }

  return (
    <section className="flex flex-col gap-3" aria-label={title}>
      <div className="flex items-center justify-between gap-4">
        <div>
          <Typography as="h2" className="font-medium">{title}</Typography>
          <Typography as="p" className="text-sm text-muted-foreground">{description}</Typography>
        </div>
        <div className="flex items-center gap-2">
          {isEnabled ? (
            <>
              {actions}
              <ConfirmDialog
                title={`Remove the ${title.toLowerCase()}?`}
                description="Its settings will be deleted. The submissions of the board are kept."
                destructive="Remove"
                onDestructive={() => run(onRemove, "Could not remove the view")}
              >
                <Button variant="outline" disabled={isPending}>
                  <Typography>Remove view</Typography>
                </Button>
              </ConfirmDialog>
            </>
          ) : (
            <Button onClick={() => run(onAdd, "Could not add the view")} disabled={isPending}>
              <PlusIcon />
              <Typography>Add view</Typography>
            </Button>
          )}
        </div>
      </div>
      {isEnabled ? (
        children
      ) : (
        <Typography as="p" className="text-sm text-muted-foreground">This board has no {title.toLowerCase()} yet.</Typography>
      )}
    </section>
  );
}
