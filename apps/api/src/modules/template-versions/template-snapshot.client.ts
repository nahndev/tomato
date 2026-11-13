import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TemplateSnapshot } from './template-versions.types';
import type { Env } from '../../config';

@Injectable()
export class TemplateSnapshotClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('COLLAB_URL', { infer: true });
  }

  async fetch(templateId: string): Promise<TemplateSnapshot> {
    const response = await fetch(new URL(`templates/${templateId}/snapshot`, this.baseUrl)).catch(
      () => null,
    );
    if (!response?.ok) throw new BadGatewayException();
    return (await response.json()) as TemplateSnapshot;
  }
}
