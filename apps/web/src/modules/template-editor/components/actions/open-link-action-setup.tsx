"use client";

import type { LinkAction } from "@tomato/types";
import { Input } from "@tomato/ui";
import type { ActionSetupProps } from "./action-registry";

export function OpenLinkActionSetup({ action, onChange }: ActionSetupProps<LinkAction>) {
  return (
    <Input
      value={action.url}
      onChange={(event) => onChange({ ...action, url: event.target.value })}
      placeholder="https://…"
      aria-label="Link URL"
    />
  );
}
