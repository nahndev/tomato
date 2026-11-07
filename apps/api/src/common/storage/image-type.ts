import { ImageMimeType } from '@tomato/constants';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const startsWith = (content: Buffer, text: string, offset = 0) =>
  content.subarray(offset, offset + text.length).toString('latin1') === text;

// Trusts the file's bytes, never the client's content type.
export function detectImageType(content: Buffer): ImageMimeType | null {
  if (content.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) return ImageMimeType.PNG;
  if (content.subarray(0, JPEG_SIGNATURE.length).equals(JPEG_SIGNATURE)) return ImageMimeType.JPEG;
  if (startsWith(content, 'RIFF') && startsWith(content, 'WEBP', 8)) return ImageMimeType.WEBP;
  return null;
}
