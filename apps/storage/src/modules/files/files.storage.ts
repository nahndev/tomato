import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ImageVariant } from '@tomato/constants';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Env } from '../../config.schema';

@Injectable()
export class FilesStorage {
  private readonly directory: string;

  constructor(config: ConfigService<Env, true>) {
    this.directory = config.get('STORAGE_DIR', { infer: true });
  }

  async save(content: Buffer): Promise<string> {
    const objectId = randomUUID();
    await mkdir(this.directory, { recursive: true });
    await writeFile(this.path(objectId), content);
    return objectId;
  }

  async saveVariant(objectId: string, variant: ImageVariant, content: Buffer): Promise<void> {
    await writeFile(this.path(objectId, variant), content);
  }

  read(objectId: string, variant?: ImageVariant): Promise<Buffer | null> {
    return readFile(this.path(objectId, variant)).catch(() => null);
  }

  async remove(objectIds: string[]): Promise<void> {
    const paths = objectIds.flatMap((objectId) => [
      this.path(objectId),
      ...Object.values(ImageVariant).map((variant) => this.path(objectId, variant)),
    ]);
    await Promise.all(paths.map((path) => rm(path, { force: true })));
  }

  private path(objectId: string, variant?: ImageVariant): string {
    return join(this.directory, variant ? `${objectId}.${variant}` : objectId);
  }
}
