import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { randomUUID } from 'node:crypto';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';
import type { Env } from '../../config';
import { AVATAR_DIRECTORY } from './users.constants';

@Injectable()
export class UsersAvatarStorage {
  private readonly directory: string;

  constructor(config: ConfigService<Env, true>) {
    this.directory = join(config.get('UPLOADS_DIR', { infer: true }), AVATAR_DIRECTORY);
  }

  async save(content: Buffer, extension: string): Promise<string> {
    const key = `${randomUUID()}.${extension}`;
    await mkdir(this.directory, { recursive: true });
    await writeFile(join(this.directory, key), content);
    return key;
  }

  read(key: string): Promise<Buffer | null> {
    return readFile(join(this.directory, key)).catch(() => null);
  }

  async remove(key: string): Promise<void> {
    await rm(join(this.directory, key), { force: true });
  }
}
