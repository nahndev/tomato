import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { TemplateSnapshot } from '@tomato/types';
import type { Env } from '../../config';
import { TEMPLATE_SNAPSHOT_PATH } from './template-editor.constants';

@Injectable()
export class TemplateSnapshotClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('COLLAB_URL', { infer: true });
  }

  async fetch(templateId: string): Promise<TemplateSnapshot> {
    const response = await fetch(new URL(`templates/${templateId}/${TEMPLATE_SNAPSHOT_PATH}`, this.baseUrl)).catch(
      () => null,
    );
    if (!response?.ok) throw new BadGatewayException();
    return (await response.json()) as TemplateSnapshot;
  }
}
