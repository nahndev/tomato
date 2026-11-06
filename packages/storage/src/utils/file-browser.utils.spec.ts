import { GroupType } from "@tomato/constants";
import type { StorageGroupDetail } from "@tomato/types";
import { describe, expect, it } from "vitest";
import { FileBrowserItemType } from "../storage.constants";
import type { FileBrowserItem } from "../storage.types";
import {
  canMoveTo,
  getFolderPath,
  getTreeNodes,
  matchesAccept,
  toBrowserItems,
} from "./file-browser.utils";

const DATE = "2026-11-06T00:00:00.000Z";
const TIMESTAMPS = { createdAt: DATE, updatedAt: DATE };

function folder(id: string, parentId: string | null): FileBrowserItem {
  return { id, name: id, parentId, type: FileBrowserItemType.FOLDER };
}

describe("toBrowserItems", () => {
  it("hides the root folder and maps its children to a null parent", () => {
    const group: StorageGroupDetail = {
      id: "group",
      type: GroupType.USER,
      uuid: "user",
      folderId: "root",
      ...TIMESTAMPS,
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
      toBrowserItems(group).map(({ id, parentId }) => [id, parentId]),
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
