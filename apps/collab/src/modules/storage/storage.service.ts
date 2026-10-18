import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { ErrorCode } from '@tomato/constants';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rename, rm, writeFile } from 'node:fs/promises';
import { dirname, join, resolve } from 'node:path';
import type { Env } from '../../config.schema';

const SEGMENT_PATTERN = /^[\w-]+$/;

@Injectable()
export class StorageService {
  private readonly dataDir: string;

  constructor(config: ConfigService<Env, true>) {
    this.dataDir = resolve(config.get('COLLAB_DATA_DIR', { infer: true }));
  }

  async load(path: string): Promise<Uint8Array | null> {
    try {
      return new Uint8Array(await readFile(this.getFilePath(path)));
    } catch (error) {
      if ((error as NodeJS.ErrnoException).code === 'ENOENT') return null;
      throw error;
    }
  }

  async save(path: string, data: Uint8Array): Promise<void> {
    const file = this.getFilePath(path);
    const temp = `${file}.${randomUUID()}.tmp`;
    await mkdir(dirname(file), { recursive: true });
    try {
      await writeFile(temp, data);
      await rename(temp, file);
    } catch (error) {
      await rm(temp, { force: true });
      throw error;
    }
  }

  private getFilePath(path: string): string {
    if (!path.split('/').every((segment) => SEGMENT_PATTERN.test(segment))) {
      throw new Error(ErrorCode.VALIDATION_FAILED);
    }
    return join(this.dataDir, path);
  }
}
