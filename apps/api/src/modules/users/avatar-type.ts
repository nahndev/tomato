import { AvatarMimeType } from '@tomato/constants';
import { AvatarExtension } from './users.constants';

const PNG_SIGNATURE = Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]);
const JPEG_SIGNATURE = Buffer.from([0xff, 0xd8, 0xff]);
const startsWith = (content: Buffer, text: string, offset = 0) =>
  content.subarray(offset, offset + text.length).toString('latin1') === text;

// Trusts the file's bytes, never the client's content type.
export function detectAvatarType(content: Buffer): AvatarMimeType | null {
  if (content.subarray(0, PNG_SIGNATURE.length).equals(PNG_SIGNATURE)) return AvatarMimeType.PNG;
  if (content.subarray(0, JPEG_SIGNATURE.length).equals(JPEG_SIGNATURE)) return AvatarMimeType.JPEG;
  if (startsWith(content, 'RIFF') && startsWith(content, 'WEBP', 8)) return AvatarMimeType.WEBP;
  return null;
}

export function avatarTypeFromKey(key: string): AvatarMimeType | null {
  const extension = key.split('.').pop();
  const entry = Object.entries(AvatarExtension).find(([, value]) => value === extension);
  return entry ? (entry[0] as AvatarMimeType) : null;
}
