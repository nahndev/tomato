import { BadGatewayException, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { Env } from '../../../config';

@Injectable()
export class SubmissionValuesClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('COLLAB_URL', { infer: true });
  }

  async update(submissionId: string, values: Record<string, unknown>): Promise<void> {
    const response = await fetch(new URL(`submissions/${submissionId}/values`, this.baseUrl), {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values }),
    }).catch(() => null);
    if (!response?.ok) throw new BadGatewayException();
  }
}
