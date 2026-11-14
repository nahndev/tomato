"use client";

import { Button, Typography } from "@tomato/ui";
import { generateId } from "@tomato/utils";
import { PlusIcon } from "lucide-react";
import { useSessionActions } from "../../sync/hooks/use-session-actions";

export function AddSessionButton() {
  const { addSession } = useSessionActions();

  return (
    <div className="mx-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => addSession(generateId(), { name: "New session" })}
      >
        <PlusIcon />
        <Typography>Add Session</Typography>
      </Button>
    </div>
  );
}
