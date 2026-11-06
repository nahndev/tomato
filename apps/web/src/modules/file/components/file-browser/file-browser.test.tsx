import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupType } from "@tomato/constants";
import type { StorageFile, StorageGroupDetail } from "@tomato/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { DEFAULT_FILE_BROWSER_LABELS as LABELS } from "../../file.constants";
import type { FileBrowserOptions } from "../../file.types";
import {
  createStorageFolder,
  deleteStorageFile,
  deleteStorageFolder,
  getStorageGroup,
  updateStorageFile,
  uploadStorageFile,
} from "../../services/storage.service";
import { FileBrowser } from "./file-browser";

vi.mock("../../services/storage.service");

const OWNER = { type: GroupType.USER, uuid: "user" };
const ROOT_ID = "root";
const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function makeFile(id: string, mimeType: string, folderId = ROOT_ID): StorageFile {
  return { id, folderId, name: id, mimeType, size: 1, ...TIMESTAMPS };
}

const IMAGE = makeFile("image.png", "image/png");
const PDF = makeFile("doc.pdf", "application/pdf");
const GROUP: StorageGroupDetail = {
  id: "group",
  ...OWNER,
  folderId: ROOT_ID,
  ...TIMESTAMPS,
  folders: [
    { id: ROOT_ID, parentId: null, name: "root", ...TIMESTAMPS },
    { id: "sub", parentId: ROOT_ID, name: "sub", ...TIMESTAMPS },
  ],
  files: [IMAGE, PDF],
};

function renderBrowser(props: {
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void;
  options?: FileBrowserOptions;
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FileBrowser group={OWNER} {...props} />
    </QueryClientProvider>,
  );
}

const submitButton = () => screen.getByRole("button", { name: LABELS.submit });

describe("FileBrowser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(getStorageGroup).mockResolvedValue(GROUP);
  });

  it("emits the selection only when submitted", async () => {
    const user = userEvent.setup();
    const onChangeValue = vi.fn();
    renderBrowser({ onChangeValue });

    await user.click(await screen.findByRole("checkbox", { name: IMAGE.name }));
    await user.click(screen.getByRole("checkbox", { name: PDF.name }));
    expect(onChangeValue).not.toHaveBeenCalled();

    await user.click(submitButton());
    expect(onChangeValue).toHaveBeenCalledExactlyOnceWith([IMAGE, PDF]);
  });

  it("starts from value and replaces the selection when not multiple", async () => {
    const user = userEvent.setup();
    const onChangeValue = vi.fn();
    renderBrowser({ value: [IMAGE], onChangeValue, options: { multiple: false } });

    const imageBox = await screen.findByRole("checkbox", { name: IMAGE.name });
    expect(imageBox).toBeChecked();

    await user.click(screen.getByRole("checkbox", { name: PDF.name }));
    expect(imageBox).not.toBeChecked();

    await user.click(submitButton());
    expect(onChangeValue).toHaveBeenCalledExactlyOnceWith([PDF]);
  });

  it("filters files with accept", async () => {
    renderBrowser({ options: { accept: { "image/*": [] } } });

    expect(await screen.findByText(IMAGE.name)).toBeInTheDocument();
    expect(screen.queryByText(PDF.name)).not.toBeInTheDocument();
  });

  it("has no selection or submit button without onChangeValue", async () => {
    renderBrowser({});

    await screen.findByText(IMAGE.name);
    expect(screen.queryByRole("checkbox")).not.toBeInTheDocument();
    expect(
      screen.queryByRole("button", { name: LABELS.submit }),
    ).not.toBeInTheDocument();
  });

  it("uploads into the root folder and reloads the list", async () => {
    const user = userEvent.setup();
    vi.mocked(uploadStorageFile).mockResolvedValue(IMAGE);
    renderBrowser({});
    await screen.findByText(IMAGE.name);

    const upload = new File(["x"], "new.png", { type: "image/png" });
    const input = document.querySelector<HTMLInputElement>("input[type=file]");
    if (!input) throw new Error("File input not found");
    await user.upload(input, upload);

    await waitFor(() =>
      expect(uploadStorageFile).toHaveBeenCalledWith(ROOT_ID, upload),
    );
    await waitFor(() => expect(getStorageGroup).toHaveBeenCalledTimes(2));
  });

  it("creates a folder inside the opened folder", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await user.click(await screen.findByRole("button", { name: "sub" }));
    await user.click(screen.getByRole("button", { name: LABELS.newFolder }));
    await user.type(screen.getByRole("textbox", { name: LABELS.name }), "docs");
    await user.click(screen.getByRole("button", { name: LABELS.save }));

    await waitFor(() =>
      expect(createStorageFolder).toHaveBeenCalledWith("sub", "docs"),
    );
  });

  it("renames a file through the files endpoint", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await user.click(
      await screen.findByRole("button", {
        name: `${LABELS.actions}: ${PDF.name}`,
      }),
    );
    await user.click(screen.getByRole("menuitem", { name: LABELS.rename }));
    const input = screen.getByRole("textbox", { name: LABELS.name });
    await user.clear(input);
    await user.type(input, "renamed.pdf");
    await user.click(screen.getByRole("button", { name: LABELS.save }));

    await waitFor(() =>
      expect(updateStorageFile).toHaveBeenCalledWith(PDF.id, {
        name: "renamed.pdf",
      }),
    );
  });

  it("deletes files and folders through their own endpoints", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    for (const name of [PDF.name, "sub"]) {
      await user.click(
        await screen.findByRole("button", {
          name: `${LABELS.actions}: ${name}`,
        }),
      );
      await user.click(screen.getByRole("menuitem", { name: LABELS.delete }));
      await user.click(
        await screen.findByRole("button", { name: LABELS.delete }),
      );
      await waitFor(() =>
        expect(screen.queryByRole("alertdialog")).not.toBeInTheDocument(),
      );
    }

    await waitFor(() => expect(deleteStorageFile).toHaveBeenCalledWith(PDF.id));
    await waitFor(() => expect(deleteStorageFolder).toHaveBeenCalledWith("sub"));
  });

  it("shows an error when the group cannot be loaded", async () => {
    vi.mocked(getStorageGroup).mockRejectedValue(new Error("failed"));
    renderBrowser({});

    expect(await screen.findByRole("alert")).toHaveTextContent(LABELS.loadFailed);
  });
});
