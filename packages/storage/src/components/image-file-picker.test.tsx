import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStorageApi, type StorageApi } from "../storage.api";
import type { FileBrowserOptions, StorageFile } from "../storage.types";
import { FileBrowserProvider } from "./file-browser/file-browser-provider";
import { ImageFilePicker } from "./image-file-picker";

vi.mock("../storage.api");
vi.mock("./file-browser/file-browser", () => ({
  FileBrowser: ({
    options,
    onChangeValue,
  }: {
    options: FileBrowserOptions;
    onChangeValue: (files: StorageFile[]) => void;
  }) => (
    <button type="button" data-accept={Object.keys(options.accept ?? {}).join()} onClick={() => onChangeValue([{ id: "image-b" } as StorageFile])}>
      Pick
    </button>
  ),
}));

const api = { getFileContentUrl: vi.fn<StorageApi["getFileContentUrl"]>() };

function renderPicker(props: Parameters<typeof ImageFilePicker>[0]) {
  return render(
    <QueryClientProvider client={new QueryClient()}>
      <FileBrowserProvider apiClient={{} as AxiosInstance} path="/rest/storage">
        <ImageFilePicker {...props} />
      </FileBrowserProvider>
    </QueryClientProvider>,
  );
}

describe("ImageFilePicker", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(createStorageApi).mockReturnValue(api as unknown as StorageApi);
    api.getFileContentUrl.mockImplementation((id, variant) => (variant ? `/content/${id}?variant=${variant}` : `/content/${id}`));
  });

  it("picks an image from the placeholder", async () => {
    const onChange = vi.fn();
    renderPicker({ onChange });

    await userEvent.click(screen.getByRole("button", { name: "Choose image" }));
    const pick = screen.getByRole("button", { name: "Pick" });
    expect(pick).toHaveAttribute("data-accept", "image/*");
    await userEvent.click(pick);

    expect(onChange).toHaveBeenCalledWith("image-b");
    expect(screen.queryByRole("dialog")).not.toBeInTheDocument();
  });

  it("expands the image on click and offers upload, download and remove", async () => {
    const onChange = vi.fn();
    const { container } = renderPicker({ value: "image-a", onChange });

    expect(container.querySelector("img")).toHaveAttribute("src", "/content/image-a?variant=medium");
    const download = screen.getByRole("link", { name: "Download image" });
    expect(download).toHaveAttribute("href", "/content/image-a");
    expect(download).toHaveAttribute("download");

    await userEvent.click(screen.getByRole("button", { name: "Expand image" }));
    expect(screen.getByRole("dialog").querySelector('img[src="/content/image-a"]')).toBeInTheDocument();
    await userEvent.keyboard("{Escape}");

    await userEvent.click(screen.getByRole("button", { name: "Upload image" }));
    await userEvent.click(screen.getByRole("button", { name: "Pick" }));
    await userEvent.click(screen.getByRole("button", { name: "Remove image" }));

    expect(onChange.mock.calls).toEqual([["image-b"], [undefined]]);
  });

  it("still expands and downloads when read-only", () => {
    renderPicker({ value: "image-a" });

    expect(screen.getByRole("button", { name: "Expand image" })).toBeInTheDocument();
    expect(screen.getByRole("link", { name: "Download image" })).toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Upload image" })).not.toBeInTheDocument();
    expect(screen.queryByRole("button", { name: "Remove image" })).not.toBeInTheDocument();
  });

  it("disables the placeholder when read-only", () => {
    renderPicker({});

    expect(screen.getByRole("button", { name: "Choose image" })).toBeDisabled();
  });
});
