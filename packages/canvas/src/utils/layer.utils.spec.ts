import { describe, expect, it } from "vitest";
import { CanvasLayerType, DUPLICATE_OFFSET } from "../canvas.constants";
import type { CanvasImageLayer, CanvasPinLayer, CanvasZoneLayer } from "../canvas.types";
import { duplicateLayer, fitLayersToFrame, toLayerList } from "./layer.utils";

const image: CanvasImageLayer = { type: CanvasLayerType.IMAGE, id: "image-1", src: "a.png", x: 0, y: 0, width: 1, height: 1 };
const pin: CanvasPinLayer = { type: CanvasLayerType.PIN, id: "pin-1", label: "A", description: "", x: 0.5, y: 0.995 };
const zone: CanvasZoneLayer = {
  type: CanvasLayerType.ZONE,
  id: "zone-1",
  label: "Lobby",
  description: "",
  points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0.5 }],
};

describe("toLayerList", () => {
  it("lists pins above zones above images, top-most first, and numbers images in drawing order", () => {
    const second = { ...image, id: "image-2" };
    const other = { ...pin, id: "pin-2", label: "B" };
    expect(toLayerList([image, pin, zone, second, other]).map(({ layer, label }) => [layer.id, label])).toEqual([
      ["pin-2", "B"],
      ["pin-1", "A"],
      ["zone-1", "Lobby"],
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

  it("shifts zones as a whole, inside the frame", () => {
    const copy = duplicateLayer(zone);
    expect(copy.id).not.toBe(zone.id);
    expect(copy.points).toEqual([{ x: 0, y: DUPLICATE_OFFSET }, { x: 1, y: DUPLICATE_OFFSET }, { x: 1, y: 0.5 + DUPLICATE_OFFSET }]);
  });
});

describe("fitLayersToFrame", () => {
  it("fits a wide frame into a square one, centered, keeping image aspect ratios", () => {
    const [fitted, fittedPin, fittedZone] = fitLayersToFrame([image, { ...pin, x: 1, y: 0.5 }, zone], { width: 200, height: 100 }, { width: 100, height: 100 });
    expect((fittedZone as CanvasZoneLayer).points).toEqual([{ x: 0, y: 0.25 }, { x: 1, y: 0.25 }, { x: 1, y: 0.5 }]);
    expect(fitted).toMatchObject({ x: 0, y: 0.25, width: 1, height: 0.5 });
    expect(fittedPin).toMatchObject({ x: 1, y: 0.5 });
  });
});
