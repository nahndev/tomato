import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
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
    await writeFile(join(this.directory, objectId), content);
    return objectId;
  }

  read(objectId: string): Promise<Buffer | null> {
    return readFile(join(this.directory, objectId)).catch(() => null);
  }

  async remove(objectIds: string[]): Promise<void> {
    await Promise.all(objectIds.map((objectId) => rm(join(this.directory, objectId), { force: true })));
  }
}
