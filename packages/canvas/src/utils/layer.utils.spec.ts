import { describe, expect, it } from "vitest";
import { CanvasLayerType, DUPLICATE_OFFSET } from "../canvas.constants";
import type { CanvasImageLayer, CanvasPinLayer } from "../canvas.types";
import { duplicateLayer, fitLayersToFrame, toLayerList } from "./layer.utils";

const image: CanvasImageLayer = { type: CanvasLayerType.IMAGE, id: "image-1", src: "a.png", x: 0, y: 0, width: 1, height: 1 };
const pin: CanvasPinLayer = { type: CanvasLayerType.PIN, id: "pin-1", label: "A", description: "", x: 0.5, y: 0.995 };

describe("toLayerList", () => {
  it("lists pins above images, top-most first, and numbers images in drawing order", () => {
    const second = { ...image, id: "image-2" };
    const other = { ...pin, id: "pin-2", label: "B" };
    expect(toLayerList([image, pin, second, other]).map(({ layer, label }) => [layer.id, label])).toEqual([
      ["pin-2", "B"],
      ["pin-1", "A"],
      ["image-2", "Image 2"],
      ["image-1", "Image 1"],
    ]);
  });
});

describe("duplicateLayer", () => {
  it("copies the layer with a new id, shifted", () => {
    const copy = duplicateLayer(image);
    expect(copy.id).not.toBe(image.id);
    expect(copy).toMatchObject({ src: "a.png", x: DUPLICATE_OFFSET, y: DUPLICATE_OFFSET, width: 1, height: 1 });
  });

  it("keeps pins inside the frame", () => {
    expect(duplicateLayer(pin).y).toBe(1);
  });
});

describe("fitLayersToFrame", () => {
  it("fits a wide frame into a square one, centered, keeping image aspect ratios", () => {
    const [fitted, fittedPin] = fitLayersToFrame([image, { ...pin, x: 1, y: 0.5 }], { width: 200, height: 100 }, { width: 100, height: 100 });
    expect(fitted).toMatchObject({ x: 0, y: 0.25, width: 1, height: 0.5 });
    expect(fittedPin).toMatchObject({ x: 1, y: 0.5 });
  });
});
