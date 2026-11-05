export const USER_LIST_PAGE_SIZE = 100;
export const USER_DETAIL_DRAWER_WIDTH = 880;
export const USER_AUTO_SAVE_DELAY = 800;
export const DEFAULT_USER_NAME = "New user";
export const DEFAULT_USER_EMAIL_DOMAIN = "example.com";

export const AutoSaveStatus = {
  IDLE: "idle",
  SAVING: "saving",
  SAVED: "saved",
  ERROR: "error",
} as const;
export type AutoSaveStatus = (typeof AutoSaveStatus)[keyof typeof AutoSaveStatus];

export const UserErrorMessage = {
  EMAIL_TAKEN: "This email is already in use",
  EMAIL_OR_EID_TAKEN: "This email or EID is already in use",
  SAVE_FAILED: "Could not save the user",
  CREATE_FAILED: "Could not create the user",
  LOAD_FAILED: "Could not load the user",
  INVALID_FIELDS: "Fix the highlighted fields to save",
  AVATAR_INVALID: "Choose a PNG, JPEG or WebP image of 5 MB or less",
  AVATAR_UPLOAD_FAILED: "Could not upload the avatar",
} as const;
export type UserErrorMessage = (typeof UserErrorMessage)[keyof typeof UserErrorMessage];
