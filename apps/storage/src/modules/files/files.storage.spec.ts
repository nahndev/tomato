import type { ConfigService } from '@nestjs/config';
import { ImageVariant } from '@tomato/constants';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Env } from '../../config.schema';
import { FilesStorage } from './files.storage';

describe('FilesStorage', () => {
  let directory: string;
  let storage: FilesStorage;

  beforeEach(async () => {
    directory = await mkdtemp(join(tmpdir(), 'files-storage-'));
    storage = new FilesStorage({ get: () => directory } as unknown as ConfigService<Env, true>);
  });

  afterEach(() => rm(directory, { recursive: true, force: true }));

  it('reads an original and its scaled copies apart', async () => {
    const objectId = await storage.save(Buffer.from('original'));
    await storage.saveVariant(objectId, ImageVariant.SMALL, Buffer.from('small'));

    expect((await storage.read(objectId))?.toString()).toBe('original');
    expect((await storage.read(objectId, ImageVariant.SMALL))?.toString()).toBe('small');
    expect(await storage.read(objectId, ImageVariant.MEDIUM)).toBeNull();
  });

  it('removes an original with its scaled copies', async () => {
    const objectId = await storage.save(Buffer.from('original'));
    await storage.saveVariant(objectId, ImageVariant.SMALL, Buffer.from('small'));
    await storage.saveVariant(objectId, ImageVariant.MEDIUM, Buffer.from('medium'));

    await storage.remove([objectId]);

    expect(await readdir(directory)).toEqual([]);
  });
});
