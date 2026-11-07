import { imageSize } from "image-size";
import { MIN_ROTATED_ORIENTATION } from "../image-map.constants";
import type { Size } from "../image-map.types";

/** Reads the size from the file header, as the browser displays it (EXIF orientation applied). */
export function getImageSize(buffer: Uint8Array): Size {
  const { width, height, orientation = 1 } = imageSize(buffer);
  return orientation >= MIN_ROTATED_ORIENTATION
    ? { width: height, height: width }
    : { width, height };
}

export async function fetchImageSize(
  src: string,
  signal?: AbortSignal,
): Promise<Size> {
  const response = await fetch(src, { signal });
  return getImageSize(new Uint8Array(await response.arrayBuffer()));
}
