import { ImageVariant } from '@tomato/constants';
import sharp from 'sharp';
import { describe, expect, it, vi } from 'vitest';
import { IMAGE_VARIANT_SIZES } from './files.constants';
import type { FilesStorage } from './files.storage';
import { ImageVariantsService } from './image-variants.service';

function png(width: number, height: number): Promise<Buffer> {
  return sharp({ create: { width, height, channels: 3, background: '#ff0000' } }).png().toBuffer();
}

function setup(original: Buffer | null) {
  const saved = new Map<ImageVariant, Buffer>();
  const storage = {
    read: vi.fn(async () => original),
    saveVariant: vi.fn(async (_objectId: string, variant: ImageVariant, content: Buffer) => {
      saved.set(variant, content);
    }),
  };
  return { saved, storage, service: new ImageVariantsService(storage as unknown as FilesStorage) };
}

describe('ImageVariantsService', () => {
  it('saves a webp copy of every size, fitted inside the size', async () => {
    const { service, saved, storage } = setup(await png(2000, 1000));

    await service.generate('key');

    expect(storage.read).toHaveBeenCalledWith('key');
    for (const variant of Object.values(ImageVariant)) {
      const { format, width, height } = await sharp(saved.get(variant)).metadata();
      expect({ format, width, height }).toEqual({
        format: 'webp',
        width: IMAGE_VARIANT_SIZES[variant],
        height: IMAGE_VARIANT_SIZES[variant] / 2,
      });
    }
  });

  it('never enlarges a small image', async () => {
    const { service, saved } = setup(await png(40, 20));

    await service.generate('key');

    const { width, height } = await sharp(saved.get(ImageVariant.MEDIUM)).metadata();
    expect({ width, height }).toEqual({ width: 40, height: 20 });
  });

  it('saves nothing for a missing or unreadable original', async () => {
    const missing = setup(null);
    const broken = setup(Buffer.from('not an image'));

    await expect(missing.service.generate('key')).resolves.toBeUndefined();
    await expect(broken.service.generate('key')).resolves.toBeUndefined();

    expect(missing.storage.saveVariant).not.toHaveBeenCalled();
    expect(broken.storage.saveVariant).not.toHaveBeenCalled();
  });
});
