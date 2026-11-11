import { formatBytes } from "@tomato/utils";
import { describe, expect, it } from "vitest";
import { FileBrowserItemType, ROOT_DROP_TARGET_ID } from "../storage.constants";
import type { FileBrowserItem, StorageFolderTree } from "../storage.types";
import {
  canMoveTo,
  findMove,
  getFolderPath,
  getTreeNodes,
  matchesAccept,
  formatFileDetails,
  toBrowserItems,
} from "./file-browser.utils";

const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function folder(id: string, parentId: string | null): FileBrowserItem {
  return { id, name: id, parentId, type: FileBrowserItemType.FOLDER };
}

describe("formatFileDetails", () => {
  it("joins the size and the date", () => {
    const details = formatFileDetails({ size: 1024, updatedAt: DATE });

    expect(details).toContain(formatBytes(1024));
    expect(details).toContain("2026");
  });

  it("skips what is missing", () => {
    expect(formatFileDetails({ size: 1024 })).toBe(formatBytes(1024));
    expect(formatFileDetails({})).toBe("");
  });
});

describe("toBrowserItems", () => {
  it("hides the root folder and maps its children to a null parent", () => {
    const tree: StorageFolderTree = {
      folders: [
        { id: "root", parentId: null, name: "root", ...TIMESTAMPS },
        { id: "a", parentId: "root", name: "a", ...TIMESTAMPS },
        { id: "b", parentId: "a", name: "b", ...TIMESTAMPS },
      ],
      files: [
        {
          id: "f",
          folderId: "root",
          name: "f.png",
          mimeType: "image/png",
          size: 1,
          ...TIMESTAMPS,
        },
      ],
    };

    expect(
      toBrowserItems("root", tree).map(({ id, parentId }) => [id, parentId]),
    ).toEqual([
      ["a", null],
      ["b", "a"],
      ["f", null],
    ]);
  });
});

describe("matchesAccept", () => {
  const image: FileBrowserItem = {
    id: "i",
    name: "photo.PNG",
    parentId: null,
    type: FileBrowserItemType.FILE,
    mimeType: "image/png",
  };

  it("matches by exact type, wildcard or extension", () => {
    expect(matchesAccept(image)).toBe(true);
    expect(matchesAccept(image, { "image/png": [] })).toBe(true);
    expect(matchesAccept(image, { "image/*": [] })).toBe(true);
    expect(matchesAccept(image, { "application/x-any": [".png"] })).toBe(true);
    expect(matchesAccept(image, { "application/pdf": [] })).toBe(false);
  });
});

describe("folder tree helpers", () => {
  const items = [folder("a", null), folder("b", "a"), folder("c", "b")];

  it("builds the path from the root", () => {
    expect(getFolderPath(items, "c").map(({ id }) => id)).toEqual([
      "a",
      "b",
      "c",
    ]);
    expect(getFolderPath(items, null)).toEqual([]);
  });

  it("refuses moves to the current parent or inside itself", () => {
    const [a, b] = items as [FileBrowserItem, FileBrowserItem];
    expect(canMoveTo(items, a, "c")).toBe(false);
    expect(canMoveTo(items, b, "a")).toBe(false);
    expect(canMoveTo(items, b, null)).toBe(true);
  });
});

describe("getTreeNodes", () => {
  const file = (id: string, parentId: string | null): FileBrowserItem => ({
    id,
    name: id,
    parentId,
    type: FileBrowserItemType.FILE,
    mimeType: id.endsWith(".png") ? "image/png" : "application/pdf",
  });
  const items = [
    file("top.pdf", null),
    folder("a", null),
    folder("b", "a"),
    file("deep.png", "b"),
    folder("empty", null),
  ];
  const ids = (nodes: ReturnType<typeof getTreeNodes>) =>
    nodes.map(({ item, depth }) => [item.id, depth]);

  it("shows only the children of expanded folders, folders first", () => {
    expect(
      ids(getTreeNodes(items, { search: "", expandedIds: new Set() })),
    ).toEqual([
      ["a", 0],
      ["empty", 0],
      ["top.pdf", 0],
    ]);
    expect(
      ids(getTreeNodes(items, { search: "", expandedIds: new Set(["a", "b"]) })),
    ).toEqual([
      ["a", 0],
      ["b", 1],
      ["deep.png", 2],
      ["empty", 0],
      ["top.pdf", 0],
    ]);
  });

  it("marks only folders with visible children as expandable", () => {
    const nodes = getTreeNodes(items, { search: "", expandedIds: new Set() });
    expect(nodes.map(({ isExpandable }) => isExpandable)).toEqual([
      true,
      false,
      false,
    ]);
  });

  it("reveals search matches inside collapsed folders", () => {
    const nodes = getTreeNodes(items, {
      search: " DEEP ",
      expandedIds: new Set(),
    });
    expect(ids(nodes)).toEqual([
      ["a", 0],
      ["b", 1],
      ["deep.png", 2],
    ]);
    expect(nodes.some(({ isExpandable }) => isExpandable)).toBe(false);
  });

  it("filters files with accept but keeps folders", () => {
    expect(
      ids(
        getTreeNodes(items, {
          accept: { "image/*": [] },
          search: "",
          expandedIds: new Set(),
        }),
      ),
    ).toEqual([
      ["a", 0],
      ["empty", 0],
    ]);
  });
});

describe("findMove", () => {
  const parent = folder("parent", null);
  const child = folder("child", "parent");
  const other = folder("other", null);
  const items = [parent, child, other];

  it("returns the item and its new parent", () => {
    expect(findMove(items, child.id, other.id)).toEqual({
      item: child,
      parentId: other.id,
    });
  });

  it("maps the root target to a null parent", () => {
    expect(findMove(items, child.id, ROOT_DROP_TARGET_ID)).toEqual({
      item: child,
      parentId: null,
    });
  });

  it.each([
    ["its current parent", child.id, parent.id],
    ["itself", parent.id, parent.id],
    ["a descendant", parent.id, child.id],
    ["the root it is already in", other.id, ROOT_DROP_TARGET_ID],
    ["anything when the item is unknown", "missing", other.id],
  ])("is null onto %s", (_, sourceId, targetId) => {
    expect(findMove(items, sourceId, targetId)).toBeNull();
  });
});
