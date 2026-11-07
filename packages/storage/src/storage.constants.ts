export const FileBrowserItemType = {
  FILE: "file",
  FOLDER: "folder",
} as const;
export type FileBrowserItemType =
  (typeof FileBrowserItemType)[keyof typeof FileBrowserItemType];

export const GROUPS_PAGE_SIZE = 100;
export const DROP_TARGET_CLASS = "bg-selected ring-2 ring-focus ring-inset";
export const ROOT_DROP_TARGET_ID = "file-browser-root";
export const DRAG_ACTIVATOR_ATTRIBUTE = "data-drag-activator";
export const DRAG_ACTIVATOR_PROPS = { [DRAG_ACTIVATOR_ATTRIBUTE]: "" };

export const DEFAULT_FILE_BROWSER_LABELS = {
  root: "All files",
  groups: "Groups",
  search: "Filter by name",
  newFolder: "New folder",
  upload: "Upload",
  rename: "Rename",
  delete: "Delete",
  cancel: "Cancel",
  save: "Save",
  submit: "Select",
  name: "Name",
  actions: "Actions",
  move: "Move",
  expand: "Expand",
  collapse: "Collapse",
  empty: "No files here yet",
  emptyFolder: "This folder is empty",
  noResults: "No files match your search",
  clearSearch: "Clear search",
  location: "Current folder",
  loading: "Loading files",
  retry: "Try again",
  dismiss: "Dismiss",
  noSelection: "No file selected",
  selectedCount: "{count} files selected",
  clearSelection: "Clear",
  uploadFailed: "Upload failed",
  dropHint: "Drop files to upload them here",
  deleteTitle: "Delete this item?",
  deleteDescription: "This action cannot be undone.",
  filesRejected: "Some files were skipped: wrong type or too large",
  actionFailed: "Something went wrong, please try again",
  loadFailed: "Could not load the files",
};
