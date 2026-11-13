import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import type { SubmissionValueEntries } from './submission.types';
import type { Env } from '../../config.schema';

@Injectable()
export class SubmissionApiClient {
  private readonly baseUrl: string;

  constructor(config: ConfigService<Env, true>) {
    this.baseUrl = config.get('API_URL', { infer: true }).replace(/\/$/, '');
  }

  async putValues(submissionId: string, values: SubmissionValueEntries, meta: SubmissionValueEntries): Promise<void> {
    const response = await fetch(`${this.baseUrl}/submissions/${submissionId}/values`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ values, meta }),
    });
    if (!response.ok) throw new Error(`${response.status}`);
  }
}
