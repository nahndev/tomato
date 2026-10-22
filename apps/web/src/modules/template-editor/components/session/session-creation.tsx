"use client";

import { Button } from "@tomato/ui";
import { generateId } from "@tomato/utils";
import { PlusIcon } from "lucide-react";
import { NEW_SESSION_NAME } from "../../template-editor.constants";
import { useSessionActions } from "../../sync/hooks/use-session-actions";

export function SessionCreation() {
  const { addSession } = useSessionActions();

  return (
    <div className="mx-auto">
      <Button
        type="button"
        variant="outline"
        size="sm"
        className="w-full justify-start"
        onClick={() => addSession(generateId(), { name: NEW_SESSION_NAME })}
      >
        <PlusIcon />
        Add Session
      </Button>
    </div>
  );
}
