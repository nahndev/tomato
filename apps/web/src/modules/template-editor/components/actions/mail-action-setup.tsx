"use client";

import type { MailAction } from "@tomato/types";
import { Input, Textarea } from "@tomato/ui";
import type { ActionSetupProps } from "./action-registry";
import { RecipientsEditor } from "./recipients-editor";

export function MailActionSetup({ action, onChange }: ActionSetupProps<MailAction>) {
  return (
    <div className="flex flex-col gap-2">
      <RecipientsEditor recipients={action.recipients} onChange={(recipients) => onChange({ ...action, recipients })} />
      <Input
        value={action.subject}
        onChange={(event) => onChange({ ...action, subject: event.target.value })}
        placeholder="Subject"
        aria-label="Mail subject"
      />
      <Textarea
        value={action.body}
        onChange={(event) => onChange({ ...action, body: event.target.value })}
        rows={3}
        placeholder="Mail content…"
        aria-label="Mail content"
      />
    </div>
  );
}
