import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupType } from "@tomato/constants";
import type { StorageFile, StorageGroupDetail } from "@tomato/types";
import { toast } from "@tomato/ui";
import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { UserFilePickerLabel } from "../file.constants";
import { getStorageGroup } from "../services/storage.service";
import { UserFilePicker, type UserFilePickerOptions } from "./user-file-picker";

vi.mock("../services/storage.service");

const TRIGGER = "Open";
const OWNER = { type: GroupType.USER, uuid: "user" };
const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function makeFile(name: string, mimeType: string): StorageFile {
  return { id: name, folderId: "root", name, mimeType, size: 1, ...TIMESTAMPS };
}

const FIRST = makeFile("first.png", "image/png");
const SECOND = makeFile("second.pdf", "application/pdf");
const GROUP: StorageGroupDetail = {
  id: "group",
  ...OWNER,
  folderId: "root",
  ...TIMESTAMPS,
  folders: [{ id: "root", parentId: null, name: "root", ...TIMESTAMPS }],
  files: [FIRST, SECOND],
};

async function openDialog(
  onConfirm: (files: StorageFile[]) => Promise<void>,
  options?: UserFilePickerOptions,
) {
  const user = userEvent.setup();
  render(
    <QueryClientProvider client={new QueryClient()}>
      <UserFilePicker group={OWNER} options={options} onConfirm={onConfirm}>
        <button type="button">{TRIGGER}</button>
      </UserFilePicker>
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
    vi.mocked(getStorageGroup).mockResolvedValue(GROUP);
  });
  afterEach(() => vi.restoreAllMocks());

  it("lists the files of the group without confirming them", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    await openDialog(onConfirm);

    expect(getStorageGroup).toHaveBeenCalledWith(OWNER);
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
    expect(screen.getByText(FIRST.name)).toBeInTheDocument();
  });
});
