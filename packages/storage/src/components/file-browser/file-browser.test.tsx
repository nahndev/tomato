import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import {
  fireEvent,
  render,
  screen,
  waitFor,
  within,
} from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import type { AxiosInstance } from "axios";
import { GroupType } from "@tomato/constants";
import type {
  StorageFile,
  StorageFolderTree,
  StorageGroup,
} from "@tomato/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import { createStorageApi, type StorageApi } from "../../storage.api";
import { DEFAULT_FILE_BROWSER_LABELS as LABELS } from "../../storage.constants";
import type {
  FileBrowserOptions,
  StorageGroupOwner,
} from "../../storage.types";
import { FileBrowser } from "./file-browser";
import {
  FileBrowserProvider,
  FileBrowserProviderMissingError,
} from "./file-browser-provider";

vi.mock("../../storage.api");

const API_CLIENT = {} as AxiosInstance;
const PATH = "/rest/storage";
const api = {
  listGroups: vi.fn<StorageApi["listGroups"]>(),
  getFolderTree: vi.fn<StorageApi["getFolderTree"]>(),
  createFolder: vi.fn<StorageApi["createFolder"]>(),
  updateFolder: vi.fn<StorageApi["updateFolder"]>(),
  deleteFolder: vi.fn<StorageApi["deleteFolder"]>(),
  uploadFile: vi.fn<StorageApi["uploadFile"]>(),
  updateFile: vi.fn<StorageApi["updateFile"]>(),
  deleteFile: vi.fn<StorageApi["deleteFile"]>(),
  getFileContentUrl: vi.fn<StorageApi["getFileContentUrl"]>(),
};

const OWNER: StorageGroupOwner = { type: GroupType.USER, uuid: "user" };
const OTHER_OWNER: StorageGroupOwner = {
  type: GroupType.DEPARTMENT,
  uuid: "department",
};
const ROOT_ID = "root";
const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function makeFile(id: string, mimeType: string, folderId = ROOT_ID): StorageFile {
  return { id, folderId, name: id, mimeType, size: 1, ...TIMESTAMPS };
}

const IMAGE = makeFile("image.png", "image/png");
const PDF = makeFile("doc.pdf", "application/pdf");
const NESTED = makeFile("nested.png", "image/png", "sub");
const ROOT_FOLDER = { id: ROOT_ID, parentId: null, name: "root", ...TIMESTAMPS };
const GROUP: StorageGroup = {
  id: "group",
  ...OWNER,
  label: "Me",
  rootFolder: ROOT_FOLDER,
  ...TIMESTAMPS,
};
const OTHER_GROUP: StorageGroup = {
  id: "other-group",
  ...OTHER_OWNER,
  label: "Sales",
  rootFolder: { ...ROOT_FOLDER, id: "other-root" },
  ...TIMESTAMPS,
};
const TREE: StorageFolderTree = {
  folders: [
    ROOT_FOLDER,
    { id: "sub", parentId: ROOT_ID, name: "sub", ...TIMESTAMPS },
  ],
  files: [IMAGE, PDF, NESTED],
};

function renderBrowser(props: {
  owners?: StorageGroupOwner[];
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void;
  options?: FileBrowserOptions;
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FileBrowserProvider apiClient={API_CLIENT} path={PATH}>
        <FileBrowser owners={[OWNER]} {...props} />
      </FileBrowserProvider>
    </QueryClientProvider>,
  );
}

function fileInput(container: HTMLElement) {
  const input = container.querySelector<HTMLInputElement>("input[type=file]");
  if (!input) throw new Error("File input not found");
  return input;
}

const submitButton = () => screen.getByRole("button", { name: LABELS.submit });

