export const FileBrowserItemType = {
  FILE: "file",
  FOLDER: "folder",
} as const;
export type FileBrowserItemType =
  (typeof FileBrowserItemType)[keyof typeof FileBrowserItemType];

export const DROP_TARGET_CLASS = "bg-accent ring-2 ring-focus ring-inset";

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
  expand: "Expand",
  collapse: "Collapse",
  empty: "No files here yet",
  dropHint: "Drop files to upload them here",
  deleteTitle: "Delete this item?",
  deleteDescription: "This action cannot be undone.",
  filesRejected: "Some files were skipped: wrong type or too large",
  actionFailed: "Something went wrong, please try again",
  loadFailed: "Could not load the files",
};
