import { describe, expect, it } from "vitest";
import { getImageSize } from "./image-size.utils";

function createPng(width: number, height: number) {
  const buffer = new Uint8Array(24);
  buffer.set([
    0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a, 0, 0, 0, 13, 0x49, 0x48,
    0x44, 0x52,
  ]);
  const view = new DataView(buffer.buffer);
  view.setUint32(16, width);
  view.setUint32(20, height);
  return buffer;
}

describe("getImageSize", () => {
  it("reads the size from the file header", () => {
    expect(getImageSize(createPng(1600, 900))).toEqual({
      width: 1600,
      height: 900,
    });
  });

  it("throws for unsupported data", () => {
    expect(() =>
      getImageSize(new TextEncoder().encode("not an image")),
    ).toThrow();
  });
});
