"use client";

import { AVATAR_MAX_SIZE, AvatarMimeType } from "@tomato/constants";
import type { User } from "@tomato/types";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
  Spinner,
  toast,
} from "@tomato/ui";
import { CameraIcon } from "lucide-react";
import { useRef, useState, type ChangeEvent } from "react";
import { getUserAvatarUrl } from "../services/users.service";
import { UserErrorMessage } from "../user.constants";

const AVATAR_MIME_TYPES: string[] = Object.values(AvatarMimeType);

interface UserProfilePanelProps {
  user: User;
  onUploadAvatar: (file: File) => Promise<void>;
}

export function UserProfilePanel({
  user,
  onUploadAvatar,
}: UserProfilePanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
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

  async function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const file = event.target.files?.[0];
    // Lets the same file be chosen again.
    event.target.value = "";
    if (!file) return;
    if (!AVATAR_MIME_TYPES.includes(file.type) || file.size > AVATAR_MAX_SIZE) {
      toast.error(UserErrorMessage.AVATAR_INVALID);
      return;
    }
    setIsUploading(true);
    try {
      await onUploadAvatar(file);
    } catch {
      toast.error(UserErrorMessage.AVATAR_UPLOAD_FAILED);
    } finally {
      setIsUploading(false);
    }
  }

  return (
    <aside className="bg-canvas rounded-lg flex shrink-0 flex-col items-center gap-2 p-6 text-center @2xl:w-64">
      <button
        type="button"
        onClick={() => inputRef.current?.click()}
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
      <input
        ref={inputRef}
        type="file"
        accept={AVATAR_MIME_TYPES.join(",")}
        onChange={handleFileChange}
        className="hidden"
      />
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
