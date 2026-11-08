import { describe, expect, it } from "vitest";
import { CanvasLayerType, DUPLICATE_OFFSET, LayerOrder } from "../canvas.constants";
import type { CanvasArrowLayer, CanvasImageLayer, CanvasPinLayer, CanvasTextLayer, CanvasZoneLayer } from "../canvas.types";
import { duplicateLayer, fitLayersToFrame, getLayerPosition, moveLayer, toLayerList } from "./layer.utils";

const image: CanvasImageLayer = { type: CanvasLayerType.IMAGE, id: "image-1", src: "a.png", x: 0, y: 0, width: 1, height: 1 };
const pin: CanvasPinLayer = { type: CanvasLayerType.PIN, id: "pin-1", label: "A", description: "", x: 0.5, y: 0.995 };
const zone: CanvasZoneLayer = {
  type: CanvasLayerType.ZONE,
  id: "zone-1",
  label: "Lobby",
  description: "",
  points: [{ x: 0, y: 0 }, { x: 1, y: 0 }, { x: 1, y: 0.5 }],
};

const text: CanvasTextLayer = { type: CanvasLayerType.TEXT, id: "text-1", text: "Hall", x: 0.5, y: 0.5, fontSize: 40 };
const arrow: CanvasArrowLayer = { type: CanvasLayerType.ARROW, id: "arrow-1", start: { x: 0, y: 0 }, end: { x: 1, y: 0.5 } };

describe("toLayerList", () => {
  it("lists texts and arrows between pins and zones, naming them by text and number", () => {
    const blank = { ...text, id: "text-2", text: " " };
    expect(toLayerList([arrow, zone, text, pin, blank]).map(({ layer, label }) => [layer.id, label])).toEqual([
      ["pin-1", "A"],
      ["text-2", "Text"],
      ["text-1", "Hall"],
      ["arrow-1", "Arrow 1"],
      ["zone-1", "Lobby"],
    ]);
  });

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

describe("duplicateLayer for texts and arrows", () => {
  it("shifts texts and arrows inside the frame", () => {
    expect(duplicateLayer(text)).toMatchObject({ x: 0.5 + DUPLICATE_OFFSET, y: 0.5 + DUPLICATE_OFFSET, text: "Hall" });
    expect(duplicateLayer(arrow)).toMatchObject({ start: { x: 0, y: DUPLICATE_OFFSET }, end: { x: 1, y: 0.5 + DUPLICATE_OFFSET } });
  });
});

describe("fitLayersToFrame", () => {
  it("scales text sizes and arrow ends with the frame", () => {
    const [fittedText, fittedArrow] = fitLayersToFrame([text, arrow], { width: 200, height: 100 }, { width: 100, height: 100 });
    expect(fittedText).toMatchObject({ x: 0.5, y: 0.5, fontSize: 20 });
    expect(fittedArrow).toMatchObject({ start: { x: 0, y: 0.25 }, end: { x: 1, y: 0.5 } });
  });

  it("fits a wide frame into a square one, centered, keeping image aspect ratios", () => {
    const [fitted, fittedPin, fittedZone] = fitLayersToFrame([image, { ...pin, x: 1, y: 0.5 }, zone], { width: 200, height: 100 }, { width: 100, height: 100 });
    expect((fittedZone as CanvasZoneLayer).points).toEqual([{ x: 0, y: 0.25 }, { x: 1, y: 0.25 }, { x: 1, y: 0.5 }]);
    expect(fitted).toMatchObject({ x: 0, y: 0.25, width: 1, height: 0.5 });
    expect(fittedPin).toMatchObject({ x: 1, y: 0.5 });
  });
});

describe("moveLayer", () => {
  const second = { ...zone, id: "zone-2" };
  const third = { ...zone, id: "zone-3" };
  const layers = [zone, pin, second, image, third];
  const zoneIds = (next: readonly { id: string; type: string }[]) =>
    next.filter((layer) => layer.type === CanvasLayerType.ZONE).map((layer) => layer.id);

  it("reorders a layer among its type only, keeping the other layers in place", () => {
    const next = moveLayer(layers, "zone-1", LayerOrder.FORWARD);
    expect(zoneIds(next)).toEqual(["zone-2", "zone-1", "zone-3"]);
    expect(next[1]).toBe(pin);
    expect(next[3]).toBe(image);
  });

  it("brings to front and sends to back", () => {
    expect(zoneIds(moveLayer(layers, "zone-1", LayerOrder.FRONT))).toEqual(["zone-2", "zone-3", "zone-1"]);
    expect(zoneIds(moveLayer(layers, "zone-3", LayerOrder.BACK))).toEqual(["zone-3", "zone-1", "zone-2"]);
    expect(zoneIds(moveLayer(layers, "zone-3", LayerOrder.BACKWARD))).toEqual(["zone-1", "zone-3", "zone-2"]);
  });

  it("does nothing at the ends or for unknown layers", () => {
    expect(moveLayer(layers, "zone-3", LayerOrder.FORWARD)).toEqual(layers);
    expect(moveLayer(layers, "zone-1", LayerOrder.BACK)).toEqual(layers);
    expect(moveLayer(layers, "missing", LayerOrder.FRONT)).toEqual(layers);
  });

  it("reports the position among the same type", () => {
    expect(getLayerPosition(layers, "zone-2")).toEqual({ index: 1, count: 3 });
    expect(getLayerPosition(layers, "missing")).toBeNull();
  });
});
