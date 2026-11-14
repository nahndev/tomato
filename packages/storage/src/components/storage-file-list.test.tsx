import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosInstance } from "axios";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStorageApi, type StorageApi } from "../storage.api";
import type { StorageFile } from "../storage.types";
import { FileBrowserProvider } from "./file-browser/file-browser-provider";
import { StorageFileList } from "./storage-file-list";

vi.mock("../storage.api");

const DATE = "2026-11-06T00:00:00.000Z";
const IMAGE: StorageFile = {
  id: "image",
  folderId: "root",
  name: "photo.png",
  mimeType: "image/png",
  size: 2048,
  createdAt: DATE,
  updatedAt: DATE,
};
const PDF: StorageFile = { ...IMAGE, id: "pdf", name: "report.pdf", mimeType: "application/pdf" };

const api = {
  listFiles: vi.fn<StorageApi["listFiles"]>(),
  getFileContentUrl: vi.fn<StorageApi["getFileContentUrl"]>(),
};

function renderList(ids: string[], onRemove?: (id: string) => void) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false } } });
  return render(
    <QueryClientProvider client={client}>
      <FileBrowserProvider apiClient={{} as AxiosInstance} path="/rest/storage">
        <StorageFileList ids={ids} onRemove={onRemove} />
      </FileBrowserProvider>
    </QueryClientProvider>,
  );
}

describe("StorageFileList", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(createStorageApi).mockReturnValue(api as unknown as StorageApi);
    api.listFiles.mockResolvedValue([PDF, IMAGE]);
    api.getFileContentUrl.mockImplementation((id, variant) => (variant ? `/content/${id}?variant=${variant}` : `/content/${id}`));
  });

  it("loads every file in one request and keeps the order of the ids", async () => {
    renderList([IMAGE.id, PDF.id]);

    expect(screen.getAllByLabelText("Loading files")).toHaveLength(2);
    const links = await screen.findAllByRole("link");
    expect(links.map((link) => link.textContent)).toEqual([
      expect.stringContaining(IMAGE.name),
      expect.stringContaining(PDF.name),
    ]);
    expect(links[0]).toHaveAttribute("href", "/content/image");
    expect(api.listFiles).toHaveBeenCalledTimes(1);
    expect(api.listFiles).toHaveBeenCalledWith([IMAGE.id, PDF.id]);
  });

  it("marks an id the storage does not know as unavailable", async () => {
    renderList([IMAGE.id, "deleted"]);

    expect(await screen.findByText("File not available")).toBeInTheDocument();
    expect(screen.getByText(IMAGE.name)).toBeInTheDocument();
  });

  it("removes a file or an unavailable id", async () => {
    const onRemove = vi.fn();
    renderList([IMAGE.id, "deleted"], onRemove);

    await userEvent.click(await screen.findByRole("button", { name: `${"Remove"} ${IMAGE.name}` }));
    await userEvent.click(screen.getByRole("button", { name: `${"Remove"} ${"File not available"}` }));

    expect(onRemove.mock.calls).toEqual([[IMAGE.id], ["deleted"]]);
  });

  it("previews an image when its row is hovered", async () => {
    renderList([IMAGE.id, PDF.id]);

    await userEvent.hover(await screen.findByText(IMAGE.name));

    expect(await screen.findByRole("img", { name: IMAGE.name })).toHaveAttribute("src", "/content/image?variant=medium");
  });

  it("does not preview a file that is not an image", async () => {
    renderList([PDF.id]);

    await userEvent.hover(await screen.findByText(PDF.name));

    await expect(screen.findByRole("img", {}, { timeout: 1200 })).rejects.toThrow();
  });

  it("has no remove button without onRemove", async () => {
    renderList([IMAGE.id]);

    await screen.findByText(IMAGE.name);
    expect(screen.queryByRole("button")).not.toBeInTheDocument();
  });

  it("renders nothing and loads nothing without ids", () => {
    const { container } = renderList([]);

    expect(container).toBeEmptyDOMElement();
    expect(api.listFiles).not.toHaveBeenCalled();
  });

  it("retries after a failed load", async () => {
    api.listFiles.mockRejectedValueOnce(new Error("down"));
    renderList([IMAGE.id]);

    await userEvent.click(await screen.findByRole("button", { name: "Try again" }));

    expect(await screen.findByText(IMAGE.name)).toBeInTheDocument();
  });
});
