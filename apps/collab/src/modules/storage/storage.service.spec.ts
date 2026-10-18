import type { ConfigService } from '@nestjs/config';
import { mkdtemp, readdir, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import type { Env } from '../../config.schema';
import { StorageService } from './storage.service';

describe('StorageService', () => {
  let dir: string;
  let storage: StorageService;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), 'storage-'));
    const config = { get: () => join(dir, 'nested') } as unknown as ConfigService<Env, true>;
    storage = new StorageService(config);
  });

  afterEach(async () => {
    await rm(dir, { recursive: true, force: true });
  });

  it('returns null when nothing is stored', async () => {
    expect(await storage.load('template/a')).toBeNull();
  });

  it('returns what was saved', async () => {
    await storage.save('template/a', new Uint8Array([1, 2, 3]));

    expect(await storage.load('template/a')).toEqual(new Uint8Array([1, 2, 3]));
  });

  it('leaves no temp file behind', async () => {
    await storage.save('template/a', new Uint8Array([1]));
    await storage.save('template/a', new Uint8Array([2]));

    expect(await readdir(join(dir, 'nested', 'template'))).toEqual(['a']);
  });

  it('rejects paths that escape the data dir', async () => {
    await expect(storage.save('../evil', new Uint8Array())).rejects.toThrow();
    await expect(storage.load('template/../a')).rejects.toThrow();
    await expect(storage.load('template/a.bin')).rejects.toThrow();
    await expect(storage.load('/template/a')).rejects.toThrow();
    await expect(storage.load('')).rejects.toThrow();
  });
});
