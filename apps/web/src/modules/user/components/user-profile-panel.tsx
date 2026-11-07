"use client";

import { UserFilePicker } from "@/modules/file";
import { GroupType } from "@tomato/constants";
import { Avatar } from "@tomato/storage-ui";
import type { StorageFile, User } from "@tomato/types";
import { useState } from "react";
import { AVATAR_PICKER_OPTIONS } from "../user.constants";

interface UserProfilePanelProps {
  user: User;
  onUploadAvatar: (fileId: string) => Promise<void>;
}

export function UserProfilePanel({
  user,
  onUploadAvatar,
}: UserProfilePanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const fullName = [user.name, user.familyName].filter(Boolean).join(" ");
  const initials = [user.name, user.familyName]
    .map((part) => part?.charAt(0).toUpperCase())
    .join("");
  const firstAddress = user.addresses[0];
  const address =
    firstAddress &&
    [
      firstAddress.street,
      firstAddress.city,
      firstAddress.postalCode,
      firstAddress.country,
    ]
      .filter(Boolean)
      .join(", ");

  async function handleConfirm([file]: StorageFile[]) {
    if (!file) return;
    setIsUploading(true);
    try {
      await onUploadAvatar(file.id);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <aside className="bg-canvas rounded-lg flex shrink-0 flex-col items-center gap-2 p-6 text-center @2xl:w-64">
      <UserFilePicker
        limit={{
          OR: [
            { type: GroupType.USER, uuid: user.id },
            { type: GroupType.DEPARTMENT, uuid: user.departmentId },
          ],
        }}
        options={AVATAR_PICKER_OPTIONS}
        onConfirm={handleConfirm}
      >
        <button
          type="button"
          disabled={isUploading}
          aria-label={`Upload avatar for ${fullName}`}
          className="group relative cursor-pointer rounded-full focus-ring disabled:cursor-wait"
        >
          <Avatar
            className="size-24"
            uuid={user.avatarFileId}
            isLoading={isUploading}
          >
            <span className="text-2xl">{initials}</span>
          </Avatar>
        </button>
      </UserFilePicker>
      <p className="w-full font-medium break-words">{fullName}</p>
      {user.eid && (
        <p className="w-full text-xs break-all text-muted-foreground">
          {user.eid}
        </p>
      )}
      {address && (
        <p className="mt-auto w-full pt-4 text-sm break-words text-muted-foreground">
          {address}
        </p>
      )}
    </aside>
  );
}
