import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupType } from "@tomato/constants";
import { toast } from "@tomato/ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { apiClient } from "@/shared/lib/api-client";
import { STORAGE_API_BASE_URL, UserFilePickerLabel } from "../file.constants";
import { StorageProvider } from "./storage-provider";
import { UserFilePicker, type UserFilePickerOptions } from "./user-file-picker";
import type { StorageFile, StorageFolderTree, StorageGroup } from "@tomato/storage-ui";

vi.mock("@/shared/lib/api-client", () => ({
  apiClient: { get: vi.fn(), getUri: vi.fn() },
}));

const TRIGGER = "Open";
const GROUPS_URL = "/groups";
const OWNER = { type: GroupType.USER, uuid: "user" };
const LIMIT = { OR: [OWNER] };
const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function makeFile(name: string, mimeType: string): StorageFile {
  return { id: name, folderId: "root", name, mimeType, size: 1, ...TIMESTAMPS };
}

const FIRST = makeFile("first.png", "image/png");
const SECOND = makeFile("second.pdf", "application/pdf");
const ROOT_FOLDER = { id: "root", parentId: null, name: "root", ...TIMESTAMPS };
const GROUP: StorageGroup = {
  id: "group",
  ...OWNER,
  label: "Me",
  folderId: ROOT_FOLDER.id,
  folder: ROOT_FOLDER,
  ...TIMESTAMPS,
};
const TREE: StorageFolderTree = {
  folders: [ROOT_FOLDER],
  files: [FIRST, SECOND],
};

async function openDialog(
  onConfirm: (files: StorageFile[]) => Promise<void>,
  options?: UserFilePickerOptions,
) {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <StorageProvider>
        <UserFilePicker limit={LIMIT} options={options} onConfirm={onConfirm}>
          <button type="button">{TRIGGER}</button>
        </UserFilePicker>
      </StorageProvider>
    </QueryClientProvider>,
  );
  await user.click(screen.getByRole("button", { name: TRIGGER }));
  await screen.findByText(FIRST.name);
  return user;
}

const confirmButton = (name: string = UserFilePickerLabel.CONFIRM) =>
  screen.getByRole("button", { name });

describe("UserFilePicker", () => {
  beforeEach(() => {
    vi.mocked(apiClient.get).mockImplementation(async (url) => ({
      data: url === GROUPS_URL ? { items: [GROUP], total: 1 } : TREE,
    }));
  });
  afterEach(() => vi.restoreAllMocks());

  it("lists the files of the group without confirming them", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    await openDialog(onConfirm);

    expect(apiClient.get).toHaveBeenCalledWith(GROUPS_URL, {
      baseURL: STORAGE_API_BASE_URL,
      params: {
        limit: JSON.stringify(LIMIT),
        page: 1,
        pageSize: 100,
      },
    });
    expect(apiClient.get).toHaveBeenCalledWith(
      `/folders/${ROOT_FOLDER.id}/tree`,
      { baseURL: STORAGE_API_BASE_URL },
    );
    expect(screen.getByText(SECOND.name)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(confirmButton()).toBeDisabled();
  });

  it("confirms every selected file, then closes", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const user = await openDialog(onConfirm);

    await user.click(screen.getByRole("checkbox", { name: FIRST.name }));
    await user.click(screen.getByRole("checkbox", { name: SECOND.name }));
    await user.click(confirmButton());

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([FIRST, SECOND]));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("uses the labels and filter from options", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    await openDialog(onConfirm, {
      accept: { "image/*": [] },
      title: "Pick an image",
      confirmLabel: "Use it",
    });

    expect(screen.queryByText(SECOND.name)).not.toBeInTheDocument();
    expect(
      screen.getByRole("heading", { name: "Pick an image" }),
    ).toBeInTheDocument();
    expect(confirmButton("Use it")).toBeInTheDocument();
  });

  it("shows a toast and stays open when confirming fails", async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error("failed"));
    const toastError = vi.spyOn(toast, "error");
    const user = await openDialog(onConfirm);

    await user.click(screen.getByRole("checkbox", { name: FIRST.name }));
    await user.click(confirmButton());

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        UserFilePickerLabel.CONFIRM_FAILED,
      ),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByRole("checkbox", { name: FIRST.name })).toBeChecked();
  });
});
