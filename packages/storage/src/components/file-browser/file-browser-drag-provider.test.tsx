import type { DragEndEvent } from "@dnd-kit/react";
import { act, render } from "@testing-library/react";
import type { ComponentProps, ReactNode } from "react";
import { describe, expect, it, vi } from "vitest";
import {
  FileBrowserItemType,
  ROOT_DROP_TARGET_ID,
} from "../../storage.constants";
import type { FileBrowserItem } from "../../storage.types";
import { FileBrowserDragProvider } from "./file-browser-drag-provider";

let endDrag: (event: DragEndEvent) => void = () => {};

vi.mock("@dnd-kit/react", async (importActual) => ({
  ...(await importActual<typeof import("@dnd-kit/react")>()),
  DragDropProvider: ({
    onDragEnd,
    children,
  }: {
    onDragEnd: (event: DragEndEvent) => void;
    children: ReactNode;
  }) => {
    endDrag = onDragEnd;
    return children;
  },
}));

const FILE: FileBrowserItem = {
  id: "file",
  name: "file",
  parentId: "folder",
  type: FileBrowserItemType.FILE,
};
const FOLDER: FileBrowserItem = {
  id: "folder",
  name: "folder",
  parentId: null,
  type: FileBrowserItemType.FOLDER,
};
const OTHER: FileBrowserItem = { ...FOLDER, id: "other", name: "other" };

function drop(sourceId: string, targetId: string | null, canceled = false) {
  const onMove =
    vi.fn<ComponentProps<typeof FileBrowserDragProvider>["onMove"]>();
  render(
    <FileBrowserDragProvider items={[FILE, FOLDER, OTHER]} onMove={onMove}>
      {null}
    </FileBrowserDragProvider>,
  );
  act(() =>
    endDrag({
      canceled,
      operation: {
        source: { id: sourceId },
        target: targetId === null ? null : { id: targetId },
      },
    } as unknown as DragEndEvent),
  );
  return onMove;
}

describe("FileBrowserDragProvider", () => {
  it("moves an item into the folder it is dropped on", () => {
    expect(drop(FILE.id, OTHER.id)).toHaveBeenCalledExactlyOnceWith(
      FILE,
      OTHER.id,
    );
  });

  it("moves an item to the root when dropped outside any folder", () => {
    expect(drop(FILE.id, ROOT_DROP_TARGET_ID)).toHaveBeenCalledExactlyOnceWith(
      FILE,
      null,
    );
  });

  it("does not move onto an invalid target", () => {
    expect(drop(FILE.id, FOLDER.id)).not.toHaveBeenCalled();
  });

  it("does not move when canceled", () => {
    expect(drop(FILE.id, OTHER.id, true)).not.toHaveBeenCalled();
  });

  it("does not move when dropped outside the tree", () => {
    expect(drop(FILE.id, null)).not.toHaveBeenCalled();
  });
});
