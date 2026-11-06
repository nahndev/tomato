import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { render, screen, waitFor, within } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { GroupType } from "@tomato/constants";
import type { StorageFile, StorageGroupDetail } from "@tomato/types";
import { beforeEach, describe, expect, it, vi } from "vitest";
import type { StorageApi } from "../../storage.api";
import { DEFAULT_FILE_BROWSER_LABELS as LABELS } from "../../storage.constants";
import type { FileBrowserGroup, FileBrowserOptions } from "../../storage.types";
import { FileBrowser } from "./file-browser";

const api = {
  getGroup: vi.fn<StorageApi["getGroup"]>(),
  createFolder: vi.fn<StorageApi["createFolder"]>(),
  updateFolder: vi.fn<StorageApi["updateFolder"]>(),
  deleteFolder: vi.fn<StorageApi["deleteFolder"]>(),
  uploadFile: vi.fn<StorageApi["uploadFile"]>(),
  updateFile: vi.fn<StorageApi["updateFile"]>(),
  deleteFile: vi.fn<StorageApi["deleteFile"]>(),
  downloadFile: vi.fn<StorageApi["downloadFile"]>(),
};

const OWNER: FileBrowserGroup = {
  type: GroupType.USER,
  uuid: "user",
  label: "Me",
};
const OTHER_OWNER: FileBrowserGroup = {
  type: GroupType.DEPARTMENT,
  uuid: "department",
  label: "Sales",
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
const GROUP: StorageGroupDetail = {
  id: "group",
  type: OWNER.type,
  uuid: OWNER.uuid,
  folderId: ROOT_ID,
  ...TIMESTAMPS,
  folders: [
    { id: ROOT_ID, parentId: null, name: "root", ...TIMESTAMPS },
    { id: "sub", parentId: ROOT_ID, name: "sub", ...TIMESTAMPS },
  ],
  files: [IMAGE, PDF, NESTED],
};

function renderBrowser(props: {
  groups?: FileBrowserGroup[];
  value?: StorageFile[];
  onChangeValue?: (files: StorageFile[]) => void;
  options?: FileBrowserOptions;
}) {
  const client = new QueryClient({
    defaultOptions: { queries: { retry: false } },
  });
  return render(
    <QueryClientProvider client={client}>
      <FileBrowser api={api} groups={[OWNER]} {...props} />
    </QueryClientProvider>,
  );
}

const submitButton = () => screen.getByRole("button", { name: LABELS.submit });

describe("FileBrowser", () => {
  beforeEach(() => {
    vi.resetAllMocks();
    api.getGroup.mockResolvedValue(GROUP);
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
    const input = document.querySelector<HTMLInputElement>("input[type=file]");
    if (!input) throw new Error("File input not found");
    await user.upload(input, upload);

    await waitFor(() =>
      expect(api.uploadFile).toHaveBeenCalledWith(ROOT_ID, upload),
    );
    await waitFor(() => expect(api.getGroup).toHaveBeenCalledTimes(2));
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
    renderBrowser({ groups: [OWNER, OTHER_OWNER] });

    await screen.findByText(IMAGE.name);
    const sidebar = screen.getByRole("navigation", { name: LABELS.groups });
    expect(
      within(sidebar).getByRole("button", { name: OWNER.label }),
    ).toHaveAttribute("aria-current", "true");
    expect(
      within(sidebar).getByRole("button", { name: OTHER_OWNER.label }),
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
    renderBrowser({ groups: [OWNER, OTHER_OWNER], onChangeValue });

    await user.click(await screen.findByRole("checkbox", { name: IMAGE.name }));
    await user.click(screen.getByRole("button", { name: OTHER_OWNER.label }));

    await waitFor(() =>
      expect(api.getGroup).toHaveBeenCalledWith(OTHER_OWNER),
    );
    expect(
      await screen.findByRole("checkbox", { name: IMAGE.name }),
    ).not.toBeChecked();
    expect(submitButton()).toBeDisabled();
  });

  it("shows an error when the group cannot be loaded", async () => {
    api.getGroup.mockRejectedValue(new Error("failed"));
    renderBrowser({});

    expect(await screen.findByRole("alert")).toHaveTextContent(LABELS.loadFailed);
  });
});
