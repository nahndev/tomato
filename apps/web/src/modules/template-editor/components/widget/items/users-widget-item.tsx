"use client";

import { Select, SelectTrigger, SelectValue } from "@tomato/ui";
import type { FieldComponentProps } from "../../../template-editor.types";

/** Placeholder until a users module exists. */
export function UsersWidgetItem({ widget }: FieldComponentProps<string>) {
  return (
    <Select disabled>
      <SelectTrigger id={widget.id} className="w-full">
        <SelectValue placeholder="No users available" />
      </SelectTrigger>
    </Select>
  );
}
