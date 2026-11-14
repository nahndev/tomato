import { Injectable, Logger } from '@nestjs/common';
import { ImageVariant } from '@tomato/constants';
import sharp from 'sharp';
import { IMAGE_VARIANT_SIZES } from './files.constants';
import { FilesStorage } from './files.storage';

@Injectable()
export class ImageVariantsService {
  private readonly logger = new Logger(ImageVariantsService.name);

  constructor(private readonly storage: FilesStorage) {}

  async generate(objectId: string): Promise<void> {
    try {
      const original = await this.storage.read(objectId);
      if (!original) return;
      await Promise.all(
        Object.values(ImageVariant).map(async (variant) => {
          const size = IMAGE_VARIANT_SIZES[variant];
          const content = await sharp(original)
            .rotate()
            .resize({ width: size, height: size, fit: 'inside', withoutEnlargement: true })
            .webp()
            .toBuffer();
          await this.storage.saveVariant(objectId, variant, content);
        }),
      );
    } catch (error) {
      this.logger.error(error);
    }
  }
}
