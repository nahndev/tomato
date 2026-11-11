"use client";

import { ErrorCode, RoleStatus } from "@tomato/constants";
import {
  Input,
  Label,
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
  Textarea,
  toast,
} from "@tomato/ui";
import { ColorPicker, ColorProvider } from "@tomato/color";
import { useId, useState, type ReactNode } from "react";
import { AutoSaveIndicator } from "@/shared/components/auto-save-indicator";
import { useAutoSave } from "@/shared/hooks/use-auto-save";
import { getApiError } from "@/shared/lib/api-client";
import {
  ROLE_AUTO_SAVE_DELAY,
  ROLE_COLOR_PRESETS,
  RoleErrorMessage,
} from "../roles.constants";
import {
  roleDetailSchema,
  type RoleDetailDraft,
  type RoleDetailInput,
} from "../roles.schemas";
import { RoleStatusBadge } from "./role-status-badge";
import type { Role } from "../roles.types";

function toDraft(role: Role): RoleDetailDraft {
  return {
    name: role.name,
    description: role.description ?? "",
    color: role.color,
    status: role.status,
  };
}

const toSaveErrorMessage = (error: unknown) =>
  getApiError(error)?.code === ErrorCode.CONFLICT
    ? RoleErrorMessage.NAME_TAKEN
    : RoleErrorMessage.SAVE_FAILED;

interface RoleDetailFormProps {
  role: Role;
  onSubmit: (input: RoleDetailInput) => Promise<void>;
  footerAction: ReactNode;
  children: ReactNode;
}

export function RoleDetailForm({
  role,
  onSubmit,
  footerAction,
  children,
}: RoleDetailFormProps) {
  const statusId = useId();
  const nameId = useId();
  const descriptionId = useId();
  const [draft, setDraft] = useState(() => toDraft(role));

  const parsed = roleDetailSchema.safeParse(draft);
  const invalidPaths = new Set(
    parsed.error?.issues.map((issue) => issue.path.join(".")),
  );
  const { status, error } = useAutoSave({
    value: parsed.success ? parsed.data : null,
    delay: ROLE_AUTO_SAVE_DELAY,
    save: onSubmit,
    onErrorAfterUnmount: (saveError) =>
      toast.error(toSaveErrorMessage(saveError)),
  });

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="flex min-h-0 flex-1 flex-col"
    >
      <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto p-6">
        <div className="flex items-end gap-4">
          <div className="grid gap-1.5">
            <Label>Color</Label>
            <ColorProvider presets={ROLE_COLOR_PRESETS}>
              <ColorPicker
                className="size-10"
                value={draft.color}
                onChange={(color) => setDraft({ ...draft, color })}
                aria-invalid={invalidPaths.has("color")}
              />
            </ColorProvider>
          </div>
          <div className="grid gap-1.5">
            <Label htmlFor={statusId}>Status</Label>
            <Select
              value={draft.status}
              onValueChange={(value) =>
                setDraft({ ...draft, status: value as RoleStatus })
              }
            >
              <SelectTrigger id={statusId} className="w-36">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.values(RoleStatus).map((value) => (
                  <SelectItem key={value} value={value}>
                    <RoleStatusBadge status={value} />
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={nameId}>Name</Label>
          <Input
            id={nameId}
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
            aria-invalid={invalidPaths.has("name")}
          />
        </div>
        <div className="grid gap-1.5">
          <Label htmlFor={descriptionId}>Description</Label>
          <Textarea
            id={descriptionId}
            value={draft.description}
            onChange={(event) =>
              setDraft({ ...draft, description: event.target.value })
            }
            aria-invalid={invalidPaths.has("description")}
          />
        </div>
        {children}
      </div>
      <div className="flex h-11 shrink-0 items-center justify-between gap-2 border-t border-border px-6">
        {footerAction}
        <div
          role="status"
          className="flex items-center gap-1.5 text-sm text-muted-foreground"
        >
          <AutoSaveIndicator
            status={status}
            errorMessage={toSaveErrorMessage(error)}
            invalidMessage={
              parsed.success ? undefined : RoleErrorMessage.INVALID_FIELDS
            }
          />
        </div>
      </div>
    </form>
  );
}
