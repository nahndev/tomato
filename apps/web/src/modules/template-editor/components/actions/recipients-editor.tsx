"use client";

import { RecipientType } from "@tomato/constants";
import type { Recipient } from "@tomato/types";
import { Button, Input, Label, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@tomato/ui";
import { PlusIcon, Trash2Icon } from "lucide-react";

interface RecipientsEditorProps {
  recipients: Recipient[];
  onChange: (recipients: Recipient[]) => void;
}

const RECIPIENT_LABELS: Record<RecipientType, { option: string; placeholder: string }> = {
  [RecipientType.MAIL]: { option: "Email", placeholder: "jane@example.com" },
  [RecipientType.USER]: { option: "User", placeholder: "User id" },
};

export function RecipientsEditor({ recipients, onChange }: RecipientsEditorProps) {
  function update(index: number, next: Recipient) {
    onChange(recipients.map((recipient, current) => (current === index ? next : recipient)));
  }

  return (
    <div className="flex flex-col gap-1.5">
      <Label>Recipients</Label>
      {recipients.map((recipient, index) => (
        <div key={index} className="flex items-center gap-1">
          <Select
            value={recipient.type}
            onValueChange={(type) => update(index, { type: type as RecipientType, value: "" })}
          >
            <SelectTrigger size="sm" className="w-28 shrink-0" aria-label="Recipient type">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {Object.values(RecipientType).map((type) => (
                <SelectItem key={type} value={type}>
                  {RECIPIENT_LABELS[type].option}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Input
            value={recipient.value}
            onChange={(event) => update(index, { ...recipient, value: event.target.value })}
            placeholder={RECIPIENT_LABELS[recipient.type].placeholder}
            className="h-8"
          />
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            aria-label="Remove recipient"
            onClick={() => onChange(recipients.filter((_, current) => current !== index))}
          >
            <Trash2Icon />
          </Button>
        </div>
      ))}
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => onChange([...recipients, { type: RecipientType.MAIL, value: "" }])}
      >
        <PlusIcon />
        Add recipient
      </Button>
    </div>
  );
}
