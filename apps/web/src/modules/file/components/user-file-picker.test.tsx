import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { toast } from "@tomato/ui";
import { afterEach, describe, expect, it, vi } from "vitest";
import { UserFilePickerLabel } from "../file.constants";
import { UserFilePicker, type UserFilePickerOptions } from "./user-file-picker";

const TRIGGER = "Open";
const FIRST = new File(["x"], "first.png", { type: "image/png" });
const SECOND = new File(["x"], "second.pdf", { type: "application/pdf" });

async function openDialog(
  onConfirm: (files: File[]) => Promise<void>,
  options?: UserFilePickerOptions,
) {
  const user = userEvent.setup();
  render(
    <UserFilePicker options={options} onConfirm={onConfirm}>
      <button type="button">{TRIGGER}</button>
    </UserFilePicker>,
  );
  await user.click(screen.getByRole("button", { name: TRIGGER }));
  const input = document.querySelector<HTMLInputElement>("input[type=file]");
  if (!input) throw new Error("File input not found");
  return { user, input };
}

describe("UserFilePicker", () => {
  afterEach(() => vi.restoreAllMocks());

  it("lists uploaded files without confirming them", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { user, input } = await openDialog(onConfirm);

    await user.upload(input, [FIRST, SECOND]);

    expect(await screen.findByText(FIRST.name)).toBeInTheDocument();
    expect(screen.getByText(SECOND.name)).toBeInTheDocument();
    expect(onConfirm).not.toHaveBeenCalled();
    expect(
      screen.getByRole("button", { name: UserFilePickerLabel.CONFIRM }),
    ).toBeDisabled();
  });

  it("confirms every selected file, then closes", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { user, input } = await openDialog(onConfirm);
    await user.upload(input, [FIRST, SECOND]);
    await screen.findByText(FIRST.name);

    await user.click(screen.getByRole("checkbox", { name: FIRST.name }));
    await user.click(screen.getByRole("checkbox", { name: SECOND.name }));
    await user.click(
      screen.getByRole("button", { name: UserFilePickerLabel.CONFIRM }),
    );

    await waitFor(() => expect(onConfirm).toHaveBeenCalledWith([FIRST, SECOND]));
    await waitFor(() =>
      expect(screen.queryByRole("dialog")).not.toBeInTheDocument(),
    );
  });

  it("uses the labels and filter from options", async () => {
    const onConfirm = vi.fn().mockResolvedValue(undefined);
    const { user, input } = await openDialog(onConfirm, {
      accept: { "image/*": [] },
      TITLE: "Pick an image",
      CONFIRM: "Use it",
    });
    await user.upload(input, FIRST);

    expect(await screen.findByText(FIRST.name)).toBeInTheDocument();
    expect(screen.getByRole("heading", { name: "Pick an image" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Use it" })).toBeInTheDocument();
  });

  it("shows a toast and stays open when confirming fails", async () => {
    const onConfirm = vi.fn().mockRejectedValue(new Error("failed"));
    const toastError = vi.spyOn(toast, "error");
    const { user, input } = await openDialog(onConfirm);
    await user.upload(input, FIRST);
    await screen.findByText(FIRST.name);

    await user.click(screen.getByRole("checkbox", { name: FIRST.name }));
    await user.click(
      screen.getByRole("button", { name: UserFilePickerLabel.CONFIRM }),
    );

    await waitFor(() =>
      expect(toastError).toHaveBeenCalledWith(
        UserFilePickerLabel.CONFIRM_FAILED,
      ),
    );
    expect(screen.getByRole("dialog")).toBeInTheDocument();
    expect(screen.getByText(FIRST.name)).toBeInTheDocument();
  });
});
