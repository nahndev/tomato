import { Injectable } from '@nestjs/common';
import { OnDomainEvent } from '@tomato/events';
import { ImageUploadedEvent } from './files.events';
import { ImageVariantsService } from './image-variants.service';

@Injectable()
export class ImageVariantsListener {
  constructor(private readonly imageVariants: ImageVariantsService) {}

  @OnDomainEvent(ImageUploadedEvent)
  onImageUploaded({ objectId }: ImageUploadedEvent): Promise<void> {
    return this.imageVariants.generate(objectId);
  }
}
