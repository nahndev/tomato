import { AVATAR_MAX_SIZE, AvatarMimeType } from "@tomato/constants";
import type { UserFilePickerOptions } from "@/modules/file";

export const USER_LIST_PAGE_SIZE = 100;
export const USER_DETAIL_DRAWER_WIDTH = 880;
export const USER_AUTO_SAVE_DELAY = 800;
export const DEFAULT_USER_EMAIL_DOMAIN = "example.com";

export const AVATAR_PICKER_OPTIONS: UserFilePickerOptions = {
  accept: Object.fromEntries(
    Object.values(AvatarMimeType).map((mimeType) => [mimeType, []]),
  ),
  maxSize: AVATAR_MAX_SIZE,
  multiple: false,
};
