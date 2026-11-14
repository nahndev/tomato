import { WidgetType } from "@tomato/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { FileUploaderWidgetItem } from "./file-uploader-widget-item";

const PICKED = [{ id: "file-b" }, { id: "file-c" }];

vi.mock("@/modules/file", () => ({
  UserFilePicker: ({ children, onConfirm }: { children: ReactNode; onConfirm: (files: unknown[]) => void }) => (
    <>
      {children}
      <button type="button" onClick={() => onConfirm(PICKED)}>
        Confirm
      </button>
    </>
  ),
}));

vi.mock("@tomato/storage-ui", () => ({
  StorageFileList: ({ ids, onRemove }: { ids: string[]; onRemove?: (id: string) => void }) => (
    <ul>
      {ids.map((id) => (
        <li key={id}>
          {id}
          {onRemove && (
            <button type="button" onClick={() => onRemove(id)}>
              Remove {id}
            </button>
          )}
        </li>
      ))}
    </ul>
  ),
}));

const WIDGET = { id: "attachments", type: WidgetType.FILE_UPLOADER, label: "Attachments" };

describe("FileUploaderWidgetItem", () => {
  it("lists the file ids and drops legacy metadata", () => {
    render(<FileUploaderWidgetItem widget={WIDGET} value={["file-a", { name: "old.pdf" }] as string[]} />);

    expect(screen.getAllByRole("listitem").map((item) => item.textContent)).toEqual(["file-a"]);
  });

  it("adds the picked files once each", async () => {
    const onChange = vi.fn();
    render(<FileUploaderWidgetItem widget={WIDGET} value={["file-a", "file-b"]} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onChange).toHaveBeenCalledWith(["file-a", "file-b", "file-c"]);
  });

  it("removes a file", async () => {
    const onChange = vi.fn();
    render(<FileUploaderWidgetItem widget={WIDGET} value={["file-a", "file-b"]} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Remove file-a" }));

    expect(onChange).toHaveBeenCalledWith(["file-b"]);
  });

  it("is read-only without onChange", () => {
    render(<FileUploaderWidgetItem widget={WIDGET} value={["file-a"]} />);

    expect(screen.getByRole("button", { name: "Add files" })).toBeDisabled();
    expect(screen.queryByRole("button", { name: "Remove file-a" })).not.toBeInTheDocument();
  });
});
