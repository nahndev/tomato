"use client";

import { useRoles } from "@/modules/roles";
import { getApiError } from "@/shared/lib/api-client";
import { ErrorCode } from "@tomato/constants";
import type { User } from "@tomato/types";
import { Checkbox, Input, Label, Spinner, toast } from "@tomato/ui";
import { CheckIcon } from "lucide-react";
import { useId, useState, type ComponentProps } from "react";
import { useAutoSave } from "../hooks/use-auto-save";
import {
  AutoSaveStatus,
  USER_AUTO_SAVE_DELAY,
  UserErrorMessage,
} from "../user.constants";
import {
  userDetailSchema,
  type UserDetailDraft,
  type UserDetailInput,
} from "../user.schemas";
import { UserAddressesField } from "./user-addresses-field";

function toDraft(user: User): UserDetailDraft {
  return {
    eid: user.eid ?? "",
    name: user.name,
    familyName: user.familyName ?? "",
    email: user.email,
    tel: user.tel ?? "",
    addresses: user.addresses.map((address) => ({
      ...address,
      postalCode: address.postalCode ?? "",
    })),
    roleIds: user.roleIds,
  };
}

const toSaveErrorMessage = (error: unknown) =>
  getApiError(error)?.code === ErrorCode.CONFLICT
    ? UserErrorMessage.EMAIL_OR_EID_TAKEN
    : UserErrorMessage.SAVE_FAILED;

function Field({
  label,
  ...props
}: ComponentProps<typeof Input> & { label: string }) {
  const id = useId();
  return (
    <div className="grid min-w-0 content-start gap-1.5">
      <Label htmlFor={id}>{label}</Label>
      <Input id={id} {...props} />
    </div>
  );
}

interface UserDetailFormProps {
  user: User;
  onSubmit: (input: UserDetailInput) => Promise<void>;
}

export function UserDetailForm({ user, onSubmit }: UserDetailFormProps) {
  const roles = useRoles(user.departmentId);
  const [draft, setDraft] = useState(() => toDraft(user));

  const parsed = userDetailSchema.safeParse(draft);
  const invalidPaths = new Set(
    parsed.error?.issues.map((issue) => issue.path.join(".")),
  );
  const { status, error } = useAutoSave({
    value: parsed.success ? parsed.data : null,
    delay: USER_AUTO_SAVE_DELAY,
    save: onSubmit,
    onErrorAfterUnmount: (saveError) =>
      toast.error(toSaveErrorMessage(saveError)),
  });

  function toggleRole(roleId: string, isChecked: boolean) {
    setDraft({
      ...draft,
      roleIds: isChecked
        ? [...draft.roleIds, roleId]
        : draft.roleIds.filter((id) => id !== roleId),
    });
  }

  return (
    <form
      onSubmit={(event) => event.preventDefault()}
      className="size-full flex flex-col items-center"
    >
      <div className="flex-1 flex flex-col gap-4">
        <div className="grid grid-cols-3 gap-4 max-w-[60em]">
          <Field
            label="EID"
            value={draft.eid}
            onChange={(event) =>
              setDraft({ ...draft, eid: event.target.value })
            }
            aria-invalid={invalidPaths.has("eid")}
          />
          <Field
            label="Name"
            value={draft.name}
            onChange={(event) =>
              setDraft({ ...draft, name: event.target.value })
            }
            aria-invalid={invalidPaths.has("name")}
          />
          <Field
            label="Family name"
            value={draft.familyName}
            onChange={(event) =>
              setDraft({ ...draft, familyName: event.target.value })
            }
            aria-invalid={invalidPaths.has("familyName")}
          />
        </div>
        <div className="grid gap-4 @lg:grid-cols-2">
          <Field
            label="Email"
            type="email"
            value={draft.email}
            onChange={(event) =>
              setDraft({ ...draft, email: event.target.value })
            }
            aria-invalid={invalidPaths.has("email")}
          />
          <Field
            label="Tel"
            type="tel"
            value={draft.tel}
            onChange={(event) =>
              setDraft({ ...draft, tel: event.target.value })
            }
            aria-invalid={invalidPaths.has("tel")}
          />
        </div>
        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-semibold">Address</legend>
          <UserAddressesField
            value={draft.addresses}
            onChange={(addresses) => setDraft({ ...draft, addresses })}
            isInvalid={(index, field) =>
              invalidPaths.has(`addresses.${index}.${field}`)
            }
          />
        </fieldset>
        <fieldset className="grid gap-3">
          <legend className="mb-3 text-sm font-semibold">Other</legend>
          <div className="grid gap-2">
            <p className="text-sm font-medium">Role</p>
            {roles.isLoading ? (
              <Spinner className="text-muted-foreground" />
            ) : roles.hasError ? (
              <p className="text-sm text-muted-foreground">
                Could not load the roles.
              </p>
            ) : roles.roles.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                This department has no roles yet.
              </p>
            ) : (
              <ul className="grid gap-2 @lg:grid-cols-2">
                {roles.roles.map((role) => (
                  <li key={role.id}>
                    <Label className="font-normal">
                      <Checkbox
                        checked={draft.roleIds.includes(role.id)}
                        onCheckedChange={(checked) =>
                          toggleRole(role.id, checked === true)
                        }
                      />
                      <span className="truncate">{role.name}</span>
                    </Label>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </fieldset>
      </div>
      <div
        role="status"
        className="w-full sticky bottom-0 flex h-11 shrink-0 items-center bg-card justify-end gap-1.5 border-t border-border px-6 text-sm text-muted-foreground"
      >
        {!parsed.success ? (
          <span className="text-danger">{UserErrorMessage.INVALID_FIELDS}</span>
        ) : status === AutoSaveStatus.SAVING ? (
          <>
            <Spinner className="size-4 text-muted-foreground" />
            Saving...
          </>
        ) : status === AutoSaveStatus.SAVED ? (
          <>
            <CheckIcon className="size-4" />
            Saved
          </>
        ) : status === AutoSaveStatus.ERROR ? (
          <span className="text-danger">{toSaveErrorMessage(error)}</span>
        ) : null}
      </div>
    </form>
  );
}