describe("FileBrowser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    vi.mocked(createStorageApi).mockReturnValue(api);
    api.listGroups.mockImplementation(async ({ type }) =>
      type === GROUP.type ? [GROUP] : [OTHER_GROUP],
    );
    api.getFolderTree.mockResolvedValue(TREE);
    api.getFileContentUrl.mockImplementation((id) => `/content/${id}`);
  });

  it("needs a FileBrowserProvider", () => {
    vi.spyOn(console, "error").mockImplementation(() => {});

    expect(() =>
      render(
        <QueryClientProvider client={new QueryClient()}>
          <FileBrowser owners={[OWNER]} />
        </QueryClientProvider>,
      ),
    ).toThrow(FileBrowserProviderMissingError);
  });

  it("builds the api from the provider's client and path", async () => {
    renderBrowser({});

    await screen.findByText(IMAGE.name);
    expect(createStorageApi).toHaveBeenCalledWith(API_CLIENT, PATH);
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
    api.uploadFile.mockResolvedValue(IMAGE);
    renderBrowser({});
    await screen.findByText(IMAGE.name);

    const upload = new File(["x"], "new.png", { type: "image/png" });
    await user.upload(fileInput(document.body), upload);

    await waitFor(() =>
      expect(api.uploadFile).toHaveBeenCalledWith(
        ROOT_ID,
        upload,
        expect.any(Function),
      ),
    );
    await waitFor(() => expect(api.getFolderTree).toHaveBeenCalledTimes(2));
  });

  it("creates a folder inside the opened folder", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await user.click(await screen.findByRole("button", { name: "sub" }));
    await user.click(screen.getByRole("button", { name: LABELS.newFolder }));
    await user.type(screen.getByRole("textbox", { name: LABELS.name }), "docs");
    await user.click(screen.getByRole("button", { name: LABELS.save }));

    await waitFor(() =>
      expect(api.createFolder).toHaveBeenCalledWith("sub", "docs"),
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
      expect(api.updateFile).toHaveBeenCalledWith(PDF.id, {
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

    await waitFor(() => expect(api.deleteFile).toHaveBeenCalledWith(PDF.id));
    await waitFor(() => expect(api.deleteFolder).toHaveBeenCalledWith("sub"));
  });

  it("expands folders in place and keeps the rest of the tree", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await screen.findByText(IMAGE.name);
    expect(screen.queryByText(NESTED.name)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Expand: sub" }));
    expect(screen.getByText(NESTED.name)).toBeInTheDocument();
    expect(screen.getByText(IMAGE.name)).toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: "Collapse: sub" }));
    expect(screen.queryByText(NESTED.name)).not.toBeInTheDocument();
  });

  it("targets the root again after collapsing the opened folder", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await user.click(await screen.findByRole("button", { name: "sub" }));
    await user.click(screen.getByRole("button", { name: "Collapse: sub" }));
    await user.click(screen.getByRole("button", { name: LABELS.newFolder }));
    await user.type(screen.getByRole("textbox", { name: LABELS.name }), "docs");
    await user.click(screen.getByRole("button", { name: LABELS.save }));

    await waitFor(() =>
      expect(api.createFolder).toHaveBeenCalledWith(ROOT_ID, "docs"),
    );
  });

  it("finds matches inside collapsed folders", async () => {
    const user = userEvent.setup();
    renderBrowser({});
    await screen.findByText(IMAGE.name);

    await user.type(
      screen.getByRole("textbox", { name: LABELS.search }),
      "nested",
    );

    expect(screen.getByText(NESTED.name)).toBeInTheDocument();
    expect(screen.getByText("sub")).toBeInTheDocument();
    expect(screen.queryByText(IMAGE.name)).not.toBeInTheDocument();
  });

  it("lists the groups in the sidebar and marks the active one", async () => {
    renderBrowser({ owners: [OWNER, OTHER_OWNER] });

    await screen.findByText(IMAGE.name);
    expect(api.listGroups).toHaveBeenCalledWith(OWNER);
    expect(api.listGroups).toHaveBeenCalledWith(OTHER_OWNER);
    const sidebar = screen.getByRole("navigation", { name: LABELS.groups });
    expect(
      within(sidebar).getByRole("button", { name: GROUP.label }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(sidebar).getByRole("button", { name: OTHER_GROUP.label }),
    ).not.toHaveAttribute("aria-current");
  });

  it("shows the sidebar with a single group", async () => {
    renderBrowser({});

    await screen.findByText(IMAGE.name);
    expect(
      screen.getByRole("navigation", { name: LABELS.groups }),
    ).toBeInTheDocument();
  });

  it("switches group from the sidebar and resets the selection", async () => {
    const user = userEvent.setup();
    const onChangeValue = vi.fn();
    api.getFolderTree.mockImplementation(async (id) => ({
      folders: [],
      files: [makeFile(IMAGE.name, IMAGE.mimeType, id)],
    }));
    renderBrowser({ owners: [OWNER, OTHER_OWNER], onChangeValue });

    await user.click(await screen.findByRole("checkbox", { name: IMAGE.name }));
    await user.click(screen.getByRole("button", { name: OTHER_GROUP.label }));

    await waitFor(() =>
      expect(api.getFolderTree).toHaveBeenCalledWith(OTHER_GROUP.rootFolder.id),
    );
    expect(
      await screen.findByRole("checkbox", { name: IMAGE.name }),
    ).not.toBeChecked();
    expect(submitButton()).toBeDisabled();
  });

  it.each([
    ["the groups", () => api.listGroups.mockRejectedValueOnce(new Error("failed"))],
    ["no group", () => api.listGroups.mockResolvedValueOnce([])],
    ["the tree", () => api.getFolderTree.mockRejectedValueOnce(new Error("failed"))],
  ])("shows an error when loading %s fails, then retries", async (_, arrange) => {
    const user = userEvent.setup();
    arrange();
    renderBrowser({});

    expect(await screen.findByRole("alert")).toHaveTextContent(LABELS.loadFailed);

    await user.click(screen.getByRole("button", { name: LABELS.retry }));
    expect(await screen.findByText(IMAGE.name)).toBeInTheDocument();
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });

  it.each([
    ["the groups", () => api.listGroups.mockReturnValue(new Promise(() => {}))],
    ["the tree", () => api.getFolderTree.mockReturnValue(new Promise(() => {}))],
  ])("shows a placeholder while loading %s", async (_, arrange) => {
    arrange();
    renderBrowser({});

    expect(
      await screen.findByRole("status", { name: LABELS.loading }),
    ).toBeInTheDocument();
  });

  it("previews only images", async () => {
    const { container } = renderBrowser({});
    await screen.findByText(IMAGE.name);

    const sources = [...container.querySelectorAll("img")].map((image) =>
      image.getAttribute("src"),
    );
    expect(sources).toEqual([`/content/${IMAGE.id}`]);
  });

  it("falls back to an icon when a preview cannot be loaded", async () => {
    const { container } = renderBrowser({});
    await screen.findByText(IMAGE.name);

    const image = container.querySelector("img");
    if (!image) throw new Error("Image not found");
    fireEvent.error(image);

    expect(container.querySelector("img")).not.toBeInTheDocument();
  });

  it("offers to clear a search with no match", async () => {
    const user = userEvent.setup();
    renderBrowser({});
    await screen.findByText(IMAGE.name);

    await user.type(
      screen.getByRole("textbox", { name: LABELS.search }),
      "missing",
    );
    expect(screen.getByText(LABELS.noResults)).toBeInTheDocument();
    expect(screen.queryByText(LABELS.empty)).not.toBeInTheDocument();

    await user.click(screen.getByRole("button", { name: LABELS.clearSearch }));
    expect(screen.getByText(IMAGE.name)).toBeInTheDocument();
  });

  it("tells an empty group from an empty folder", async () => {
    const user = userEvent.setup();
    api.getFolderTree.mockResolvedValue({ ...TREE, files: [IMAGE] });
    renderBrowser({});

    await user.click(await screen.findByRole("button", { name: "sub" }));
    expect(screen.getByText(LABELS.emptyFolder)).toBeInTheDocument();
    expect(screen.queryByText(LABELS.empty)).not.toBeInTheDocument();
  });

  it("shows where uploads go", async () => {
    const user = userEvent.setup();
    renderBrowser({});

    await user.click(await screen.findByRole("button", { name: "sub" }));
    expect(screen.getByLabelText(LABELS.location)).toHaveTextContent(
      `${LABELS.root} / sub`,
    );
  });

  it("summarizes the selection and clears it", async () => {
    const user = userEvent.setup();
    renderBrowser({ onChangeValue: vi.fn() });

    await user.click(await screen.findByRole("checkbox", { name: IMAGE.name }));
    expect(screen.getAllByText(IMAGE.name)).toHaveLength(2);

    await user.click(screen.getByRole("checkbox", { name: PDF.name }));
    expect(screen.getByText("2 files selected")).toBeInTheDocument();

    await user.click(
      screen.getByRole("button", { name: LABELS.clearSelection }),
    );
    expect(screen.getByText(LABELS.noSelection)).toBeInTheDocument();
    expect(submitButton()).toBeDisabled();
  });

  it("shows the progress of each upload and removes it when done", async () => {
    const user = userEvent.setup();
    let finishUpload = () => {};
    api.uploadFile.mockImplementation((_folderId, _file, onProgress) => {
      onProgress?.(0.5);
      return new Promise((resolve) => {
        finishUpload = () => resolve(IMAGE);
      });
    });
    const { container } = renderBrowser({});
    await screen.findByText(IMAGE.name);

    await user.upload(
      fileInput(container),
      new File(["x"], "new.png", { type: "image/png" }),
    );

    const progress = await screen.findByRole("progressbar", { name: "new.png" });
    expect(progress).toHaveAttribute("aria-valuenow", "50");

    finishUpload();
    await waitFor(() =>
      expect(screen.queryByRole("progressbar")).not.toBeInTheDocument(),
    );
  });

  it("names the failed upload until it is dismissed", async () => {
    const user = userEvent.setup();
    api.uploadFile.mockRejectedValue(new Error("failed"));
    const { container } = renderBrowser({});
    await screen.findByText(IMAGE.name);

    await user.upload(
      fileInput(container),
      new File(["x"], "new.png", { type: "image/png" }),
    );

    expect(await screen.findByRole("alert")).toHaveTextContent(
      LABELS.uploadFailed,
    );
    await user.click(
      screen.getByRole("button", { name: `${LABELS.dismiss}: new.png` }),
    );
    expect(screen.queryByText("new.png")).not.toBeInTheDocument();
  });

  it("shows a dismissible banner when an action fails", async () => {
    const user = userEvent.setup();
    api.createFolder.mockRejectedValue(new Error("failed"));
    renderBrowser({});

    await user.click(
      await screen.findByRole("button", { name: LABELS.newFolder }),
    );
    await user.type(screen.getByRole("textbox", { name: LABELS.name }), "docs");
    await user.click(screen.getByRole("button", { name: LABELS.save }));

    expect(await screen.findByRole("alert")).toHaveTextContent(
      LABELS.actionFailed,
    );
    await user.click(screen.getByRole("button", { name: LABELS.dismiss }));
    expect(screen.queryByRole("alert")).not.toBeInTheDocument();
  });
});
