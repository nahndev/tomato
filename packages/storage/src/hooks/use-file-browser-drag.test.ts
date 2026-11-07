import type { DragEndEvent, DragStartEvent } from "@dnd-kit/react";
import { act, renderHook } from "@testing-library/react";
import { describe, expect, it, vi } from "vitest";
import { FileBrowserItemType, ROOT_DROP_TARGET_ID } from "../storage.constants";
import type { FileBrowserItem } from "../storage.types";
import { useFileBrowserDrag } from "./use-file-browser-drag";

function makeItem(
  id: string,
  parentId: string | null,
  type: FileBrowserItemType = FileBrowserItemType.FOLDER,
) {
  return { id, parentId, type, name: id } as FileBrowserItem;
}

const PARENT = makeItem("parent", null);
const CHILD = makeItem("child", "parent");
const OTHER = makeItem("other", null);
const FILE = makeItem("file", "child", FileBrowserItemType.FILE);
const ITEMS = [PARENT, CHILD, OTHER, FILE];

function setup() {
  const onMove = vi.fn();
  const { result } = renderHook(() => useFileBrowserDrag(ITEMS, onMove));

  function drop(sourceId: string, targetId: string | null, canceled = false) {
    act(() =>
      result.current.dragDropProps.onDragEnd({
        canceled,
        operation: {
          source: { id: sourceId },
          target: targetId === null ? null : { id: targetId },
        },
      } as unknown as DragEndEvent),
    );
  }

  function start(sourceId: string) {
    act(() =>
      result.current.dragDropProps.onDragStart({
        operation: { source: { id: sourceId } },
      } as unknown as DragStartEvent),
    );
  }

  return { result, onMove, drop, start };
}

describe("useFileBrowserDrag", () => {
  it("moves an item into the folder it is dropped on", () => {
    const { onMove, drop } = setup();

    drop(FILE.id, OTHER.id);

    expect(onMove).toHaveBeenCalledExactlyOnceWith(FILE, OTHER.id);
  });

  it("moves an item to the root when dropped outside any folder", () => {
    const { onMove, drop } = setup();

    drop(FILE.id, ROOT_DROP_TARGET_ID);

    expect(onMove).toHaveBeenCalledExactlyOnceWith(FILE, null);
  });

  it.each([
    ["its current parent", CHILD.id, PARENT.id],
    ["itself", PARENT.id, PARENT.id],
    ["a descendant", PARENT.id, CHILD.id],
    ["the root it is already in", OTHER.id, ROOT_DROP_TARGET_ID],
  ])("does not move an item onto %s", (_, sourceId, targetId) => {
    const { onMove, drop } = setup();

    drop(sourceId, targetId);

    expect(onMove).not.toHaveBeenCalled();
  });

  it("does not move when canceled or dropped outside the tree", () => {
    const { onMove, drop } = setup();

    drop(FILE.id, OTHER.id, true);
    drop(FILE.id, null);

    expect(onMove).not.toHaveBeenCalled();
  });

  it("allows only valid targets while dragging", () => {
    const { result, start, drop } = setup();
    expect(result.current.canDropOn(OTHER.id)).toBe(false);

    start(PARENT.id);
    expect(result.current.canDropOn(OTHER.id)).toBe(true);
    expect(result.current.canDropOn(CHILD.id)).toBe(false);
    expect(result.current.canDropOn(null)).toBe(false);

    drop(PARENT.id, CHILD.id);
    expect(result.current.canDropOn(OTHER.id)).toBe(false);
  });
});
