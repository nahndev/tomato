import { MapLayerType } from "@tomato/constants";
import { ImageMapLayerType } from "@tomato/image-map";
import type { MapLayer } from "@tomato/types";
import { describe, expect, it } from "vitest";
import { getFileContentUrl } from "@/modules/file";
import { fromImageMapLayers, isLayerListChange, toImageMapLayers } from "./map.utils";

const image: MapLayer = { type: MapLayerType.IMAGE, id: "image-1", fileId: "file-1", x: 0, y: 0, width: 1, height: 1 };
const pin: MapLayer = { type: MapLayerType.PIN, id: "pin-1", label: "Gate", description: "", x: 0.5, y: 0.5 };

describe("map layers", () => {
  it("round-trips stored layers through image-map layers with full image URLs", () => {
    const layers = toImageMapLayers([image, pin], "Map");
    expect(layers[0]).toMatchObject({ src: getFileContentUrl("file-1") });
    expect(fromImageMapLayers(layers)).toEqual([image, pin]);
  });

  it("drops images that are not storage files", () => {
    const layer = { type: ImageMapLayerType.IMAGE, id: "image-2", src: "https://example.com/a.png", x: 0, y: 0, width: 1, height: 1 };
    expect(fromImageMapLayers([layer])).toEqual([]);
  });

  it("treats moves as no layer list change", () => {
    expect(isLayerListChange([image, pin], [{ ...image, x: 0.2 }, { ...pin, y: 0.1 }])).toBe(false);
  });

  it("treats added, removed and renamed layers as a layer list change", () => {
    expect(isLayerListChange([image], [image, pin])).toBe(true);
    expect(isLayerListChange([image, pin], [image])).toBe(true);
    expect(isLayerListChange([pin], [{ ...pin, label: "Door" }])).toBe(true);
  });
});
