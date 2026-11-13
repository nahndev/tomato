"use client";

import type { LinkAction } from "@/shared/types/template.types";
import { Input } from "@tomato/ui";
import type { ButtonActionSetupProps } from "./button-action-registry";

export function OpenLinkActionSetup({ action, onChange }: ButtonActionSetupProps<LinkAction>) {
  return (
    <Input
      value={action.url}
      onChange={(event) => onChange({ ...action, url: event.target.value })}
      placeholder="https://…"
      aria-label="Link URL"
    />
  );
}
