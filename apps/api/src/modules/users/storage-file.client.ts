import { BadGatewayException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../config';

@Injectable()
export class StorageFileClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('STORAGE_URL', { infer: true });
  }

  async fetchContent(fileId: string): Promise<Buffer | null> {
    const response = await fetch(new URL(`rest/files/${fileId}/content`, this.baseUrl)).catch(() => null);
    if (response?.status === HttpStatus.NOT_FOUND) return null;
    if (!response?.ok) throw new BadGatewayException();
    return Buffer.from(await response.arrayBuffer());
  }
}
