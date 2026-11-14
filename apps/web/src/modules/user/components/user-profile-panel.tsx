"use client";

import { UserFilePicker } from "@/modules/file";
import { GroupType } from "@tomato/constants";
import { Avatar } from "@tomato/storage-ui";
import { useState } from "react";
import { AVATAR_PICKER_OPTIONS } from "../user.constants";
import { getUserFullName, getUserInitials } from "../user.utils";
import type { StorageFile } from "@tomato/storage-ui";
import type { User } from "../user.types";

import { Typography } from "@tomato/ui";
interface UserProfilePanelProps {
  user: User;
  onUploadAvatar: (fileId: string) => Promise<void>;
}

export function UserProfilePanel({
  user,
  onUploadAvatar,
}: UserProfilePanelProps) {
  const [isUploading, setIsUploading] = useState(false);

  const fullName = getUserFullName(user);
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
        options={{
          ...AVATAR_PICKER_OPTIONS,
          title: "Change avatar",
          confirmFailedMessage: "Could not upload the avatar",
        }}
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
            <Typography className="text-2xl">{getUserInitials(user)}</Typography>
          </Avatar>
        </button>
      </UserFilePicker>
      <Typography as="p" className="w-full font-medium break-words">{fullName}</Typography>
      {user.eid && (
        <Typography as="p" className="w-full text-xs break-all text-muted-foreground">
          {user.eid}
        </Typography>
      )}
      {address && (
        <Typography as="p" className="mt-auto w-full pt-4 text-sm break-words text-muted-foreground">
          {address}
        </Typography>
      )}
    </aside>
  );
}
