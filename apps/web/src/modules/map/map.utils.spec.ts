import { getFileContentUrl } from "@/modules/file";
import { CanvasLayerType } from "@tomato/canvas";
import { MAP_FRAME_DEFAULT_SIZE, MapLayerType } from "@tomato/constants";
import type { MapLayer, MapValue } from "@tomato/types";
import { describe, expect, it } from "vitest";
import { fromCanvasValue, shouldSaveNow, toCanvasValue } from "./map.utils";

const image: MapLayer = { type: MapLayerType.IMAGE, id: "image-1", fileId: "file-1", x: 0, y: 0, width: 1, height: 1 };
const pin: MapLayer = { type: MapLayerType.PIN, id: "pin-1", label: "Gate", description: "", x: 0.5, y: 0.5 };
const zone: MapLayer = {
  type: MapLayerType.ZONE,
  id: "zone-1",
  label: "Lobby",
  description: "",
  points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 1 }],
};
const frame = { width: 1080, height: 1080 };
const viewport = { transform: null };

function valueOf(layers: MapLayer[], next: Partial<MapValue> = {}): MapValue {
  return { frame, layers, viewport, ...next };
}

describe("map value", () => {
  it("round-trips through the canvas value with full image URLs and locks", () => {
    const value = valueOf([{ ...image, isLocked: true }, zone, pin]);
    const canvas = toCanvasValue(value, "Map");
    expect(canvas.layers[0]).toMatchObject({ src: getFileContentUrl("file-1"), alt: "Map", isLocked: true });
    expect(fromCanvasValue(canvas)).toEqual(value);
  });

  it("keeps pin and zone colors", () => {
    const value = valueOf([{ ...zone, color: "#22c55e" }, { ...pin, color: "#ef4444" }]);
    expect(fromCanvasValue(toCanvasValue(value, "Map"))).toEqual(value);
  });

  it("uses the default frame for maps saved without one", () => {
    expect(toCanvasValue({ layers: [], viewport }, "Map").frame).toEqual(MAP_FRAME_DEFAULT_SIZE);
  });

  it("drops images that are not storage files", () => {
    const layer = { type: CanvasLayerType.IMAGE, id: "image-2", src: "https://example.com/a.png", x: 0, y: 0, width: 1, height: 1 };
    expect(fromCanvasValue({ frame, layers: [layer], viewport }).layers).toEqual([]);
  });
});

describe("shouldSaveNow", () => {
  it("debounces moves", () => {
    expect(shouldSaveNow(valueOf([image, pin]), valueOf([{ ...image, x: 0.2 }, { ...pin, y: 0.1 }]))).toBe(false);
  });

  it("saves added, deleted, locked and renamed layers at once", () => {
    expect(shouldSaveNow(valueOf([image]), valueOf([image, pin]))).toBe(true);
    expect(shouldSaveNow(valueOf([image, pin]), valueOf([image]))).toBe(true);
    expect(shouldSaveNow(valueOf([image]), valueOf([{ ...image, isLocked: true }]))).toBe(true);
    expect(shouldSaveNow(valueOf([pin]), valueOf([{ ...pin, label: "Door" }]))).toBe(true);
    expect(shouldSaveNow(valueOf([zone]), valueOf([{ ...zone, label: "Hall" }]))).toBe(true);
  });

  it("saves frame changes at once", () => {
    expect(shouldSaveNow(valueOf([]), valueOf([], { frame: { width: 1920, height: 1080 } }))).toBe(true);
    expect(shouldSaveNow({ layers: [], viewport }, valueOf([], { frame: MAP_FRAME_DEFAULT_SIZE }))).toBe(false);
  });
});
