import { AVATAR_MAX_SIZE, AvatarMimeType } from "@tomato/constants";
import type { UserFilePickerOptions } from "@/modules/file";

export const USER_LIST_PAGE_SIZE = 100;
export const USER_DETAIL_DRAWER_WIDTH = 880;
export const USER_AUTO_SAVE_DELAY = 800;
export const DEFAULT_USER_NAME = "New user";
export const DEFAULT_USER_EMAIL_DOMAIN = "example.com";

export const UserErrorMessage = {
  EMAIL_TAKEN: "This email is already in use",
  EMAIL_OR_EID_TAKEN: "This email or EID is already in use",
  SAVE_FAILED: "Could not save the user",
  CREATE_FAILED: "Could not create the user",
  LOAD_FAILED: "Could not load the user",
  INVALID_FIELDS: "Fix the highlighted fields to save",
} as const;
export type UserErrorMessage = (typeof UserErrorMessage)[keyof typeof UserErrorMessage];

export const AVATAR_PICKER_OPTIONS: UserFilePickerOptions = {
  accept: Object.fromEntries(
    Object.values(AvatarMimeType).map((mimeType) => [mimeType, []]),
  ),
  maxSize: AVATAR_MAX_SIZE,
  multiple: false,
  title: "Change avatar",
  confirmLabel: "Use as avatar",
  confirmFailedMessage: "Could not upload the avatar",
  empty: "Drop an image here or click Upload",
  filesRejected: "Choose a PNG, JPEG or WebP image of 5 MB or less",
};
