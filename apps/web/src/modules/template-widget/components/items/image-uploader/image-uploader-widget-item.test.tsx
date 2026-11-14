import { WidgetType } from "@tomato/constants";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import { ImageUploaderWidgetItem } from "./image-uploader-widget-item";

vi.mock("@/modules/file", () => ({
  getFileContentUrl: (id: string) => `/content/${id}`,
  UserFilePicker: ({ children, onConfirm }: { children: ReactNode; onConfirm: (files: unknown[]) => void }) => (
    <>
      {children}
      <button type="button" onClick={() => onConfirm([{ id: "image-b" }])}>
        Confirm
      </button>
    </>
  ),
}));

vi.mock("@tomato/storage-ui", () => ({
  Picture: ({ src }: { src: string }) => <img src={src} alt="" />,
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

const WIDGET = { id: "photo", type: WidgetType.IMAGE_UPLOADER, label: "Photo" };

describe("ImageUploaderWidgetItem", () => {
  it("saves the id of the picked image", async () => {
    const onChange = vi.fn();
    render(<ImageUploaderWidgetItem widget={WIDGET} onChange={onChange} />);

    await userEvent.click(screen.getByRole("button", { name: "Confirm" }));

    expect(onChange).toHaveBeenCalledWith("image-b");
  });

  it("previews the image and removes it", async () => {
    const onChange = vi.fn();
    const { container } = render(<ImageUploaderWidgetItem widget={WIDGET} value="image-a" onChange={onChange} />);

    expect(container.querySelector("img")).toHaveAttribute("src", "/content/image-a");
    await userEvent.click(screen.getByRole("button", { name: "Remove image-a" }));

    expect(onChange).toHaveBeenCalledWith(undefined);
  });

  it("treats a legacy data URL value as empty", () => {
    render(<ImageUploaderWidgetItem widget={WIDGET} value={{ dataUrl: "data:" } as unknown as string} />);

    expect(screen.getByRole("button", { name: "Choose image" })).toBeInTheDocument();
  });

  it("is read-only without onChange", () => {
    render(<ImageUploaderWidgetItem widget={WIDGET} />);

    expect(screen.getByRole("button", { name: "Choose image" })).toBeDisabled();
  });
});
