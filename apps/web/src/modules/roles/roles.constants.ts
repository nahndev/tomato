export const ROLE_LIST_PAGE_SIZE = 100;
export const ROLE_AUTO_SAVE_DELAY = 800;
export const ROLE_DRAWER_WIDTH = 560;

export const ROLE_COLOR_PRESETS = [
  "#64748b",
  "#ef4444",
  "#f97316",
  "#eab308",
  "#22c55e",
  "#14b8a6",
  "#06b6d4",
  "#3b82f6",
  "#6366f1",
  "#8b5cf6",
  "#d946ef",
  "#ec4899",
] as const;

export const RoleErrorMessage = {
  NAME_TAKEN: "This role already exists",
  SAVE_FAILED: "Could not save the role",
  LOAD_FAILED: "Could not load the role",
  DELETE_FAILED: "Could not delete the role",
  INVALID_FIELDS: "Fix the highlighted fields to save",
} as const;
export type RoleErrorMessage = (typeof RoleErrorMessage)[keyof typeof RoleErrorMessage];
