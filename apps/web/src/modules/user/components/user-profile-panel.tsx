"use client";

import type { User } from "@tomato/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Spinner,
} from "@tomato/ui";
import { CameraIcon } from "lucide-react";
import { useState } from "react";
import { UserFilePicker } from "@/modules/file";
import { getUserAvatarUrl } from "../services/users.service";
import { AVATAR_PICKER_OPTIONS } from "../user.constants";

interface UserProfilePanelProps {
  user: User;
  onUploadAvatar: (file: File) => Promise<void>;
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

  async function handleConfirm([file]: File[]) {
    if (!file) return;
    setIsUploading(true);
    try {
      await onUploadAvatar(file);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <aside className="bg-canvas rounded-lg flex shrink-0 flex-col items-center gap-2 p-6 text-center @2xl:w-64">
      <UserFilePicker options={AVATAR_PICKER_OPTIONS} onConfirm={handleConfirm}>
        <button
          type="button"
          disabled={isUploading}
          aria-label={`Upload avatar for ${fullName}`}
          className="group relative cursor-pointer rounded-full focus-ring disabled:cursor-wait"
        >
          <Avatar className="size-24">
            <AvatarImage src={getUserAvatarUrl(user)} alt="" />
            <AvatarFallback className="text-2xl">{initials}</AvatarFallback>
          </Avatar>
          <span className="absolute inset-0 flex items-center justify-center rounded-full bg-overlay text-white opacity-0 motion-base group-hover:opacity-100 group-focus-visible:opacity-100 group-disabled:opacity-100">
            {isUploading ? (
              <Spinner />
            ) : (
              <CameraIcon className="size-5" strokeWidth={1.75} />
            )}
          </span>
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
